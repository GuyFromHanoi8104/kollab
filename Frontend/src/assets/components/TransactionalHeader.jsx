import { Link } from "react-router-dom";
import KollabLogo from "./KollabLogo";

const colors = {
  navy: "#191c1e",
  blueDark: "#004ac6",
};

// Shared by Login.jsx, SignUp.jsx, and any other auth/transactional page.
// Figma calls this "Header (Suppressed active navigation for transactional
// page)" — deliberately no nav links, just the logo and a way back/forward
// between Login and Sign Up.
export default function TransactionalHeader({ mode = "login" }) {
  return (
    <div style={{ background: "#f7f9fb", borderBottom: "1px solid #e0e3e5", width: "100%" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", boxSizing: "border-box" }}>
        <Link to="/" style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
          <KollabLogo size={40} />
          <span style={{ fontWeight: 800, color: colors.navy, fontSize: 24 }}>Kollab</span>
        </Link>
        {mode === "login" ? (
          <Link to="/signup" style={{ fontWeight: 600, color: colors.blueDark, fontSize: 14, letterSpacing: 0.28, textDecoration: "none" }}>
            Sign Up
          </Link>
        ) : (
          <Link to="/login" style={{ fontWeight: 600, color: colors.blueDark, fontSize: 14, letterSpacing: 0.28, textDecoration: "none" }}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}