import { Link } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { SearchBox } from "../components/AppTopBar";
import { appColors } from "../components/appColors";
import Footer from "../components/Footer";

function InstagramLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="igGradient" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="30%" stopColor="#fa7e1e" />
          <stop offset="60%" stopColor="#d62976" />
          <stop offset="100%" stopColor="#962fbf" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#igGradient)" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.5" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" />
      <circle cx="16.3" cy="7.7" r="0.9" fill="white" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="#010101" />
      <path d="M15.4 6.7c.3 1.5 1.2 2.5 2.7 2.7v2c-.9-.1-1.8-.4-2.7-.9v3.8a3.6 3.6 0 1 1-3.6-3.6c.2 0 .4 0 .6.03v2a1.5 1.5 0 1 0 1 1.45V6.7h2Z" fill="#25F4EE" transform="translate(-0.4,0.3)" />
      <path d="M15.4 6.7c.3 1.5 1.2 2.5 2.7 2.7v2c-.9-.1-1.8-.4-2.7-.9v3.8a3.6 3.6 0 1 1-3.6-3.6c.2 0 .4 0 .6.03v2a1.5 1.5 0 1 0 1 1.45V6.7h2Z" fill="#FE2C55" transform="translate(0.4,-0.3)" />
      <path d="M15.4 6.7c.3 1.5 1.2 2.5 2.7 2.7v2c-.9-.1-1.8-.4-2.7-.9v3.8a3.6 3.6 0 1 1-3.6-3.6c.2 0 .4 0 .6.03v2a1.5 1.5 0 1 0 1 1.45V6.7h2Z" fill="white" />
    </svg>
  );
}

const STATS = [
  { value: "4", label: "Active Campaigns", badge: "+2 new", badgeColor: "#16a34a", iconBg: "#dce1ff" },
  { value: "27", label: "Contact Requests Sent", badge: "Since last month", badgeColor: appColors.grayLight, iconBg: "#eaddff" },
  { value: "13", label: "New KOL Applications", badge: "Review Now", badgeColor: appColors.primary, iconBg: "#ffdcc6" },
  { value: "56", label: "Saved Creators", badge: "Active list", badgeColor: appColors.grayLight, iconBg: appColors.primaryLight },
];

const CAMPAIGNS = [
  { name: "Protein Powder Launch", niche: "FITNESS", nicheBg: "#dce1ff", nicheColor: "#003cad", budget: "$3,000", apps: 18, status: "Active", statusColor: "#16a34a", dotColor: "#22c55e" },
  { name: "Healthy Snacks", niche: "FOOD", nicheBg: "#eaddff", nicheColor: "#5a00c6", budget: "$1,500", apps: 7, status: "Reviewing", statusColor: "#ea580c", dotColor: "#f97316" },
];

const RECOMMENDED_CREATORS = [
  { name: "Thanh Huyen", role: "Wellness & Yoga", followers: "45.2K", engagement: "5.4%", initial: "T" },
  { name: "Minh Tu", role: "Professional Athlete", followers: "120K", engagement: "3.2%", initial: "M" },
  { name: "An Nguyen", role: "Lifestyle & Travel", followers: "89K", engagement: "6.1%", initial: "A" },
  { name: "Bich Phuong", role: "Beauty Specialist", followers: "215K", engagement: "4.8%", initial: "B" },
];

const APPLICATIONS = [
  { name: "Linh Nguyen", category: "Food & Beverage", followers: "126K", following: "32K", er: "7.8%", badge: "NEW", badgeBg: "#dce1ff", badgeColor: appColors.primary, initial: "L" },
  { name: "Duc Tran", category: "Tech & Fitness", followers: "54K", following: "12K", er: "4.2%", badge: "2D AGO", badgeBg: appColors.primaryLight, badgeColor: appColors.grayLight, initial: "D" },
];

const ACTIVITY = [
  { title: "Linh Nguyen", detail: "Applied to Protein Powder Launch", time: "2 hours ago", dot: appColors.primary },
  { title: "Campaign Milestone", detail: "Healthy Snacks reached 50k reach", time: "5 hours ago", dot: "#712ae2" },
  { title: "Account Security", detail: "New login detected from Ho Chi Minh City", time: "Yesterday", dot: appColors.border, dim: true },
];

function StatCard({ stat }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", flex: 1, minWidth: 0, padding: "25px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, boxSizing: "border-box" }}>
      <div style={{ background: stat.iconBg, borderRadius: 12, width: 48, height: 48 }} />
      <span style={{ fontWeight: 700, color: stat.badgeColor, fontSize: 12, letterSpacing: 0.24, whiteSpace: "nowrap" }}>{stat.badge}</span>
      <span style={{ fontWeight: 700, color: appColors.navy, fontSize: 48, letterSpacing: -1.2 }}>{stat.value}</span>
      <span style={{ color: appColors.grayLight, fontSize: 14, textAlign: "center" }}>{stat.label}</span>
    </div>
  );
}

