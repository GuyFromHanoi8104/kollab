import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { Breadcrumb } from "../components/AppTopBar";
import { appColors } from "../components/appColors";
import PremiumAIPanel from "../components/PremiumAIPanel";

const FILTER_CHIPS = ["Industry", "Campaign Type", "Budget Range", "Location"];

// Reusing brand names already established elsewhere in the app (Landing
// Page's Active Brands, Campaigns Browse) instead of inventing new ones,
// so the mock data feels like one connected product rather than disconnected
// per-page placeholders.
const BRANDS = [
  {
    id: "shopee",
    name: "Shopee Vietnam",
    industry: "E-commerce",
    location: "Ho Chi Minh City",
    tags: ["E-commerce", "Retail"],
    activeCampaigns: "4",
    avgBudget: "$1,200 – $5,000",
    creatorsWorked: "340+",
    initial: "S",
    logoBg: "#fff7ed",
  },
  {
    id: "vinfast",
    name: "VinFast",
    industry: "Automotive",
    location: "Hanoi",
    tags: ["Automotive", "EV"],
    activeCampaigns: "2",
    avgBudget: "$3,000 – $8,000",
    creatorsWorked: "85+",
    initial: "V",
    logoBg: "#e5eeff",
  },
  {
    id: "highlands",
    name: "Highlands Coffee",
    industry: "F&B",
    location: "Ho Chi Minh City",
    tags: ["F&B", "Lifestyle"],
    activeCampaigns: "6",
    avgBudget: "$500 – $1,500",
    creatorsWorked: "620+",
    initial: "H",
    logoBg: "#fef3c7",
  },
  {
    id: "glow",
    name: "GLOW Skin",
    industry: "Beauty",
    location: "Ho Chi Minh City",
    tags: ["Beauty", "Skincare"],
    activeCampaigns: "3",
    avgBudget: "$300 – $800",
    creatorsWorked: "210+",
    initial: "G",
    logoBg: "#e5eeff",
  },
  {
    id: "azure",
    name: "Azure Resorts",
    industry: "Travel",
    location: "Phu Quoc",
    tags: ["Travel", "Hospitality"],
    activeCampaigns: "1",
    avgBudget: "$1,200 – $2,500",
    creatorsWorked: "45+",
    initial: "A",
    logoBg: "#dbeafe",
  },
  {
    id: "vertex",
    name: "Vertex Tech",
    industry: "Tech",
    location: "Hanoi",
    tags: ["Tech", "Gaming"],
    activeCampaigns: "2",
    avgBudget: "$2,000 – $4,500",
    creatorsWorked: "120+",
    initial: "V",
    logoBg: "#e5eeff",
  },
];

const RECENTLY_VIEWED = [
  { name: "Shopee Vietnam", time: "2 hours ago", initial: "S" },
  { name: "GLOW Skin", time: "Yesterday", initial: "G" },
];

const SAVED_LISTS = [
  { name: "Beauty & Skincare Brands", meta: "3 brands" },
  { name: "High Budget Campaigns", meta: "5 brands • 2 new" },
];

function SearchIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
      <path d="M16 16l-3.5-3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
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

