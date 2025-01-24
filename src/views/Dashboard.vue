<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <div class="dashboard__header">
        <h1 class="dashboard__title">Subscribes</h1>
        <router-link to="/cp/total-analytics" class="dashboard__link">Go to Total Analytics</router-link>
      </div>
      <ListCards />
    </div>
  </div>
</template>

<script>
import ListCards from "@/components/ListCards.vue";

export default {
  components: {
    ListCards,
  },
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