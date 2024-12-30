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
      const filteredData = this.jsonData[0].platform.web.data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });

      const data = filteredData.map((item) => item.value);
      const categories = filteredData.map((item) => new Date(item.date).getTime());

      this.chartStore.updateChart(data, categories);
    },
  },
  mounted() {
    this.updateChart();
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
