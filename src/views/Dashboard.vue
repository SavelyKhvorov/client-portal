<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__header">

        <h1 class="dashboard__title">Products</h1>
        <!-- <router-link to="/cp/total-analytics" class="dashboard__link">Go to Total Analytics</router-link> -->

        <div class="dashboard__btns">
          <button @click="toTrial" class="trial-button">
          <SvgPlus class="plus-icon"/>
          Request new trial
        </button>

        <button @click="handleAuth" class="logout-button">
          <SvgLogout class="logout-icon"/>
          Logout
        </button>
        </div>

      </div>
      <ListCards />
    </div>
  </div>
</template>

<script>
import ListCards from "@/components/ListCards.vue";
import { useAuthStore } from '@/stores/AuthStore.js';
import SvgLogout from "@/components/icons/SvgLogout.vue";
import SvgPlus from "@/components/icons/SvgPlus.vue";

export default {
  components: {
    ListCards,
    SvgLogout,
    SvgPlus
  },
  methods: {
    toTrial(){
      this.$router.push('/cp/get-free-trial');
    },

    handleAuth() {
      const authStore = useAuthStore();

      if (authStore.isAuthenticated) {
        authStore.clearAuthStatus();
        this.$router.push('/cp/login');
      } else {
        console.log("User is not authenticated, signing in...");
        this.$router.push('/cp/login');
      }
    },
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
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 135px;
  }

  &__title {
    margin: 25px 0px 0px 0px;
    color: @black;
    font-weight: 500;
  }

  &__header {
    display: flex;
    justify-content: space-between; 
    align-items: center; 
  }

  &__btns{
    display: flex;
    gap: 16px;
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

  .logout-button {
    display: flex;
    align-items: center; 
    gap: 8px;
    padding: 10px 20px;
    border-radius: 5px;
    color: @blue2;
    font-weight: 500;
    border: solid 2px #F9F9F9;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
      border: solid 2px @blue2;
    }
  }

  .logout-icon {
    width: 16px;
    height: 16px;
    color: @blue2; 
    transition: color 0.3s;
  }

  .trial-button {
    display: flex;
    align-items: center; 
    gap: 8px;
    padding: 10px 20px;
    border-radius: 5px;
    color: @blue2;
    font-weight: 500;
    border: solid 2px #F9F9F9;
    transition: background-color 0.3s, color 0.3s;
    border: solid 2px @blue2;

    &:hover {
      background-color: @blue2;
      color: @white;

      .plus-icon { 
        color: @white; 
      }
    }
  }

  .plus-icon {
    width: 16px;
    height: 16px;
    color: inherit;
  }


}
</style>