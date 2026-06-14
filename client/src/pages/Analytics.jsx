import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const Analytics = () => {
  const { token, darkMode, user } = useAuth();
  const [stats, setStats] = useState({
    totalExchanges: 0,
    completedExchanges: 0,
    points: 0,
    rating: 0,
    level: 1
  });

  const d = darkMode;
  const bg = d ? "#0f172a" : "#f8fafc";
  const cardBg = d ? "#1e293b" : "#ffffff";
  const text = d ? "#f1f5f9" : "#111827";
  const subtext = d ? "#94a3b8" : "#6b7280";
  const border = d ? "#334155" : "#e5e7eb";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/skills/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = res.data;
        setStats({
          totalExchanges: userData.totalExchanges || 0,
          completedExchanges: userData.completedExchanges || 0,
          points: userData.points || 0,
          rating: userData.rating || 0,
          level: userData.level || 1
        });
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    
    fetchStats();
  }, [token]);

  const StatCard = ({ label, value, icon, color }) => (
    <div style={{
      background: cardBg, border: `1px solid ${border}`,
      borderRadius: "12px", padding: "20px",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <div>
        <p style={{ fontSize: "13px", color: subtext, marginBottom: "4px" }}>{label}</p>
        <p style={{ fontSize: "28px", fontWeight: "700", color }}>{value}</p>
      </div>
      <span style={{ fontSize: "32px" }}>{icon}</span>
    </div>
  );

  const ProgressBar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <p style={{ fontSize: "13px", color: text, fontWeight: "500" }}>{label}</p>
        <p style={{ fontSize: "13px", color: subtext }}>{value}/{max}</p>
      </div>
      <div style={{ width: "100%", height: "8px", background: border, borderRadius: "10px", overflow: "hidden" }}>
        <div style={{
          width: `${(value / max) * 100}%`, height: "100%",
          background: color, borderRadius: "10px", transition: "width 0.3s"
        }} />
      </div>
    </div>
  );

  const BarChart = ({ skills }) => {
    const maxValue = Math.max(...skills.map(s => s.count), 3);
    
    return (
      <div>
        {skills.length === 0 ? (
          <p style={{ color: subtext, fontSize: "13px", textAlign: "center", padding: "20px" }}>
            No skills with exchanges yet
          </p>
        ) : (
          skills.map((skill) => (
            <div key={skill.name} style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: text, marginBottom: "6px", fontWeight: "500" }}>{skill.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ flex: 1, height: "30px", background: border, borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{
                    width: `${(skill.count / maxValue) * 100}%`, height: "100%",
                    background: "#3b82f6", borderRadius: "6px"
                  }} />
                </div>
                <span style={{ fontSize: "13px", color: text, fontWeight: "600", minWidth: "30px" }}>{skill.count}</span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>

        <h2 style={{ fontSize: "22px", fontWeight: "700", color: text, marginBottom: "4px" }}>
          📊 Analytics
        </h2>
        <p style={{ color: subtext, fontSize: "14px", marginBottom: "24px" }}>
          Track your progress and skill exchange statistics
        </p>

        {/* Top Stats - Real Data */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px", marginBottom: "24px"
        }}>
          <StatCard label="Total Exchanges" value={stats.totalExchanges} icon="🎯" color="#3b82f6" />
          <StatCard label="Completed" value={stats.completedExchanges} icon="✅" color="#10b981" />
          <StatCard label="Points" value={stats.points} icon="⚡" color="#f59e0b" />
          <StatCard label="Rating" value={stats.rating || "N/A"} icon="⭐" color="#f97316" />
        </div>

        {/* Progress & Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

          {/* Level Progress - Real Data */}
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
              📈 Level Progress
            </h3>
            <ProgressBar label="Current Level" value={stats.points} max={500} color="#16a34a" />
            <p style={{ fontSize: "12px", color: subtext, textAlign: "center" }}>
              Level {stats.level} - {stats.points}/500 points to next level
            </p>
          </div>

          {/* Exchange Status */}
          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
              Exchange Status
            </h3>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: subtext, fontSize: "13px" }}>
                {stats.totalExchanges === 0 
                  ? "No exchanges yet. Visit Find Skills to start!" 
                  : `${stats.completedExchanges}/${stats.totalExchanges} completed`}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Performance */}
        <div style={{
          background: cardBg, border: `1px solid ${border}`,
          borderRadius: "12px", padding: "20px", marginBottom: "24px"
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: text, marginBottom: "16px" }}>
            🌟 Skills Performance
          </h3>
          <BarChart skills={[]} />
        </div>

        {/* Your Stats - Real Data */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <p style={{ fontSize: "13px", color: subtext, marginBottom: "8px" }}>Total Exchanges</p>
            <p style={{ fontSize: "24px", fontWeight: "700", color: "#3b82f6", marginBottom: "4px" }}>{stats.totalExchanges}</p>
            <p style={{ fontSize: "12px", color: subtext }}>Skill exchanges started</p>
          </div>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <p style={{ fontSize: "13px", color: subtext, marginBottom: "8px" }}>Completed Exchanges</p>
            <p style={{ fontSize: "24px", fontWeight: "700", color: "#10b981", marginBottom: "4px" }}>{stats.completedExchanges}</p>
            <p style={{ fontSize: "12px", color: subtext }}>Successfully finished</p>
          </div>

          <div style={{
            background: cardBg, border: `1px solid ${border}`,
            borderRadius: "12px", padding: "20px"
          }}>
            <p style={{ fontSize: "13px", color: subtext, marginBottom: "8px" }}>Your Rating</p>
            <p style={{ fontSize: "24px", fontWeight: "700", color: "#f59e0b", marginBottom: "4px" }}>{stats.rating || "N/A"}</p>
            <p style={{ fontSize: "12px", color: subtext }}>Average from exchanges</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;