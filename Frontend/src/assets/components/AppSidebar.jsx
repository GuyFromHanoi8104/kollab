import { Link } from "react-router-dom";
import KollabLogo from "./KollabLogo";
import { appColors } from "./appColors";

function GridIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function SearchIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
      <path d="M16 16l-3.5-3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function MegaphoneIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 7v4h3l6 3V4L5 7H2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 6.5c1 .8 1 4.2 0 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function BookmarkIcon({ color }) {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <path d="M1 1h12v16l-6-4-6 4V1Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function MessageIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 2h16v11H6l-5 4V2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function AnalyticsIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 16V9M9 16V2M16 16v-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M9 1v2M9 15v2M17 9h-2M3 9H1M14.5 3.5l-1.4 1.4M4.9 13.1l-1.4 1.4M14.5 14.5l-1.4-1.4M4.9 4.9L3.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", to: "/dashboard", Icon: GridIcon },
  { key: "discover", label: "Discover Creators", to: "/discover", Icon: SearchIcon },
  { key: "campaigns", label: "Campaigns", to: "/manage-campaigns", Icon: MegaphoneIcon },
  { key: "saved", label: "Saved Creators", to: "/saved", Icon: BookmarkIcon },
  { key: "messages", label: "Messages", to: "/messages", Icon: MessageIcon },
];

function NavLink({ to, label, Icon, active }) {
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 16px",
        borderRadius: 8,
        background: active ? appColors.primaryLight : "transparent",
        textDecoration: "none",
        width: "100%",
      }}
    >
      <Icon color={active ? appColors.primary : appColors.gray} />
      <span style={{ fontWeight: active ? 600 : 400, color: active ? appColors.primary : appColors.gray, fontSize: 16 }}>
        {label}
      </span>
    </Link>
  );
}

// activeItem: "dashboard" | "discover" | "campaigns" | "saved" | "messages" | "settings"
export default function AppSidebar({ activeItem }) {
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: 256,
        background: "white",
        borderRight: `1px solid ${appColors.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "16px 17px 16px 16px",
        boxSizing: "border-box",
        zIndex: 10,
      }}
    >
      <Link to="/" style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 16px", marginBottom: 24, textDecoration: "none" }}>
        <KollabLogo size={40} />
        <span style={{ fontWeight: 800, color: "#191c1e", fontSize: 24, letterSpacing: -0.6 }}>Kollab</span>
      </Link>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.key} to={item.to} label={item.label} Icon={item.Icon} active={activeItem === item.key} />
        ))}

        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", marginTop: 12, opacity: 0.5 }}>
          <AnalyticsIcon color={appColors.gray} />
          <span style={{ color: appColors.gray, fontSize: 16 }}>Analytics </span>
          <span style={{ color: appColors.gray, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Coming</span>
        </div>
      </nav>

      <div style={{ borderTop: `1px solid ${appColors.border}`, paddingTop: 17, display: "flex", flexDirection: "column", gap: 8 }}>
        <NavLink to="/settings" label="Settings" Icon={SettingsIcon} active={activeItem === "settings"} />

        {/* Static placeholder -- wire to real account/usage data later */}
        <div style={{ background: appColors.primaryLighter, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontWeight: 700, color: appColors.gray, fontSize: 12, letterSpacing: 0.24 }}>PRO PLAN</span>
          <div style={{ background: appColors.border, height: 6, borderRadius: 9999, overflow: "hidden" }}>
            <div style={{ background: appColors.primary, height: "100%", width: "75%" }} />
          </div>
          <span style={{ color: appColors.gray, fontSize: 11, fontStyle: "italic" }}>750 of 1000 searches used</span>
        </div>
      </div>
    </aside>
  );
}