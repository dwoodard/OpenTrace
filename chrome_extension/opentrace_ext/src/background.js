console.log('background.js', window.location.href);

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