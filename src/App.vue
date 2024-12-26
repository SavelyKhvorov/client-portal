<template>
  <div>
    <PageHeader />
    <router-view />
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue';


export default {
  name: 'App',
  components: {
    PageHeader,
  },
}
</script>

<style>

</style>
