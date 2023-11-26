<template>
  <div>
    <nav class="bg-gray-800 p-4">
      <div class="container flex items-center justify-between flex-wrap">
        <h1 class="text-white">OpenTrace</h1>
        <div>
          <router-link to="/timeline" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Timeline</router-link>
          <router-link to="/settings" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Settings</router-link>
          <!-- 
            <router-link to="/sandbox" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"> Sandbox </router-link>
          <router-link to="/activity-log" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Activity Log</router-link>
          <router-link to="/help-feedback" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Help/Feedback</router-link> 
        -->
        </div>
      </div>
    </nav>

    <div :class="{ 'bg-green-500': isExtEnabled, 'bg-red-500': !isExtEnabled, }" class="flex justify-between px-3 py-2">
      <div class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="toggleExtension">
        OpenTrace is {{ isExtEnabled ? "on" : "off" }}
      </div>
    </div>

    <main>
      <router-view />
    </main>

  </div>
</template>

<script>

export default {
  data() {
    return {
      isExtEnabled: true
    };
  },

  methods: {
    toggleExtension() {
      //toggle the isExtEnabled value and set it in storage
      this.isExtEnabled = !this.isExtEnabled;



      //send message to background.js to toggle the extension

      chrome.runtime.sendMessage({
        type: "toggleExtension",
        isExtEnabled: this.isExtEnabled
      }, response => {
        console.log("response", response);
      });


      console.log("isExtEnabled", this.isExtEnabled);
    }
  },
  mounted() {
    console.log("mounted");

    chrome.storage.sync.get(["isExtEnabled"], result => {
      console.log("Value currently is " + result.isExtEnabled);
      this.isExtEnabled = !!result.isExtEnabled;
    });
  },
  components: {
  }
};
</script>

<style scoped></style>
