// uuid 
import { v4 as uuid } from 'uuid';

class Contact {
  constructor(name = '') {

    console.log(uuid());


    this.id = uuid();
    this.name = name;
    this.emails = new Set();
    this.phoneNumbers = new Set();
    this.usernames = new Set();
    this.addresses = new Set();
    this.associatedUrls = new Set();
  }

  addEmail(email) {
    this.emails.add(email);
  }

  addPhoneNumber(phoneNumber) {
    this.phoneNumbers.add(phoneNumber);
  }

  addUsername(platform, username) {
    this.usernames[platform] = username;
  }

  addAddress(address) {
    this.addresses.add(address);
  }

  addAssociatedUrl(url) {
    this.associatedUrls.add(url);
  }

  // You can add more methods here for additional functionality
  // like removing data, updating data, or exporting data.
}

export default Contact;