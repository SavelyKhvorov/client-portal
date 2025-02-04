<template>
  <div class="app">
    <PageHeader />
    <router-view class="main-content" />
    <PageFooter class="page-footer" />
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue';
import PageFooter from '@/components/PageFooter.vue';
import { useAuthStore } from '@/stores/AuthStore.js';

export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter
  },
  created(){
    const authStore = useAuthStore();
    authStore.loadAuthStatus();
  }
}
</script>

<style>
  .app{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .main-content {
    flex: 1 0 auto;
    margin: 0 auto;
  }

  .page-footer {
    flex-shrink: 0;
  }
</style>
