import { defineStore } from 'pinia';
import { handleError } from 'vue';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authStatus: null,
  }),

  getters: {
    isAuthenticated: (state) => state.authStatus === 'OK', 
  },

  actions: {
    setAuthStatus(status) {
      this.authStatus = status;
      localStorage.setItem('authStatus', status);  
    },

    loadAuthStatus() {
      const status = localStorage.getItem('authStatus');
      this.authStatus = status === 'OK' ? 'OK' : null;
    },

    clearAuthStatus() {
      this.authStatus = null;
      localStorage.removeItem('authStatus'); 
    },

  },
});