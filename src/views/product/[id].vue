<template>
  <div class="prod">
    <div class="prod__container">


      <div class="breadscrumbs">
        <router-link to="/cp/dashboard" class="breadscrumbs__link">Products</router-link>
        <span>/</span>&nbsp;
        <router-link :to="{ name: 'ProductDetails', params: { id: productData?.id } }" class="breadscrumbs__link breadscrumbs__link--current"> {{ productData?.sdk }} SDK for {{ productData?.platform }}: {{ productData?.name }}</router-link>
      </div>

      <div class="prod__card">
        <div class="prod__header">
          <div class="prod__title">
            <div class="prod__icon">
              <SvgAndroid v-if="productData?.platform === 'android'" />
              <SvgIOS v-if="productData?.platform === 'ios'" />
              <SvgWeb v-if="productData?.platform === 'web'" />
            </div>
            <span class="card__sdk">{{ productData?.sdk }} SDK for {{ productData?.platform }}: </span>&nbsp;
            <span class="card__name"> {{ productData?.name }}</span>
          </div>
        </div>


        <div class="prod__usage-block">
          <p>Sessions Used</p>
          <div class="prod__usage-status" v-if="productData?.limit != 0">
            <span class="prod__current" :class="usageColor">{{ productData?.current }}</span> / <span> {{ productData?.limit }}</span>
          </div>
          <div class="prod__usage-status" v-else>
            Unlimited
          </div>
        </div>

        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage + '%', backgroundColor: progressBarColor }"></div>
        </div>

        <div class="prod__body">
          <div class="prod__customer-id">
            CustomerID: 
            <div class="prod__id-btn">
              <span class="prod__id">{{ productData?.customerId }}</span>
              <button class="prod__copy-btn" @click="copyToClipboard(productData?.customerId)">
                <SvgCopy v-if="!isCopied" />
                <SvgCheck v-if="isCopied" />
              </button>
            </div>
          </div>
        </div>

        <div class="prod__footer">
          <div class="prod__subscription-info">
            <span class="prod__status" :class="statusColor">{{ productData?.status }} Subscription </span> 
            <span class="prod__expire-date">{{ subscriptionPeriod }}</span>
          </div>
        </div>
      </div>

      <div class="prod__chart-block">
        <div class="prod__chart-container">
          <apexchart
            type="line"
            :options="chartStore.chartOptions"
            :series="chartStore.chartSeries"
            height="300"
          />
        </div>

        <div class="divider"></div>

        <div class="prod__controls">
          <vue-date-picker
            v-model:value="value1"
            :type="date"
            range
            :shortcuts="shortcuts"
            :popupVisible="true"
            :editable="true"
            @change="updateChart"
            class="prod__calendar"
          />
          <div class="prod__analytics-buttons">
            <!-- <button class="btn chart-button--cumulative" @click="switchChart('chart1')">Cumulative</button> -->
            <button class="btn chart-button" @click="switchChart('chart2')">Daily</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useChartStore } from '@/stores/ChartStore.js';
import { useAnalyticsStore } from '@/stores/AnalyticsStore.js';
import VueDatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import ApexCharts from 'vue3-apexcharts';
import descriptionData from '@/json/description.json';

import SvgCopy from '@/components/icons/SvgCopy.vue';
import SvgAndroid from '@/components/icons/SvgAndroid.vue';
import SvgIOS from '@/components/icons/SvgIOS.vue';
import SvgWeb from '@/components/icons/SvgWeb.vue';
import SvgCheck from '@/components/icons/SvgCheck.vue';


