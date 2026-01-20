// Background service worker for Quick Hotel Booker

console.log("Quick Hotel Booker: Background service worker initialized");

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Quick Hotel Booker installed!");
  } else if (details.reason === "update") {
    console.log("Quick Hotel Booker updated!");
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);

  if (request.action === "pageChanged") {
    // Handle page navigation if needed
    console.log("Page changed to:", request.page);
  }

  sendResponse({ success: true });
  return true;
});

// Optional: Monitor tab updates to help with automation flow
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.includes("book.passkey.com")
  ) {
    console.log("Booking page loaded:", tab.url);
  }
});
