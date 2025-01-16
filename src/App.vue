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
  setup() {
    const authStore = useAuthStore();
    authStore.loadToken(); 
  },
}
</script>

<style>

</style>
