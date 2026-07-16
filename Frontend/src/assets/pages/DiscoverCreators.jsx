import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { Breadcrumb } from "../components/AppTopBar";
import { appColors } from "../components/appColors";
import PremiumAIPanel from "../components/PremiumAIPanel";

const FILTER_CHIPS = ["Platform", "Category", "Followers", "Engagement Rate", "Location", "Price Range"];

const CREATORS = [
  {
    id: "minh",
    name: "Minh Review",
    handle: "@minh.techtips",
    tags: ["Tech", "Gadgets"],
    statLabel: "TIKTOK FOLLOWERS",
    statValue: "1.2M",
    engagement: "4.8%",
    avgViews: "450K Avg. Views",
    location: "Ho Chi Minh City",
    initial: "M",
  },
  {
    id: "thanh",
    name: "Thanh Beauty",
    handle: "@thanh.glam",
    tags: ["Beauty", "Luxury"],
    statLabel: "INSTAGRAM FOLLOWERS",
    statValue: "840K",
    engagement: "3.2%",
    avgViews: "120K Avg. Views",
    location: "Hanoi, VN",
    initial: "T",
  },
  {
    id: "khoa",
    name: "Khoa Fitness",
    handle: "@khoa.trains",
    tags: ["Fitness", "Wellness"],
    statLabel: "TIKTOK FOLLOWERS",
    statValue: "2.4M",
    engagement: "5.5%",
    avgViews: "680K Avg. Views",
    location: "Ho Chi Minh City",
    initial: "K",
  },
  {
    id: "linh",
    name: "Linh Nguyen",
    handle: "@linh.kitchen",
    tags: ["Food", "Lifestyle"],
    statLabel: "FOLLOWERS (TOTAL)",
    statValue: "410K",
    engagement: "7.1%",
    avgViews: "95K Avg. Views",
    location: "Da Nang, VN",
    initial: "L",
  },
];

const RECENTLY_VIEWED = [
  { name: "Minh Review", time: "2 hours ago", initial: "M" },
  { name: "Thanh Beauty", time: "Yesterday", initial: "T" },
];

const SAVED_LISTS = [
  { name: "Summer Campaign", meta: "12 creators • 4 new" },
  { name: "Beauty Creators", meta: "8 creators" },
  { name: "Food Campaign", meta: "24 creators • 2 new" },
];

function SearchIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
      <path d="M16 16l-3.5-3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function VerifiedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill={appColors.primary} />
      <path d="M5 8.2l2 2 4-4.4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EyeIcon({ color }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M1 6s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" stroke={color} strokeWidth="1.3" />
      <circle cx="8" cy="6" r="2" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}
function LocationIcon({ color }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M6 13S1 8.4 1 5a5 5 0 0 1 10 0c0 3.4-5 8-5 8Z" stroke={color} strokeWidth="1.3" />
      <circle cx="6" cy="5" r="1.6" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}
