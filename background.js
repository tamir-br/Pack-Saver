// Background service worker for extension

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getStatus') {
    // Get enabled status from storage
    chrome.storage.sync.get(['enabled'], function(result) {
      const isEnabled = result.enabled !== false; // Default to true
      sendResponse({ enabled: isEnabled });
    });
    return true; // Keep channel open for async response
  }
});

// Set default state on install
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ enabled: true }, function() {
    console.log('Extension installed, default state: enabled');
  });
});