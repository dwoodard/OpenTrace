//EmailExtractor.js

class EmailExtractor {
    constructor() {
        this.data = {
            emails: new Set()
        };
    }

    extract(node) {
        let email = node.href.replace('mailto:', '');
        this.data.emails.add(email);
    }

    get data() {
        return this.data;
    }
}