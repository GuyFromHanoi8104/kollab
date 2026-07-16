import { useState } from "react";
import { Link } from "react-router-dom";
import KollabLogo from "../components/KollabLogo";
import TransactionalHeader from "../components/TransactionalHeader";

const colors = {
  navy: "#191c1e",
  gray: "#434655",
  blue: "#2563eb",
  blueDark: "#004ac6",
};

// Role-specific subtext shown above the Creator/Brand cards, pulled from
// Figma. NOTE: the "Brand" copy in Figma ("Find creators. tiny changes.
// huge usability improvements") reads like a leftover AI-placeholder string,
// not real copy — I've kept it as a starting point but you'll probably want
// to replace it with something intentional.
const ROLE_SUBTEXT = {
  none: "how will you use kollab?",
  creator: "apply to campaigns. connect with brands",
  brand: "Find creators. tiny changes. huge usability improvements",
};

function CreatorIcon({ color }) {
  return (
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 1.5 17 5 6 16l-4.5 1L2.5 12.5 13.5 1.5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" style={{ transition: "stroke 200ms ease-out" }} />
    </svg>
  );
}

function BrandIcon({ color }) {
  return (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="16" height="11" rx="1.5" stroke={color} strokeWidth="1.6" style={{ transition: "stroke 200ms ease-out" }} />
      <path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V6" stroke={color} strokeWidth="1.6" style={{ transition: "stroke 200ms ease-out" }} />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.6 10.23c0-.68-.06-1.33-.17-1.96H10v3.71h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.27Z" fill="#4285F4" />
      <path d="M10 20c2.7 0 4.96-.9 6.61-2.43l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.06v2.59A10 10 0 0 0 10 20Z" fill="#34A853" />
      <path d="M4.41 11.9a5.99 5.99 0 0 1 0-3.8V5.5H1.06a10 10 0 0 0 0 9l3.35-2.6Z" fill="#FBBC05" />
      <path d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.96 9.96 0 0 0 10 0 10 10 0 0 0 1.06 5.5l3.35 2.6C5.2 5.74 7.4 3.98 10 3.98Z" fill="#EA4335" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="18" rx="5" stroke="#191c1e" strokeWidth="1.6" />
      <circle cx="10" cy="10" r="4.2" stroke="#191c1e" strokeWidth="1.6" />
      <circle cx="15" cy="5" r="1" fill="#191c1e" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 2c.3 1.9 1.5 3.1 3.5 3.3v2.6c-1.2.1-2.4-.3-3.5-1v5.6a4.6 4.6 0 1 1-4.6-4.6c.3 0 .6 0 .9.08v2.7a1.9 1.9 0 1 0 1.4 1.83V2h2.3Z"
        fill="#191c1e"
      />
    </svg>
  );
}

function RoleCard({ role, label, icon, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      aria-pressed={selected}
      style={{
        background: selected ? "rgba(37,99,235,0.1)" : "white",
        border: `1px solid ${selected ? colors.blue : "#c3c6d7"}`,
        borderRadius: 8,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 17,
        cursor: "pointer",
        gap: 8,
        transition: "background-color 200ms ease-out, border-color 200ms ease-out",
      }}
    >
      <div
        style={{
          background: selected ? colors.blue : "#e6e8ea",
          borderRadius: 9999,
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 200ms ease-out",
        }}
      >
        {icon(selected ? "white" : colors.navy)}
      </div>
      <span style={{ fontWeight: 600, color: colors.navy, fontSize: 14, letterSpacing: 0.28 }}>{label}</span>
    </button>
  );
}

function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      style={{
        background: "white",
        border: "1px solid #c3c6d7",
        borderRadius: 8,
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: "13px 25px",
        width: "100%",
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      {icon}
      <span style={{ fontWeight: 600, color: colors.navy, fontSize: 14, letterSpacing: 0.28 }}>{label}</span>
    </button>
  );
}

