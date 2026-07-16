import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import KollabLogo from "../components/KollabLogo";
import Footer from "../components/Footer";
import MarketingNavBar from "../components/MarketingNavBar";

const colors = {
  navy: "#191c1e",
  gray: "#434655",
  blue: "#2563eb",
  blueDark: "#004ac6",
};

const TRENDING_TAGS = ["Beauty", "Tech", "Lifestyle", "Fitness"];

const FEATURED_KOLS = [
  { handle: "@linh.beauty", niche: "Beauty & Lifestyle", followers: "120K", er: "5.2% ER", tint: "rgba(37,99,235,0.1)", initial: "L" },
  { handle: "@minh.review", niche: "Tech & Gadgets", followers: "85K", er: "4.8% ER", tint: "rgba(37,99,235,0.16)", initial: "M" },
  { handle: "@eat.with.tui", niche: "Food & Travel", followers: "42K", er: "6.1% ER", tint: "rgba(101,109,132,0.1)", initial: "T" },
];

const ACTIVE_BRANDS = [
  { name: "VinFast", category: "Automotive", tint: "rgba(37,99,235,0.1)", initial: "V" },
  { name: "Shopee Vietnam", category: "E-commerce", tint: "rgba(37,99,235,0.16)", initial: "S" },
  { name: "Highlands Coffee", category: "F&B", tint: "rgba(101,109,132,0.1)", initial: "H" },
];

const STATS = [
  { value: "1000+", label: "Active KOLs", tint: "rgba(219,225,255,0.5)" },
  { value: "Diverse", label: "Industries Covered", tint: "rgba(37,99,235,0.12)" },
  { value: "Secure", label: "Payment Guarantee", tint: "rgba(218,226,253,0.5)" },
];

function SearchModeToggle({ mode, onChange }) {
  const btnStyle = (active) => ({
    padding: "10.5px 32px 11.5px",
    borderRadius: 9999,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: 0.28,
    border: active ? "none" : "1px solid rgba(195,198,215,0.3)",
    background: active ? colors.blue : "rgba(255,255,255,0.5)",
    color: active ? "white" : colors.gray,
    boxShadow: active ? "0px 4px 6px -1px rgba(37,99,235,0.3), 0px 2px 4px -2px rgba(37,99,235,0.3)" : "none",
    cursor: "pointer",
  });
  return (
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <button type="button" onClick={() => onChange("kols")} style={btnStyle(mode === "kols")}>Find KOLs</button>
      <button type="button" onClick={() => onChange("campaigns")} style={btnStyle(mode === "campaigns")}>Find Campaigns</button>
    </div>
  );
}

