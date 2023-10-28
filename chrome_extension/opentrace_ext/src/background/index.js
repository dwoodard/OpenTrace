import DataExtractor from './DataExtractor';

// init data extractor
const dataExtractor = new DataExtractor();

// listen for messages from the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    // extract data from current tab
    const data = dataExtractor.extract();
    sendResponse(data);
  }
});