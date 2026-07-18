import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const FindSkills = () => {
  const { token, darkMode, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchSkill, setSearchSkill] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [aiMatch, setAiMatch] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const d = darkMode;
  const bg = d ? "#0f172a" : "#f8fafc";
  const cardBg = d ? "#1e293b" : "#ffffff";
  const text = d ? "#f1f5f9" : "#111827";
  const subtext = d ? "#94a3b8" : "#6b7280";
  const border = d ? "#334155" : "#e5e7eb";
  const inputBg = d ? "#0f172a" : "#f9fafb";

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const mockUsers = [
      {
        _id: "1",
        name: "Alice Johnson",
        email: "alice@gmail.com",
        location: "New York",
        rating: 4.8,
        skillsToTeach: [
          { name: "React", level: "Expert" },
          { name: "JavaScript", level: "Expert" }
        ],
        skillsToLearn: ["Python", "Design"]
      },
      {
        _id: "2",
        name: "Bob Smith",
        email: "bob@gmail.com",
        location: "San Francisco",
        rating: 4.5,
        skillsToTeach: [
          { name: "Python", level: "Expert" },
          { name: "Data Analysis", level: "Intermediate" }
        ],
        skillsToLearn: ["React", "Node.js"]
      },
      {
        _id: "3",
        name: "Carol White",
        email: "carol@gmail.com",
        location: "Austin",
        rating: 5,
        skillsToTeach: [
          { name: "UI/UX Design", level: "Expert" },
          { name: "Graphic Design", level: "Intermediate" }
        ],
        skillsToLearn: ["Web Development", "JavaScript"]
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    if (!searchSkill.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(u =>
      u.skillsToTeach.some(s =>
        s.name.toLowerCase().includes(searchSkill.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  }, [searchSkill, users]);

  const getAIMatch = async (targetUser) => {
    setSelectedUser(targetUser);
    setAiMatch(null);
    setAiError("");
    setAiLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/skills/ai-match",
        { targetUserId: targetUser._id },
        config
      );
      setAiMatch(res.data);
    } catch (err) {
      setAiError(err.response?.data?.message || "Failed to generate AI match");
    }
    setAiLoading(false);
  };

  const sendRequest = async () => {
    if (!selectedUser || !skillOffered || !skillRequested) {
      setMessage("❌ Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/exchanges/request",
        {
          recipientId: selectedUser._id,
          skillOffered,
          skillRequested
        },
        config
      );
      setMessage("✅ Exchange request sent!");
      setSelectedUser(null);
      setSkillOffered("");
      setSkillRequested("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Failed to send request"));
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>

        <h2 style={{ fontSize: "22px", fontWeight: "700", color: text, marginBottom: "4px" }}>
          🔍 Find Skills
        </h2>
        <p style={{ color: subtext, fontSize: "14px", marginBottom: "24px" }}>
          Browse and connect with users who can teach you new skills
        </p>

        {message && (
          <div style={{
            background: message.includes("✅") ? "#f0fdf4" : "#fef2f2",
            color: message.includes("✅") ? "#16a34a" : "#dc2626",
            padding: "10px 16px", borderRadius: "8px",
            marginBottom: "16px", fontSize: "14px",
            border: message.includes("✅") ? "1px solid #bbf7d0" : "1px solid #fecaca"
          }}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <input
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
            placeholder="Search skills (e.g., Python, Design, Photography)..."
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "8px",
              border: `1px solid ${border}`, background: inputBg,
              color: text, fontSize: "14px", outline: "none"
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px",
            maxHeight: "600px", overflowY: "auto"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
              Available Users ({filteredUsers.length})
            </h3>

            {filteredUsers.length === 0 && (
              <p style={{ color: subtext, fontSize: "13px", textAlign: "center", padding: "20px" }}>
                No users found with that skill
              </p>
            )}

            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => { setSelectedUser(u); setAiMatch(null); setAiError(""); }}
                style={{
                  background: selectedUser?._id === u._id ? "#f0fdf4" : "transparent",
                  border: `1px solid ${selectedUser?._id === u._id ? "#16a34a" : border}`,
                  borderRadius: "8px", padding: "12px",
                  marginBottom: "8px", cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <p style={{ fontWeight: "600", color: text, marginBottom: "4px" }}>
                      {u.name}
                    </p>
                    <p style={{ fontSize: "12px", color: subtext, marginBottom: "4px" }}>
                      📍 {u.location}
                    </p>
                    <p style={{ fontSize: "12px", color: subtext, marginBottom: "8px" }}>
                      ⭐ {u.rating || "N/A"}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {u.skillsToTeach.slice(0, 2).map((s) => (
                        <span
                          key={s.name}
                          style={{
                            background: "#f0fdf4", color: "#16a34a",
                            padding: "2px 8px", borderRadius: "12px",
                            fontSize: "11px", fontWeight: "500"
                          }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      getAIMatch(u);
                    }}
                    style={{
                      background: "#eef2ff", color: "#4f46e5",
                      border: "1px solid #c7d2fe", borderRadius: "8px",
                      padding: "6px 10px", fontSize: "12px", fontWeight: "600",
                      cursor: "pointer", whiteSpace: "nowrap"
                    }}
                  >
                    🤖 AI Match
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            {selectedUser ? (
              <>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
                  Exchange with {selectedUser.name}
                </h3>

                {aiLoading && (
                  <p style={{ color: subtext, fontSize: "13px", marginBottom: "16px" }}>
                    🤖 Analyzing compatibility...
                  </p>
                )}

                {aiError && (
                  <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>
                    ❌ {aiError}
                  </p>
                )}

                {aiMatch && (
                  <div style={{
                    background: d ? "#0f172a" : "#f5f3ff",
                    border: "1px solid #c7d2fe", borderRadius: "10px",
                    padding: "16px", marginBottom: "20px"
                  }}>
                    <p style={{ fontWeight: "700", color: "#4f46e5", fontSize: "15px", marginBottom: "8px" }}>
                      Compatibility: {aiMatch.score}%
                    </p>

                    <p style={{ fontSize: "13px", color: text, marginBottom: "10px" }}>
                      {aiMatch.explanation}
                    </p>

                    <p style={{ fontSize: "13px", fontWeight: "600", color: text, marginBottom: "4px" }}>
                      Why you're a great match:
                    </p>
                    <p style={{ fontSize: "13px", color: subtext, marginBottom: "10px" }}>
                      {aiMatch.whyGoodMatch}
                    </p>

                    <p style={{ fontSize: "13px", fontWeight: "600", color: text, marginBottom: "4px" }}>
                      Suggested Exchange:
                    </p>
                    <ul style={{ margin: "0 0 10px 18px", padding: 0, fontSize: "13px", color: subtext }}>
                      {(aiMatch.suggestedSessions || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>

                    <p style={{ fontSize: "13px", fontWeight: "600", color: text, marginBottom: "4px" }}>
                      Ice-breaker:
                    </p>
                    <p style={{ fontSize: "13px", color: subtext, fontStyle: "italic" }}>
                      "{aiMatch.iceBreaker}"
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "13px", color: subtext, marginBottom: "4px" }}>
                    📚 Skill You Want to Learn
                  </p>
                  <select
                    value={skillRequested}
                    onChange={(e) => setSkillRequested(e.target.value)}
                    style={{
                      width: "100%", padding: "8px 12px",
                      borderRadius: "8px", border: `1px solid ${border}`,
                      background: inputBg, color: text, fontSize: "13px", outline: "none"
                    }}
                  >
                    <option value="">Choose a skill they offer</option>
                    {selectedUser.skillsToTeach.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({s.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "13px", color: subtext, marginBottom: "4px" }}>
                    🎁 Skill You Can Offer
                  </p>
                  <input
                    value={skillOffered}
                    onChange={(e) => setSkillOffered(e.target.value)}
                    placeholder="e.g., JavaScript, Design..."
                    style={{
                      width: "100%", padding: "8px 12px",
                      borderRadius: "8px", border: `1px solid ${border}`,
                      background: inputBg, color: text, fontSize: "13px", outline: "none"
                    }}
                  />
                </div>

                <button
                  onClick={sendRequest}
                  disabled={loading}
                  style={{
                    width: "100%", background: "#16a34a",
                    color: "white", border: "none", borderRadius: "8px",
                    padding: "10px", fontSize: "14px", fontWeight: "600",
                    cursor: "pointer", opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? "Sending..." : "Send Exchange Request"}
                </button>

                <p style={{ fontSize: "12px", color: subtext, marginTop: "12px", textAlign: "center" }}>
                  Once accepted, you can chat and schedule the exchange
                </p>
              </>
            ) : (
              <p style={{ color: subtext, fontSize: "14px", textAlign: "center", padding: "40px 20px" }}>
                Select a user to send an exchange request
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindSkills;