import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null, 
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, 
  },

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token); 
    },

    loadToken() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
      }
    },

    clearToken() {
      this.token = null;
      localStorage.removeItem('token'); 
    },
  },
});