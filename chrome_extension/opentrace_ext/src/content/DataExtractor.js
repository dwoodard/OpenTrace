import areacodes from '@/json/areacodes.json';
import ElementCount from './ElementCount.js';

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
    this.observer(); // this is the observer that listens for changes to the DOM
    this.listenForXHR(); // this is the listener that listens for XHR requests

    this.watchElementCount(); // this is the watcher that watches for the element with the most growth
  }

  init() {
    // console.log('DataExtractor init'); 
    this.data.domain = JSON.parse(JSON.stringify(window.location));
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

  observer() {
    let observe = new MutationObserver(this.runObserver.bind(this));

    observe.observe(document.body, {
      attributes: true,
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
    // console.log('DataExtractor runObserver', mutationsList, observer);

    mutationsList.forEach(mutation => {
      this.extract(mutation.target);
    });

    // console.log('data', this.data);


  }

  extract(el = document.body) {
    this.extractEmails(el);
    this.extractPhoneNumbers(el);
    this.extractAddresses(el);
    this.extractLinks(el);
    // this.extractUsernames(el);
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

  extractUsernames(el = document.body) {
    console.log('DataExtractor extractUsernames');




    // twitter.com/username
    // facebook.com/username
    // instagram.com/username
    // github.com/username
    // linkedin.com/in/username


    // youtube.com/username
    // pinterest.com/username
    // soundcloud.com/username
    // vimeo.com/username
    // flickr.com/username
    // reddit.com/username
    // tumblr.com/username
    // medium.com/username
    // quora.com/username
    // etsy.com/username
    // meetup.com/username
    // snapchat.com/username
    // whatsapp.com/username
    // telegram.com/username
    // vk.com/username
    // slack.com/username
    // discord.com/username
    // twitch.com/username
    // tiktok.com/username
    // snapchat.com/username

    // this function should extract usernames from the page
    // and add them to the usernames Set
    // this.data.usernames.add(username);

    // some areas to look for usernames
    // - document.body.querySelectorAll('[class*="username"]') // just the elements with a class that contains the word username
    // - document.body.querySelectorAll('[class*="social"]') // just the elements with a class that contains the word social



  }


  watchElementCount() {
    const elementCount = new ElementCount();
    elementCount.start();

    setInterval(() => {
      const elementWithMaxGrowth = elementCount.getElementWithMaxGrowth();
      if (elementWithMaxGrowth) {

        // return null if the element is the body
        if (elementWithMaxGrowth === document.body) {
          return null;
        }

        console.log('elementCount', elementCount.getElementWithMaxGrowth(), 'count', elementCount.maxGrowth); ');

      }
    }, 500);
  }

}

export default DataExtractor;