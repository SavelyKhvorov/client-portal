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
            :platform="item.platform"
            :name="item.name"
            :period="item.period"
            :limit="item.limit"
            :current="item.current"
            :flag="item.flag"
            :customerId="item.customerId"
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
// import productsList from "@/json/newproducts.json";

export default {
  components: {
    Card,
  },
  data() {
    return {
      productsList: [],
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await this.$axios.get("/api/cp/products");
        if (response.data.result === "OK") {
          this.productsList = response.data.response; 
        }
      } catch (error) {
        console.error("Error loading subscriptions:", error);
      }
    },
  },
  created() {
    this.fetchProducts(); 
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
