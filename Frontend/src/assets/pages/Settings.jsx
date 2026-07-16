import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { Breadcrumb } from "../components/AppTopBar";
import { appColors } from "../components/appColors";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      style={{
        width: 44, height: 24, borderRadius: 9999, border: "none", cursor: "pointer", padding: 2,
        background: checked ? appColors.primary : appColors.border,
        transition: "background-color 150ms ease-out", flexShrink: 0, display: "flex", alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: 9999, background: "white", boxShadow: "0px 1px 2px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

function SettingsCard({ title, description, children }) {
  return (
    <div style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 16, boxShadow: "0px 10px 40px -10px rgba(21,80,211,0.08)", padding: 33, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontWeight: 700, color: appColors.navy, fontSize: 18, margin: 0 }}>{title}</h2>
        {description && <p style={{ color: appColors.grayLight, fontSize: 14, margin: "4px 0 0 0" }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 200 }}>
      <label style={{ color: appColors.gray, fontWeight: 600, fontSize: 13 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ background: appColors.bg, border: `1px solid ${appColors.border}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, color: appColors.navy, outline: "none" }}
      />
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <div>
        <div style={{ fontWeight: 600, color: appColors.navy, fontSize: 14 }}>{label}</div>
        <div style={{ color: appColors.grayLight, fontSize: 13 }}>{description}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  // Dummy pre-filled account fields -- editable locally, nothing persists.
  const [name, setName] = useState("Kollab Demo");
  const [email, setEmail] = useState("demo@kollabdemo.vn");
  const [company, setCompany] = useState("Kollab Demo");
  const [website, setWebsite] = useState("www.kollabdemo.vn");

  const [notifications, setNotifications] = useState({
    newApplications: true,
    campaignUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  });
  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [twoFactor, setTwoFactor] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("kollab_mock_logged_in");
    navigate("/");
  };

  return (
    <div
      className="kollab-settings"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-settings, .kollab-settings *, .kollab-settings *::before, .kollab-settings *::after {
          box-sizing: border-box;
        }
      `}</style>

      <AppSidebar activeItem="settings" />
      <AppTopBar left={<Breadcrumb text="Workspace /" current="Settings" />} />

      <main style={{ marginLeft: 256, paddingTop: 96, paddingBottom: 64, paddingLeft: 32, paddingRight: 32, maxWidth: 800 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
          <h1 style={{ fontWeight: 600, color: appColors.navy, fontSize: 36, letterSpacing: -0.72, margin: 0 }}>Settings</h1>
          <p style={{ color: appColors.grayLight, fontSize: 16, margin: 0 }}>Manage your account, notifications, and preferences.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SettingsCard title="Account" description="Update your brand's basic information.">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <TextField label="Full Name" value={name} onChange={setName} />
              <TextField label="Email Address" value={email} onChange={setEmail} type="email" />
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <TextField label="Company Name" value={company} onChange={setCompany} />
              <TextField label="Website" value={website} onChange={setWebsite} />
            </div>
            <button type="button" style={{ background: appColors.primary, border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, color: "white", fontSize: 14, cursor: "pointer", alignSelf: "flex-start" }}>
              Save Changes
            </button>
          </SettingsCard>

          <SettingsCard title="Notifications" description="Choose what you want to be notified about.">
            <ToggleRow
              label="New Applications"
              description="Get notified when a creator applies to your campaign"
              checked={notifications.newApplications}
              onChange={() => toggleNotification("newApplications")}
            />
            <ToggleRow
              label="Campaign Updates"
              description="Status changes on your active campaigns"
              checked={notifications.campaignUpdates}
              onChange={() => toggleNotification("campaignUpdates")}
            />
            <ToggleRow
              label="Weekly Digest"
              description="A summary of your account activity every Monday"
              checked={notifications.weeklyDigest}
              onChange={() => toggleNotification("weeklyDigest")}
            />
            <ToggleRow
              label="Marketing Emails"
              description="Product news, tips, and promotions from Kollab"
              checked={notifications.marketingEmails}
              onChange={() => toggleNotification("marketingEmails")}
            />
          </SettingsCard>

          <SettingsCard title="Security">
            <ToggleRow
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              checked={twoFactor}
              onChange={() => setTwoFactor((v) => !v)}
            />
            <button type="button" style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 12, padding: "12px 24px", fontWeight: 700, color: appColors.navy, fontSize: 14, cursor: "pointer", alignSelf: "flex-start" }}>
              Change Password
            </button>
          </SettingsCard>

          <SettingsCard title="Plan & Billing">
            <div style={{ background: appColors.primaryLighter, borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 16 }}>Pro Plan</div>
                <div style={{ color: appColors.grayLight, fontSize: 13 }}>750 of 1,000 searches used this month</div>
              </div>
              <button type="button" style={{ background: appColors.primary, border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, color: "white", fontSize: 14, cursor: "pointer" }}>
                Upgrade Plan
              </button>
            </div>
            <button type="button" style={{ background: "none", border: "none", color: appColors.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", padding: 0, textAlign: "left" }}>
              Manage Billing & Invoices
            </button>
          </SettingsCard>

          <SettingsCard title="Session">
            <button
              type="button"
              onClick={handleLogout}
              style={{ background: "white", border: `1px solid ${appColors.border}`, borderRadius: 12, padding: "14px 24px", fontWeight: 700, color: "#ba1a1a", fontSize: 14, cursor: "pointer", alignSelf: "flex-start" }}
            >
              Log Out
            </button>
          </SettingsCard>

          <SettingsCard title="Danger Zone">
            {/* Dummy on purpose -- account deletion needs real confirmation
                flows and backend work that's out of scope right now. */}
            <button type="button" style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 24px", fontWeight: 700, color: "#ba1a1a", fontSize: 14, cursor: "pointer", alignSelf: "flex-start" }}>
              Delete Account
            </button>
          </SettingsCard>
        </div>
      </main>
    </div>
  );
}