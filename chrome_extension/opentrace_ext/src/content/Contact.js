// uuid 
import { v4 as uuid } from 'uuid';

class Contact {
  constructor(name = '') {

    // console.log(uuid());


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

  // Returns a string representation of the object
  toString() {
    return JSON.stringify(this.toJSON());
  }

  // Returns a JSON representation of the object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      emails: Array.from(this.emails),
      phoneNumbers: Array.from(this.phoneNumbers),
      usernames: Array.from(this.usernames),
      addresses: Array.from(this.addresses),
      associatedUrls: Array.from(this.associatedUrls),
    };
  }
}

export default Contact;