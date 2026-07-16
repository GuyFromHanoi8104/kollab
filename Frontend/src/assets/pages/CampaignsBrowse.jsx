import { useState } from "react";
import MarketingNavBar from "../components/MarketingNavBar";
import Footer from "../components/Footer";

const colors = {
  navy: "#0b1c30",
  gray: "#434654",
  grayLight: "#737686",
  blue: "#2563eb",
  border: "rgba(195,197,215,0.4)",
};

const FEATURED = {
  brand: "Shopee Vietnam",
  title: "Shopee Vietnam – 9.9 Mega Sale Creator Extravaganza",
  description: "Join Vietnam's biggest shopping event of the season. We're looking for lifestyle, fashion, and tech creators to showcase their top picks and exclusive vouchers to their community.",
  budget: "Up to $5,000",
  deadline: "July 31, 2026",
  applications: "15.6K Applications",
};

const OPPORTUNITIES = [
  {
    id: "azure",
    brand: "Azure Resorts",
    location: "PHU QUOC, VN",
    title: "Luxury Escape Content Creation",
    description: "Showcase the ultimate luxury experience at our new oceanfront villas. Seeking cinematic…",
    tags: ["20K+ Followers", "Vietnamese/English"],
    budget: "$1,200 – $2,500",
    deadline: "Aug 15",
    urgent: true,
    category: "Travel",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
    logoBg: "#fff7ed",
    logoInitial: "A",
  },
  {
    id: "glow",
    brand: "GLOW Skin",
    location: "HCMC, VN",
    title: "Glow Morning Routine Reel",
    description: "We're looking for skincare enthusiasts to create aesthetic Reels showcasing their daily routine…",
    tags: ["5K+ Followers", "Beauty Niche"],
    budget: "$300 – $800",
    deadline: "Aug 05",
    urgent: false,
    category: "Beauty",
    gradient: "linear-gradient(135deg, #fbcfe8, #f472b6)",
    logoBg: "#e5eeff",
    logoInitial: "G",
  },
  {
    id: "vertex",
    brand: "Vertex Tech",
    location: "HANOI, VN",
    title: "New Gen Gaming Headset Review",
    description: "Tech reviewers wanted for our upcoming flagship headset launch. In-depth review on…",
    tags: ["50K+ Followers", "Tech & Gaming"],
    budget: "$2,000 – $4,500",
    deadline: "Aug 20",
    urgent: false,
    category: "Tech",
    gradient: "linear-gradient(135deg, #334155, #0f172a)",
    logoBg: "#e5eeff",
    logoInitial: "V",
  },
];

const FILTER_CHIPS = ["Category", "Platform", "Budget", "Location", "Campaign Type"];

const STATS = [
  { value: "1,200+", label: "ACTIVE CREATORS" },
  { value: "150+", label: "ACTIVE CAMPAIGNS" },
  { value: "80+", label: "PARTNER BRANDS" },
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
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
      <path d="M5.5 13S1 8.4 1 5a4.5 4.5 0 0 1 9 0c0 3.4-4.5 8-4.5 8Z" stroke={color} strokeWidth="1.2" />
      <circle cx="5.5" cy="5" r="1.4" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}
