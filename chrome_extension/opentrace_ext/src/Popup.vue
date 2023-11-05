<template>
  <div class="flex flex-col w-[500px] bg-blue-500 p-10">
    <h1>OpenTrace</h1>
     
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
        phones: []
      }
    },
      mounted(){

        console.log('mounted');

        //add listener for messages from content script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          console.log('request', request);
          console.log('sender', sender);
          console.log('sendResponse', sendResponse);

          this.emails = request.emails;
          this.phones = request.phones;

          // send message to popup
          chrome.runtime.sendMessage(request, (response) => {
          console.log('response', response.message);
          });
        });

        


        // chrome.action.setBadgeText({
        //   text: getTabBadge(tabId),
        //   tabId: getTabId(),
        // });





    }
  }
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  