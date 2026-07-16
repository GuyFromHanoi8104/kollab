import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { SearchBox } from "../components/AppTopBar";
import { appColors } from "../components/appColors";

const PROFILE = {
  name: "Linh Nguyen",
  handle: "@linh.beauty",
  tags: ["Beauty", "Lifestyle"],
  bio: "Beauty and lifestyle creator focused on skincare, fashion, and daily life. Passionate about authentic storytelling and helping her audience find the best routines for their busy urban lifestyles.",
  location: "Ho Chi Minh City, Vietnam",
  languages: "Vietnamese, English",
  memberSince: "Feb 2026",
  responseNote: "Responds within 6 hours (98% Rate)",
  quickNote: "I prefer skincare and fashion campaigns that allow for 4-5 days of content creation for maximum quality.",
};

const STATS = [
  { label: "TIKTOK FOLLOWERS", value: "245K", color: appColors.navy },
  { label: "IG FOLLOWERS", value: "82K", color: appColors.navy },
  { label: "ENGAGEMENT", value: "6.8%", color: appColors.primary },
  { label: "AVG VIEWS", value: "420K", color: appColors.navy },
  { label: "CAMPAIGNS", value: "38", color: appColors.navy },
];

const AGE_DISTRIBUTION = [
  { range: "18-24", pct: 41 },
  { range: "25-34", pct: 36 },
];

const TOP_LOCATIONS = ["Ho Chi Minh City", "Hanoi", "Da Nang"];

const PLATFORMS = [
  { name: "TikTok", handle: "@linh.beauty", followers: "245.2K", avgViews: "512K", bg: appColors.navy },
  { name: "Instagram", handle: "@linh.beauty_official", followers: "82.4K", avgViews: "128K", bg: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)" },
];

const COLLABORATIONS = [
  { brand: "Shopee Vietnam", campaign: "11.11 Mega Sale Campaign", reach: "1.2M Reach" },
  { brand: "Laneige VN", campaign: "Water Bank Product Launch", reach: "850K Reach" },
  { brand: "Uniqlo VN", campaign: "Winter Essentials Wardrobe", reach: "640K Reach" },
];

const PORTFOLIO = [
  { views: "245K", comments: "12K" },
  { views: "512K", comments: "34K" },
  { views: "180K", comments: "9K" },
  { views: "330K", comments: "21K" },
];

const TESTIMONIAL = {
  quote: `"Professional communication and delivered the campaign ahead of schedule. Linh's content quality exceeded our expectations and drove significant engagement for our 11.11 campaign. Highly recommended for premium beauty brands."`,
  author: "Nguyen Thu Thao",
  role: "Brand Partnerships Manager @ Shopee Vietnam",
};

const SIMILAR_CREATORS = [
  { name: "Tram Anh", niche: "Minimal Fashion", followers: "150K" },
  { name: "Khanh Vy", niche: "Beauty & Makeup", followers: "312K" },
  { name: "Duy Khanh", niche: "Lifestyle Vlog", followers: "98K" },
  { name: "Minh Ha", niche: "Eco-Beauty", followers: "205K" },
];

const CAMPAIGN_OPTIONS = ["Summer Protein Launch", "11.11 Mega Sale", "Holiday Skincare Bundle"];

function VerifiedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill={appColors.primary} stroke="white" strokeWidth="2" />
      <path d="M5.5 9.2l2.2 2.2 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
function GlobeIcon({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.2" />
      <path d="M1 6h10M6 1c1.5 1.5 1.5 8.5 0 10M6 1c-1.5 1.5-1.5 8.5 0 10" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}
function CalendarIcon({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="2" width="10" height="9" rx="1.5" stroke={color} strokeWidth="1.2" />
      <path d="M1 5h10M4 1v2M8 1v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.2" />
      <path d="M6 3v3l2 1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function EyeIcon({ color }) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path d="M1 5s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" stroke={color} strokeWidth="1.1" />
      <circle cx="7" cy="5" r="1.7" stroke={color} strokeWidth="1.1" />
    </svg>
  );
}
function CommentIcon({ color }) {
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M1 1h10v7H4l-3 2.5V1Z" stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
      <path d="M9 0l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1L3.6 16.3l1.3-6L0.3 6.2l6.1-.6L9 0Z" fill="#f5b400" />
    </svg>
  );
}
function ShareIcon({ color }) {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
      <circle cx="12" cy="3" r="2.2" stroke={color} strokeWidth="1.3" />
      <circle cx="3" cy="8.5" r="2.2" stroke={color} strokeWidth="1.3" />
      <circle cx="12" cy="14" r="2.2" stroke={color} strokeWidth="1.3" />
      <path d="M5 7.3l5-2.6M5 9.7l5 2.6" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}
