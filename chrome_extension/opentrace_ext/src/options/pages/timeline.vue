<template>
  <!-- make this outer div a flex container, and white bg -->

  <div class="flex flex-col bg-gray-600 p-10">
    <h1>Timeline</h1>
    <div>
      <!-- todo: make a D3 timeline of each domain visited it should have a filter for filtering by domain name -->

      <div class="flex justify-between">
        message: {{ message }}
      </div>

    </div>


  </div>
</template>

<script setup>
import { ref } from "vue";

const message = ref("Hello Vue 3!");

setTimeout(() => {
  message.value = "Hello Vue 3 from setTimeout!";
  // Add code here
}, 2000); 
</script>

<style scoped></style>