import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const POPULAR_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "Graphic Design",
  "Photography", "Spanish", "French", "Video Editing", "Content Writing",
  "Digital Marketing", "Data Analysis", "UI/UX Design", "Public Speaking",
  "Excel", "Cooking", "Yoga", "Music Production", "Photoshop", "Git"
];

const MySkills = () => {
  const { token, darkMode } = useAuth();
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [customTeach, setCustomTeach] = useState("");
  const [customLearn, setCustomLearn] = useState("");
  const [teachLevel, setTeachLevel] = useState("Intermediate");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const d = darkMode;
  const bg = d ? "#0f172a" : "#f8fafc";
  const cardBg = d ? "#1e293b" : "#ffffff";
  const text = d ? "#f1f5f9" : "#111827";
  const subtext = d ? "#94a3b8" : "#6b7280";
  const border = d ? "#334155" : "#e5e7eb";
  const inputBg = d ? "#0f172a" : "#f9fafb";

  // Auth header for all API calls
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Load existing skills when page opens
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/skills/me", config);
        setTeachSkills(res.data.skillsToTeach || []);
        setLearnSkills(res.data.skillsToLearn || []);
      } catch (err) {
        console.error("Failed to load skills");
      }
    };
    fetchSkills();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // Add skill to teach
  const addTeachSkill = async (skillName) => {
    if (!skillName.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/skills/teach",
        { name: skillName, level: teachLevel },
        config
      );
      setTeachSkills(res.data.skillsToTeach);
      setCustomTeach("");
      showMessage("✅ Skill added!");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to add skill");
    }
    setLoading(false);
  };

  // Remove skill to teach
  const removeTeachSkill = async (skillId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/skills/teach/${skillId}`,
        config
      );
      setTeachSkills(res.data.skillsToTeach);
      showMessage("🗑️ Skill removed");
    } catch (err) {
      showMessage("Failed to remove skill");
    }
  };

  // Add skill to learn
  const addLearnSkill = async (skillName) => {
    if (!skillName.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/skills/learn",
        { name: skillName },
        config
      );
      setLearnSkills(res.data.skillsToLearn);
      setCustomLearn("");
      showMessage("✅ Skill added!");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to add skill");
    }
  };

  // Remove skill to learn
  const removeLearnSkill = async (skillName) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/skills/learn/${skillName}`,
        config
      );
      setLearnSkills(res.data.skillsToLearn);
      showMessage("🗑️ Skill removed");
    } catch (err) {
      showMessage("Failed to remove skill");
    }
  };

  const inputStyle = {
    padding: "8px 12px", borderRadius: "8px",
    border: `1px solid ${border}`, background: inputBg,
    color: text, fontSize: "14px", outline: "none"
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>

        <h2 style={{ fontSize: "22px", fontWeight: "700", color: text, marginBottom: "4px" }}>
          My Skills
        </h2>
        <p style={{ color: subtext, fontSize: "14px", marginBottom: "24px" }}>
          Manage skills you can teach and skills you want to learn
        </p>

        {/* Message */}
        {message && (
          <div style={{
            background: "#f0fdf4", color: "#16a34a",
            padding: "10px 16px", borderRadius: "8px",
            marginBottom: "16px", fontSize: "14px",
            border: "1px solid #bbf7d0"
          }}>
            {message}
          </div>
        )}

        {/* ── Skills I Can Teach ── */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: "12px", padding: "24px", marginBottom: "20px"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
            🌿 Skills I Can Teach
          </h3>

          {/* Current teach skills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {teachSkills.length === 0 && (
              <p style={{ color: subtext, fontSize: "13px" }}>No skills added yet</p>
            )}
            {teachSkills.map((skill) => (
              <div key={skill._id} style={{
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: "20px", padding: "4px 12px",
                display: "flex", alignItems: "center", gap: "8px", fontSize: "13px"
              }}>
                <span style={{ color: "#16a34a", fontWeight: "500" }}>{skill.name}</span>
                <span style={{ color: "#94a3b8", fontSize: "11px" }}>{skill.level}</span>
                <button
                  onClick={() => removeTeachSkill(skill._id)}
                  style={{
                    background: "none", border: "none",
                    cursor: "pointer", color: "#94a3b8",
                    fontSize: "14px", padding: "0"
                  }}
                >×</button>
              </div>
            ))}
          </div>

          {/* Popular skills buttons */}
          <p style={{ fontSize: "12px", color: subtext, marginBottom: "8px" }}>
            Quick add:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {POPULAR_SKILLS.slice(0, 10).map((skill) => (
              <button
                key={skill}
                onClick={() => addTeachSkill(skill)}
                style={{
                  padding: "4px 12px", borderRadius: "20px",
                  border: `1px solid ${border}`, background: "none",
                  fontSize: "12px", color: subtext, cursor: "pointer"
                }}
              >
                + {skill}
              </button>
            ))}
          </div>

          {/* Custom skill input */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              value={customTeach}
              onChange={(e) => setCustomTeach(e.target.value)}
              placeholder="Add custom skill..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && addTeachSkill(customTeach)}
            />
            <select
              value={teachLevel}
              onChange={(e) => setTeachLevel(e.target.value)}
              style={{ ...inputStyle, width: "140px" }}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
            <button
              onClick={() => addTeachSkill(customTeach)}
              disabled={loading}
              style={{
                background: "#16a34a", color: "white",
                border: "none", borderRadius: "8px",
                padding: "8px 16px", fontSize: "13px",
                fontWeight: "600", cursor: "pointer"
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* ── Skills I Want to Learn ── */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: "12px", padding: "24px"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
            🎯 Skills I Want to Learn
          </h3>

          {/* Current learn skills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {learnSkills.length === 0 && (
              <p style={{ color: subtext, fontSize: "13px" }}>No skills added yet</p>
            )}
            {learnSkills.map((skill) => (
              <div key={skill} style={{
                background: "#eff6ff", border: "1px solid #bfdbfe",
                borderRadius: "20px", padding: "4px 12px",
                display: "flex", alignItems: "center", gap: "8px", fontSize: "13px"
              }}>
                <span style={{ color: "#2563eb", fontWeight: "500" }}>{skill}</span>
                <button
                  onClick={() => removeLearnSkill(skill)}
                  style={{
                    background: "none", border: "none",
                    cursor: "pointer", color: "#94a3b8",
                    fontSize: "14px", padding: "0"
                  }}
                >×</button>
              </div>
            ))}
          </div>

          {/* Popular skills buttons */}
          <p style={{ fontSize: "12px", color: subtext, marginBottom: "8px" }}>
            Quick add:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {POPULAR_SKILLS.slice(10).map((skill) => (
              <button
                key={skill}
                onClick={() => addLearnSkill(skill)}
                style={{
                  padding: "4px 12px", borderRadius: "20px",
                  border: `1px solid ${border}`, background: "none",
                  fontSize: "12px", color: subtext, cursor: "pointer"
                }}
              >
                + {skill}
              </button>
            ))}
          </div>

          {/* Custom skill input */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={customLearn}
              onChange={(e) => setCustomLearn(e.target.value)}
              placeholder="Add custom skill..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && addLearnSkill(customLearn)}
            />
            <button
              onClick={() => addLearnSkill(customLearn)}
              style={{
                background: "#2563eb", color: "white",
                border: "none", borderRadius: "8px",
                padding: "8px 16px", fontSize: "13px",
                fontWeight: "600", cursor: "pointer"
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySkills;