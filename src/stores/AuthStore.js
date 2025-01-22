import { defineStore } from 'pinia';

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
      if (status) {
        this.authStatus = status;
      }
    },

    clearAuthStatus() {
      this.authStatus = null;
      localStorage.removeItem('authStatus'); 
    },
  },
});