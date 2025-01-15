import { defineStore } from 'pinia';

export const useAnalyticsStore = defineStore('analytics-chart', {
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
          format: 'dd MMM yyyy',
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM yyyy',
            day: 'dd MMM yyyy'
          },
        },
      },
      yaxis: {
        title: { text: 'Sessions per day' },
      },
      title: {
        text: 'Analytics',
        align: 'left',
      },
      tooltip: {
        x: { format: 'dd MMM yyyy' },
      },
    },
  }),
  actions: {
    updateChart(seriesData, totalData) {
      this.chartSeries = [
        ...seriesData,
        {
          name: "Total",
          data: totalData
        }
      ];
    
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: seriesData.flatMap((series) => series.data.map((d) => d.x))
        },
      };
    },
  },

});