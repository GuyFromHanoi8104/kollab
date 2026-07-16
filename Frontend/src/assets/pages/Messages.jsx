import { useState } from "react";
import AppSidebar from "../components/AppSidebar";
import AppTopBar, { Breadcrumb } from "../components/AppTopBar";
import { appColors } from "../components/appColors";

const CONVERSATIONS = [
  { id: "linh", name: "Linh Nguyen", initial: "L", campaign: "Protein Powder Launch", unread: true },
  { id: "minh", name: "Minh Review", initial: "M", campaign: "New Gen Gaming Headset Review", unread: false },
  { id: "thanh", name: "Thanh Beauty", initial: "T", campaign: "Glow Morning Routine Reel", unread: true },
  { id: "khoa", name: "Khoa Fitness", initial: "K", campaign: "Healthy Snacks", unread: false },
];

const INITIAL_THREADS = {
  linh: [
    { from: "them", text: "Hi! Thanks for the invite to the Protein Powder Launch campaign.", time: "10:03 AM" },
    { from: "me", text: "Of course! We loved your recent skincare content, think you'd be a great fit.", time: "10:05 AM" },
    { from: "them", text: "Sounds great! I can start filming next week.", time: "10:07 AM" },
  ],
  minh: [
    { from: "them", text: "Thanks for the campaign details, reviewing the brief now.", time: "Yesterday" },
    { from: "me", text: "Sounds good, let me know if anything's unclear!", time: "Yesterday" },
  ],
  thanh: [
    { from: "them", text: "Loved the moodboard you sent over.", time: "Mon" },
    { from: "them", text: "Could we adjust the deadline slightly? Need a few extra days for the reshoot.", time: "Mon" },
  ],
  khoa: [
    { from: "them", text: "Video draft is ready for review 🎥", time: "2 days ago" },
    { from: "me", text: "Just watched it, looks great! One small note on the intro.", time: "2 days ago" },
    { from: "them", text: "Got it, sending an updated cut today.", time: "2 days ago" },
  ],
};

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9l16-8-6 16-3-6-7-2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Messages() {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");

  const activeConvo = CONVERSATIONS.find((c) => c.id === activeId);
  const activeMessages = threads[activeId] || [];

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...prev[activeId], { from: "me", text, time: "Now" }],
    }));
    setDraft("");
  };

  return (
    <div
      className="kollab-messages"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: appColors.bg, minHeight: "100vh", textAlign: "left" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { margin: 0; background: white; }
        #root { max-width: none; margin: 0; padding: 0; width: 100%; }
        .kollab-messages, .kollab-messages *, .kollab-messages *::before, .kollab-messages *::after {
          box-sizing: border-box;
        }
        .kollab-scroll-col {
          scrollbar-width: thin;
          scrollbar-color: ${appColors.border} transparent;
        }
        .kollab-scroll-col::-webkit-scrollbar { width: 6px; }
        .kollab-scroll-col::-webkit-scrollbar-thumb { background: ${appColors.border}; border-radius: 9999px; }
      `}</style>

      <AppSidebar activeItem="messages" />
      <AppTopBar left={<Breadcrumb text="Workspace /" current="Messages" />} />

      <main style={{ marginLeft: 256, paddingTop: 64, height: "100vh", boxSizing: "border-box", display: "flex" }}>
        {/* Conversation list */}
        <aside className="kollab-scroll-col" style={{ width: 320, flexShrink: 0, borderRight: `1px solid ${appColors.border}`, background: "white", overflowY: "auto" }}>
          <div style={{ padding: "24px 24px 16px 24px" }}>
            <h1 style={{ fontWeight: 700, color: appColors.navy, fontSize: 24, margin: 0 }}>Messages</h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {CONVERSATIONS.map((convo) => {
              const isActive = convo.id === activeId;
              const lastMsg = threads[convo.id][threads[convo.id].length - 1];
              return (
                <button
                  key={convo.id}
                  type="button"
                  onClick={() => setActiveId(convo.id)}
                  style={{
                    display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 24px", border: "none", cursor: "pointer", textAlign: "left",
                    background: isActive ? appColors.primaryLighter : "transparent", borderLeft: isActive ? `3px solid ${appColors.primary}` : "3px solid transparent",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ background: "#e2e8f0", width: 44, height: 44, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.grayLight }}>
                      {convo.initial}
                    </div>
                    {convo.unread && (
                      <span style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderRadius: 9999, background: "#ba1a1a", boxShadow: "0 0 0 2px white" }} />
                    )}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontWeight: convo.unread ? 700 : 600, color: appColors.navy, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{convo.name}</span>
                    </div>
                    <div style={{ color: appColors.grayLight, fontSize: 11, marginBottom: 4 }}>{convo.campaign}</div>
                    <div style={{ color: convo.unread ? appColors.navy : appColors.grayLight, fontSize: 13, fontWeight: convo.unread ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lastMsg.from === "me" ? "You: " : ""}{lastMsg.text}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Thread */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ padding: "20px 32px", borderBottom: `1px solid ${appColors.border}`, background: "white", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: "#e2e8f0", width: 40, height: 40, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: appColors.grayLight }}>
              {activeConvo.initial}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: appColors.navy, fontSize: 15 }}>{activeConvo.name}</div>
              <div style={{ color: appColors.grayLight, fontSize: 12 }}>{activeConvo.campaign}</div>
            </div>
          </div>

          <div className="kollab-scroll-col" style={{ flex: 1, overflowY: "auto", padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            {activeMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: 420 }}>
                  <div
                    style={{
                      background: msg.from === "me" ? appColors.primary : "white",
                      color: msg.from === "me" ? "white" : appColors.navy,
                      border: msg.from === "me" ? "none" : `1px solid ${appColors.border}`,
                      borderRadius: 16,
                      padding: "12px 16px",
                      fontSize: 14,
                      lineHeight: "21px",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div style={{ color: appColors.grayLight, fontSize: 11, marginTop: 4, textAlign: msg.from === "me" ? "right" : "left" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 24, borderTop: `1px solid ${appColors.border}`, background: "white", display: "flex", gap: 12 }}>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{ flex: 1, background: appColors.bg, border: `1px solid ${appColors.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: appColors.navy, outline: "none" }}
            />
            <button
              type="button"
              onClick={handleSend}
              aria-label="Send message"
              style={{ background: appColors.primary, border: "none", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}