function CreatorCard({ creator }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", padding: 25, display: "flex", flexDirection: "column", gap: 16, minWidth: 230, boxSizing: "border-box", flexShrink: 0 }}>
      <div style={{ background: "#e2e8f0", borderRadius: 12, width: 230, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontWeight: 700, color: appColors.grayLight, fontSize: 32 }}>{creator.initial}</span>
      </div>
      <div>
        <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{creator.name}</div>
        <div style={{ fontWeight: 600, color: appColors.grayLight, fontSize: 12, letterSpacing: 0.24 }}>{creator.role}</div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: appColors.grayLight, fontSize: 10, textTransform: "uppercase" }}>Followers</div>
          <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{creator.followers}</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: appColors.grayLight, fontSize: 10, textTransform: "uppercase" }}>Engagement</div>
          <div style={{ fontWeight: 700, color: appColors.primary, fontSize: 14 }}>{creator.engagement}</div>
        </div>
      </div>
      <button type="button" style={{ background: appColors.primaryLighter, border: "none", borderRadius: 12, padding: "8px 0", fontWeight: 700, color: appColors.primary, fontSize: 14, cursor: "pointer" }}>
        View Profile
      </button>
    </div>
  );
}

function ApplicationCard({ app }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", flex: 1, minWidth: 0, padding: 24, display: "flex", gap: 16, alignItems: "center", boxSizing: "border-box" }}>
      <div style={{ background: "#e2e8f0", borderRadius: 16, width: 80, height: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontWeight: 700, color: appColors.grayLight, fontSize: 24 }}>{app.initial}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{app.name}</div>
            <div style={{ fontWeight: 600, color: appColors.grayLight, fontSize: 12, letterSpacing: 0.24 }}>Category: {app.category}</div>
          </div>
          <span style={{ background: app.badgeBg, color: app.badgeColor, fontWeight: 700, fontSize: 10, borderRadius: 4, padding: "4px 8px", flexShrink: 0 }}>{app.badge}</span>
        </div>
        <div style={{ display: "flex", gap: 16, margin: "12px 0" }}>
          <span style={{ fontWeight: 700, color: appColors.navy, fontSize: 12 }}>{app.followers}</span>
          <span style={{ fontWeight: 700, color: appColors.navy, fontSize: 12 }}>{app.following}</span>
          <span style={{ fontWeight: 700, color: appColors.navy, fontSize: 12 }}>{app.er} ER</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" style={{ background: appColors.primary, border: "none", borderRadius: 12, padding: "12px 16px", fontWeight: 700, color: "white", fontSize: 12, letterSpacing: 0.24, cursor: "pointer", flex: 1, whiteSpace: "nowrap" }}>
            Review Application
          </button>
          <button type="button" aria-label="Save" style={{ background: appColors.primaryLighter, border: "none", borderRadius: 12, padding: "0 16px", cursor: "pointer" }}>
            ♡
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div
      className="kollab-dashboard"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
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
        .kollab-dashboard, .kollab-dashboard *, .kollab-dashboard *::before, .kollab-dashboard *::after {
          box-sizing: border-box;
        }
        .kollab-scroll-row {
          scrollbar-width: thin;
          scrollbar-color: ${appColors.border} transparent;
        }
        .kollab-scroll-row::-webkit-scrollbar {
          height: 6px;
        }
        .kollab-scroll-row::-webkit-scrollbar-thumb {
          background: ${appColors.border};
          border-radius: 9999px;
        }
        .kollab-scroll-row::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      <AppSidebar activeItem="dashboard" />
      <AppTopBar left={<SearchBox placeholder="Search creators, campaigns, or keywords..." />} />

      <main style={{ marginLeft: 256, marginRight: 320, paddingTop: 96, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, display: "flex", flexDirection: "column", gap: 48, boxSizing: "border-box" }}>
        <div style={{ background: appColors.primary, borderRadius: 16, padding: 48, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", width: "100%", boxSizing: "border-box" }}>
          <h1 style={{ color: "white", fontSize: 30, lineHeight: "40px", fontWeight: 600, letterSpacing: -0.6, margin: 0 }}>
            Welcome back, Kollab Demo <span style={{ marginLeft: 4 }}>👋</span>
          </h1>
          <p style={{ color: "white", opacity: 0.9, fontSize: 18, lineHeight: "28px", maxWidth: 576, margin: "8px 0 0 0" }}>
            Your campaigns are performing 12% better this week. You have 13 new creator applications waiting for review.
          </p>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", padding: 32, textAlign: "center" }}>
              <div style={{ width: 96, height: 96, borderRadius: 16, background: "#e2e8f0", margin: "0 auto 16px auto", boxShadow: "0 0 0 4px rgba(60,107,237,0.2)" }} />
              <div style={{ fontWeight: 600, color: appColors.navy, fontSize: 24, letterSpacing: -0.24 }}>Kollab Demo</div>
              <span style={{ display: "inline-block", marginTop: 8, color: appColors.primary, fontWeight: 600, fontSize: 14 }}>Software</span>
              <div style={{ borderTop: `1px solid ${appColors.border}`, marginTop: 16, paddingTop: 17, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ color: appColors.gray, fontSize: 14 }}>www.kollabdemo.vn</div>
                <div style={{ color: appColors.gray, fontSize: 14 }}>Hanoi, Vietnam</div>
              </div>
            </div>

            <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", padding: 33, display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 16 }}>Connected Accounts</div>
              <div style={{ background: appColors.primaryLighter, border: `2px solid rgba(21,80,211,0.2)`, borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
                <InstagramLogo />
                <span style={{ fontWeight: 600, color: appColors.navy, fontSize: 14, flex: 1 }}>Instagram</span>
                <span style={{ color: appColors.primary, fontWeight: 700, fontSize: 12 }}>Connected</span>
              </div>
              <div style={{ background: appColors.primaryLighter, borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
                <TikTokLogo />
                <span style={{ fontWeight: 600, color: appColors.navy, fontSize: 14, flex: 1 }}>TikTok</span>
                <span style={{ color: appColors.grayLight, fontWeight: 700, fontSize: 12 }}>Connect</span>
              </div>
            </div>
          </div>

          <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", overflow: "hidden", minWidth: 0 }}>
            <div style={{ borderBottom: `1px solid ${appColors.border}`, padding: "32px 32px 33px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <h2 style={{ fontWeight: 600, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, margin: 0, whiteSpace: "nowrap" }}>Active Campaigns</h2>
              <Link to="/manage-campaigns" style={{ color: appColors.primary, fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>View All →</Link>
            </div>
            <div className="kollab-scroll-row" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: appColors.primaryLighter, borderBottom: `1px solid ${appColors.border}` }}>
                    {["CAMPAIGN NAME", "NICHE", "BUDGET", "APPS", "STATUS"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "16px 32px", color: appColors.grayLight, fontSize: 12, fontWeight: 700, letterSpacing: 0.24, whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGNS.map((c) => (
                    <tr key={c.name} style={{ borderBottom: `1px solid ${appColors.border}` }}>
                      <td style={{ padding: "20px 32px", fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{c.name}</td>
                      <td style={{ padding: "20px 32px" }}>
                        <span style={{ background: c.nicheBg, color: c.nicheColor, fontWeight: 700, fontSize: 10, borderRadius: 9999, padding: "2.5px 12px", textTransform: "uppercase" }}>{c.niche}</span>
                      </td>
                      <td style={{ padding: "20px 32px", color: appColors.navy, fontSize: 16 }}>{c.budget}</td>
                      <td style={{ padding: "20px 32px", color: appColors.navy, fontSize: 14 }}>+{c.apps}</td>
                      <td style={{ padding: "20px 32px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: c.statusColor, fontWeight: 700, fontSize: 14 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 9999, background: c.dotColor }} />
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h2 style={{ fontWeight: 600, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, margin: 0 }}>Recommended Creators</h2>
              <p style={{ color: appColors.grayLight, fontSize: 14, margin: "4px 0 0 0" }}>Based on your industry and recent searches</p>
            </div>
          </div>
          <div className="kollab-scroll-row" style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 8 }}>
            {RECOMMENDED_CREATORS.map((c) => (
              <CreatorCard key={c.name} creator={c} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 600, color: appColors.navy, fontSize: 24, letterSpacing: -0.24, margin: 0 }}>Recent KOL Applications</h2>
            <a href="#" style={{ color: appColors.primary, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>See all 13</a>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {APPLICATIONS.map((app) => (
              <ApplicationCard key={app.name} app={app} />
            ))}
          </div>
        </div>

        <Footer />
      </main>

      <aside
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: 320,
          background: "white",
          borderLeft: `1px solid ${appColors.border}`,
          padding: "88px 24px 32px 25px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <h3 style={{ color: appColors.primary, fontSize: 24, letterSpacing: -0.24, fontWeight: 600, margin: 0 }}>Activity</h3>
        <p style={{ color: appColors.grayLight, fontSize: 12, letterSpacing: 0.24, fontWeight: 600, margin: "0 0 28px 0" }}>Recent Updates</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {ACTIVITY.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 16, opacity: item.dim ? 0.7 : 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: 9999, background: item.dot, marginTop: 8, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{item.title}</div>
                <div style={{ fontWeight: 600, color: appColors.gray, fontSize: 12, letterSpacing: 0.24 }}>{item.detail}</div>
                <div style={{ color: appColors.grayLight, fontSize: 10, marginTop: 4 }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}