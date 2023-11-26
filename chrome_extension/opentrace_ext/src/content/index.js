import OpenTrace from './OpenTrace'; // ./src/content/OpenTrace.js

console.log('content init');



chrome.storage.sync.get(['isExtEnabled']).then((data) => {
  console.log('isExtEnabled', data.isExtEnabled);

  if (data.isExtEnabled) {
    const openTrace = new OpenTrace();
    console.log(openTrace.data);
    console.log('json', openTrace.toJSON());
  }

});









