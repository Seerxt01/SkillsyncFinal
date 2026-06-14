import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const AIAssistant = () => {
  const { darkMode, user } = useAuth();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const d = darkMode;
  const bg = d ? "#0f172a" : "#f8fafc";
  const cardBg = d ? "#1e293b" : "#ffffff";
  const text = d ? "#f1f5f9" : "#111827";
  const subtext = d ? "#94a3b8" : "#6b7280";
  const border = d ? "#334155" : "#e5e7eb";
  const inputBg = d ? "#0f172a" : "#f9fafb";

  // Simple AI matching logic
  const getAISuggestions = (searchQuery) => {
    const skillDatabase = {
      "javascript": ["React", "Node.js", "Web Development", "Frontend Development"],
      "python": ["Data Analysis", "Machine Learning", "Web Scraping", "Automation"],
      "design": ["UI/UX Design", "Graphic Design", "Web Design", "Figma"],
      "react": ["JavaScript", "Web Development", "Component Design", "State Management"],
      "teaching": ["Public Speaking", "Content Creation", "Mentoring", "Communication"],
      "music": ["Guitar", "Piano", "Music Theory", "Sound Design"],
      "photography": ["Videography", "Image Editing", "Lighting", "Composition"],
      "writing": ["Content Writing", "Copywriting", "Blogging", "Technical Writing"],
      "marketing": ["Social Media", "SEO", "Analytics", "Content Strategy"],
      "spanish": ["French", "German", "Portuguese", "Language Exchange"]
    };

    const query = searchQuery.toLowerCase();
    let results = [];

    // Find matching skills
    for (const [key, value] of Object.entries(skillDatabase)) {
      if (key.includes(query) || value.some(v => v.toLowerCase().includes(query))) {
        results.push(...value);
      }
    }

    // Remove duplicates
    return [...new Set(results)].slice(0, 5);
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const matches = getAISuggestions(query);
      setSuggestions(matches);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>

        <h2 style={{ fontSize: "22px", fontWeight: "700", color: text, marginBottom: "4px" }}>
          🤖 AI Skill Assistant
        </h2>
        <p style={{ color: subtext, fontSize: "14px", marginBottom: "24px" }}>
          Get AI-powered recommendations for skills to learn and teach
        </p>

        {/* Main Card */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: "12px", padding: "32px", marginBottom: "24px"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: text, marginBottom: "16px" }}>
            📚 Find Skill Matches
          </h3>
          <p style={{ color: subtext, fontSize: "13px", marginBottom: "16px" }}>
            Type a skill you want to learn or teach, and we'll suggest compatible skills
          </p>

          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="E.g., React, Python, Design, Marketing..."
              style={{
                flex: 1, padding: "12px 16px", borderRadius: "8px",
                border: `1px solid ${border}`, background: inputBg,
                color: text, fontSize: "14px", outline: "none"
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                background: "#16a34a", color: "white",
                border: "none", borderRadius: "8px",
                padding: "12px 24px", fontSize: "14px",
                fontWeight: "600", cursor: "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Results */}
          {suggestions.length > 0 && (
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "600", color: text, marginBottom: "12px" }}>
                ✨ Recommended Skills:
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {suggestions.map((skill) => (
                  <div
                    key={skill}
                    style={{
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: "20px", padding: "6px 14px",
                      fontSize: "13px", color: "#16a34a", fontWeight: "500",
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#dcfce7";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#f0fdf4";
                    }}
                  >
                    + {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && !loading && suggestions.length === 0 && (
            <p style={{ color: subtext, fontSize: "13px", textAlign: "center", padding: "20px" }}>
              No matching skills found. Try another keyword!
            </p>
          )}
        </div>

        {/* AI Tips */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", color: text, marginBottom: "12px" }}>
              💡 Smart Tips
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                "Start with one skill per exchange",
                "Learn from highly-rated teachers",
                "Schedule exchanges in advance",
                "Give honest ratings after exchanges"
              ].map((tip, idx) => (
                <li
                  key={idx}
                  style={{
                    color: subtext, fontSize: "13px",
                    marginBottom: "10px", paddingLeft: "20px",
                    position: "relative"
                  }}
                >
                  <span style={{ position: "absolute", left: 0 }}>✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", color: text, marginBottom: "12px" }}>
              🎯 Your Current Skills
            </h4>
            <div>
              <p style={{ fontSize: "12px", color: subtext, marginBottom: "8px", fontWeight: "500" }}>
                Can Teach (0)
              </p>
              <p style={{ color: subtext, fontSize: "13px", marginBottom: "16px" }}>
                Add skills in My Skills page
              </p>
              <p style={{ fontSize: "12px", color: subtext, marginBottom: "8px", fontWeight: "500" }}>
                Want to Learn (2)
              </p>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {["Data Analysis", "Git"].map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: "#eff6ff", color: "#2563eb",
                      padding: "2px 8px", borderRadius: "12px",
                      fontSize: "11px", fontWeight: "500"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* How It Works */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: "12px", padding: "24px", marginTop: "24px"
        }}>
          <h4 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
            🔄 How AI Matching Works
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { num: "1", title: "Search", desc: "Type a skill you're interested in" },
              { num: "2", title: "AI Matches", desc: "Get related skills suggestions" },
              { num: "3", title: "Find Users", desc: "Browse users with those skills" },
              { num: "4", title: "Connect", desc: "Send exchange requests & learn" }
            ].map((step) => (
              <div key={step.num} style={{ textAlign: "center" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: "#f0fdf4", color: "#16a34a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: "700", margin: "0 auto 8px"
                }}>
                  {step.num}
                </div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: text, marginBottom: "4px" }}>
                  {step.title}
                </p>
                <p style={{ fontSize: "12px", color: subtext }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;