// Popup script for extension management

const reactivateBtn = document.getElementById('reactivateBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusTitle = document.getElementById('statusTitle');
const statusMessage = document.getElementById('statusMessage');
const statusText = document.getElementById('statusText');

// Check if extension is disabled and show re-enable button
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getExtensionStatus' }, function(response) {
      if (response && !response.isActive) {
        // Extension is closed/disabled
        statusIndicator.classList.add('disabled');
        statusTitle.textContent = '⚠️ Extension Closed';
        statusMessage.textContent = 'Click "Re-enable" to activate on this page.';
        statusText.textContent = 'Extension has been closed on this website.';
        statusText.classList.add('show');
      } else {
        // Extension is active
        statusIndicator.classList.remove('disabled');
        statusTitle.textContent = '✅ Active on this site';
        statusMessage.textContent = 'This extension automatically finds the best price per item on search results.';
        reactivateBtn.style.display = 'none';
      }
    });
  }
});

// Re-enable button click handler
reactivateBtn.addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'reactivate' }, function() {
        console.log('Re-activation message sent');
      });
      // Close popup after clicking
      window.close();
    }
  });
});