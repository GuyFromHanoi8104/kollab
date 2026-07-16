import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./assets/pages/LandingPage";
import Login from "./assets/pages/Login";
import SignUp from "./assets/pages/SignUp";
import Dashboard from "./assets/pages/Dashboard";
import DiscoverCreators from "./assets/pages/DiscoverCreators";
import CreatorProfile from "./assets/pages/CreatorProfile";
import CampaignsBrowse from "./assets/pages/CampaignsBrowse";
import DiscoverBrands from "./assets/pages/DiscoverBrands";
import ManageCampaigns from "./assets/pages/ManageCampaigns";
import Settings from "./assets/pages/Settings";
import SavedCreators from "./assets/pages/SavedCreators";
import Messages from "./assets/pages/Messages";
import ProtectedRoute from "./assets/components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/discover" element={<DiscoverCreators />} />
        <Route path="/creator/:id" element={<CreatorProfile />} />
        <Route path="/campaigns" element={<CampaignsBrowse />} />
        <Route path="/discover-brands" element={<DiscoverBrands />} />
        <Route path="/manage-campaigns" element={<ProtectedRoute><ManageCampaigns /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedCreators /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}