<template>
  <div class="flex flex-col w-[500px] bg-red-500 p-10">
    <h1>OpenTrace</h1>

    <!-- 
      create a toggle button to turn on/off the extension
      
      show a message if the extension is turned off
     -->
    <button class="bg-blue-500 text-white p-2 rounded-md" @click="toggleExtension">
      {{ message }} {{ counter }}
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
  export default{
    data(){
      return{
        emails: [],
        phones: [],
        counter: 0,
      }
    },

    methods: {
      toggleExtension(){
        counter++;

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
  