import './DataExtractor.js';

console.log('background.js');

// background.js
console.log(window.location.href);

// Function to handle observed changes
function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // The observed element is now in the viewport
      // You can perform actions or record the change here
      // console.log('Element entered the viewport:', entry.target);

      // get email address from target
      console.log(entry.target.innerText);

    }
  });
}

// Create an Intersection Observer
const observer = new IntersectionObserver(handleIntersection, {
  root: null, // Use the viewport as the root
  rootMargin: '0px', // No margin
  threshold: 0.5, // Trigger when 50% of the element is visible
});

// Start observing elements
document.querySelectorAll('.observe-me').forEach((element) => {
  observer.observe(element);
});

// Add the observer to monitor dynamically added elements
const observerConfig = {
  childList: true, // Observe changes to the DOM tree
  subtree: true, // Observe all descendants of the target node
};

const observerForDynamicChanges = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Start observing dynamically added elements
          observer.observe(node);
        }
      });
    }
  });
});

// Start observing the entire document for dynamic changes
observerForDynamicChanges.observe(document, observerConfig);
