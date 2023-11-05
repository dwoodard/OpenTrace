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
    usernames: new Set(),

    // common data
    names: new Set(),
    people: new Set(),
    addresses: new Set(),

    // social data
    usernames: new Set(), // twitter, facebook, instagram, github, linkedin, etc




    // Page data
    pageLinks: new Set(),


  };

  constructor() {
    // console.log('DataExtractor constructor');
    this.init();
  }


  init() {
    // console.log('DataExtractor init'); 


    this.data.domain = JSON.parse(JSON.stringify(window.location));
    this.data.domain.query = new URLSearchParams(window.location.search)
    //format as epoch
    this.data.timestamp = Date.now();

    this.extract()
    this.createRelationships();

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
       - document.body.querySelectorAll('link') // just the links
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

  extract() {
    this.extractEmails();
    this.extractPhoneNumbers();
    this.extractAddresses();
    this.extractLinks();
  }

  extractEmails() {
    // foo@bar.com
    // foo at bar dot com

    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/mig;

    let emails = document.body.innerText.match(emailRegex) || [];
    console.log('emails', emails);

    this.data.emails.add([...new Set(emails)]);
  }

  extractPhoneNumbers() {
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


    // get all the phone numbers on the page
    let extractedPhones = document.body.innerText.match(phoneRegex) || [];
    console.log('extractedPhones', extractedPhones);

    // step 1 - normalize the phone numbers
    extractedPhones = extractedPhones.map(phone => {
      // remove all non-numeric characters
      phone = phone.replace(/\D/g, ''); // (801) 776-0476 => 8017760476

      // remove the leading 1 if it exists
      phone = phone.replace(/^1/, ''); // 18017760476 => 8017760476

      // check the area code, if it's not in the areacodes list, then remove it
      let areaCode = phone.substring(0, 3);
      if (!Object.values(areacodes).some(i => i.includes(areaCode))) {
        phone = phone.substring(3);
      }

      return phone;
    });

    // step 2 - filter the phone numbers that are not in the areacodes list
    extractedPhones = extractedPhones.filter(phone => {
      let areaCode = phone.substring(0, 3);
      return Object.values(areacodes).some(i => i.includes(areaCode));
    });

    // step 3 - add the phone numbers back to the set

    this.data.phoneNumbers = new Set(extractedPhones);
  }

  extractAddresses() {
    console.log('DataExtractor extractAddresses');
  }

  extractLinks() {
    console.log('DataExtractor extractLinks');
    let links = new Set([...document.body.querySelectorAll('a')].map(i => i.href))
    // this.data.links.internal = [...links].filter(i => i.includes(this.data.domain.host));
    console.log('links', links);

    // this.data.links.external = [...links].filter(i => !i.includes(this.data.domain.host));
  }

  createRelationships() {
    console.log('DataExtractor createRelationships');
    // given the data we have extracted, we can create relationships between the data
    // like name owns email, email owns phone number, email owns social media accounts, etc

    // create people
    this.data.emails.forEach(email => {
      let person = {
        name: '',
        email: email,
        // assign the phone to the email
        phoneNumbers: this.getMostLikelyPhoneNumbers(),
        addresses: [],
        socialMedia: [],
      };


      // find the name that owns this email

      // find the phone numbers that belong to this email

      // find the addresses that belong to this email

      // find the social media accounts that belong to this email


      // add the person to the people set
      this.data.people.add(person);
    });
  }

  getMostLikelyPhoneNumbers() {
    // get the most likely phone numbers for this person
    // we can do this by comparing the phone numbers to the areacodes
    
    return phoneNumbers;

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