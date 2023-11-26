<template>
  <div class="flex justify-between px-3 py-2">
    <h1>Settings</h1>
  </div>
</template>

<script>
export default {

  data() {
    return {
      isExtEnabled: true,
      dataset: {
        domain: "linkedin.com",
        time: 1627776000000, //epoch time in milliseconds
        contacts: [
          {
            name: "John Doe",
            email: "john.doe@gmail.com",
            phone: "555-555-1234"
          },
          {
            name: "Jane Doe",
            email: "jane.doe@gmail.com",
            phone: "555-555-2345"
          }
        ],
      },
    }
  },

  methods: {
    toggleExtension() {
      //toggle chrome extension sync storage value
      this.isExtEnabled = !this.isExtEnabled;
      chrome.storage.sync.set({ isExtEnabled: this.isExtEnabled });

      chrome.runtime.sendMessage({ message: "toggleExtension" }, (response) => {
        console.log('response', response.message);
      });

    },


    mounted() {
      console.log("mounted");

      chrome.storage.sync.get("isExtEnabled", result => {
        console.log("Value currently is " + result.isExtEnabled);
        this.isExtEnabled = !!result.isExtEnabled;
      });
    }


  }
}
</script>

<style scoped></style>