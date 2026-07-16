import { Navigate } from "react-router-dom";

// Guards routes that genuinely require an account: Dashboard, Manage
// Campaigns, Saved Creators, Messages, Settings. Redirects to Login if the
// mock auth flag isn't set.
//
// Browsing is public -- NOT applied to /discover (Discover Creators),
// /discover-brands, /campaigns, or /creator/:id (Creator Profile). Those
// pages handle guests themselves: hiding account-only sections (Recently
// Viewed, Saved Lists) and gating specific actions (e.g. Creator Profile's
// "Invite to Campaign" button checks login itself and redirects rather than
// blocking the whole page).
//
// NOTE: checks "logged in at all", not role (brand vs creator) -- there's
// still only one mock persona.
export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("kollab_mock_logged_in") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}