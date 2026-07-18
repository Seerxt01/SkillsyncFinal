const User = require("../models/User");

// ─── Helpers ──────────────────────────────────────────────────────────────
const norm = (s) => (s || "").toString().trim().toLowerCase();

// Compatibility score is calculated HERE, in plain JS — never by the AI.
// It measures, in both directions, how much of what each person wants to
// learn is covered by what the other person can teach.
const calculateCompatibility = (me, them) => {
  const myTeach = (me.skillsToTeach || []).map((s) => norm(s.name));
  const myLearn = (me.skillsToLearn || []).map(norm);
  const theirTeach = (them.skillsToTeach || []).map((s) => norm(s.name));
  const theirLearn = (them.skillsToLearn || []).map(norm);

  // Skills I can teach that they want to learn
  const iCanTeachThem = [...new Set(myTeach.filter((s) => theirLearn.includes(s)))];
  // Skills they can teach that I want to learn
  const theyCanTeachMe = [...new Set(theirTeach.filter((s) => myLearn.includes(s)))];

  const myWantsFulfilled = myLearn.length > 0 ? theyCanTeachMe.length / myLearn.length : 0;
  const theirWantsFulfilled = theirLearn.length > 0 ? iCanTeachThem.length / theirLearn.length : 0;

  const sidesWithWants = (myLearn.length > 0 ? 1 : 0) + (theirLearn.length > 0 ? 1 : 0);
  const score =
    sidesWithWants > 0
      ? Math.round(((myWantsFulfilled + theirWantsFulfilled) / sidesWithWants) * 100)
      : 0;

  return { score, iCanTeachThem, theyCanTeachMe };
};

// ─── POST /api/skills/ai-match ────────────────────────────────────────────
const getAIMatch = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    const [me, them] = await Promise.all([
      User.findById(req.user.id).select("name bio location skillsToTeach skillsToLearn"),
      User.findById(targetUserId).select("name bio location skillsToTeach skillsToLearn"),
    ]);

    if (!them) return res.status(404).json({ message: "User not found" });

    // 1) Score is computed programmatically — the AI never touches this number.
    const { score, iCanTeachThem, theyCanTeachMe } = calculateCompatibility(me, them);

    // 2) Ask the LLM only for the explanation/recommendations, passing the
    //    score in as a fixed fact it must use, not generate.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "AI service not configured (missing GEMINI_API_KEY)" });
    }

    const prompt = `You are helping two users of a peer-to-peer skill exchange app understand a match between them.

Their compatibility score has ALREADY been calculated by the backend as ${score}%. Treat this as a fixed fact — do not recalculate, restate a different number, or contradict it.

My profile:
- Name: ${me.name}
- Skills I can teach: ${(me.skillsToTeach || []).map((s) => s.name).join(", ") || "none listed"}
- Skills I want to learn: ${(me.skillsToLearn || []).join(", ") || "none listed"}
- Bio: ${me.bio || "n/a"}

Their profile:
- Name: ${them.name}
- Skills they can teach: ${(them.skillsToTeach || []).map((s) => s.name).join(", ") || "none listed"}
- Skills they want to learn: ${(them.skillsToLearn || []).join(", ") || "none listed"}
- Bio: ${them.bio || "n/a"}

Pre-calculated overlap (use this, don't invent other skills):
- Skills I can teach them: ${iCanTeachThem.join(", ") || "none"}
- Skills they can teach me: ${theyCanTeachMe.join(", ") || "none"}

Respond with ONLY valid JSON (no markdown fences, no commentary) in exactly this shape:
{
  "explanation": "2-3 sentence explanation of why the compatibility score is what it is",
  "whyGoodMatch": "1-2 sentence summary of why they're a great match",
  "skillsICanTeachThem": ["..."],
  "skillsTheyCanTeachMe": ["..."],
  "suggestedSessions": ["Session 1: ...", "Session 2: ..."],
  "iceBreaker": "one friendly first message to start the conversation"
}`;

    const model = process.env.LLM_MODEL || "gemini-2.5-flash";
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 700,
          },
        }),
      }
    );

    if (!aiRes.ok) {
      console.error("LLM API error:", await aiRes.text());
      return res.status(502).json({ message: "AI service request failed" });
    }

    const aiData = await aiRes.json();
    const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed;
    try {
      parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch (e) {
      console.error("Failed to parse AI response:", rawText);
      return res.status(502).json({ message: "AI response could not be parsed" });
    }

    // 3) Score always comes from our own calculation, never overwritten by parsed AI output.
    res.json({ score, ...parsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAIMatch };