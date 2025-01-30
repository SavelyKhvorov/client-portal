import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore.js';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Registration from '@/views/Registration.vue';
import TotalAnalytics from '@/views/TotalAnalytics.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';

const routes = [
  { path: '/cp/', redirect: '/cp/login' },
  { path: '/cp/login', name: 'Login', component: Login },
  { path: '/cp/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password/:token', name: 'ResetPassword', component: ResetPassword },
  { path: '/cp/registration', name: 'Registration', component: Registration},
  { path: '/cp/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/cp/total-analytics', name: 'TotalAnalytics', component: TotalAnalytics, meta: { requiresAuth: true }  },
  { path: '/cp/product/:id', name: 'ProductDetails', component: () => import("@/views/product/[id].vue"), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadAuthStatus();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/cp/login'); 
  } else {
    next(); 
  }
});

export default router;