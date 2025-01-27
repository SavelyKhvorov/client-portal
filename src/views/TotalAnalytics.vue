<template>
  <div class="total">
    <div class="total__container">

      <div class="total__header">
        <h1 class="total__title">Total Analytics</h1>
        <button type="button" class="btn back-button" @click="ToDashboard">Back</button>
      </div>

    <div class="total__controls">
        <vue-date-picker
        v-model:value="value1"
        :type="date"
        range
        :shortcuts="shortcuts"
        :popupVisible="true"
        :editable="true"
        @change="updateChart"
        class="total__calendar"
      />

      <div class="total__checkbox-group">
        <div class="total__checkbox-block">
          <label class="total__label">Choose platforms:</label>
          <div class="platforms-grid">
            <label><input type="checkbox" value="web" v-model="selectedPlatforms" /> Web</label>
            <label><input type="checkbox" value="android" v-model="selectedPlatforms" /> Android</label>
            <label><input type="checkbox" value="ios" v-model="selectedPlatforms" /> iOS</label>
            <label><input type="checkbox" value="win" v-model="selectedPlatforms" /> Win</label>
            <label><input type="checkbox" value="mac" v-model="selectedPlatforms" /> Mac</label>
            <label><input type="checkbox" value="linux" v-model="selectedPlatforms" /> Linux</label>
          </div>
        </div>

        <div class="total__checkbox-block">
          <label class="total__label">Choose SDK:</label>
          <label><input type="checkbox" value="video" v-model="selectedSdks" /> Video</label>
          <label><input type="checkbox" value="audio" v-model="selectedSdks" /> Audio</label>
        </div>
      </div>
    </div>

    <div class="total__chart-container">
      <apexchart
        type="line"
        :options="AnalyticsStore.chartOptions"
        :series="AnalyticsStore.chartSeries"
        height="300"
      />
    </div>
  </div>
  </div>
</template>

<script>
import { useAnalyticsStore } from '@/stores/AnalyticsStore.js';
import VueDatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import ApexCharts from 'vue3-apexcharts';
// import jsonData from '@/json/data.json';

export default {
  components: { VueDatePicker, apexchart: ApexCharts },
  setup() {
    const AnalyticsStore = useAnalyticsStore();
    const jsonData = {};
    return {
      AnalyticsStore,
    };
  },
  data() {
    return {
      selectedPlatforms: ["web", "android", "ios", "win", "mac", "linux"],
      selectedSdks: ["video", "audio"],
      value1: [],
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
        // {
        //   text: 'Subs month',
        //   onClick: () => {
        //     const subscriptionDate = new Date(this.jsonData[0].platform.web.period.start);
        //     const start = new Date(subscriptionDate);
        //     const end = new Date(subscriptionDate);
        //     end.setMonth(start.getMonth() + 1); 
        //     this.value1 = [start, end];
        //     this.updateChart();
        //   },
        // },
        // {
        //   text: 'Subs year',
        //   onClick: () => {
        //     const subscriptionDate = new Date(this.jsonData[0].platform.web.period.start);
        //     const start = new Date(subscriptionDate);
        //     const end = new Date(subscriptionDate);
        //     end.setFullYear(start.getFullYear() + 1);  
        //     this.value1 = [start, end];
        //     this.updateChart();
        //   },
        // },
      ],
    };
  },
  methods: {
    ToDashboard(){
      this.$router.push('/cp/dashboard');
    },
    updateChart() {
      const [startDate, endDate] = this.value1.map((date) => new Date(date));
      const platforms = this.selectedPlatforms;
      const sdks = this.selectedSdks;

      const combinedData = [];

      this.jsonData.forEach((sdkData) => {
        if (!sdks.includes(sdkData.sdk)) return;

        platforms.forEach((platform) => {
          const platformData = sdkData.platform[platform];
          if (!platformData) return;

          const dataByDate = platformData.data.reduce((acc, item) => {
            acc[new Date(item.date).toISOString().split('T')[0]] = item.value;
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

          combinedData.push({
            name: `${sdkData.sdk} - ${platform}`,
            data: filledData,
          });
        });
      });

      const totalData = combinedData.flatMap((series) => series.data).reduce((acc, point) => {
        const existingPoint = acc.find((p) => p.x === point.x);
        if (existingPoint) {
          existingPoint.y += point.y; 
        } else {
          acc.push({ ...point });
        }
        return acc;
      }, []);

      this.AnalyticsStore.updateChart(combinedData, totalData);
    }
  },
  mounted() {
    const now = new Date();
    const start = new Date(now);
    start.setMonth(now.getMonth() - 1);
    this.value1 = [start, now];
    this.updateChart();
  },
  watch: {
    selectedPlatforms: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
    selectedSdks: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
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
.total {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    padding: 40px 80px 40px 80px;
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
    color: #333;
  }


  &__header {
    display: flex;
    justify-content: center; 
    align-items: center; 
    width: 100%;
    margin-bottom: 10px;
    margin-top: -20px;
  }

  &__title {
    font-size: 36px; 
    font-weight: bold;
    color: #1E2362;
    margin: 0;
    flex-grow: 1; 
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
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
    max-width: 1260px;
    align-self: center;
    margin-top: 20px;
    background-color: @white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &__calendar {
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
  align-self: flex-end;
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
