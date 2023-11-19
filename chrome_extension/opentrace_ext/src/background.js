console.log('background.js', window.location.href);

chrome.runtime.onInstalled.addListener(() => {
  // Set the initial state of the extension
  chrome.storage.local.set({ isExtEnabled: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('background.js', 'message', message, sender, sendResponse);

  if (message.isExtEnabled !== undefined) {
    if (message.isExtEnabled) {
      console.log('background.js', 'enabled');


    } else {
      console.log('background.js', 'disabled');
    }
  }
});