function BookmarkIcon({ filled }) {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <path d="M1 1h12v16l-6-4-6 4V1Z" stroke={colors.navy} strokeWidth="1.4" fill={filled ? colors.blue : "none"} style={{ transition: "fill 150ms ease-out" }} />
    </svg>
  );
}
function SortChevron() {
  return (
    <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
      <path d="M1 1l3.5 3.5L8 1" stroke={colors.navy} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRight({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8M6 2l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OpportunityCard({ opp, saved, onToggleSave }) {
  return (
    <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 24, boxShadow: "0px 12px 32px -8px rgba(37,99,235,0.08)", overflow: "hidden", flex: "1 1 340px", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 224, background: opp.gradient, position: "relative" }}>
        <span style={{ position: "absolute", left: 16, top: 17, backdropFilter: "blur(6px)", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(37,99,235,0.1)", borderRadius: 8, padding: "4px 13px", fontWeight: 700, color: colors.blue, fontSize: 12 }}>
          {opp.category}
        </span>
      </div>
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: opp.logoBg, border: `1px solid ${colors.border}`, borderRadius: 16, width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: colors.blue }}>
              {opp.logoInitial}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: colors.navy, fontSize: 15 }}>{opp.brand}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                <LocationIcon color={colors.grayLight} />
                <span style={{ color: colors.grayLight, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{opp.location}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => onToggleSave(opp.id)} aria-label="Save opportunity" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <BookmarkIcon filled={saved} />
          </button>
        </div>

        <h4 style={{ fontWeight: 800, color: colors.navy, fontSize: 19, margin: 0 }}>{opp.title}</h4>
        <p style={{ color: colors.gray, fontSize: 14, lineHeight: "23px", margin: 0 }}>{opp.description}</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {opp.tags.map((tag) => (
            <span key={tag} style={{ background: "#eff4ff", border: "1px solid rgba(195,197,215,0.1)", borderRadius: 8, padding: "5px 11px", fontWeight: 700, color: colors.gray, fontSize: 11 }}>{tag}</span>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: "auto", paddingTop: 25, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: colors.grayLight, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Budget Range</div>
            <div style={{ color: colors.navy, fontWeight: 800, fontSize: 16 }}>{opp.budget}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: colors.grayLight, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Deadline</div>
            <div style={{ color: opp.urgent ? "#ba1a1a" : colors.gray, fontWeight: 800, fontSize: 16 }}>{opp.deadline}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" style={{ background: colors.blue, border: "none", borderRadius: 16, padding: "16px 0", flex: 1, fontWeight: 700, color: "white", fontSize: 16, cursor: "pointer" }}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsBrowse() {
  const [saved, setSaved] = useState(new Set());

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      className="kollab-campaigns-browse"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "white", textAlign: "left", position: "relative" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-campaigns-browse, .kollab-campaigns-browse *, .kollab-campaigns-browse *::before, .kollab-campaigns-browse *::after {
          box-sizing: border-box;
        }
      `}</style>

      <MarketingNavBar activeTab="campaigns" />

      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", padding: "128px 24px 0 24px" }}>
        <h1 style={{ fontWeight: 800, color: colors.navy, fontSize: 56, letterSpacing: -1.5, textAlign: "center", margin: 0 }}>Discover Campaigns</h1>
        <p style={{ color: colors.gray, fontSize: 18, textAlign: "center", maxWidth: 672, margin: 0 }}>Browse collaboration opportunities from leading brands across Vietnam.</p>

        <div style={{ position: "relative", maxWidth: 768, width: "100%", marginTop: 20 }}>
          <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
            <SearchIcon color={colors.grayLight} />
          </div>
          <input
            type="text"
            placeholder="Search brands, industries, or keywords..."
            style={{ width: "100%", height: 64, border: `1px solid ${colors.border}`, borderRadius: 16, boxShadow: "0px 12px 32px -8px rgba(37,99,235,0.08)", padding: "0 130px 0 65px", fontSize: 16, color: colors.navy, outline: "none" }}
          />
          <button type="button" style={{ position: "absolute", right: 8, top: 8, bottom: 8, background: colors.blue, border: "none", borderRadius: 16, padding: "0 32px", fontWeight: 700, color: "white", fontSize: 16, cursor: "pointer" }}>
            Search
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center", maxWidth: 1024, marginTop: 20 }}>
          <button type="button" style={{ background: colors.blue, border: "none", borderRadius: 9999, padding: "10px 20px", fontWeight: 600, color: "white", fontSize: 14, cursor: "pointer", boxShadow: "0px 4px 6px -1px rgba(37,99,235,0.2)" }}>
            All Filters
          </button>
          {FILTER_CHIPS.map((chip) => (
            <button key={chip} type="button" style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 9999, padding: "11px 21px", fontWeight: 500, color: colors.gray, fontSize: 14, cursor: "pointer" }}>
              {chip}
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 16 }}>
            <span style={{ color: colors.gray, fontSize: 14 }}>Sort By:</span>
            <span style={{ color: colors.navy, fontWeight: 700, fontSize: 14 }}>Newest First</span>
            <SortChevron />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "48px auto 0 auto", padding: "0 24px" }}>
        <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 24, boxShadow: "0px 12px 32px -8px rgba(37,99,235,0.08)", overflow: "hidden", display: "flex" }}>
          <div style={{ flex: 1, padding: 56, display: "flex", flexDirection: "column", gap: 24 }}>
            <span style={{ display: "inline-flex", gap: 8, alignItems: "center", background: "#dbeafe", borderRadius: 8, padding: "6px 14px", fontWeight: 700, color: colors.blue, fontSize: 12, letterSpacing: 1.2, width: "fit-content" }}>
              FEATURED OPPORTUNITY
            </span>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ background: "#fff7ed", border: "1px solid #ffedd5", borderRadius: 16, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#ea580c", fontSize: 20 }}>S</div>
              <span style={{ fontWeight: 700, color: colors.navy, fontSize: 17 }}>{FEATURED.brand}</span>
            </div>
            <h2 style={{ fontWeight: 800, color: colors.navy, fontSize: 30, lineHeight: "36px", margin: 0 }}>{FEATURED.title}</h2>
            <p style={{ color: colors.gray, fontSize: 16, lineHeight: "26px", margin: 0 }}>{FEATURED.description}</p>
            <div style={{ display: "flex", gap: 48 }}>
              <div>
                <div style={{ color: colors.grayLight, fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Estimated Budget</div>
                <div style={{ color: colors.blue, fontWeight: 800, fontSize: 24 }}>{FEATURED.budget}</div>
              </div>
              <div>
                <div style={{ color: colors.grayLight, fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Application Deadline</div>
                <div style={{ color: colors.navy, fontWeight: 800, fontSize: 24 }}>{FEATURED.deadline}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button type="button" style={{ background: colors.blue, border: "none", borderRadius: 16, padding: "17px 40px", fontWeight: 700, color: "white", fontSize: 16, cursor: "pointer" }}>Apply Now</button>
              <button type="button" style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 16, padding: "17px 41px", fontWeight: 700, color: colors.navy, fontSize: 16, cursor: "pointer" }}>View Details</button>
            </div>
          </div>
          <div style={{ flex: 1, position: "relative", background: "linear-gradient(135deg, #f97316, #ec4899)", minHeight: 320 }}>
            <div style={{ position: "absolute", right: 32, bottom: 32, backdropFilter: "blur(6px)", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 16, padding: "11px 21px", display: "flex", gap: 12, alignItems: "center", boxShadow: "0px 20px 25px -5px rgba(0,0,0,0.1)" }}>
              <div style={{ background: "#712ae2", width: 10, height: 10, borderRadius: 9999 }} />
              <span style={{ fontWeight: 700, color: colors.navy, fontSize: 14 }}>{FEATURED.applications}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "56px auto 0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h3 style={{ fontWeight: 800, color: colors.navy, fontSize: 30, letterSpacing: -0.75, margin: 0 }}>New Opportunities</h3>
          <p style={{ color: colors.gray, fontSize: 16, margin: "4px 0 0 0" }}>Freshly posted campaigns tailored for your niche.</p>
        </div>
        <button type="button" style={{ background: "none", border: "none", display: "flex", gap: 8, alignItems: "center", color: colors.blue, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          View All <ArrowRight color={colors.blue} />
        </button>
      </div>

      <div style={{ maxWidth: 1280, margin: "40px auto 0 auto", padding: "0 24px 56px 24px", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
        {OPPORTUNITIES.map((opp) => (
          <OpportunityCard key={opp.id} opp={opp} saved={saved.has(opp.id)} onToggleSave={toggleSave} />
        ))}
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ background: "#1e3a8a", borderRadius: 40, padding: 80, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
          <h2 style={{ fontWeight: 800, color: "white", fontSize: 48, textAlign: "center", margin: 0 }}>Find brand collaborations faster.</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, textAlign: "center", maxWidth: 672, margin: 0 }}>
            Join thousands of creators in Vietnam who are already scaling their career with Kollab's direct-to-brand marketplace.
          </p>
          <button type="button" style={{ background: colors.blue, border: "none", borderRadius: 16, padding: "20px 48px", fontWeight: 700, color: "white", fontSize: 16, cursor: "pointer", boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.2)" }}>
            Create Free Creator Account
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "65px 24px", display: "flex", gap: 64, justifyContent: "center", borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
        {STATS.map((stat) => (
          <div key={stat.label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: colors.blue, fontWeight: 800, fontSize: 48 }}>{stat.value}</div>
            <div style={{ color: colors.gray, fontWeight: 700, fontSize: 14, letterSpacing: 2.8, textTransform: "uppercase", marginTop: 12 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}