<template>
  <main class="list-cards">
    <div class="list-cards__container">
      <div class="list-cards__wrapper">
        <div class="list-cards__list">
          <TransitionGroup>
            <Card
            v-for="item in productsList"
            :key="item.id"
            :id="item.id"
            :sdk="item.sdk"
            :platform="Object.keys(item.platform)[0]"
            :name="item.platform[Object.keys(item.platform)[0]].name"
            :period="item.platform[Object.keys(item.platform)[0]].period"
            :limit="item.platform[Object.keys(item.platform)[0]].limit"
            :current="item.platform[Object.keys(item.platform)[0]].current"
            :flag="item.platform[Object.keys(item.platform)[0]].flag"
            :customerId="item.platform[Object.keys(item.platform)[0]].customerId"
            class="list-cards__card"
          />
          </TransitionGroup>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Card from "@/components/Card.vue";
import productsList from "@/json/products.json";

export default {
  components: {
    Card,
  },
  data() {
    return {
      productsList,
    };
  },
};
</script>

<style lang="less">
.list-cards {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }

  &__wrapper {
    position: relative;
    padding-top: 5px;
    width: 100%;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
  }

  &__card {
    margin-bottom: 10px;
    width: 100%;
  }
}
</style>
