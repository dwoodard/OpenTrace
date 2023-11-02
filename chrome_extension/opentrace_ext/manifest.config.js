import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest(async (command, mode) => {

  return {

    manifest_version: 3,
    name: "OpenTrace Extension",
    version: "0.0.1",

    // chrome_url_overrides: {
    //   newtab: "index.html"
    // },

    icons: {
      "16": "icons/icon.png",
      "48": "icons/icon.png",
      "128": "icons/icon.png"
    },

    // background: {
    //   "service_worker": "src/background/index.js",
    //   "type": "module"
    // },

    permissions: [
      "activeTab"
    ],

    options_ui: {
      page: "options/index.html",
      open_in_tab: false
    },

    action: {
      default_popup: "popup.html",
    },

    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["src/content/index.js"]
      }
    ]

  }
})