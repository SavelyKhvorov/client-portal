updateChart() {
  if (!this.productData) {
    console.warn('No product data available. Skipping chart update.');
    return;
  }

  const [startDate, endDate] = this.value1.map((date) => new Date(date));
  const combinedData = [];


  this.selectedPlatforms.forEach((platform) => {
    const platformData = this.productData.platform[platform];
    if (!platformData) {
      console.warn(`No platform data found for platform: ${platform}`);
      return;
    }

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
        name: `${this.productData.sdk} - ${platform}`,
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