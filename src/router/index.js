import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Registration from '@/views/Registration.vue';
import TotalAnalytics from '@/views/TotalAnalytics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/registration', name: 'Registration', component: Registration },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/total-analytics', name: 'TotalAnalytics', component: TotalAnalytics },
  { path: '/product/:id', name: 'ProductDetails', component: () => import("@/views/product/[id].vue")},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;