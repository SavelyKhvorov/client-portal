import { defineStore } from 'pinia';

export const useChartStore = defineStore('chart', {
  state: () => ({
    chartSeries: [],
    chartOptions: {
      chart: {
        type: 'line',
        toolbar: { show: false },
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM yyyy',
            day: 'dd MMM',
            hour: 'HH:mm',
          },
        },
      },
      yaxis: {
        title: { text: 'Value' },
      },
      title: {
        text: 'Динамика данных',
        align: 'left',
      },
      tooltip: {
        x: { format: 'dd MMM yyyy' },
      },
    },
  }),
  actions: {
    updateChart(data, categories) {
      this.chartSeries = [
        {
          name: 'Web Data',
          data,
        },
      ];
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories,
        },
      };
    },
  },
});
