<template>
<div>
  <div class="bg-blue-500 text-white p-3 flex justify-between">
    <div>
      OpenTrace Options  
    </div>

    <button class="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-700" @click="toggleExtension">
        {{ isExtEnabled ? 'Turn Off' : 'Turn On' }}
      </button>
  </div>
  <!-- 
    make a thin line to show if it is on (green) or off (red)
   -->

  <div :class="{
    'bg-green-500': isExtEnabled,
    'bg-red-500': !isExtEnabled 
   }" class="flex justify-between px-3 py-2">
    
    <div>
      OpenTrace is {{ isExtEnabled ? 'on' : 'off' }}
    </div>
     
  </div>


    
  </div>
  <div class="p-3">
  
    <h1>OpenTrace Options</h1>
 
    <!-- 
      create a toggle button to turn on/off the extension
      show a message if the extension is turned off
     -->  
   

    <div class="  text-white p-3">
    <ul>
      <li v-for="site in [
        'https://www.google.com',
        'https://www.facebook.com',
        'https://www.twitter.com',
      ]" :key="site">{{ site }}</li>
    </ul>
    
  </div>

</div> 
</template>

<script>

export default{
  data(){
    return{
      isExtEnabled: true,
    }
  },

  methods: {
    toggleExtension(){
      //toggle the isExtEnabled value and set it in storage
      this.isExtEnabled = !this.isExtEnabled;
      
      chrome.storage.sync.set({isExtEnabled: this.isExtEnabled});
      console.log('isExtEnabled', chrome.storage.sync.get(['isExtEnabled']));
    }
  },
    mounted(){
       console.log('mounted');

         
        chrome.storage.sync.get(['isExtEnabled'], (result) => {
          console.log('Value currently is ' + result.isExtEnabled);
          this.isExtEnabled = !!result.isExtEnabled;
        });
  }
}


</script>

<style scoped>
 
     
</style>
