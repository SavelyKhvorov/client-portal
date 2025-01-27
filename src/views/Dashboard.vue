<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__header">
        <h1 class="dashboard__title">Subscribes</h1>
        <!-- <router-link to="/cp/total-analytics" class="dashboard__link">Go to Total Analytics</router-link> -->
        <button @click="handleAuth" class="page-header__login-button">{{ isAuthenticated ? 'Sign Out' : 'Sign In' }}
        </button>
      </div>
      <ListCards />
    </div>
  </div>
</template>

<script>
import ListCards from "@/components/ListCards.vue";
import { useAuthStore } from '@/stores/AuthStore.js';

export default {
  components: {
    ListCards,
  },
  methods: {
    handleAuth() {
    const authStore = useAuthStore();

    if (this.isAuthenticated) {
      console.log("User is authenticated, signing out...");
      authStore.clearAuthStatus(); 
      this.$router.push('/cp/login');  
    } else {
      console.log("User is not authenticated, signing in...");
      this.$router.push('/cp/login');
      }
    }
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    }
  }
};
</script>

<style lang="less">
.dashboard {
  &__container {
    padding: 0 100px 0 100px;
  }

  &__title {
    margin: 25px 0px 0px 0px;
    color: @black;
  }

  &__header {
    display: flex;
    justify-content: space-between; 
    align-items: center; 
    
  }

  &__link {
    text-decoration: none; 
    // margin-right: 10px;
    color: @blue2; 
    font-size: 16px;
    font-weight: 500; 
    padding: 6px 14px; 
    border: 2px solid @blue2; 
    border-radius: 5px; 
    transition: background-color 0.3s, color 0.3s; 
    &:hover {
      background-color: @blue2;
      color: @white; 
    }
  }
}
</style>