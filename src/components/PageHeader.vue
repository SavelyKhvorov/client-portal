<template>
  <header class="page-header">
    <div class="page-header__container">

      <!-- <RouterLink to="/" class="page-header__logo-wrap">
        <SvgLogo />
      </RouterLink> -->

      <a href="/" class="page-header__logo-wrap">
        <SvgLogo />
      </a>

      
      <nav class="page-header__nav">
        <div class="page-header__nav-item">
          <!-- <RouterLink
            :to="{ path: tab.path, query: tab.query }"
            class="page-header__nav-link"
          >
            {{ tab.title }}
          </RouterLink> -->
          <a href="/contacts" class="page-header__nav-link">Contacts</a>

        </div>
      </nav>

      
      <div class="page-header__actions">
        <!-- <button @click="handleAuth" class="page-header__login-button">{{ isAuthenticated ? 'Sign Out' : 'Sign In' }}
        </button> -->
        <button class="page-header__trial-button" @click="toTrial">GET FREE TRIAL</button>
      </div>
    </div>
  </header>
</template>

<script>
import SvgLogo from '@/components/icons/SvgLogo.vue';
import { useAuthStore } from '@/stores/AuthStore.js';


export default {
  components: {
    SvgLogo,
  },
  data() {
    // return {
    //   tabs: [
    //     { title: 'Contact Us', path: '/contacts'},
    //   ],
    // };
  },
  methods: {
    toTrial(){
      this.$router.push('/cp/get-free-trial');
    },
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
  },
    mounted() {
    const authStore = useAuthStore();
    authStore.loadAuthStatus();
  }
};
</script>

<style lang="less">

.page-header {
  background-color: white;
  border-bottom: 1px solid #e5e5e5;
  // padding: 0.5rem 1rem;
  padding: 0.5rem 135px 0.5rem 135px ;
  display: flex;
  justify-content: center;


  &__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

&__logo-wrap {
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 226px;
  height: 38px;
}

&__nav {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-left: auto;
  padding: 0 20px 0;
}

&__nav-item {
  position: relative;
}

&__nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-family: @font1;

  &:hover{
    color: #007bff;
  }
}

&__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

&__login-button{
  padding: 10px 20px;
  border-radius: 5px;
  color: @blue2;
  border: solid 2px @blue2;
  &:hover{
    color: white;
    background-color: @blue2;
  }
}

&__trial-button {
  background-color: @blue2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover{
    background-color: #364dcf;
  }
}

}

</style>
