<template>
  <div class="card" :class="flagClass">
    <div class="card__header">
      <div class="card__title"  @click="$router.push({ name: 'ProductDetails', params: { id: id } })">
        
        {{ sdk }} - {{ platform }}: {{ name }}
      </div>
      <div class="card__metadata">
        CustomerID: {{ customerId }}
      </div>
    </div>
    <div class="card__details">
      <div class="card__usage" :class="usageClass">
        <span class="card__current">{{ current }}</span>/<span class="card__limit">{{ limit }}</span>
      </div>
      <div class="card__period">
        {{ period.start }} – {{ period.end }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    sdk: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    period: {
      type: Object,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      default: 0,
    },
    flag: {
      type: String,
      default: "green",
    },
    customerId: {
      type: String,
      required: false,
    },
  },
  computed: {
    flagClass() {
      return {
        "card--red": this.flag === "red",
        "card--yellow": this.flag === "yellow",
        "card--green": this.flag === "green",
      };
    },
    usageClass() {
    return {
      "usage--red": this.flag === "red",
      "usage--yellow": this.flag === "yellow",
      "usage--green": this.flag === "green",
    };
  },
},
};
</script>

<style lang="less">
.card {
  box-sizing: border-box;
  border: 2px solid @yellow;
  padding: 15px;
  border-radius: 5px;
  background-color: @white;
  font-family: @font1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 1.4;

  &--red {
    border-color: @orange;
  }
  &--yellow {
    border-color: @yellow;
  }
  &--green {
    border-color: @green;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__title {
    font-size: 16px;
    font-weight: bold;
    color: @black;
    cursor: pointer;
  }

  &__metadata {
    font-size: 12px;
    color: #666;
  }

  &__details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  &__usage {
    font-size: 18px;
    // color: @black;
    font-weight: bold;

      &--red {
        color: @orange;
      }
      &--yellow {
        color: @yellow;
      }
      &--green {
        color: @green;
      }
  }

  &__period {
    font-size: 12px;
    color: #333;
  }
}
</style>
