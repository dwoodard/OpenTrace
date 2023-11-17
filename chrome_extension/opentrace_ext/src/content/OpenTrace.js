// Contact
import Contact from './Contact.js';

// Patterns to look for in the DOM
import areacodes from '@/json/areacodes.json';
// import social from './Social.js';
// import DomTools from './DomTools.js';

class OpenTrace {

  data = {

    domain: {
      host: '',
      path: '',
      fullurl: '',
    },

    contacts: new Set(),



    // unique identifiers
    emails: new Set(),
    phoneNumbers: new Set(),

    // common data
    names: new Set(),
    people: new Set(),
    addresses: new Set(),

    // social data
    usernames: new Set(), // twitter, facebook, instagram, github, linkedin, etc

    // Page data
    links: {
      internal: new Set(),
      external: new Set(),
      other: new Set(),
    }
  };

  constructor() {
    console.log('Contact', new Contact());
    console.log('Contact', new Contact());


    // console.log('OpenTrace constructor');
    this.analyzePage(); // this is the main function that runs when the class is instantiated
    this.observer(); // this is the observer that listens for changes to the DOM

  }

  analyzePage() {
    // Logic to analyze the entire page
    this.data.domain = JSON.parse(JSON.stringify(window.location));
    this.data.timestamp = Date.now();
    this.data.depthMap = this.groupElementsByDepth()




    this.traverseDOM(document.body);

  }

  // Traverses the DOM to find and extract data
  traverseDOM(node) {
    // Extract data from the current node
    this.extract(node)

    // Recursively analyze child nodes
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        this.traverseDOM(child);
      }
    });
  }

  observer() {
    let observe = new MutationObserver(this.runObserver.bind(this));

    observe.observe(document.body, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }

  runObserver(mutationsList, observer) {
    // console.log('runObserver', mutationsList, observer); 
    mutationsList.forEach(mutation => {
      console.log('mutation', mutation);
      this.traverseDOM(mutation.target);
    });

    // console.log('data', this.data);
  }

  extract(el = document.body) {
    this.extractEmails(el);
    this.extractPhoneNumbers(el);
    this.extractAddresses(el);
    this.extractLinks(el);

  }

  extractEmails(el = document.body) {
    // foo@bar.com
    // foo at bar dot com

    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/mig;


    let emails = el.innerText?.match(emailRegex) || [];

    emails.forEach(email => {
      this.data.emails.add(email);
    });

  }

  extractPhoneNumbers(el = document.body) {
    // console.log('OpenTrace extractPhoneNumbers');

    // (801) 776-0476
    // 801-776-0476
    // 801.776.0476
    // 801 776 0476
    // 8017760476
    // 1-801-776-0476
    // 1.801.776.0476
    // 1 801 776 0476
    // 1 (801) 776-0476
    // 1(801)776-0476 
    // [435]851-6044
    // 888444.4444 <--- this is not a phone number

    const phoneRegex = /(?:\b(?:\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4}\b)|\[(\d{3})\](\d{3})[-.\s]?(\d{4}\b))/mig;

    //check el if it is a style element, if so, skip it
    if (el.tagName === 'STYLE') {
      return;
    }


    // get all the phone numbers on the page
    let extractedPhones = el.innerText?.match(phoneRegex) || [];

    // console.log('extractedPhones', extractedPhones);

    // Normalize and filter phone numbers
    extractedPhones.forEach(phone => {
      // remove all non-numeric characters
      let normalizedPhone = phone.replace(/\D/g, '');

      // remove the leading 1 for US numbers if it exists
      if (normalizedPhone.length === 11 && normalizedPhone.startsWith('1')) {
        normalizedPhone = normalizedPhone.substring(1);
      }

      // Validate the length of the phone number
      if (normalizedPhone.length !== 10) {
        return; // Skip this iteration if the phone number doesn't have 10 digits
      }

      // check the area code, if it's not in the areacodes list, then skip it
      let areaCode = normalizedPhone.substring(0, 3);
      if (!Object.values(areacodes).some(i => i.includes(areaCode))) {
        return; // Skip this iteration as the area code is not valid
      }

      // Add the phone number to the set
      this.data.phoneNumbers.add(normalizedPhone);

    });
  }

  extractAddresses(el = document.body) {
    // console.log('OpenTrace extractAddresses', el.outerText);

    // look for addresses in the outerText of the element
    // console.log(el.outerText);



  }

  extractLinks(el = document.body) {
    // Initialize the Sets if they haven't been already
    this.data.links.internal = this.data.links.internal || new Set();
    this.data.links.external = this.data.links.external || new Set();
    this.data.links.other = this.data.links.other || new Set();

    // Extract all hyperlinks from the element
    [...el.querySelectorAll('a[href]')] // Select only <a> elements with href
      .map(a => a.href.trim()) // Trim whitespace from each href
      .filter(href => href) // Filter out empty strings
      .forEach(href => {
        try {
          const link = new URL(href);

          // Check if the link is neither HTTP nor HTTPS (e.g., mailto, tel, etc.)
          if (link.protocol !== 'http:' && link.protocol !== 'https:') {
            this.data.links.other.add(href);
          } else {
            // Prepare the main domain for comparison by stripping out 'www' and any subdomains
            const baseDomain = this.data.domain.host;
            const linkBaseDomain = link.host;

            // Check if the link's base domain matches the data domain's base domain
            if (linkBaseDomain === baseDomain) {
              this.data.links.internal.add(href);
            } else {
              this.data.links.external.add(href);
            }
          }
        } catch (error) {
          // If there's an error in creating a new URL, it means the href was not a valid URL
          console.error('Invalid URL:', href);
        }
      });
  }

  extractUsernames(link) {
    // step 1. check if the link is a social link
    // step 2. if it is a social link, extract the username from the link
    // step 3. add the username to the usernames Set

    this.data.usernames.add(social.findUsername(link));



  }


  groupElementsByDepth() {
    const allElements = [...document.querySelectorAll('body *:not(script)')];
    const depthMap = new Map();

    allElements.forEach(element => {
      let depth = 0;
      let parent = element.parentNode;
      while (parent && parent !== document) {
        depth++;
        parent = parent.parentNode;
      }

      if (!depthMap.has(depth)) {
        depthMap.set(depth, []);
      }

      depthMap.get(depth).push(element);
    });

    return depthMap;
  }

}

export default OpenTrace;