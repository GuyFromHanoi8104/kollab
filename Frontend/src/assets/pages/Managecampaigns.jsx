import { useState } from "react";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { SearchBox } from "../components/AppTopBar";
import { appColors } from "../components/appColors";

const CAMPAIGNS = [
  { id: 1, name: "Protein Powder Launch", niche: "FITNESS", nicheBg: "#dce1ff", nicheColor: "#003cad", budget: "$3,000", apps: 18, status: "Active", statusColor: "#16a34a", dotColor: "#22c55e" },
  { id: 2, name: "Healthy Snacks", niche: "FOOD", nicheBg: "#eaddff", nicheColor: "#5a00c6", budget: "$1,500", apps: 7, status: "Reviewing", statusColor: "#ea580c", dotColor: "#f97316" },
  { id: 3, name: "Summer Skincare Bundle", niche: "BEAUTY", nicheBg: "#ffe4f0", nicheColor: "#be185d", budget: "$2,200", apps: 0, status: "Draft", statusColor: appColors.grayLight, dotColor: appColors.border },
  { id: 4, name: "New Year Blowout", niche: "LIFESTYLE", nicheBg: "#e5eeff", nicheColor: "#1550d3", budget: "$4,000", apps: 32, status: "Completed", statusColor: appColors.grayLight, dotColor: "#94a3b8" },
];

const STATS = [
  { value: "2", label: "Active Campaigns", iconBg: "#dce1ff" },
  { value: "$10,700", label: "Total Budget Allocated", iconBg: "#eaddff" },
  { value: "57", label: "Total Applications", iconBg: "#ffdcc6" },
  { value: "1", label: "Completed Campaigns", iconBg: appColors.primaryLight },
];

const FILTER_CHIPS = ["Status", "Niche", "Budget Range", "Date"];

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v14M1 8h14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
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
function DotsIcon() {
  return (
    <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
      <circle cx="2" cy="2" r="1.6" fill={appColors.grayLight} />
      <circle cx="8" cy="2" r="1.6" fill={appColors.grayLight} />
      <circle cx="14" cy="2" r="1.6" fill={appColors.grayLight} />
    </svg>
  );
}

function StatCard({ stat }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", flex: 1, minWidth: 0, padding: 25, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: stat.iconBg, borderRadius: 12, width: 44, height: 44 }} />
      <span style={{ fontWeight: 700, color: appColors.navy, fontSize: 32, letterSpacing: -0.8 }}>{stat.value}</span>
      <span style={{ color: appColors.grayLight, fontSize: 13 }}>{stat.label}</span>
    </div>
  );
}

export default function ManageCampaigns() {
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = ["All", "Active", "Reviewing", "Draft", "Completed"];
  const filtered = statusFilter === "All" ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === statusFilter);

  return (
    <div
      className="kollab-manage-campaigns"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-manage-campaigns, .kollab-manage-campaigns *, .kollab-manage-campaigns *::before, .kollab-manage-campaigns *::after {
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

      <AppSidebar activeItem="campaigns" />
      <AppTopBar left={<SearchBox placeholder="Search your campaigns..." />} />

      <main style={{ marginLeft: 256, paddingTop: 96, paddingBottom: 64, paddingLeft: 32, paddingRight: 32, display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h1 style={{ fontWeight: 600, color: appColors.navy, fontSize: 36, letterSpacing: -0.72, margin: 0 }}>Manage Campaigns</h1>
            <p style={{ color: appColors.grayLight, fontSize: 16, margin: 0 }}>Create, track, and manage all of your brand's campaigns in one place.</p>
          </div>
          <button type="button" style={{ background: appColors.primary, border: "none", borderRadius: 12, padding: "14px 24px", display: "flex", gap: 8, alignItems: "center", fontWeight: 700, color: "white", fontSize: 14, cursor: "pointer", boxShadow: "0px 10px 15px -3px rgba(21,80,211,0.2), 0px 4px 6px -4px rgba(21,80,211,0.2)" }}>
            <PlusIcon /> Create Campaign
          </button>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", overflow: "hidden" }}>
          <div style={{ borderBottom: `1px solid ${appColors.border}`, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div className="kollab-scroll-row" style={{ display: "flex", gap: 8, overflowX: "auto" }}>
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  style={{
                    background: statusFilter === s ? appColors.primary : "white",
                    border: `1px solid ${statusFilter === s ? appColors.primary : appColors.border}`,
                    borderRadius: 9999, padding: "8px 16px", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap",
                    color: statusFilter === s ? "white" : appColors.gray, cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {FILTER_CHIPS.map((chip) => (
                <button key={chip} type="button" style={{ background: "none", border: "none", display: "flex", gap: 6, alignItems: "center", color: appColors.gray, fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0 }}>
                  {chip} <SortChevron />
                </button>
              ))}
            </div>
          </div>

          <div className="kollab-scroll-row" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: appColors.primaryLighter, borderBottom: `1px solid ${appColors.border}` }}>
                  {["CAMPAIGN NAME", "NICHE", "BUDGET", "APPLICATIONS", "STATUS", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "16px 24px", color: appColors.grayLight, fontSize: 12, fontWeight: 700, letterSpacing: 0.24, whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${appColors.border}` }}>
                    <td style={{ padding: "20px 24px", fontWeight: 700, color: appColors.navy, fontSize: 14 }}>{c.name}</td>
                    <td style={{ padding: "20px 24px" }}>
                      <span style={{ background: c.nicheBg, color: c.nicheColor, fontWeight: 700, fontSize: 10, borderRadius: 9999, padding: "2.5px 12px", textTransform: "uppercase" }}>{c.niche}</span>
                    </td>
                    <td style={{ padding: "20px 24px", color: appColors.navy, fontSize: 16 }}>{c.budget}</td>
                    <td style={{ padding: "20px 24px", color: appColors.navy, fontSize: 14 }}>{c.apps > 0 ? `+${c.apps}` : "—"}</td>
                    <td style={{ padding: "20px 24px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: c.statusColor, fontWeight: 700, fontSize: 14 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 9999, background: c.dotColor }} />
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <button type="button" aria-label="More actions" style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
                        <DotsIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "40px 24px", textAlign: "center", color: appColors.grayLight, fontSize: 14 }}>
                      No campaigns match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}