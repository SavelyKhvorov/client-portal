<template>
  <div class="dashboard">
    <div class="dashboard__container">
      <h1 class="dashboard__title">Subscribes</h1>
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
    .container();
    padding: 0 100px 0 100px;
  }

  &__title {
    margin: 25px 0px 0px 0px;
    color: @black;
  }
}
</style>