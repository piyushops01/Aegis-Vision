// AegisVision Content Script

function scanPage() {
  console.log("[AegisVision] Scanning page for threats...");
  
  // Simulate AI Analysis by looking for specific keywords or just a random chance
  const pageText = document.body.innerText.toLowerCase();
  
  const highRiskKeywords = ["urgent login", "account suspended", "verify your credentials", "claim your prize"];
  let threatDetected = false;
  let threatType = "";
  
  for (const keyword of highRiskKeywords) {
    if (pageText.includes(keyword)) {
      threatDetected = true;
      threatType = "NLP / Phishing";
      break;
    }
  }

  // Random chance to simulate Deepfake detection if a video exists
  if (!threatDetected && document.querySelectorAll('video, img').length > 0) {
    if (Math.random() < 0.1) { // 10% chance
      threatDetected = true;
      threatType = "Deepfake Anomalies";
    }
  }

  if (threatDetected) {
    console.log("[AegisVision] Threat detected: " + threatType);
    injectCrimsonModal(threatType);
    
    // Send message to background script to log the threat
    chrome.runtime.sendMessage({
      type: "LOG_THREAT",
      payload: {
        source: window.location.hostname,
        type: threatType,
        level: threatType === "NLP / Phishing" ? "Critical" : "High",
        action: "Flagged & Blocked"
      }
    });
  } else {
    console.log("[AegisVision] Page is clean.");
    // Optionally update badge to green
    chrome.runtime.sendMessage({ type: "UPDATE_STATUS", status: "SAFE" });
  }
}

function injectCrimsonModal(threatType) {
  if (document.getElementById('aegisvision-modal')) return;

  const modalHtml = `
    <div id="aegisvision-modal" style="position: fixed; inset: 0; z-index: 999999; background: rgba(9, 9, 11, 0.95); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; color: white;">
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 32px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2);">
        <div style="width: 64px; height: 64px; background: rgba(239, 68, 68, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #ef4444;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #fff;">Threat Detected</h2>
        <p style="color: #ef4444; font-weight: 500; font-size: 16px; margin-bottom: 16px;">High probability of social engineering exploitation.</p>
        <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px; line-height: 1.5;">Our AI engine detected <strong style="color: #fff;">${threatType}</strong> on this page. For your safety, access to this content has been temporarily paused.</p>
        
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button id="aegis-close-btn" style="padding: 10px 20px; border-radius: 6px; border: 1px solid #3f3f46; background: transparent; color: white; cursor: pointer; font-weight: 500;">Go Back</button>
          <button id="aegis-proceed-btn" style="padding: 10px 20px; border-radius: 6px; border: none; background: #ef4444; color: white; cursor: pointer; font-weight: 500;">Proceed Anyway</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.getElementById('aegis-close-btn').addEventListener('click', () => {
    window.history.back();
  });

  document.getElementById('aegis-proceed-btn').addEventListener('click', () => {
    document.getElementById('aegisvision-modal').remove();
  });
}

// Run scan after brief delay to allow dynamic content to load
setTimeout(scanPage, 1500);
