// AegisVision Background Service Worker

const SUPABASE_URL = "https://kboxenurbbyurbopysas.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_OgqytL9svmvudV9wU3dTkw_8nfPuNN5";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOG_THREAT") {
    console.log("[AegisVision Background] Threat received:", message.payload);
    
    // Change extension icon to red
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });

    // Send to Supabase REST API
    if (SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE") {
      fetch(`${SUPABASE_URL}/rest/v1/scans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          source: message.payload.source,
          type: message.payload.type,
          level: message.payload.level,
          action: message.payload.action,
          // Generate a random ID or let Postgres handle it
        })
      }).then(res => {
        console.log("Logged to Supabase:", res.status);
      }).catch(err => {
        console.error("Supabase log error:", err);
      });
    }
  } else if (message.type === "UPDATE_STATUS" && message.status === "SAFE") {
    chrome.action.setBadgeText({ text: "" });
  }
});
