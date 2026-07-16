import { useState } from "react";
import { Link } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { Breadcrumb } from "../components/AppTopBar";
import { appColors } from "../components/appColors";

// NOTE: this is its own static demo dataset, not live-synced with the Save
// toggles on Discover Creators / Creator Profile (those are local component
// state and don't persist across pages yet). Reusing the same creator
// identities for consistency, but wiring real shared "saved" state across
// the app is a bigger piece for later.
const SAVED_CREATORS = [
  { id: "linh", name: "Linh Nguyen", handle: "@linh.beauty", tags: ["Beauty", "Lifestyle"], statLabel: "TIKTOK FOLLOWERS", statValue: "245K", engagement: "6.8%", avgViews: "420K Avg. Views", location: "Ho Chi Minh City", list: "Beauty Creators", initial: "L" },
  { id: "minh", name: "Minh Review", handle: "@minh.techtips", tags: ["Tech", "Gadgets"], statLabel: "TIKTOK FOLLOWERS", statValue: "1.2M", engagement: "4.8%", avgViews: "450K Avg. Views", location: "Ho Chi Minh City", list: "Summer Campaign", initial: "M" },
  { id: "thanh", name: "Thanh Beauty", handle: "@thanh.glam", tags: ["Beauty", "Luxury"], statLabel: "INSTAGRAM FOLLOWERS", statValue: "840K", engagement: "3.2%", avgViews: "120K Avg. Views", location: "Hanoi, VN", list: "Beauty Creators", initial: "T" },
  { id: "khoa", name: "Khoa Fitness", handle: "@khoa.trains", tags: ["Fitness", "Wellness"], statLabel: "TIKTOK FOLLOWERS", statValue: "2.4M", engagement: "5.5%", avgViews: "680K Avg. Views", location: "Ho Chi Minh City", list: "Summer Campaign", initial: "K" },
];

const LISTS = ["All Saved", "Summer Campaign", "Beauty Creators", "Food Campaign"];

function LocationIcon({ color }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M6 13S1 8.4 1 5a5 5 0 0 1 10 0c0 3.4-5 8-5 8Z" stroke={color} strokeWidth="1.3" />
      <circle cx="6" cy="5" r="1.6" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <path d="M9 15S1 10.2 1 5.4A3.9 3.9 0 0 1 9 3.2a3.9 3.9 0 0 1 8 2.2C17 10.2 9 15 9 15Z" fill="#ba1a1a" />
    </svg>
  );
}

function SavedCreatorCard({ creator, onUnsave }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ height: 200, background: "linear-gradient(135deg, #cbd5e1, #94a3b8)", position: "relative" }}>
        <button
          type="button"
          onClick={() => onUnsave(creator.id)}
          aria-label="Remove from saved"
          style={{ position: "absolute", right: 16, top: 16, backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 9999, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <HeartIcon />
        </button>
        <span style={{ position: "absolute", left: 16, bottom: 16, background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "4px 12px", fontWeight: 700, color: appColors.primary, fontSize: 11 }}>
          {creator.list}
        </span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <div>
          <div style={{ color: appColors.navy, fontSize: 16, fontWeight: 700 }}>{creator.name}</div>
          <div style={{ color: appColors.gray, fontSize: 14 }}>{creator.handle}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {creator.tags.map((tag) => (
              <span key={tag} style={{ background: appColors.primaryLight, color: appColors.primary, fontWeight: 700, fontSize: 12, borderRadius: 9999, padding: "4px 12px" }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>{creator.statLabel}</div>
            <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, marginTop: 4 }}>{creator.statValue}</div>
          </div>
          <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>ENGAGEMENT</div>
            <div style={{ fontWeight: 700, color: "#924700", fontSize: 24, letterSpacing: -0.24, marginTop: 4 }}>{creator.engagement}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <LocationIcon color={appColors.gray} />
          <span style={{ color: appColors.gray, fontSize: 12, fontWeight: 600 }}>{creator.location}</span>
        </div>

        <Link
          to={`/creator/${creator.id}`}
          style={{ background: appColors.primary, border: "none", borderRadius: 12, padding: "16px 0", fontWeight: 700, color: "white", fontSize: 16, textAlign: "center", textDecoration: "none", display: "block", marginTop: "auto" }}
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
}

export default function SavedCreators() {
  const [creators, setCreators] = useState(SAVED_CREATORS);
  const [activeList, setActiveList] = useState("All Saved");

  const handleUnsave = (id) => {
    setCreators((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = activeList === "All Saved" ? creators : creators.filter((c) => c.list === activeList);

  return (
    <div
      className="kollab-saved-creators"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-saved-creators, .kollab-saved-creators *, .kollab-saved-creators *::before, .kollab-saved-creators *::after {
          box-sizing: border-box;
        }
      `}</style>

      <AppSidebar activeItem="saved" />
      <AppTopBar left={<Breadcrumb text="Workspace /" current="Saved Creators" />} />

      <main style={{ marginLeft: 256, paddingTop: 96, paddingBottom: 64, paddingLeft: 32, paddingRight: 32, display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 style={{ fontWeight: 600, color: appColors.navy, fontSize: 36, letterSpacing: -0.72, margin: 0 }}>Saved Creators</h1>
          <p style={{ color: appColors.grayLight, fontSize: 16, margin: 0 }}>Creators you've bookmarked, organized into your lists.</p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LISTS.map((list) => {
            const count = list === "All Saved" ? SAVED_CREATORS.length : SAVED_CREATORS.filter((c) => c.list === list).length;
            return (
              <button
                key={list}
                type="button"
                onClick={() => setActiveList(list)}
                style={{
                  background: activeList === list ? appColors.primary : "white",
                  border: `1px solid ${activeList === list ? appColors.primary : appColors.border}`,
                  borderRadius: 9999, padding: "9px 17px", fontWeight: 600, fontSize: 14,
                  color: activeList === list ? "white" : appColors.gray, cursor: "pointer",
                }}
              >
                {list} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {filtered.map((creator) => (
              <SavedCreatorCard key={creator.id} creator={creator} onUnsave={handleUnsave} />
            ))}
          </div>
        ) : (
          <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 64, textAlign: "center", color: appColors.grayLight }}>
            No creators saved to this list yet.
          </div>
        )}
      </main>
    </div>
  );
}