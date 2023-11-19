import OpenTrace from '@/content/OpenTrace'; // ./src/content/OpenTrace.js

console.log('content init');
console.log(window.location.href);

//get isExtEnabled from storage
chrome.storage.local.get('isExtEnabled', (result) => {
  if (result.isExtEnabled) {
    console.log('index.js', result.isExtEnabled);
  }
});

const openTrace = new OpenTrace();
console.log(openTrace.data);

