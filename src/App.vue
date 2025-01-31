<template>
  <div>
    <PageHeader />
    <router-view />
    <PageFooter />
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

</style>
