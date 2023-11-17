// Find Social usernames links. It will be used to find the social links from the page
// use the sites in the socialSites array to find the social links 

class Social {



  constructor() {
    if (Social.instance) {
      return Social.instance;
    }

    this.socialSitesPattern = [
      "facebook.com/username",
      "instagram.com/username",
      "twitter.com/@username",
      "linkedin.com/in/username",
      "github.com/username",
      "youtube.com/@username",
      "pinterest.com/username",
      "soundcloud.com/username",
      "vimeo.com/username",
      "flickr.com/username",
      "reddit.com/username",
      "tumblr.com/username",
      "medium.com/username",
      "quora.com/username",
      "etsy.com/username",
      "meetup.com/username",
      "snapchat.com/username",
      "whatsapp.com/username",
      "telegram.com/username",
      "slack.com/username",
      "discord.com/username",
      "twitch.com/username",
      "tiktok.com/username",
      "snapchat.com/username",
      "whatsapp.com/username",
      "telegram.com/username",
    ];

    Social.instance = this;

  };

  findUsername(link) {
    console.log('link', link);
    // use socialSitesPattern to find the social links from the page
    let socialSitesPattern = this.socialSitesPattern;
    let username = '';

    // take the link and compare it to the socialSitesPattern by using the username to 

  }

}
const instance = new Social();

export default instance;