function BookmarkIcon({ filled }) {
  return (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
      <path d="M1 1h10v13l-5-3.5L1 14V1Z" stroke={appColors.navy} strokeWidth="1.3" fill={filled ? appColors.primary : "none"} style={{ transition: "fill 150ms ease-out" }} />
    </svg>
  );
}
function MessageIcon({ color }) {
  return (
    <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
      <path d="M1 1h15v9H5l-4 3.5V1Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRight({ color }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M1 1h7v7M8 1L1 8" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 2l14 14M16 2L2 16" stroke={appColors.gray} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function AvatarPlaceholder({ size, radius, label }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: "linear-gradient(135deg, #e5eeff, #c7d7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.primary, fontSize: size / 3, flexShrink: 0 }}>
      {label}
    </div>
  );
}

function StatCard({ stat, highlight }) {
  if (highlight) {
    return (
      <div style={{ background: "#3c6bed", border: "1px solid rgba(21,80,211,0.2)", borderRadius: 16, padding: "25px", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase" }}>
          ✨ AI COMPATIBILITY
        </span>
        <span style={{ color: "white", fontSize: 16, fontWeight: 700, lineHeight: "22px" }}>
          🔒 Unlock with Premium
        </span>
      </div>
    );
  }
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: "25px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ color: appColors.grayLight, fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase" }}>
        {stat.label}
      </span>
      <span style={{ color: stat.color, fontSize: 30, fontWeight: 700 }}>
        {stat.value}
      </span>
    </div>
  );
}

