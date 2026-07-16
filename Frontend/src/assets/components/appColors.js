// Color tokens for the logged-in "app" side of Kollab, extracted from
// Figma's Dashboard/Discover Creators frames. NOTE: these differ from the
// marketing site's tokens (colors.blue = #2563eb, colors.navy = #191c1e in
// LandingPage.jsx) -- this looks like two separate Stitch generation passes
// rather than one unified design system. Built faithfully to what's in
// Figma; worth unifying later if that's intentional drift vs. a mistake.
//
// Lives in its own file (not inside AppSidebar.jsx) on purpose: Vite's Fast
// Refresh only hot-swaps files that export components. Mixing a component
// export with a constant export in one file breaks that, forcing a full
// page reload on every edit instead of a hot swap.
export const appColors = {
  primary: "#1550d3",
  primaryLight: "#e5eeff",
  primaryLighter: "#eff4ff",
  navy: "#0b1c30",
  gray: "#434654",
  grayLight: "#737686",
  border: "#c3c5d7",
  bg: "#f8f9ff",
};