function BrandCard({ brand, saved, onToggleSave }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: brand.logoBg, border: `1px solid ${appColors.border}`, borderRadius: 16, width: 56, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.primary, fontSize: 20 }}>
              {brand.initial}
            </div>
            <div>
              <div style={{ color: appColors.navy, fontSize: 16, fontWeight: 700 }}>{brand.name}</div>
              <div style={{ color: appColors.gray, fontSize: 14 }}>{brand.industry}</div>
            </div>
          </div>
          <button type="button" onClick={() => onToggleSave(brand.id)} aria-label="Save brand" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <SaveIcon filled={saved} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {brand.tags.map((tag) => (
            <span key={tag} style={{ background: appColors.primaryLight, color: appColors.primary, fontWeight: 700, fontSize: 12, borderRadius: 9999, padding: "4px 12px" }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>ACTIVE CAMPAIGNS</div>
            <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, marginTop: 4 }}>{brand.activeCampaigns}</div>
          </div>
          <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>CREATORS WORKED WITH</div>
            <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, marginTop: 4 }}>{brand.creatorsWorked}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <LocationIcon color={appColors.gray} />
            <span style={{ color: appColors.gray, fontSize: 12, fontWeight: 600, letterSpacing: 0.24 }}>{brand.location}</span>
          </div>
          <span style={{ color: appColors.gray, fontSize: 12, fontWeight: 600, letterSpacing: 0.24 }}>Avg. Budget: {brand.avgBudget}</span>
        </div>

        {/* No Brand Profile page exists yet (this whole page is a new,
            not-yet-in-Figma design) -- button is a visual placeholder for now. */}
        <button type="button" style={{ background: appColors.primary, border: "none", borderRadius: 12, padding: "16px 0", fontWeight: 700, color: "white", fontSize: 16, cursor: "pointer", marginTop: "auto" }}>
          View Brand Profile
        </button>
      </div>
    </div>
  );
}

export default function DiscoverBrands() {
  const [saved, setSaved] = useState(new Set());

  // NOTE: there's no real "creator" account/role yet -- only the single
  // brand persona ("Kollab Demo") the rest of the app is built around. Using
  // the existing mock-login flag as a stand-in: logged in = brand viewing,
  // logged out = the public/creator-curious visitor. Swap this for a real
  // role check once creator accounts actually exist.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("kollab_mock_logged_in") === "true");
  }, []);

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      className="kollab-discover-brands"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-discover-brands, .kollab-discover-brands *, .kollab-discover-brands *::before, .kollab-discover-brands *::after {
          box-sizing: border-box;
        }
      `}</style>

      {/* NOTE: reusing the brand-side AppSidebar shell for visual consistency
          since a creator-specific sidebar doesn't exist yet (that's the
          bigger "role split" task still pending). No matching nav item
          highlights here on purpose -- this page doesn't belong to the
          current brand-oriented nav. */}
      <AppSidebar activeItem={null} />
      <AppTopBar left={<Breadcrumb text="Workspace /" current="Discover Brands" />} />

      <main style={{ marginLeft: 256, paddingTop: 96, paddingBottom: 64, paddingLeft: 32, paddingRight: 32, display: "flex", gap: 32 }}>
        <div style={{ flex: "1 1 640px", maxWidth: 640, minWidth: 0, display: "flex", flexDirection: "column", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <h1 style={{ fontWeight: 600, color: appColors.navy, fontSize: 36, lineHeight: "44px", letterSpacing: -0.72, margin: 0 }}>Discover Brands</h1>
              <p style={{ color: appColors.gray, fontSize: 18, lineHeight: "28px", opacity: 0.8, margin: "8px 0 0 0" }}>
                {isLoggedIn
                  ? "See who else is building with Kollab, and explore partnership trends across industries."
                  : "Browse brands actively looking for creators like you."}
              </p>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
                <SearchIcon color={appColors.grayLight} />
              </div>
              <input
                type="text"
                placeholder="Search brands by name, industry, or keywords..."
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
            {BRANDS.map((brand) => (
              <BrandCard key={brand.id} brand={brand} saved={saved.has(brand.id)} onToggleSave={toggleSave} />
            ))}
          </div>
        </div>

        <aside style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 32 }}>
          <PremiumAIPanel subject="brands" />

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
                <div style={{ fontWeight: 700, color: appColors.gray, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", padding: "0 8px" }}>Saved Lists</div>
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
              <p style={{ color: appColors.gray, fontSize: 14, margin: 0 }}>Create a free account to save brands and track your browsing history.</p>
              <Link to="/signup" style={{ background: appColors.primary, borderRadius: 12, padding: "12px 0", fontWeight: 700, color: "white", fontSize: 14, textDecoration: "none" }}>
                Sign Up Free
              </Link>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}