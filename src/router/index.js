import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Registration from '@/views/Registration.vue';
import TotalAnalytics from '@/views/TotalAnalytics.vue';

const routes = [
  { path: '/cp/', redirect: '/cp/login' },
  { path: '/cp/login', name: 'Login', component: Login },
  { path: '/cp/registration', name: 'Registration', component: Registration },
  { path: '/cp/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/cp/total-analytics', name: 'TotalAnalytics', component: TotalAnalytics },
  { path: '/cp/product/:id', name: 'ProductDetails', component: () => import("@/views/product/[id].vue")},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;