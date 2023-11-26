console.log('background.js', 'service-worker-loader.js');
console.log('do service worker stuff here');


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'toggleExtension') {
    chrome.storage.sync.get('isExtEnabled', ({ isExtEnabled }) => {
      isExtEnabled = !isExtEnabled;
      chrome.storage.sync.set({ isExtEnabled });
      sendResponse({ isExtEnabled });
    });
    return true;
  }
});


// listen for the active tab to change then set the badge text

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.sync.get('isExtEnabled', ({ isExtEnabled }) => {
    chrome.action.setBadgeText({
      tabId: activeInfo.tabId,
      text: isExtEnabled ? 'ON' : 'OFF'
    });
  });
}); 
