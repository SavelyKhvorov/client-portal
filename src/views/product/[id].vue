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
      <apexchart
            :key="chartKey"
            type="line"
            :options="chartOptions"
            :series="chartSeries"
            height="350"
          />
    </div>



    <p>Выбранный диапазон: {{ value1 }}</p>
  </div>
</template>

<script>
import VueDatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import ApexCharts from 'vue3-apexcharts';
import jsonData from '@/json/data.json';

export default {
  components: { VueDatePicker, apexchart: ApexCharts },
  data() {
    return {
      chartKey: 0,
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
      rawData: jsonData,
      chartSeries: [
        ],
        chartOptions: {
          chart: {
            type: "line",
            toolbar: { show: false },
          },
          xaxis: {
            type: "datetime",
            categories: [
              new Date("2024-01-01").getTime(),
              new Date("2024-01-02").getTime(),
              new Date("2024-01-03").getTime(),
              new Date("2024-01-04").getTime(),
              new Date("2024-01-05").getTime(),
            ],
          },
        },
      chartOptions: {
        chart: {
          type: "line",
          toolbar: { show: false },
        },
        xaxis: {
          type: "datetime", 
          categories: [], 
          labels: {
            datetimeFormatter: {
              year: "yyyy",
              month: "MMM yyyy",
              day: "dd MMM",
              hour: "HH:mm",
            },
          },
        },
        yaxis: {
          title: { text: "Value" },
        },
        title: {
          text: "Динамика данных",
          align: "left",
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
        },
      },
    };
  },
  methods: {
    updateChart() {
        if (!this.value1 || !this.value1[0] || !this.value1[1]) {
          console.log("Диапазон не выбран.");
          return;
        }

        const [startDate, endDate] = this.value1.map((date) => new Date(date));

        const filteredData = this.rawData[0].platform.web.data.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });

        this.chartSeries = [
          {
            name: "Web Data",
            data: filteredData.map((item) => item.value),
          },
        ];

        const newCategories = filteredData.map((item) =>
          new Date(item.date).getTime()
        );

        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: newCategories,
          },
        };

        this.chartKey += 1; 
      },
    },
  mounted() {
    console.log("Raw data:", this.rawData);
    this.updateChart(); 
  },
};
</script>

<style>
</style>
