import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user, darkMode } = useAuth();
  const navigate = useNavigate();

  const d = darkMode;
  const bg = d ? "#0f172a" : "#f8fafc";
  const cardBg = d ? "#1e293b" : "#ffffff";
  const text = d ? "#f1f5f9" : "#111827";
  const subtext = d ? "#94a3b8" : "#6b7280";
  const border = d ? "#334155" : "#e5e7eb";

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui, sans-serif" }}>
      
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>

        {/* Welcome Card */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: "12px", padding: "24px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "20px"
        }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: text, marginBottom: "6px" }}>
              Welcome back, {user?.name}! 👋
            </h2>
            <p style={{ color: subtext, fontSize: "14px", marginBottom: "16px" }}>
              Ready to continue your skill-swapping journey? You're at Level 1 with 0 points!
            </p>
            <p style={{ fontSize: "12px", color: subtext, marginBottom: "8px" }}>
              Progress to Level 2 — 0/100 points
            </p>
            <div style={{ width: "400px", height: "6px", background: border, borderRadius: "10px" }}>
              <div style={{ width: "0%", height: "100%", background: "#16a34a", borderRadius: "10px" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                onClick={() => navigate("/find-skills")}
                style={{
                  background: "#16a34a", color: "white",
                  border: "none", borderRadius: "8px",
                  padding: "8px 16px", fontSize: "13px",
                  fontWeight: "600", cursor: "pointer"
                }}>
                🔍 Find Skills
              </button>
              <button
                onClick={() => navigate("/my-skills")}
                style={{
                  background: "none", border: `1px solid ${border}`,
                  borderRadius: "8px", padding: "8px 16px",
                  fontSize: "13px", color: text, cursor: "pointer"
                }}>
                💬 My Exchanges
              </button>
            </div>
          </div>

          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "#16a34a", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: "700"
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px", marginBottom: "20px"
        }}>
          {[
            { label: "Experience Points", value: "0", icon: "📈" },
            { label: "Completed Exchanges", value: "0", icon: "👥" },
            { label: "Active Exchanges", value: "0", icon: "💬" },
            { label: "Pending Requests", value: "0", icon: "📅" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: cardBg, border: `1px solid ${border}`,
              borderRadius: "12px", padding: "16px 20px"
            }}>
              <p style={{ fontSize: "13px", color: subtext, marginBottom: "6px" }}>{stat.label}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "28px", fontWeight: "700", color: text }}>{stat.value}</span>
                <span style={{ fontSize: "24px" }}>{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🌿</span>
                <span style={{ fontWeight: "600", color: text }}>Skills I Offer</span>
              </div>
              <button
                onClick={() => navigate("/my-skills")}
                style={{
                  background: "none", border: `1px solid ${border}`,
                  borderRadius: "6px", padding: "4px 10px",
                  fontSize: "12px", color: subtext, cursor: "pointer"
                }}>
                ⚙ Manage
              </button>
            </div>
            <p style={{ color: subtext, fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
              No skills added yet
            </p>
            <button
              onClick={() => navigate("/my-skills")}
              style={{
                background: "none", border: `1px solid ${border}`,
                borderRadius: "8px", padding: "8px 14px",
                fontSize: "13px", color: text, cursor: "pointer"
              }}>
              + Add Skills
            </button>
          </div>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🎯</span>
                <span style={{ fontWeight: "600", color: text }}>Skills I Want to Learn</span>
              </div>
              <button
                onClick={() => navigate("/my-skills")}
                style={{
                  background: "none", border: `1px solid ${border}`,
                  borderRadius: "6px", padding: "4px 10px",
                  fontSize: "12px", color: subtext, cursor: "pointer"
                }}>
                ⚙ Manage
              </button>
            </div>
            <p style={{ color: subtext, fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
              No learning goals set yet
            </p>
            <button
              onClick={() => navigate("/my-skills")}
              style={{
                background: "none", border: `1px solid ${border}`,
                borderRadius: "8px", padding: "8px 14px",
                fontSize: "13px", color: text, cursor: "pointer"
              }}>
              + Add Skills
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: "12px", padding: "24px"
        }}>
          <h3 style={{ fontWeight: "600", color: text, marginBottom: "20px" }}>Recent Activity</h3>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>💬</p>
            <p style={{ color: subtext, fontSize: "14px", marginBottom: "16px" }}>No exchanges yet</p>
            <button
              onClick={() => navigate("/find-skills")}
              style={{
                background: "#16a34a", color: "white",
                border: "none", borderRadius: "8px",
                padding: "10px 20px", fontSize: "14px",
                fontWeight: "600", cursor: "pointer"
              }}>
              Start Your First Exchange
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;