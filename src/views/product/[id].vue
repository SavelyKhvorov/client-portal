<template>
  <div class="prod">
    <div class="prod__container">
    <!-- <button type="button" class="btn back-button" @click="ToDashboard">Back</button> -->

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

      <div class="prod__checkbox-group">
        <div class="prod__checkbox-block">
          <label class="prod__label">Choose platforms:</label>
          <div class="platforms-grid">
            <label><input type="checkbox" value="web" v-model="selectedPlatforms" /> Web</label>
            <label><input type="checkbox" value="android" v-model="selectedPlatforms" /> Android</label>
            <label><input type="checkbox" value="ios" v-model="selectedPlatforms" /> iOS</label>
            <label><input type="checkbox" value="win" v-model="selectedPlatforms" /> Win</label>
            <label><input type="checkbox" value="mac" v-model="selectedPlatforms" /> Mac</label>
            <label><input type="checkbox" value="linux" v-model="selectedPlatforms" /> Linux</label>
          </div>
        </div>

        <div class="prod__checkbox-block">
          <label class="prod__label">Choose SDK:</label>
          <label><input type="checkbox" value="video" v-model="selectedSdks" /> Video</label>
          <label><input type="checkbox" value="audio" v-model="selectedSdks" /> Audio</label>
        </div>
      </div>
    </div>

    <div class="prod__chart-container">
      <apexchart
        type="line"
        :options="chartStore.chartOptions"
        :series="chartStore.chartSeries"
        height="300"
      />
    </div>
  </div>
  </div>
</template>

<script>
import { useChartStore } from '@/stores/ChartStore.js';
import VueDatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import ApexCharts from 'vue3-apexcharts';
import jsonData from '@/json/data.json';

export default {
  components: { VueDatePicker, apexchart: ApexCharts },
  setup() {
    const chartStore = useChartStore();
    return {
      chartStore,
      jsonData,
    };
  },
  data() {
    return {
      selectedPlatforms: ["web", "android"],
      selectedSdks: ["video", "audio"],
      value1: [],
      shortcuts: [
        {
          text: 'Today',
          onClick: () => {
            const today = new Date();
            this.value1 = [today, today];
            this.updateChart();
          },
        },
        {
          text: 'This week',
          onClick: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 7);
            this.value1 = [start, end];
            this.updateChart();
          },
        },
        {
          text: 'This month',
          onClick: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            this.value1 = [start, end];
            this.updateChart();
          },
        },
      ],
    };
  },
  methods: {
    ToDashboard(){
      this.$router.push('/dashboard');
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

          const filteredData = platformData.data.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
          });

          combinedData.push({
            name: `${sdkData.sdk} - ${platform}`, 
            data: filteredData.map((item) => ({
              x: new Date(item.date).getTime(), 
              y: item.value, 
            })),
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

      this.chartStore.updateChart(combinedData, totalData);
    }
  },
  mounted() {
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
      deep: true,
    },
  },
};
</script>

<style lang="less">
.prod {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    padding: 40px 80px 40px 80px;
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
    color: #333;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 600px; 
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
  color: @white;
  background-color: @blue2;
  border: solid 2px @blue2;
  margin-bottom: 20px; 
  &:hover {
    color: @blue2;
    background-color: @white;
  }
}

input[type="checkbox"] {
  margin-right: 8px;
  accent-color: @blue;
  width: 18px;
  height: 18px;
}

</style>