function InviteModal({ onClose }) {
  const [campaign, setCampaign] = useState(CAMPAIGN_OPTIONS[0]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#0b1c30", opacity: 0.45 }} />
      <div style={{ position: "relative", background: "white", borderRadius: 24, width: "100%", maxWidth: 480, padding: 32, display: "flex", flexDirection: "column", gap: 20, boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)" }}>
        {sent ? (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 20 }}>Invitation sent!</div>
            <p style={{ color: appColors.gray, fontSize: 14, marginTop: 8 }}>{PROFILE.name} will be notified about {campaign}.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 18 }}>Invite Creator to Campaign</div>
                <p style={{ color: appColors.gray, fontSize: 13, margin: "4px 0 0 0" }}>Invite {PROFILE.name} to collaborate on one of your campaigns.</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <CloseIcon />
              </button>
            </div>

            <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <AvatarPlaceholder size={48} radius={9999} label="L" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{PROFILE.name} {PROFILE.handle}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  {PROFILE.tags.map((t) => (
                    <span key={t} style={{ background: "white", color: appColors.primary, fontWeight: 700, fontSize: 10, borderRadius: 9999, padding: "2px 8px" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: appColors.gray }}>
                <div>TikTok 245K</div>
                <div>IG 82K</div>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 700, color: appColors.gray, fontSize: 12, letterSpacing: 0.24 }}>Select Campaign</label>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                style={{ width: "100%", marginTop: 6, background: "white", border: `1px solid ${appColors.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: appColors.navy }}
              >
                {CAMPAIGN_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 700, color: appColors.gray, fontSize: 12, letterSpacing: 0.24 }}>Personal Invitation <span style={{ fontWeight: 400, textTransform: "none" }}>(Optional)</span></label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Hi ${PROFILE.name.split(" ")[0]}, we loved your recent content and think you'd be a perfect fit for our ${campaign}.`}
                rows={3}
                style={{ width: "100%", marginTop: 6, background: "white", border: `1px solid ${appColors.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: appColors.navy, resize: "none", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ background: appColors.bg, border: `1px solid ${appColors.border}`, borderRadius: 12, padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
              <div><div style={{ color: appColors.grayLight, fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Budget</div><div style={{ color: appColors.navy, fontWeight: 600 }}>$1,500 - $2,500</div></div>
              <div><div style={{ color: appColors.grayLight, fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Duration</div><div style={{ color: appColors.navy, fontWeight: 600 }}>4 Weeks</div></div>
              <div><div style={{ color: appColors.grayLight, fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Platform</div><div style={{ color: appColors.navy, fontWeight: 600 }}>TikTok & IG</div></div>
              <div><div style={{ color: appColors.grayLight, fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Deadline</div><div style={{ color: appColors.navy, fontWeight: 600 }}>Aug 15, 2026</div></div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button type="button" onClick={onClose} style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 12, padding: "12px 24px", fontWeight: 600, color: appColors.gray, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              <button type="button" onClick={handleSend} style={{ background: appColors.primary, border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, color: "white", fontSize: 14, cursor: "pointer", display: "flex", gap: 8, alignItems: "center" }}>
                Send Invitation <ArrowRight color="white" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CreatorProfile() {
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState("All Content");
  const navigate = useNavigate();

  // Viewing a profile is public; inviting a creator to a campaign requires
  // an account. Gate the action, not the page.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("kollab_mock_logged_in") === "true");
  }, []);

  const handleInviteClick = () => {
    if (isLoggedIn) {
      setModalOpen(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="kollab-creator-profile"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-creator-profile, .kollab-creator-profile *, .kollab-creator-profile *::before, .kollab-creator-profile *::after {
          box-sizing: border-box;
        }
        .kollab-scroll-row {
          scrollbar-width: thin;
          scrollbar-color: ${appColors.border} transparent;
        }
        .kollab-scroll-row::-webkit-scrollbar { height: 6px; }
        .kollab-scroll-row::-webkit-scrollbar-thumb { background: ${appColors.border}; border-radius: 9999px; }
        .kollab-scroll-row::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <AppSidebar activeItem="discover" />
      <AppTopBar left={<SearchBox placeholder="Search creators, niches, or keywords..." />} />

      <main style={{ marginLeft: 256, paddingTop: 96, paddingBottom: 64, paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, maxWidth: 1280 }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 24, padding: 33, boxShadow: "0px 20px 40px -10px rgba(79,124,255,0.08)" }}>
              <div style={{ display: "flex", gap: 32 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ border: `4px solid ${appColors.bg}`, borderRadius: 24, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)" }}>
                    <AvatarPlaceholder size={160} radius={20} label="L" />
                  </div>
                  <div style={{ position: "absolute", bottom: -8, right: -8, background: appColors.primary, border: "4px solid white", borderRadius: 9999, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <VerifiedIcon />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <h1 style={{ fontWeight: 800, color: appColors.navy, fontSize: 36, letterSpacing: -0.9, margin: 0 }}>{PROFILE.name}</h1>
                    <div style={{ color: appColors.primary, fontWeight: 600, fontSize: 16 }}>{PROFILE.handle}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      {PROFILE.tags.map((tag) => (
                        <span key={tag} style={{ background: appColors.primaryLight, color: appColors.primary, fontWeight: 600, fontSize: 12, borderRadius: 9999, padding: "6px 16px" }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <p style={{ color: appColors.gray, fontSize: 16, lineHeight: "26px", margin: 0, maxWidth: 672 }}>{PROFILE.bio}</p>

                  <div style={{ borderTop: `1px solid ${appColors.border}`, paddingTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><LocationIcon color={appColors.grayLight} /><span style={{ color: appColors.grayLight, fontSize: 14 }}>{PROFILE.location}</span></div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><GlobeIcon color={appColors.grayLight} /><span style={{ color: appColors.grayLight, fontSize: 14 }}>{PROFILE.languages}</span></div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><CalendarIcon color={appColors.grayLight} /><span style={{ color: appColors.grayLight, fontSize: 14 }}>Member since {PROFILE.memberSince}</span></div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><ClockIcon color={appColors.primary} /><span style={{ color: appColors.primary, fontSize: 14 }}>{PROFILE.responseNote}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} highlight={false} />
              ))}
              <StatCard highlight stat={null} />
            </div>

            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 25, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
                <h3 style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, margin: 0 }}>Audience Insights</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: appColors.grayLight, fontSize: 14 }}>Gender Split</span>
                    <span style={{ color: appColors.navy, fontWeight: 700, fontSize: 14 }}>72% Female / 28% Male</span>
                  </div>
                  <div style={{ background: appColors.primaryLight, height: 8, borderRadius: 9999, overflow: "hidden", display: "flex" }}>
                    <div style={{ background: appColors.primary, width: "72%" }} />
                    <div style={{ background: "#712ae2", width: "28%" }} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <span style={{ color: appColors.grayLight, fontSize: 14 }}>Age Distribution</span>
                  {AGE_DISTRIBUTION.map((a) => (
                    <div key={a.range} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ width: 40, color: appColors.grayLight, fontSize: 12 }}>{a.range}</span>
                      <div style={{ flex: 1, background: appColors.primaryLight, height: 16, borderRadius: 9999, overflow: "hidden" }}>
                        <div style={{ background: "rgba(21,80,211,0.7)", height: "100%", width: `${a.pct}%` }} />
                      </div>
                      <span style={{ width: 32, color: appColors.navy, fontWeight: 700, fontSize: 12 }}>{a.pct}%</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: `1px solid ${appColors.border}`, paddingTop: 17, display: "flex", flexDirection: "column", gap: 12 }}>
                  <span style={{ color: appColors.grayLight, fontSize: 14 }}>Top Locations</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TOP_LOCATIONS.map((loc) => (
                      <span key={loc} style={{ background: appColors.bg, border: `1px solid ${appColors.border}`, borderRadius: 9999, padding: "5px 13px", fontSize: 12, color: appColors.navy }}>{loc}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {PLATFORMS.map((p) => (
                  <div key={p.name} style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 25, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ background: p.bg, borderRadius: 12, width: 40, height: 40 }} />
                        <div>
                          <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 16 }}>{p.name}</div>
                          <div style={{ color: appColors.grayLight, fontSize: 12 }}>{p.handle}</div>
                        </div>
                      </div>
                      <ArrowRight color={appColors.grayLight} />
                    </div>
                    <div style={{ display: "flex", gap: 16, justifyContent: "space-around" }}>
                      <div>
                        <div style={{ color: appColors.grayLight, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Followers</div>
                        <div style={{ color: appColors.navy, fontWeight: 700, fontSize: 16 }}>{p.followers}</div>
                      </div>
                      <div>
                        <div style={{ color: appColors.grayLight, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Avg Views</div>
                        <div style={{ color: appColors.navy, fontWeight: 700, fontSize: 16 }}>{p.avgViews}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, margin: 0 }}>Recent Collaborations</h3>
                <button type="button" style={{ background: "none", border: "none", display: "flex", gap: 4, alignItems: "center", color: appColors.primary, fontSize: 14, cursor: "pointer" }}>
                  View History <ArrowRight color={appColors.primary} />
                </button>
              </div>
              <div className="kollab-scroll-row" style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
                {COLLABORATIONS.map((c) => (
                  <div key={c.brand} style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 21, display: "flex", gap: 16, alignItems: "center", minWidth: 280, flexShrink: 0 }}>
                    <div style={{ background: "#d3e4fe", borderRadius: 12, width: 56, height: 56, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 16 }}>{c.brand}</div>
                      <div style={{ color: appColors.grayLight, fontSize: 12 }}>{c.campaign}</div>
                      <div style={{ color: appColors.primary, fontWeight: 700, fontSize: 12, marginTop: 8 }}>↗ {c.reach}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, margin: 0 }}>Campaign Portfolio</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {["All Content", "TikTok", "Reels"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setPortfolioFilter(tab)}
                      style={{
                        background: portfolioFilter === tab ? appColors.primary : "white",
                        border: `1px solid ${portfolioFilter === tab ? appColors.primary : appColors.border}`,
                        borderRadius: 9999, padding: "7px 13px", fontWeight: 600, fontSize: 12,
                        color: portfolioFilter === tab ? "white" : appColors.grayLight, cursor: "pointer",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {PORTFOLIO.map((item, i) => (
                  <div key={i} style={{ aspectRatio: "9/16", background: "linear-gradient(135deg, #cbd5e1, #94a3b8)", border: `1px solid ${appColors.border}`, borderRadius: 16, position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}><EyeIcon color="white" /><span style={{ color: "white", fontSize: 12 }}>{item.views}</span></div>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}><CommentIcon color="white" /><span style={{ color: "white", fontSize: 12 }}>{item.comments}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: appColors.primaryLighter, border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 33, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} />)}
              </div>
              <p style={{ color: appColors.navy, fontSize: 16, lineHeight: "26px", fontStyle: "italic", margin: 0 }}>{TESTIMONIAL.quote}</p>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <AvatarPlaceholder size={48} radius={9999} label="N" />
                <div>
                  <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 16 }}>{TESTIMONIAL.author}</div>
                  <div style={{ color: appColors.grayLight, fontSize: 12 }}>{TESTIMONIAL.role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column -- sticky contact card */}
          <div style={{ minWidth: 0 }}>
            <div style={{ position: "sticky", top: 96, background: "white", border: `1px solid ${appColors.border}`, borderRadius: 24, padding: 25, boxShadow: "0px 20px 40px -10px rgba(79,124,255,0.08)", display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ background: "#22c55e", width: 10, height: 10, borderRadius: 9999 }} />
                  <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>Available for campaigns</span>
                </div>
                <button type="button" aria-label="Share profile" style={{ background: appColors.bg, border: `1px solid ${appColors.border}`, borderRadius: 9999, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ShareIcon color={appColors.gray} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <button
                  type="button"
                  onClick={handleInviteClick}
                  style={{ background: appColors.primary, border: "none", borderRadius: 16, padding: "16px 0", fontWeight: 700, color: "white", fontSize: 16, cursor: "pointer", boxShadow: "0px 10px 15px -3px rgba(21,80,211,0.2), 0px 4px 6px -4px rgba(21,80,211,0.2)" }}
                >
                  Invite to Campaign
                </button>
                <div style={{ display: "flex", gap: 16 }}>
                  <button type="button" onClick={() => setSaved((s) => !s)} style={{ flex: 1, background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: "13px 0", display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.navy, fontSize: 16, cursor: "pointer" }}>
                    <BookmarkIcon filled={saved} /> {saved ? "Saved" : "Save"}
                  </button>
                  <button type="button" style={{ flex: 1, background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: "13px 0", display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.navy, fontSize: 16, cursor: "pointer" }}>
                    <MessageIcon color={appColors.navy} /> Message
                  </button>
                </div>
              </div>

              <div style={{ background: appColors.primaryLighter, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 11 }}>
                <span style={{ color: appColors.grayLight, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}>Quick Note</span>
                <p style={{ color: appColors.gray, fontSize: 14, lineHeight: "23px", margin: 0, fontStyle: "italic" }}>&ldquo;{PROFILE.quickNote}&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, marginTop: 32, paddingBottom: 48, display: "flex", flexDirection: "column", gap: 32 }}>
          <h3 style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, margin: 0 }}>Similar Creators You Might Like</h3>
          <div style={{ display: "flex", gap: 24 }}>
            {SIMILAR_CREATORS.map((c) => (
              <div key={c.name} style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, padding: 21, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ border: `2px solid ${appColors.bg}`, borderRadius: 16 }}>
                  <AvatarPlaceholder size={80} radius={14} label={c.name[0]} />
                </div>
                <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 16, marginTop: 12 }}>{c.name}</div>
                <div style={{ color: appColors.grayLight, fontSize: 12 }}>{c.niche}</div>
                <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 8 }}>
                  <EyeIcon color={appColors.navy} />
                  <span style={{ color: appColors.navy, fontWeight: 700, fontSize: 14 }}>{c.followers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {modalOpen && <InviteModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}