function Footer() {
  return (
    <footer style={{ backdropFilter: "blur(6px)", background: "rgba(255,255,255,0.3)", borderTop: "1px solid rgba(195,198,215,0.1)", width: "100%" }}>
      <div style={{ maxWidth: 1600, margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "64px 40px", flexWrap: "wrap", gap: 40, boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <KollabLogo size={32} />
            <span style={{ fontWeight: 800, color: colors.navy, fontSize: 24 }}>Kollab</span>
          </div>
          <p style={{ color: colors.gray, fontSize: 16, lineHeight: "26px", maxWidth: 384, margin: 0 }}>
            © 2026 Kollab. Powering brand partnerships globally through technology and trust.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function SignUp() {
  const [role, setRole] = useState(null); // null | "creator" | "brand"

  const subtext = role ? ROLE_SUBTEXT[role] : ROLE_SUBTEXT.none;

  return (
    <div
      className="kollab-signup"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        textAlign: "left",
        background: "linear-gradient(90deg, rgb(247,249,251) 0%, rgb(247,249,251) 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {
          margin: 0;
          background: white;
        }
        #root {
          max-width: none;
          margin: 0;
          padding: 0;
          width: 100%;
        }
        .kollab-signup, .kollab-signup *, .kollab-signup *::before, .kollab-signup *::after {
          box-sizing: border-box;
        }
      `}</style>

      <TransactionalHeader mode="signup" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "80px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "flex-start", maxWidth: 512, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", width: "100%" }}>
            <h1 style={{ fontWeight: 700, color: colors.navy, fontSize: 48, lineHeight: "56px", letterSpacing: -0.48, textAlign: "center", margin: 0 }}>
              Create your account
            </h1>
            <p style={{ color: colors.gray, fontSize: 18, lineHeight: "28px", textAlign: "center", margin: 0 }}>
              Join the next generation of creative partnerships.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0)",
              border: "1px solid #c3c6d7",
              borderRadius: 12,
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: 32,
              width: "100%",
              padding: 33,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              <span style={{ fontWeight: 600, color: colors.gray, fontSize: 14, letterSpacing: 0.7, textTransform: "uppercase" }}>
                {subtext}
              </span>
              <div style={{ display: "flex", gap: 16, width: "100%" }}>
                <RoleCard role="creator" label="Creator" icon={(c) => <CreatorIcon color={c} />} selected={role === "creator"} onSelect={setRole} />
                <RoleCard role="brand" label="Brand" icon={(c) => <BrandIcon color={c} />} selected={role === "brand"} onSelect={setRole} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
              <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
              <SocialButton icon={<InstagramIcon />} label="Continue with Instagram" />
              <SocialButton icon={<TikTokIcon />} label="Continue with TikTok" />
            </div>

            <div style={{ display: "flex", width: "100%" }}>
              <input
                type="checkbox"
                required
                style={{ width: 16, height: 16, marginTop: 2, borderRadius: 4, border: "1px solid #c3c6d7", accentColor: colors.blue, flexShrink: 0 }}
              />
              <p style={{ color: colors.gray, fontSize: 12, lineHeight: "16px", margin: 0, paddingLeft: 12 }}>
                By continuing, you agree to our{" "}
                <a href="/terms" style={{ color: colors.blueDark, textDecoration: "none" }}>Terms of Service</a>{" "}
                and <a href="/privacy" style={{ color: colors.blueDark, textDecoration: "none" }}>Privacy Policy</a>.
              </p>
            </div>

            <div style={{ borderTop: "1px solid #c3c6d7", width: "100%", paddingTop: 33, textAlign: "center" }}>
              <span style={{ color: colors.gray, fontSize: 16, lineHeight: "24px" }}>Already have an account? </span>
              <Link to="/login" style={{ color: colors.blueDark, fontSize: 16, lineHeight: "24px", fontWeight: 700, textDecoration: "none" }}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}