export default {
  components: {
    VueDatePicker,
    apexchart: ApexCharts,
    SvgCopy,
    SvgAndroid,
    SvgIOS,
    SvgWeb,
    SvgCheck
  },
  setup() {
    const chartStore = useChartStore();
    const AnalyticsStore = useAnalyticsStore();
    return {
      AnalyticsStore,
      chartStore,
      descriptionData,
    };
  },
  data() {
    return {
      productData: null,
      selectedPlatforms: [],
      selectedSdks: [],
      value1: [],
      isCopied: false, 
      currentChartType: 'chart2',
      shortcuts: [
      {
          text: 'Month',
          onClick: () => {
            const now = new Date();
            const start = new Date(now);
            start.setMonth(now.getMonth() - 1);
            this.value1 = [start, now];
            this.updateChart();
          },
        },
        {
          text: 'Half-year',
          onClick: () => {
            const now = new Date();
            const start = new Date(now);
            start.setMonth(now.getMonth() - 6);
            this.value1 = [start, now];
            this.updateChart();
          },
        },
        {
          text: 'Year',
          onClick: () => {
            const now = new Date();
            const start = new Date(now);
            start.setFullYear(now.getFullYear() - 1);
            this.value1 = [start, now];
            this.updateChart();
          },
        },
        {
          text: 'Subs month',
          onClick: () => {
            const platformKey = this.productData?.platform; 
            if (!platformKey) {
              console.error('No platform selected.');
              return;
            }

            const platformData = this.productData;
            if (!platformData || !platformData.period || !platformData.period.start) {
              console.error('No valid subscription period found for platform:', platformKey);
              return;
            }

            const subscriptionDate = new Date(platformData.period.start);
            const start = new Date(subscriptionDate);
            const end = new Date(subscriptionDate);
            end.setMonth(start.getMonth() + 1);
            this.value1 = [start, end];
            this.updateChart();
          },
        },
        {
          text: 'Subs year',
          onClick: () => {
            const platformKey = this.productData?.platform; 
            if (!platformKey) {
              console.error('No platform selected.');
              return;
            }

            const platformData = this.productData;
            if (!platformData || !platformData.period || !platformData.period.start) {
              console.error('No valid subscription period found for platform:', platformKey);
              return;
            }

            const subscriptionDate = new Date(platformData.period.start);
            const start = new Date(subscriptionDate);
            const end = new Date(subscriptionDate);
            end.setFullYear(start.getFullYear() + 1); 
            this.value1 = [start, end];
            this.updateChart();
          },
        },
      ],
    };
  },
  methods: {
    async fetchProductData() {
      const subscription_id = Number(this.$route.params.id);
      try {
        const response = await this.$axios.get(`/api/cp/stats/${subscription_id}`);
        if (response.data.result === 'OK') {
          this.productData = response.data.response;
        } else {
          console.error('Failed to fetch product data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    },

    getSubscriptionDescription(name) {
      const subscription = this.descriptionData.find((item) => item.name === name);
      return subscription ? subscription.description : "Description not available";
    },

    ToDashboard() {
      this.$router.push('/cp/dashboard');
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.isCopied = true;
          setTimeout(() => {
            this.isCopied = false;
          }, 1000);
        })
    },

    calculateEndDate() {
      if (!this.productData || !this.productData.platform) {
        console.error("Platform data is not available.");
        return "Unknown";
      }

      const remainingLimit = this.productData?.limit - this.productData?.current;

      const dailyUsage = Math.round(
        this.productData.data.reduce((sum, item) => sum + item.value, 0) / this.productData.data.length
      );

      if (dailyUsage === 0) {
        return "Unknown";
      }

      const daysToEnd = Math.ceil(remainingLimit / dailyUsage);

      const lastDate = new Date(this.productData.data[this.productData.data.length - 1].date);
      const predictedEndDate = new Date(lastDate);
      predictedEndDate.setDate(predictedEndDate.getDate() + daysToEnd);

      return predictedEndDate.toISOString().split("T")[0];
    },

    switchChart(type) {
      this.currentChartType = type;
      if (type === 'chart1') {
        const predictedEndDate = this.calculateEndDate();

        if (predictedEndDate !== "Unknown") {
          const subscriptionStartDate = new Date(this.productData.period.start);
          const endDate = new Date(this.productData.period.end);
          // endDate.setDate(endDate.getDate() + 10); 

          this.value1 = [subscriptionStartDate, endDate];
          this.updateChart(); 
        } else {
          console.error("Unable to calculate the predicted end date.");
        }
      } else if (type === 'chart2') {
        const now = new Date(this.productData.period.end);
        const start = new Date(this.productData.period.start);
        this.value1 = [start, now];
      }
      this.updateChart();
    },

    updateChart() {
      if (!this.productData) {
        console.warn('No product data available. Skipping chart update.');
        return;
      }

      const [startDate, endDate] = this.value1.map((date) => new Date(date));
      const combinedData = [];
      let annotations = [];

      if (this.currentChartType === 'chart1') {
        let totalLimit = 0;
        let totalCurrent = 0;

        const platformData = this.productData;

        if (!platformData) {
          console.warn('No platform data found');
          return;
        }

        const dataByDate = platformData.data.reduce((acc, item) => {
          acc[new Date(item.date).toISOString().split('T')[0]] = item.value;
          return acc;
        }, {});

        totalLimit += platformData.limit;
        totalCurrent += platformData.current;

        const filledData = [];
        let cumulativeSum = platformData.current;
        let dailyUsageSum = platformData.data.reduce((sum, item) => sum + item.value, 0);
        let dailyUsageAvg = Math.round(dailyUsageSum / platformData.data.length);

        let predictedEndDate = null;

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const value = dataByDate[dateStr] || 0;
          cumulativeSum += value;

          filledData.push({
            x: new Date(dateStr).getTime(),
            y: Math.round(cumulativeSum),
          });

          if (!predictedEndDate && cumulativeSum >= platformData.limit) {
            predictedEndDate = new Date(d);
          }

          if (!dataByDate[dateStr] && d > new Date(platformData.data[platformData.data.length - 1].date)) {
            cumulativeSum += dailyUsageAvg;
            filledData.push({
              x: new Date(d).getTime(),
              y: Math.round(cumulativeSum),
            });

            if (!predictedEndDate && cumulativeSum >= platformData.limit) {
              predictedEndDate = new Date(d);
            }
          }
        }

        combinedData.push({
          name: `${this.productData.sdk} - ${this.productData.platform}`,
          data: filledData,
        });

        if (predictedEndDate) {
          annotations.push({
            x: predictedEndDate.getTime(),
            strokeDashArray: 4,
            borderColor: '#FF4560',
            label: {
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: `End Date: ${predictedEndDate.toISOString().split('T')[0]}`,
            },
          });
        }

        this.chartStore.updateChart(combinedData, annotations);

      } else if (this.currentChartType === 'chart2') {
        const platform = this.productData.platform;
        if (!platform) {
          console.warn('No platform data found');
          return;
        }

        const platformData = this.productData;
        if (!platformData) {
          console.warn(`No platform data found for platform: ${platform}`);
          return;
        }

        const dataByDate = platformData.data.reduce((acc, item) => {
          const dateStr = new Date(item.date).toISOString().split('T')[0];
          acc[dateStr] = item.value;
          return acc;
        }, {});

        const filledData = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          filledData.push({
            x: new Date(dateStr).getTime(),
            y: dataByDate[dateStr] || 0,
          });
        }

        const chartData = [{
          name: `${this.productData.sdk} - ${platformData.platform}`,
          data: filledData,
        }];

        this.chartStore.updateChart(chartData, []);
      }
    }
  },

  computed: {
    subscriptionPeriod() {
      if (this.productData?.period) {
        const { start, end } = this.productData.period;
        return `${start.split(" ")[0]} ~ ${end.split(" ")[0]}`;
      }
      return "No subscription data";
    },
    progressPercentage() {
      return Math.min((this.productData?.current / this.productData?.limit) * 100, 100).toFixed(2);
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
  async mounted() {
    await this.fetchProductData(); 

    const subscriptionStartDate = new Date(this.productData.period.start);
    const endDate = new Date(this.productData.period.end);
    this.value1 = [subscriptionStartDate, endDate];
    this.updateChart(); 
  },
  watch: {
    value1: {
      handler() {
        this.updateChart();
      },
      deep: true
    },
  },
};
</script>

<style lang="less">
.prod {
  &__container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    background-color: #f9f9f9;
    font-family: @font1;
    color: #333;

    max-width: 1440px;
    margin: 0 auto;
    padding: 40px 135px;
  }

  &__controls {
    display: flex;
    justify-content: space-between; 
    align-items: center; 
    width: 100%;
  }

  &__chart-block{
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: @white;
    border-radius: 8px;
  }

  &__chart-container {
    width: 100%;
    align-self: center;
    padding: 20px;
  }

  &__calendar {
    align-self: center;
    width: 100%;
    max-width: 380px; 
    padding: 20px;
    // border-radius: 8px;
    // background-color: @white;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__label{
    font-weight: bold;
  }

  &__analytics-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  &__card {
    width: 50%;
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
  }

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
    text-transform: capitalize;
  }

  &__text{
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    color: #6F717C;
    text-align: justify;
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
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-transform: capitalize;
  }

  &__subscription-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: black;
  }

  &__expire-date{
    font-weight: 400;
    color:#6F717C;
  }
}

