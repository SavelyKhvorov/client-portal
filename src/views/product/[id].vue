<template>
  <div>
    <vue-date-picker
      v-model:value="value1"
      :type="date"
      range
      :shortcuts="shortcuts"
      :popupVisible="true"
      :editable="true"
      @change="updateChart"
    />

    <div>
      <label>Выберите платформы:</label>
      <div>
        <label><input type="checkbox" value="web" v-model="selectedPlatforms" /> Web</label>
        <label><input type="checkbox" value="android" v-model="selectedPlatforms" /> Android</label>
      </div>

      <label>Выберите SDK:</label>
      <div>
        <label><input type="checkbox" value="video" v-model="selectedSdks" /> Video</label>
        <label><input type="checkbox" value="audio" v-model="selectedSdks" /> Audio</label>
      </div>
    </div>

    <div class="chart-container">
      <apexchart
        type="line"
        :options="chartStore.chartOptions"
        :series="chartStore.chartSeries"
        height="300"
      />
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
          text: 'Сегодня',
          onClick: () => {
            const today = new Date();
            this.value1 = [today, today];
            this.updateChart();
          },
        },
        {
          text: 'Эта неделя',
          onClick: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 7);
            this.value1 = [start, end];
            this.updateChart();
          },
        },
        {
          text: 'Этот месяц',
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
  updateChart() {
    if (!this.value1 || !this.value1[0] || !this.value1[1]) {
      console.log('Диапазон не выбран.');
      return;
    }

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
.chart-container {
  width: 1200px;
  height: 300px;
  margin: 0 auto;
}
</style>