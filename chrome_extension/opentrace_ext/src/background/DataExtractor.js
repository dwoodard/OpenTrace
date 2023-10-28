// data extractor will look at current tab and extract all data sets from it based on the rules
// create the structure needed for this layout


// this file is handed the current tab/page 

// looking via body/content of the page  and document/object model

class DataExtractor {
  constructor() {

    //using window loop through all the elements in the page and extract the data

    this.data = {
      emails: [],
      phoneNumbers: [],
      addresses: [],
      socialMedia: [],
      names: [],
      companies: [],
      images: [],
      videos: [],
      files: [],
      links: [],
      domains: [],
      ips: [],
      keywords: [],
    };


  }

  extract() {
    this.data = [];
    this.extractEmails();
    this.extractPhoneNumbers();
    this.extractAddresses();
    this.extractSocialMedia();
    this.extractNames();
    this.extractCompanies();

    // OSINT
    this.extractImages();
    this.extractVideos();
    this.extractFiles();
    this.extractLinks();
    this.extractDomains();
    this.extractIPs();
    this.extractKeywords();

    return this.data;
  }

  extractEmails() {
    // using regex to extract emails


  }