.platforms-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.back-button {
  width: 80px;
  height: 40px;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: normal;
  color: @blue2;
  background-color: @white;
  border: solid 2px @blue2;
  align-self: flex-start;
  margin-top: 12px;
  margin-right: 20px;
  transition: background-color 0.3s, color 0.3s; 
  &:hover {
    color: @white;
    background-color: @blue2;
  }
}

.chart-button{
  width: 100px;
  height: 40px;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: normal;
  color: @blue2;
  background-color: @white;
  border: solid 2px @blue2;
  align-self: flex-start;
  margin-top: 12px;
  margin-right: 20px;
  transition: background-color 0.3s, color 0.3s; 
  &:hover {
    color: @white;
    background-color: @blue2;
  }
}

.chart-button--cumulative{
  width: 140px;
  height: 40px;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: normal;
  color: @blue2;
  background-color: @white;
  border: solid 2px @blue2;
  align-self: flex-start;
  margin-top: 12px;
  margin-right: 20px;
  transition: background-color 0.3s, color 0.3s; 
  &:hover {
    color: @white;
    background-color: @blue2;
  }
}

input[type="checkbox"] {
  margin-right: 8px;
  accent-color: @blue;
  width: 18px;
  height: 18px;
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
.divider {
  width: 100%; 
  height: 1px; 
  background-color: #EAECF0;
  margin: 0; 
}

.breadscrumbs{
  &__link{
    display: inline;
    margin-right: 10px;
    color: @black;
    font-size: 16px;
    line-height: 22px;
    text-decoration: none;
    transition: color 0.2s;
    text-transform: capitalize;

    &:hover{
      color: @blue2;
    }

    &--current{
      color:#6F717C;
      &:hover{
      color: #6F717C;
    }
    }
  }
}

</style>
