import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navBg = darkMode ? "#1e293b" : "#ffffff";
  const border = darkMode ? "#334155" : "#e5e7eb";
  const text = darkMode ? "#f1f5f9" : "#111827";
  const subtext = darkMode ? "#94a3b8" : "#6b7280";

  const links = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Skills", path: "/my-skills" },
  { label: "Find Skills", path: "/find-skills" },
  { label: "AI Assistant", path: "/ai-assistant" },
  { label: "Analytics", path: "/analytics" },
];
  return (
    <nav style={{
      background: navBg,
      borderBottom: `1px solid ${border}`,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 10
    }}>

      {/* Left — Logo + Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <div
          onClick={() => navigate("/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <span style={{ fontSize: "20px" }}>🌿</span>
          <span style={{ fontWeight: "700", fontSize: "18px", color: "#16a34a" }}>SkillSync</span>
        </div>

        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <span
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                fontSize: "14px",
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "#16a34a" : subtext,
                cursor: "pointer",
                paddingBottom: "2px",
                borderBottom: isActive ? "2px solid #16a34a" : "none"
              }}
            >
              {link.label}
            </span>
          );
        })}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={toggleDarkMode} style={{
          background: "none", border: "none",
          fontSize: "18px", cursor: "pointer"
        }}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <span style={{
          background: "#f0fdf4", color: "#16a34a",
          padding: "4px 10px", borderRadius: "20px",
          fontSize: "13px", fontWeight: "600"
        }}>
          0 pts
        </span>

        <span style={{ fontSize: "13px", color: subtext }}>Level 1</span>

        <div style={{
          width: "34px", height: "34px", borderRadius: "50%",
          background: "#16a34a", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: "700", fontSize: "14px"
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <span style={{ fontSize: "14px", color: text }}>{user?.name}</span>

        <button onClick={handleLogout} style={{
          background: "none",
          border: `1px solid ${border}`,
          borderRadius: "6px", padding: "6px 12px",
          fontSize: "13px", color: subtext, cursor: "pointer"
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;