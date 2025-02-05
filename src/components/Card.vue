<template>
  <div class="card">

    <div class="card__header">
      <div class="card__title" @click="$router.push({ name: 'ProductDetails', params: { id: id } })">
        <div class="card__icon">
          <SvgAndroid v-if="platform === 'android'" />
          <SvgIOS v-if="platform === 'ios'" />
          <SvgWeb v-if="platform === 'web'" />
        </div>
        <span class="card__sdk">{{ sdk }} SDK for {{ platform }}: </span>&nbsp;
        <span class="card__name"> {{ name }}</span>
      </div>
    </div>

    <div class="card__usage-block">
      <p>Sessions Used</p>
      <div class="card__usage-status" v-if="limit != 0">
        <span class="card__current" :class="usageColor">{{ current }}</span> / <span> {{ limit }}</span>
      </div>
      <div class="card__usage-status" v-else>
          Unlimited
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress" :style="{ width: progressPercentage + '%', backgroundColor: progressBarColor }"></div>
    </div>

    <div class="card__body">
      <div class="card__customer-id">
        CustomerID: 
        <div class="card__id-btn">
          <span class="card__id">{{ customerId }}</span>
          <button class="card__copy-btn" @click="copyToClipboard(customerId)">
            <SvgCopy v-if="!isCopied" />
            <SvgCheck v-if="isCopied" />
          </button>
        </div>
      </div>
    </div>

    <div class="card__footer">
      <div class="card__subscription-info">
        <span class="card__status" :class="statusColor">{{ status }} Subscription </span> 
        <span class="card__expire-date">(expiring {{ formattedEndDate }})</span>
      </div>
      <button class="card__details-button" @click="$router.push({ name: 'ProductDetails', params: { id: id } })">
        Stats
      </button>
    </div>
  </div>
</template>

<script>
import SvgCopy from '@/components/icons/SvgCopy.vue';
import SvgAndroid from '@/components/icons/SvgAndroid.vue';
import SvgIOS from '@/components/icons/SvgIOS.vue';
import SvgWeb from '@/components/icons/SvgWeb.vue';
import SvgCheck from '@/components/icons/SvgCheck.vue';

export default {
  components: {
    SvgCopy,
    SvgAndroid,
    SvgIOS,
    SvgWeb,
    SvgCheck
  },
  props: {
    id: { type: [Number, String], required: true },
    sdk: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    platform: { type: String, required: true },
    current: { type: Number, default: 0 },
    limit: { type: Number, required: true },
    customerId: { type: String, required: true },
    period: { type: Object, required: true },
    flag: { type: String, required: true }, 
  },
  data() {
    return {
      isCopied: false, 
    };
  },
  computed: {
    progressPercentage() {
      return Math.min((this.current / this.limit) * 100, 100).toFixed(2);
    },
    formattedEndDate() {
      const endDate = new Date(this.period.end);
      return endDate.toLocaleDateString();
    },
    progressBarColor() {
      switch (this.flag) {
        case 'green':
          return '#1EB13E';
        case 'yellow':
          return '#FFAC2F';
        case 'red':
          return '#F76A3E';
        default:
          return '#1EB13E';
      }
    },
    usageColor() {
      switch (this.flag) {
        case 'green':
          return 'status-green';
        case 'yellow':
          return 'status-yellow';
        case 'red':
          return 'status-red';
        default:
          return 'status-green';
      }
    },
    statusColor(){
      if (this.flag === 'red') {
        return 'status-red';
      }
    }
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.isCopied = true;
          setTimeout(() => {
            this.isCopied = false;
          }, 1000);
        })
    },
  },
};
</script>

<style lang="less">
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 25px;
  font-family: Rubik, sans-serif;
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

&__icon{
  width: 20px;
  height: 20px;
  color: #6F717C;
  margin-right: 5px;
}

&__sdk {
  color: #6F717C;
}

&__title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #333;
  cursor: pointer;
  text-transform: capitalize;
}

&__usage-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin-bottom: -20px;
}

&__usage-status {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}


&__body {
  display: flex; 
  flex-direction: column;
  gap: 8px;
  padding: 20px 10px 30px;
}

&__customer-id {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: black;
  gap: 8px;
}

&__id-btn{
  display: flex;
}

&__id {
  font-family: monospace;
  font-size: 14px;
  color: #6F717C;
}

&__copy-btn {
  align-self: center;
  width: 14px;
  height: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6F717C;
  margin-left: 10px;
}

&__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-transform: capitalize;
}

&__subscription-info {
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: black;
}

&__expire-date{
  color:#6F717C;
}

&__details-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 83px;
  height: 24px;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
  color: #3E50F7;
  border: solid 2px #3E50F7;
  margin-top: 4px;

  &:hover {
  color: white;
  background-color: #3E50F7;
  }
}

.progress {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.progress-bar {
  background: #f0f0f0;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
}

.status-green {
  color: #1EB13E;
}

.status-yellow {
  color: #FFAC2F;
}

.status-red {
  color: #F76A3E;
}

}
</style>