function SearchCard({ mode, onModeChange }) {
  return (
    <div
      style={{
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.4)",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: 32,
        boxShadow: "0px 8px 32px 0px rgba(31,38,135,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 896,
        width: "100%",
        padding: 33,
        boxSizing: "border-box",
      }}
    >
      <SearchModeToggle mode={mode} onChange={onModeChange} />

      <div style={{ display: "flex", gap: 12, width: "100%" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(115,118,134,0.6)" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, category, platform..."
            style={{
              background: "rgba(255,255,255,0.8)",
              borderRadius: 16,
              boxShadow: "0px 0px 0px 1px rgba(195,198,215,0.3)",
              width: "100%",
              padding: "19px 24px 20px 48px",
              fontSize: 18,
              color: colors.gray,
              border: "none",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          type="button"
          style={{
            background: colors.blue,
            borderRadius: 16,
            boxShadow: "0px 10px 15px -3px rgba(37,99,235,0.2), 0px 4px 6px -4px rgba(37,99,235,0.2)",
            padding: "19.5px 40px 20.5px",
            fontWeight: 600,
            color: "white",
            fontSize: 14,
            letterSpacing: 0.28,
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, color: colors.gray, fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase" }}>Trending:</span>
        {TRENDING_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(195,198,215,0.2)",
              borderRadius: 9999,
              padding: "7px 17px",
              fontWeight: 500,
              color: colors.gray,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: 48,
        boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          height: 334,
          width: "100%",
          position: "relative",
          background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
        <button
          type="button"
          aria-label="Play video"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              backdropFilter: "blur(6px)",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              fontSize: 28,
              color: "white",
            }}
          >
            ▶
          </span>
        </button>
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <div style={{ borderTop: "1px solid rgba(195,198,215,0.1)", display: "flex", gap: 40, justifyContent: "center", width: "100%", paddingTop: 49, paddingBottom: 48 }}>
      {STATS.map((stat) => (
        <div key={stat.label} style={{ display: "flex", gap: 20, alignItems: "center", width: 234 }}>
          <div style={{ backdropFilter: "blur(2px)", background: stat.tint, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, flexShrink: 0, width: 56, height: 56 }} />
          <div>
            <p style={{ fontWeight: 700, color: colors.navy, fontSize: 24, lineHeight: "32px", margin: 0 }}>{stat.value}</p>
            <p style={{ fontWeight: 500, color: colors.gray, fontSize: 12, lineHeight: "16px", margin: 0 }}>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarPanel({ title, viewAllTo, children }) {
  return (
    <div
      style={{
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.4)",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: 40,
        boxShadow: "0px 8px 32px 0px rgba(31,38,135,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        width: "100%",
        padding: 33,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <h3 style={{ fontWeight: 700, color: colors.navy, fontSize: 24, margin: 0 }}>{title}</h3>
        {viewAllTo ? (
          <Link to={viewAllTo} style={{ fontWeight: 700, color: colors.blue, fontSize: 12, textDecoration: "none" }}>View All</Link>
        ) : (
          <a href="#" style={{ fontWeight: 700, color: colors.blue, fontSize: 12, textDecoration: "none" }}>View All</a>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>{children}</div>
    </div>
  );
}

function FeaturedKolRow({ kol }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", width: "100%" }}>
      <div style={{ borderRadius: "50%", background: kol.tint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 56, height: 56, fontWeight: 700, color: colors.navy, textAlign: "center", lineHeight: 1 }}>
        {kol.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, color: colors.navy, fontSize: 14, letterSpacing: 0.28, margin: 0 }}>{kol.handle}</p>
        <p style={{ fontWeight: 500, color: colors.gray, fontSize: 12, margin: 0 }}>{kol.niche}</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontWeight: 700, color: colors.navy, fontSize: 14, letterSpacing: 0.28, margin: 0 }}>{kol.followers}</p>
        <p style={{ fontWeight: 700, color: colors.blue, fontSize: 12, margin: 0 }}>{kol.er}</p>
      </div>
    </div>
  );
}

function BrandRow({ brand }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", width: "100%" }}>
      <div style={{ borderRadius: 12, background: brand.tint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 48, height: 48, fontWeight: 700, color: colors.navy, textAlign: "center", lineHeight: 1 }}>
        {brand.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, color: colors.navy, fontSize: 14, letterSpacing: 0.28, margin: 0 }}>{brand.name}</p>
        <p style={{ fontWeight: 500, color: colors.gray, fontSize: 12, margin: 0 }}>{brand.category}</p>
      </div>
    </div>
  );
}


export default function LandingPage() {
  const [mode, setMode] = useState("kols"); // "kols" | "campaigns"

  // Mock login state -- there's no real backend/auth yet, so Login.jsx's
  // "Continue with Google" button just sets this flag and sends the user
  // back here. Swap this for real auth state (e.g. from a context/provider)
  // once login actually exists.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("kollab_mock_logged_in") === "true");
  }, []);

  return (
    <div
      className="kollab-landing"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 160,
        alignItems: "center",
        paddingTop: 128,
        position: "relative",
        width: "100%",
        background: "linear-gradient(90deg, rgb(247,249,251) 0%, rgb(247,249,251) 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        textAlign: "left",
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
        .kollab-landing, .kollab-landing *, .kollab-landing *::before, .kollab-landing *::after {
          box-sizing: border-box;
        }
      `}</style>

      <MarketingNavBar activeTab="explore" isLoggedIn={isLoggedIn} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 48, width: "100%", maxWidth: 1200, padding: "0 40px", boxSizing: "border-box" }}>
        {/* Main content, 8 cols */}
        <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-start", minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
            <h1 style={{ fontWeight: 800, color: colors.navy, fontSize: 64, lineHeight: "72px", letterSpacing: -1.6, maxWidth: 768, margin: 0 }}>
              Connecting Brands with{" "}
              <span style={{ color: colors.blue }}>the Perfect KOLs</span>
            </h1>
            <p style={{ color: colors.gray, fontSize: 18, lineHeight: "29px", maxWidth: 672, margin: 0 }}>
              The ultimate platform for fast, transparent, and efficient influencer collaboration for every campaign. Experience the future of partnership.
            </p>
          </div>

          <SearchCard mode={mode} onModeChange={setMode} />
          <HeroVisual />
          <StatsBar />
        </div>

        {/* Sidebar, 4 cols */}
        <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-start", minWidth: 0 }}>
          <SidebarPanel title="Featured KOLs" viewAllTo="/discover">
            {FEATURED_KOLS.map((kol) => (
              <FeaturedKolRow key={kol.handle} kol={kol} />
            ))}
          </SidebarPanel>
          <SidebarPanel title="Active Brands" viewAllTo="/discover-brands">
            {ACTIVE_BRANDS.map((brand) => (
              <BrandRow key={brand.name} brand={brand} />
            ))}
          </SidebarPanel>
        </div>
      </div>

      <Footer />
    </div>
  );
}