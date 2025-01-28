<template>
  <div class="prod">
    <div class="prod__container">

      <div class="prod__header">
        <div class="prod__card prod__card--highlight">
          <div class="prod__card-head">
            <h1 class="prod__title">SDK: {{ productData?.sdk }}</h1>
            <p class="prod__status">{{ productData?.status }}</p>
          </div>
          
          <p class="prod__platform">Platform: {{ productData?.platform }} </p>
          <h2>{{ productData?.name }}</h2>
          <p>
            {{ getSubscriptionDescription(productData?.name) }}
          </p>
          <p><strong>{{ subscriptionPeriod }}</strong></p>
          <p>
            <strong>
              {{ productData?.limit === 0 ? 'Unlimited' : `${productData?.current} / ${productData?.limit}` }}
            </strong>
          </p>
        </div>
        <button type="button" class="btn back-button" @click="ToDashboard">Back</button>
      </div>

      <!-- <div class="prod__cards">
        <div class="prod__card">
          <p class="prod__text">
            {{ getSdkDescription(productData?.sdk) }}
          </p>
        </div>

        <div class="prod__card prod__card--highlight">
          <h1 class="prod__title">SDK: {{ productData?.sdk }}</h1>
          <p class="prod__platform">Platform: {{ productData?.platform }} </p>
          <h2>{{ productData?.name }}</h2>
          <p>
            {{ getSubscriptionDescription(productData?.name) }}
          </p>
          <p><strong>{{ subscriptionPeriod }}</strong></p>
          <p><strong>{{ productData?.current }} / {{ productData?.limit }}</strong></p>
        </div>
      </div> -->

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

      <div class="prod__chart-container">
        <apexchart
          type="line"
          :options="chartStore.chartOptions"
          :series="chartStore.chartSeries"
          height="400"
        />
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

export default {
  components: { VueDatePicker, apexchart: ApexCharts },
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
    // getSdkDescription(sdkName) {
    //   const sdk = this.descriptionData.find((item) => item.sdk === sdkName);
    //   return sdk ? sdk.description : "Description not available";
    // },
    getSubscriptionDescription(name) {
      const subscription = this.descriptionData.find((item) => item.name === name);
      return subscription ? subscription.description : "Description not available";
    },
    ToDashboard() {
      this.$router.push('/cp/dashboard');
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
    }
  },

  async mounted() {
    await this.fetchProductData(); 

    const subscriptionStartDate = new Date(this.productData.period.start);
    const endDate = new Date(this.productData.period.end);
    this.value1 = [subscriptionStartDate, endDate];
    this.updateChart(); 

    // const predictedEndDate = this.calculateEndDate();

    // if (predictedEndDate !== "Unknown") {
    //   const subscriptionStartDate = new Date(this.productData.period.start);
    //   const endDate = new Date(predictedEndDate);
    //   endDate.setDate(endDate.getDate() + 10); 

    //   this.value1 = [subscriptionStartDate, endDate];
    //   this.updateChart(); 
    // } else {
    //   console.error("Unable to calculate the predicted end date.");
    // }

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
    gap: 20px;
    padding: 40px 80px 40px 80px;
    background-color: #f9f9f9;
    font-family: @font1;
    color: #333;
  }


  &__header {
    display: flex;
    justify-content: space-between; 
    align-items: flex-start; 
    width: 100%;
    margin-bottom: 10px;
    margin-top: -20px;
  }

  &__title-container {
    display: flex;
    flex-direction: column; 
  }


  &__title {
    font-size: 36px; 
    font-weight: bold;
    color: #1E2362;
    margin: 0;
    flex-grow: 1; 
  }

  &__platform {
    font-size: 18px;
    color: #666;
    margin: 0;
  }

  &__status{
    font-size: 25px;
    font-weight: bold;
    color: @blue;
    text-transform: uppercase;
    align-self: center;
    margin: 0;
  }

  &__cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  &__card {
    flex: 1;
    min-width: 300px; 
    max-width: 600px;  
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
    box-sizing: border-box; 
    word-wrap: break-word; 
  }

  &__card--highlight {
    background-color: #f0f4ff;
    border-color: #a7b3ff;
  }

  &__card-head{
    display: flex;
    width: 100%;
  }

  &__controls {
    display: flex;
    justify-content: space-between; 
    align-items: flex-start; 
    width: 100%;

  }

  &__header {
    display: flex;
    justify-content: space-between; 
    align-items: flex-start; 
    width: 100%;
    margin-bottom: 10px;
    margin-top: -20px;
  }


  &__checkbox-group {
    display: flex;
    justify-content: flex-start; 
    gap: 80px; 
  }

  &__checkbox-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px 0px 10px;
  }

  &__chart-container {
    width: 100%;
    align-self: center;
    margin-top: 20px;
    background-color: @white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__calendar {
    align-self: center;
    width: 100%;
    max-width: 380px; 
    padding: 10px;
    border-radius: 8px;
    background-color: @white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__label{
    font-weight: bold;
  }

  &__analytics-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
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

</style>