function SaveIcon({ filled }) {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <path
        d="M9 15S1 10.2 1 5.4A3.9 3.9 0 0 1 9 3.2a3.9 3.9 0 0 1 8 2.2C17 10.2 9 15 9 15Z"
        stroke={appColors.gray}
        strokeWidth="1.5"
        fill={filled ? "#ba1a1a" : "none"}
        style={{ transition: "fill 150ms ease-out" }}
      />
    </svg>
  );
}
function ChevronRight({ color }) {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
      <path d="M1 1l5 5-5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v14M1 8h14" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function SortChevron() {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1l5 5 5-5" stroke={appColors.primary} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AvatarSquare({ initial, size = 48, radius = 12 }) {
  return (
    <div
      style={{
        background: "#e2e8f0", width: size, height: size, borderRadius: radius, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.grayLight,
      }}
    >
      {initial}
    </div>
  );
}

function CreatorCard({ creator, compared, onToggleCompare, saved, onToggleSave }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ height: 256, background: "linear-gradient(135deg, #cbd5e1, #94a3b8)", position: "relative" }}>
        <div style={{ position: "absolute", left: 16, right: 16, top: 16, display: "flex", justifyContent: "space-between" }}>
          <label
            style={{
              backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.9)", borderRadius: 9999,
              display: "flex", gap: 8, alignItems: "center", padding: "6px 12px", cursor: "pointer", userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={compared}
              onChange={() => onToggleCompare(creator.id)}
              style={{ width: 16, height: 16, borderRadius: 4, accentColor: appColors.primary }}
            />
            <span style={{ fontWeight: 700, color: appColors.navy, fontSize: 12, letterSpacing: 0.24 }}>Compare</span>
          </label>
          <button
            type="button"
            onClick={() => onToggleSave(creator.id)}
            aria-label="Save creator"
            style={{
              backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 9999,
              width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
          >
            <SaveIcon filled={saved} />
          </button>
        </div>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ color: appColors.navy, fontSize: 16 }}>{creator.name}</span>
              <VerifiedIcon />
            </div>
            <div style={{ color: appColors.gray, fontSize: 14 }}>{creator.handle}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {creator.tags.map((tag) => (
              <span key={tag} style={{ background: appColors.primaryLight, color: appColors.primary, fontWeight: 700, fontSize: 12, borderRadius: 9999, padding: "4px 12px" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>{creator.statLabel}</div>
            <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, marginTop: 4 }}>{creator.statValue}</div>
          </div>
          <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>ENGAGEMENT RATE</div>
            <div style={{ fontWeight: 700, color: "#924700", fontSize: 24, letterSpacing: -0.24, marginTop: 4 }}>{creator.engagement}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <EyeIcon color={appColors.gray} />
            <span style={{ color: appColors.gray, fontSize: 12, fontWeight: 600, letterSpacing: 0.24 }}>{creator.avgViews}</span>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <LocationIcon color={appColors.gray} />
            <span style={{ color: appColors.gray, fontSize: 12, fontWeight: 600, letterSpacing: 0.24 }}>{creator.location}</span>
          </div>
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

export default function DiscoverCreators() {
  const [compared, setCompared] = useState(new Set());
  const [saved, setSaved] = useState(new Set());

  // Guest-vs-account distinction: browsing is public, but "Recently Viewed"
  // and "Saved Lists" are inherently account-tied concepts (nowhere to
  // persist them for an anonymous visitor), so they're hidden entirely when
  // logged out rather than shown empty/fake.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("kollab_mock_logged_in") === "true");
  }, []);

  const toggleCompare = (id) => {
    setCompared((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const comparedCreators = CREATORS.filter((c) => compared.has(c.id));

  return (
    <div
      className="kollab-discover"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-discover, .kollab-discover *, .kollab-discover *::before, .kollab-discover *::after {
          box-sizing: border-box;
        }
      `}</style>

      <AppSidebar activeItem="discover" />
      <AppTopBar left={<Breadcrumb text="Workspace /" current="Kollab Demo" />} />

      <main style={{ marginLeft: 256, paddingTop: 96, paddingBottom: comparedCreators.length > 0 ? 140 : 64, paddingLeft: 32, paddingRight: 32, display: "flex", gap: 32 }}>
        {/* Left: search + filters + creator grid */}
        <div style={{ flex: "1 1 640px", maxWidth: 640, minWidth: 0, display: "flex", flexDirection: "column", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <h1 style={{ fontWeight: 600, color: appColors.navy, fontSize: 36, lineHeight: "44px", letterSpacing: -0.72, margin: 0 }}>Discover Creators</h1>
              <p style={{ color: appColors.gray, fontSize: 18, lineHeight: "28px", opacity: 0.8, margin: "8px 0 0 0" }}>
                Find the perfect match for your next big campaign with AI-driven insights.
              </p>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
                <SearchIcon color={appColors.grayLight} />
              </div>
              <input
                type="text"
                placeholder="Search creators by name, username, niche or keywords..."
                style={{
                  background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
                  width: "100%", height: 64, padding: "0 25px 0 65px", fontSize: 16, color: appColors.navy, outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {FILTER_CHIPS.map((chip) => (
                  <button key={chip} type="button" style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 9999, padding: "9px 17px", fontWeight: 500, color: appColors.navy, fontSize: 14, cursor: "pointer" }}>
                    {chip}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", opacity: 0.9 }}>
                <span style={{ color: appColors.gray, fontSize: 14, fontWeight: 500 }}>Sort by:</span>
                <button type="button" style={{ background: "none", border: "none", display: "flex", gap: 8, alignItems: "center", cursor: "pointer", padding: 0 }}>
                  <span style={{ color: appColors.primary, fontWeight: 700, fontSize: 16 }}>Relevance</span>
                  <SortChevron />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {CREATORS.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                compared={compared.has(creator.id)}
                onToggleCompare={toggleCompare}
                saved={saved.has(creator.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        </div>

        {/* Right: AI suggestions, recently viewed, saved lists */}
        <aside style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 32 }}>
          <PremiumAIPanel subject="creators" />

          {isLoggedIn ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", padding: "0 8px" }}>Recently Viewed</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {RECENTLY_VIEWED.map((item) => (
                    <div key={item.name} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderRadius: 16 }}>
                      <AvatarSquare initial={item.initial} size={48} radius={12} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{item.name}</div>
                        <div style={{ color: appColors.gray, fontSize: 11 }}>{item.time}</div>
                      </div>
                      <ChevronRight color={appColors.grayLight} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px" }}>
                  <span style={{ fontWeight: 700, color: appColors.gray, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" }}>Saved Lists</span>
                  <button type="button" aria-label="New list" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    <PlusIcon color={appColors.grayLight} />
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SAVED_LISTS.map((list) => (
                    <div key={list.name} style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 17, display: "flex", gap: 12, alignItems: "center" }}>
                      <AvatarSquare initial={list.name[0]} size={20} radius={4} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{list.name}</div>
                        <div style={{ color: appColors.gray, fontSize: 11 }}>{list.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 24, textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ color: appColors.gray, fontSize: 14, margin: 0 }}>Create a free account to save creators and track your browsing history.</p>
              <Link to="/signup" style={{ background: appColors.primary, borderRadius: 12, padding: "12px 0", fontWeight: 700, color: "white", fontSize: 14, textDecoration: "none" }}>
                Sign Up Free
              </Link>
            </div>
          )}
        </aside>
      </main>

      {/* Floating compare bar -- only appears once creators are actually selected */}
      {comparedCreators.length > 0 && (
        <div
          style={{
            position: "fixed", left: 256, right: 0, bottom: 24, display: "flex", justifyContent: "center", padding: "0 32px", zIndex: 20,
          }}
        >
          <div
            style={{
              backdropFilter: "blur(6px)", background: "rgba(255,255,255,0.9)", border: `1px solid ${appColors.border}`, borderRadius: 32,
              boxShadow: "0px 10px 40px -15px rgba(0,0,0,0.2)", padding: 17, display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 24, width: "100%", maxWidth: 900,
            }}
          >
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase" }}>Compare</div>
                <div style={{ fontWeight: 700, color: appColors.primary, fontSize: 24, letterSpacing: -0.24 }}>{comparedCreators.length}</div>
              </div>
              <div style={{ width: 1, height: 40, background: appColors.border }} />
              <div style={{ display: "flex" }}>
                {comparedCreators.slice(0, 3).map((c, i) => (
                  <div key={c.id} style={{ marginLeft: i === 0 ? 0 : -16 }}>
                    <div style={{ background: "#e2e8f0", border: "4px solid white", borderRadius: 9999, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.grayLight, boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}>
                      {c.initial}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button type="button" onClick={() => setCompared(new Set())} style={{ background: "none", border: "none", padding: "16px 24px", fontWeight: 700, color: appColors.gray, fontSize: 16, cursor: "pointer", borderRadius: 16 }}>
                Clear All
              </button>
              <button type="button" style={{ background: appColors.primary, border: "none", borderRadius: 16, padding: "16px 40px", fontWeight: 700, color: "white", fontSize: 16, cursor: "pointer", boxShadow: "0px 10px 15px -3px rgba(21,80,211,0.2), 0px 4px 6px -4px rgba(21,80,211,0.2)" }}>
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}