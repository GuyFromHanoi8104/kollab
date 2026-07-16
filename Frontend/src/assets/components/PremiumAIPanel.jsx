import { appColors } from "./appColors";

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" fill={appColors.primary} />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
      <rect x="1" y="7" width="12" height="8" rx="2" stroke={appColors.primary} strokeWidth="1.4" />
      <path d="M3.5 7V4.5a3.5 3.5 0 0 1 7 0V7" stroke={appColors.primary} strokeWidth="1.4" />
    </svg>
  );
}

// subject: what the recommendations would be for, e.g. "creators" or "brands"
export default function PremiumAIPanel({ subject = "creators" }) {
  return (
    <div style={{ background: "#d3e4fe", border: `1px solid ${appColors.border}`, borderRadius: 32, padding: 25, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 15 }}>
      <div style={{ position: "absolute", background: "rgba(21,80,211,0.1)", filter: "blur(32px)", width: 128, height: 128, borderRadius: 9999, top: -48, right: -48 }} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative" }}>
        <SparkleIcon />
        <span style={{ color: appColors.navy, fontSize: 18, flex: 1 }}>AI Recommendations</span>
        <LockIcon />
      </div>
      <p style={{ color: appColors.gray, fontSize: 14, lineHeight: "23px", margin: 0, position: "relative" }}>
        Get personalized {subject} matched to your industry, budget, and past campaigns — powered by AI.
      </p>
      <button
        type="button"
        style={{ position: "relative", background: appColors.primary, border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 700, color: "white", fontSize: 14, cursor: "pointer", width: "100%" }}
      >
        Upgrade to Premium
      </button>
    </div>
  );
}