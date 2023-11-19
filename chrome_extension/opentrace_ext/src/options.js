import { createApp } from 'vue'
import './style.css'

import router from '@/routes/options'; // Import the router configuration

import Options from './options/index.vue'

import { createRouter, createWebHistory } from 'vue-router';

console.log('options.js loaded');

// createApp(Options).mount('#app')

const app = createApp(Options);
app.use(router); // Use the router
app.mount('#app'); // Mount the app