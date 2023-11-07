import areacodes from '@/json/areacodes.json';

/* 
  example of what dataExtractor should look like:
  let dataExtractor = new DataExtractor(data);
  dataExtractor.data  // this is what we want to return 
*/

class DataExtractor {

  data = {

    domain: {
      host: '',
      path: '',
      fullurl: '',
    },


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
    // console.log('DataExtractor constructor');
    this.init(); // this is the main function that runs when the class is instantiated
    this.observe(); // this is the observer that listens for changes to the DOM
    this.listenForXHR(); // this is the listener that listens for XHR requests
  }

  init() {
    // console.log('DataExtractor init'); 
    this.data.domain = JSON.parse(JSON.stringify(window.location));
    //get the query string
    this.data.domain.query = this.data.domain.searchParams || "";
    this.data.timestamp = Date.now();

    this.extract()

    /* 
     The Loop (extract)
     q: what are some ways we can loop through the DOM?
     - document.body.outerHTML // look at the entire page
     - document.body.innerText // just the text
     - document.body.querySelectorAll('a') // just the links
     - we'll skip media elements for now
       - document.body.querySelectorAll('img') // just the images
       - document.body.querySelectorAll('video') // just the videos
       - document.body.querySelectorAll('audio') // just the audio
       - document.body.querySelectorAll('object') // just the objects
       - document.body.querySelectorAll('script') // just the scripts
       - document.body.querySelectorAll('style') // just the styles
       - document.body.querySelectorAll('iframe') // just the iframes
     - class names or attributes might hold some clues
     - document.body.querySelectorAll('[class*="email"]') // just the elements with a class that contains the word email 
     - document.body.querySelectorAll('[class*="phone"]') // just the elements with a class that contains the word phone
     - document.body.querySelectorAll('[class*="address"]') // just the elements with a class that contains the word address
     - document.body.querySelectorAll('[class*="social"]') // just the elements with a class that contains the word social
     - document.body.querySelectorAll('[class*="company"]') // just the elements with a class that contains the word company
   
     q: should we use outerHTML or innerText?
     a: innerText is faster and more reliable
     
     - document.body.querySelectorAll('a')
     
    */
    console.log('done');

  }

  observe() {
    this.observe = new MutationObserver(this.runObserver.bind(this));
    this.observe.observe(document.body, {
      // attributes: true,
      childList: true,
      subtree: true
    });
  }

  listenForXHR() {
    console.log('listenForXHR');

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        console.log(responseData);
      } else {
        console.log('Error', xhr.statusText);
      }
    });

  }

  runObserver(mutationsList, observer) {
    // log the mutationsList
    // console.log('mutationsList', mutationsList);
    // console.log('runObserver', this);
    mutationsList.forEach(mutation => {
      this.extract(mutation.target);
    });

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


    let emails = el.innerText.match(emailRegex) || [];
    // console.log('emails', emails);


    emails.forEach(email => {
      this.data.emails.add(email);
    });

  }

  extractPhoneNumbers(el = document.body) {
    // console.log('DataExtractor extractPhoneNumbers');

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
    // 888444.4444 <--- this is not a phone number
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/mig;

    // [...document.body.querySelectorAll('[id*="phone"], [class*="phone"],')].map(i => i.innerText)

    // get all the phone numbers on the page
    let extractedPhones = el.innerText.match(phoneRegex) || [];

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
    // console.log('DataExtractor extractAddresses');
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


}

export default DataExtractor;
/* 
------------------------------------------------------------------------


// step 1: set patterns to match
// Regular expression to match email addresses
const phoneRegex = /(\d{3})[-. ]?(\d{3})[-. ]?(\d{4})/g; //example: 801-776-0476


// step 2: add all items to a set to remove duplicates
let extractedEmails = [...new Set(document.body.textContent.match(emailRegex) || [])];
let extractedPhones = [...new Set(document.body.textContent.match(phoneRegex) || [])];

// step 3: Normalize and filter the data
// lets normalize the phone numbers so we can compare them to the areacodes
extractedPhones = extractedPhones.map(phone => {
  phone = phone.replace(/\D/g, '');
  if (phone.length === 11 && phone[0] === '1') {
    phone = phone.substring(1);
  }
  return phone;
});

extractedPhones = [...new Set(extractedPhones)];

// lets compare the phone numbers to the areacodes
extractedPhones = extractedPhones.filter(phone => {
  let areaCode = phone.substring(0, 3);
  return Object.values(areacodes).some(i => i.includes(areaCode));
});

// normalize the phone numbers back to the original format
extractedPhones = extractedPhones.map(phone => {
  phone = phone.replace(/\D/g, '');
  if (phone.length === 11 && phone[0] === '1') {
    phone = phone.substring(1);
  }
  phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  return phone;
});

*/