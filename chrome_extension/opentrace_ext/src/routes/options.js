import { createRouter, createWebHistory } from 'vue-router';
import Timeline from '@/options/pages/timeline.vue';
import Settings from '@/options/pages/settings.vue';

const routes = [
  { path: '/', component: null },
  { path: '/options.html', component: Timeline },

  { path: '/timeline', component: Timeline },
  { path: '/timeline', component: Timeline },

  { path: '/settings', component: Settings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
