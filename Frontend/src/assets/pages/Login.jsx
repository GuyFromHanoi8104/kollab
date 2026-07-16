import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KollabLogo from "../components/KollabLogo";
import TransactionalHeader from "../components/TransactionalHeader";

const colors = {
  navy: "#191c1e",
  gray: "#434655",
  blue: "#2563eb",
  blueDark: "#004ac6",
};

// Simple inline replicas of the Google/Instagram/TikTok marks — safer and
// more reliable than hotlinking Figma's temp asset URLs (see the note in
// LandingPage.jsx). Swap for your own icon set if you have one.
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


function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
    <footer style={{ background: "#f7f9fb", borderTop: "1px solid #e0e3e5", width: "100%" }}>
      <div style={{ background: "white", borderTop: "1px solid #c3c6d7", width: "100%" }}>
        <div style={{ backdropFilter: "blur(6px)", background: "rgba(255,255,255,0.3)", borderTop: "1px solid rgba(195,198,215,0.1)", width: "100%" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 64 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <p style={{ fontWeight: 800, color: colors.navy, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>Platform</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
                  <li><a href="#" style={{ fontWeight: 500, color: colors.gray, fontSize: 12, textDecoration: "none" }}>About Us</a></li>
                  <li><a href="#" style={{ fontWeight: 500, color: colors.gray, fontSize: 12, textDecoration: "none" }}>Help Center</a></li>
                  <li><a href="#" style={{ fontWeight: 500, color: colors.gray, fontSize: 12, textDecoration: "none" }}>Contact</a></li>
                </ul>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <p style={{ fontWeight: 800, color: colors.navy, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>Legal</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
                  <li><a href="#" style={{ fontWeight: 500, color: colors.gray, fontSize: 12, textDecoration: "none" }}>Privacy Policy</a></li>
                  <li><a href="#" style={{ fontWeight: 500, color: colors.gray, fontSize: 12, textDecoration: "none" }}>Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Mock login -- no real backend/auth yet. Sets a flag LandingPage.jsx
  // reads to switch into its logged-in header state, then sends the user
  // there. Replace with real OAuth + session handling later.
  const handleGoogleLogin = () => {
    localStorage.setItem("kollab_mock_logged_in", "true");
    navigate("/");
  };

  return (
    <div
      className="kollab-login"
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
        .kollab-login, .kollab-login *, .kollab-login *::before, .kollab-login *::after {
          box-sizing: border-box;
        }
      `}</style>

      <TransactionalHeader mode="login" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%", padding: "80px 24px", overflow: "hidden" }}>
        {/* Atmospheric background glow, matches Figma's blurred radial element */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            width: 1000,
            height: 600,
            borderRadius: 9999,
            background: "rgba(0,74,198,0.05)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 448,
            width: "100%",
            backdropFilter: "blur(6px)",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(226,232,240,0.8)",
            borderRadius: 12,
            boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 32,
            padding: 41,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", width: "100%" }}>
            <h1 style={{ fontWeight: 700, color: colors.navy, fontSize: 32, lineHeight: "40px", letterSpacing: -0.32, textAlign: "center", margin: 0 }}>
              Welcome back!
            </h1>
            <p style={{ color: colors.gray, fontSize: 16, lineHeight: "24px", textAlign: "center", margin: 0 }}>
              Log in to your account to continue.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <SocialButton icon={<GoogleIcon />} label="Continue with Google" onClick={handleGoogleLogin} />
            <SocialButton icon={<InstagramIcon />} label="Continue with Instagram" />
            <SocialButton icon={<TikTokIcon />} label="Continue with TikTok" />
          </div>

          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div style={{ flex: 1, height: 1, background: "#e0e3e5" }} />
            <span style={{ padding: "0 16px", color: "#737686", fontSize: 12, fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#e0e3e5" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid #c3c6d7", accentColor: colors.blue }}
              />
              <span style={{ color: colors.gray, fontSize: 12, fontWeight: 500 }}>Remember me</span>
            </label>
            <a href="/forgot-password" style={{ color: colors.blueDark, fontSize: 12, fontWeight: 500, textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>

          <div style={{ width: "100%", textAlign: "center" }}>
            <span style={{ color: colors.gray, fontSize: 16, lineHeight: "24px" }}>Don't have an account? </span>
            <Link to="/signup" style={{ color: colors.blueDark, fontSize: 16, lineHeight: "24px", fontWeight: 700, textDecoration: "none" }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}