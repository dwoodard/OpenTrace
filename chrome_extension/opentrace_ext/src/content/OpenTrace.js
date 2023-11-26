import Contact from './Contact.js';
import areacodes from '../data/areacodes.js'; // Assuming this is a list of valid area codes

class OpenTrace {
  constructor() {
    this.data = {
      domain: JSON.parse(JSON.stringify(window.location)),
      timestamp: Date.now(),
      contacts: new Map() // Stores contacts by unique identifier or ancestor
    };

    this.analyzePage();
    this.listenObserver();
  }

  analyzePage() {
    let nodes = this.extractData(document.body);
    // log out those nodes here
    console.log('============================');
    console.log('nodes', nodes);
    console.log('============================');
    this.groupDataByAncestors(nodes);
  }

  listenObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // Process each added node if any
        mutation.addedNodes.forEach(addedNode => {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            let nodes = this.extractData(addedNode);
            this.groupDataByAncestors(nodes);
          }
        });
      });
    });

    const observerConfig = {
      childList: true,
      subtree: true
    };

    observer.observe(document.body, observerConfig);
  }

  extractData(node) {
    let dataNodes = [];
    this.traverseDOM(node, dataNodes);
    // console.log("Extracted data nodes:", dataNodes);

    return dataNodes;
  }

  traverseDOM(node, dataNodes) {


    // console.log("Traversing Node:", node);

    this.processNode(node, dataNodes);
    node.childNodes.forEach(childNode => {
      this.traverseDOM(childNode, dataNodes);
    });

  }
  processNode(node, dataNodes) {


    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.nodeValue.trim();
      const email = this.extractEmail(textContent);
      const phone = this.extractPhone(textContent);

      if (email) dataNodes.push({ type: 'email', content: email, node });
      if (phone) dataNodes.push({ type: 'phone', content: phone, node });
    }
    else if (node.nodeName === 'A' && node.href) {
      if (node.href.startsWith('mailto:')) {
        const email = node.href.substring(7); // Extract email after 'mailto:'
        dataNodes.push({ type: 'email', content: email, node });
      }
      else if (node.href.startsWith('tel:')) {
        const phone = node.href.substring(4); // Extract phone after 'tel:'
        dataNodes.push({ type: 'phone', content: this.normalizePhone(phone), node });
      }
    }
  }

  groupDataByAncestors(nodes) {
    nodes.forEach(({ node, content, type }) => {
      const ancestor = this.findClosestCommonAncestor(node);

      // log out the ancestor here
      console.log('>>>>>>>>>------------------');
      for (const el of ancestor.childNodes) {
        console.log(el);
      }
      console.log('>>>>>>>>>------------------');

      if (!ancestor) return;

      // Get the contact for the ancestor
      let contact = this.data.contacts.get(ancestor);


      if (!contact) {
        contact = new Contact();
        // this sets the contact from the ancestor
        this.data.contacts.set(ancestor, contact);
      }
      else {
        console.log('contact', contact);
      }

      //  log out the contact here
      console.log('------------------');
      console.log(contact);
      console.log('------------------');

      // Add the extracted data to the contact
      if (type === 'email') {
        contact.addEmail(content);
      }
      else if (type === 'phone') {
        contact.addPhoneNumber(content);
      }
    });
  }

  // Helper methods (extractEmail, extractPhone, etc.) remain the same
  extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = emailRegex.exec(text);
    return match ? match[0] : null;
  }

  extractPhone(text) {
    const phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;
    const match = phoneRegex.exec(text);
    return match ? this.normalizePhone(match[0]) : null;
  }

  normalizePhone(phone) {
    let normalizedPhone = phone.replace(/\D/g, '');

    // remove the leading 1 for US numbers if it exists
    if (normalizedPhone.length === 11 && normalizedPhone.startsWith('1')) {
      normalizedPhone = normalizedPhone.substring(1);
    }

    // Validate the length of the phone number
    if (normalizedPhone.length !== 10) {
      return; // Skip this iteration if the phone number doesn't have 10 digits
    }

    return normalizedPhone;

  }

  isAddress(address) {
    const addressRegex = /(\d{1,5}\s)([A-Za-z\s]{1,})/; // Simple regex for address validation
    return addressRegex.test(address);
  }

  findClosestCommonAncestor(node) {
    let path = [];
    let current = node;

    while (current && current !== document.body) {
      path.unshift(current);
      current = current.parentElement;
    }

    if (path.length === 0) return null;

    let ancestor = path[0];
    for (const el of path) {
      if (el.contains(ancestor)) ancestor = el;
    }
    return ancestor;
  }

  findClosestCommonAncestor(nodes) {
    let paths = nodes.map((node) => this.getAncestorPath(node));
    let shortestPath = paths.reduce((a, b) => (a.length < b.length ? a : b));

    for (let i = 0; i < shortestPath.length; i++) {
      if (paths.every((path) => path[i] === shortestPath[i])) {
        console.log(
          `findClosestCommonAncestor: Common ancestor found at depth ${i}`
        );
        return shortestPath[i];
      }
    }

    console.log("findClosestCommonAncestor: No common ancestor found");
    return null;
  }










  toJSON() {
    return {
      data: {
        domain: this.data.domain,
        timestamp: this.data.timestamp,
        contacts: Array.from(this.data.contacts.values()).
          map(contact => contact.toJSON())
      }
    }
  }
}

export default OpenTrace;
