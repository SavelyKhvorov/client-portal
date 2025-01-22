<template>
  <div>
    <PageHeader />
    <router-view />
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue';
import { useAuthStore } from '@/stores/AuthStore.js';

export default {
  name: 'App',
  components: {
    PageHeader,
  },
  created(){
    const authStore = useAuthStore();
    authStore.loadAuthStatus();
  }
}
</script>

<style>

</style>
