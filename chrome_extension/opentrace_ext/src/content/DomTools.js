class DomTools {
  constructor() {
    if (DomTools.instance) {
      return DomTools.instance;
    }

    this.elementWithMostChildren = { element: null, count: 0 };

    // Initialize the observation of DOM changes
    this.init();

    DomTools.instance = this;
  }

  init() {
    // Start the search with the children of document.body
    Array.from(document.body.children).forEach(child => {
      this.findMostChildren(child);
    });

    // Observe DOM changes
    this.observer = new MutationObserver(() => {
      // Reset the record before reassessing the DOM
      this.elementWithMostChildren = { element: null, count: 0 };
      // Update the record whenever the DOM updates
      Array.from(document.body.children).forEach(child => {
        this.findMostChildren(child);
      });
    });

    // Start observing the document body for changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  findMostChildren(element) {
    // Update the record if the current element has more children than the current record holder
    if (element.childNodes.length > this.elementWithMostChildren.count) {
      this.elementWithMostChildren = { element: element, count: element.childNodes.length };
      //emit an event when the element with the most children is found
      const event = new CustomEvent('elementWithMostChildren', { el: this.elementWithMostChildren });
    }

    // Recursively check each child element
    Array.from(element.children).forEach((child) => {
      this.findMostChildren(child);
    });
  }

  // Method to get the element with the most children excluding the body
  getElementWithMostChildren() {
    return this.elementWithMostChildren;
  }

  // Disconnect the observer when it's no longer needed to prevent memory leaks
  disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

}

// Ensuring that the instance is a singleton
const instance = new DomTools();

// Export the instance as the default export
export default instance;
