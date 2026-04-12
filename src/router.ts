import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory('/portal/'),
  routes: [
    { path: '/', name: 'Home', component: () => import('./views/DailyPortal.vue') },
    { path: '/day-starter', name: 'Day Starter', component: () => import('./views/DayStarter.vue') },
    { path: '/checklist', name: 'Checklist', component: () => import('./views/ActivityChecklist.vue') },
    { path: '/comprehension/:type', name: 'Comprehension', component: () => import('./views/Comprehension.vue') },
    { path: '/fitness', name: 'Fitness', component: () => import('./views/FitnessLog.vue') },
    { path: '/day-finisher', name: 'Day Finisher', component: () => import('./views/DayFinisher.vue') },
    { path: '/history', name: 'History', component: () => import('./views/History.vue') },
  ],
});

export { router };
