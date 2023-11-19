<template>
  <div class="flex justify-between px-3 py-2">

    <h1>Settings</h1>

    <div>
      <div class="flex justify-between">
        <div>Enable OpenTrace</div>
        <div>
          <input type="checkbox" v-model="isExtEnabled" @change="toggleExtension" />
        </div>
      </div>
    </div>


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

      chrome.storage.sync.set({ isExtEnabled: this.isExtEnabled });

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
  watch: {
    isExtEnabled: function (val) {
      console.log("isExtEnabled changed", val);
      chrome.storage.sync.set({ isExtEnabled: val });
    }
  }
}
</script>

<style scoped></style>