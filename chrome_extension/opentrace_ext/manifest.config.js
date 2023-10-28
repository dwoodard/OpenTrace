import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest(async (env) => {
  return {

    manifest_version: 3,
    name: "OpenTrace Extension",
    version: "1.0.1",

    // chrome_url_overrides: {
    //   newtab: "index.html"
    // },



    background: {
      "service_worker": "src/background/index.js",
      "type": "module"
    },

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
        js: ["src/background/index.js"],
        run_at: "document_end",
      }
    ]
  }
})