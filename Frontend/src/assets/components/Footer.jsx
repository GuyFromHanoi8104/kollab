import KollabLogo from "./KollabLogo";

// Marketing-site colors (matches LandingPage.jsx's palette, not the app-shell
// appColors used in Dashboard/AppSidebar). Kept local since Footer is
// primarily a marketing-site element being reused, not an app-shell one.
const colors = {
  navy: "#191c1e",
  gray: "#434655",
};

export default function Footer() {
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
    </footer>
  );
}