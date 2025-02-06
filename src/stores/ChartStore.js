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
          format: 'dd MMM yyyy',
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM yyyy',
            day: 'dd MMM yyyy'
          },
        },
      },
      yaxis: {
        title: {
          text: 'Analytics',
          style: {
            fontSize: '14px', 
            fontHeight: '18px',
            fontWeight: '500', 
            color: '#6F717C',
            fontFamily: 'Rubik, sans-serif',
          },
        },
      },
    },
  }),
  actions: {
    updateChart(seriesData, annotations=[]) {
      this.chartSeries = [
        ...seriesData,
      ];
    
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: seriesData.flatMap((series) => series.data.map((d) => d.x))
        },
        annotations: {
          xaxis:  annotations
        },
      };
    },


  },

});