import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { appColors } from "./appColors";

function BellIcon({ color }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M8 1c-3 0-5 2.2-5 5.5v3.7L1 13h14l-2-2.8V6.5C13 3.2 11 1 8 1Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 16a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function SearchGlyph({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.5" />
      <path d="M14.5 14.5l-3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SearchBox({ placeholder }) {
  return (
    <div style={{ background: appColors.primaryLighter, borderRadius: 12, width: 384, display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", boxSizing: "border-box" }}>
      <SearchGlyph color={appColors.grayLight} />
      <input
        type="text"
        placeholder={placeholder}
        style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 14, color: appColors.gray, minWidth: 0 }}
      />
    </div>
  );
}

export function Breadcrumb({ text, current }) {
  return (
    <span style={{ color: appColors.gray, fontSize: 16 }}>
      {text} <span style={{ fontWeight: 700, color: appColors.navy }}>{current}</span>
    </span>
  );
}

// left: JSX for the left slot -- pass <SearchBox .../> or <Breadcrumb .../>
export default function AppTopBar({ left, userName = "Kollab Demo", plan = "PREMIUM PLAN" }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("kollab_mock_logged_in") === "true");
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 256,
        right: 0,
        height: 64,
        background: appColors.bg,
        borderBottom: `1px solid ${appColors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
        zIndex: 9,
      }}
    >
      <div>{left}</div>

      {isLoggedIn ? (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <BellIcon color={appColors.gray} />
            <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 9999, background: "#ba1a1a", boxShadow: `0 0 0 2px ${appColors.bg}` }} />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: "#dce1ff", borderRadius: 9999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontWeight: 700, color: appColors.primary, fontSize: 14 }}>K</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: appColors.navy, fontSize: 14, fontWeight: 500 }}>{userName}</div>
              <div style={{ color: appColors.grayLight, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>{plan}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/login" style={{ fontWeight: 600, color: appColors.gray, fontSize: 14, textDecoration: "none" }}>Login</Link>
          <Link
            to="/signup"
            style={{ background: appColors.primary, borderRadius: 9999, padding: "10px 24px", fontWeight: 600, color: "white", fontSize: 14, textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}