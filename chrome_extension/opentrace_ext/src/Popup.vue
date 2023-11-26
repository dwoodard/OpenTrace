<template>
  <div class="flex flex-col w-[500px] p-10" :class="{ 'bg-red-500': !isExtEnabled, 'bg-green-500': isExtEnabled }">
    <div class="bg-blue-500 text-white p-2 rounded-md" @click="openOptions">
      open this chrome ext option pages
    </div>

    <h1>OpenTrace</h1>


    <button class="bg-blue-500 text-white p-2 rounded-md" @click="toggleExtension">
      toggle extension {{ isExtEnabled ? "on" : "off" }}
    </button>

    <div v-if="emails.length">
      <h2>Emails Found ({{ emails.length }}):</h2>
      <ul>
        <li v-for="email in emails" :key="email">{{ email }}</li>
      </ul>
    </div>

    <div v-if="phones.length">
      <h2>Phones Found ({{ phones.length }}):</h2>
      <ul>
        <li v-for="phone in phones" :key="phone">{{ phone }}</li>
      </ul>
    </div>

  </div>
</template> 
  
<script>
export default {
  data() {
    return {
      emails: [],
      phones: [],
      isExtEnabled: null

    }
  },

  methods: {
    toggleExtension() {
      this.isExtEnabled = !this.isExtEnabled;
      //send message to the service worker to toggle the extension
      chrome.runtime.sendMessage({
        type: "toggleExtension",
        isExtEnabled: this.isExtEnabled
      }, response => {
        console.log("response", response);
      });

    },
    openOptions() {
      chrome.runtime.openOptionsPage();
    }
  },
  mounted() {
    console.log('mounted');

    //isExtEnabled
    chrome.storage.sync.get(["isExtEnabled"], result => {
      this.isExtEnabled = !!result.isExtEnabled;
    });

  }
}
</script>
  
<style scoped></style>
  