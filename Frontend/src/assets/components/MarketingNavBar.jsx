import { Link } from "react-router-dom";
import KollabLogo from "./KollabLogo";

const colors = {
  navy: "#191c1e",
  gray: "#434655",
  blue: "#2563eb",
  blueDark: "#004ac6",
};

function BellIcon({ color }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M8 1c-3 0-5 2.2-5 5.5v3.7L1 13h14l-2-2.8V6.5C13 3.2 11 1 8 1Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 16a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV_LINKS = [
  { key: "explore", label: "Explore", to: "/" },
  { key: "campaigns", label: "Campaigns", to: "/campaigns" },
  { key: "kols", label: "KOLs", to: "/discover" },
];

// activeTab: "explore" | "campaigns" | "kols"
export default function MarketingNavBar({ activeTab, isLoggedIn = false }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.6)",
        borderBottom: "1px solid rgba(195,198,215,0.2)",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px" }}>
        <Link to="/" style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
          <KollabLogo size={36} />
          <span style={{ fontWeight: 800, color: colors.navy, fontSize: 24, letterSpacing: -0.6 }}>Kollab</span>
        </Link>
        <nav style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {NAV_LINKS.map((link) => {
            const active = link.key === activeTab;
            return (
              <Link
                key={link.key}
                to={link.to}
                style={{
                  borderBottom: active ? `2px solid ${colors.blueDark}` : "none",
                  paddingBottom: active ? 6 : 8,
                  fontWeight: active ? 700 : 600,
                  color: active ? colors.blueDark : colors.gray,
                  fontSize: 14,
                  letterSpacing: 0.28,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {isLoggedIn ? (
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ position: "relative", display: "flex" }}>
              <BellIcon color={colors.gray} />
              <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 9999, background: "#ba1a1a", boxShadow: "0 0 0 2px #f8f9ff" }} />
            </div>
            <Link to="/dashboard" style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }}>
              <div style={{ background: "#dce1ff", borderRadius: 9999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontWeight: 700, color: "#1550d3", fontSize: 14 }}>K</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#0b1c30", fontSize: 14, fontWeight: 500 }}>Kollab Demo</div>
                <div style={{ color: "#737686", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>Premium Plan</div>
              </div>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link to="/login" style={{ fontWeight: 600, color: colors.gray, fontSize: 14, letterSpacing: 0.28, textDecoration: "none" }}>Login</Link>
            <Link
              to="/signup"
              style={{
                background: colors.blue,
                borderRadius: 9999,
                padding: "10px 28px",
                fontWeight: 600,
                color: "white",
                fontSize: 14,
                letterSpacing: 0.28,
                textDecoration: "none",
                boxShadow: "0px 10px 15px -3px rgba(37,99,235,0.2), 0px 4px 6px -4px rgba(37,99,235,0.2)",
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}