<template>
<div>
  <div class="bg-blue-500 text-white p-3">
    OpenTrace Options
  </div>
  <!-- 
    make a thin line to show if it is on (green) or off (red)
   -->

  <div :class="{
    'bg-green-500': isExtActive,
    'bg-red-500': !isExtActive 
   }" class="px-3">
    <div>OpenTrace is {{ isExtActive ? 'on' : 'off' }}</div>
    <div>
      <button class="bg-blue-500 text-white p-2 rounded-md" @click="toggleExtension">
        {{ isExtActive ? 'Turn Off' : 'Turn On' }}
      </button>
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
      isExtActive: true,
    }
  },

  methods: {
    toggleExtension(){
      //send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {message: "toggleExtension"}, (response) => {
          console.log('response', response.message);
        });
      }); 
    }
  },
    mounted(){
       console.log('mounted');
  }
}


</script>

<style scoped>
 
     
</style>
