console.log('background.js', window.location.href);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'onOrOff': true }, result => {
    console.log("On Installed Set value to on")
  })
})

var isExtensionOn = true;

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === 'local' && changes.onOrOff) {
    console.log(changes.onOrOff.newValue)
    // extension is on
    if (changes.onOrOff.newValue) {
      isExtensionOn = true;
    }
    // extension is off
    else {
      console.log("Extension Is Off")
      isExtensionOn = false;

    }

  }
})

/* 
the background script is for the extension to do things in the background
example:
- listen for clicks on the browser action
- listen for clicks on the page action
- make a network request
- listen for network requests
- access browser tabs
- access browser storage
- access the clipboard
- listen for messages from other extensions or apps
  - chrome.runtime.onMessageExternal
  - chrome.runtime.onMessage
  - chrome.runtime.onConnect

check out the chrome api for more info here:
 https://developer.chrome.com/docs/extensions/reference/

 */