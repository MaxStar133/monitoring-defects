export class DetectionCharts {
  constructor() {
    this.charts = {
      length: null,
      width: null,
      area: null
    };
  }

  // Отрисовка всех трёх графиков
  renderCharts(detections, containerSelector = '.detections-graphs') {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js не загружен!');
      return;
    }

    const container = document.querySelector(containerSelector);

    if (!container) {
      console.error('Контейнер для графиков не найден');
      return;
    }

    container.innerHTML = '';

    if (!detections || detections.length === 0) {
      container.innerHTML = '<div class="no-data">Нет данных для графиков</div>';
      return;
    }

    this.createLengthChart(container, detections);
    this.createWidthChart(container, detections);
    this.createAreaChart(container, detections);
  }

  // График длины
  createLengthChart(container, detections) {
    const chartData = this.prepareChartData(detections, 'length');

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'graph-container';
    chartWrapper.innerHTML = `
      <div class="graph-header">
        <span class="graph-title">Динамика длины</span>
        <span class="graph-unit">мм</span>
      </div>
      <div class="graph-canvas-wrapper">
        <canvas class="detection-chart" id="chart-length"></canvas>
      </div>
    `;
    container.appendChild(chartWrapper);

    const canvas = chartWrapper.querySelector('#chart-length');
    const ctx = canvas.getContext('2d');

    if (this.charts.length) {
      this.charts.length.destroy();
    }

    try {
      this.charts.length = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Длина (мм)',
            data: chartData.values,
            borderColor: '#3B6ACF',
            backgroundColor: 'rgba(59, 106, 207, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#3B6ACF',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          }]
        },
        options: this.getChartOptions('Длина, мм')
      });
    } catch (error) {
      console.error('Ошибка создания графика длины:', error);
    }
  }

  // График ширины
  createWidthChart(container, detections) {
    const chartData = this.prepareChartData(detections, 'width');

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'graph-container';
    chartWrapper.innerHTML = `
      <div class="graph-header">
        <span class="graph-title">Динамика ширины</span>
        <span class="graph-unit">мм</span>
      </div>
      <div class="graph-canvas-wrapper">
        <canvas class="detection-chart" id="chart-width"></canvas>
      </div>
    `;
    container.appendChild(chartWrapper);

    const canvas = chartWrapper.querySelector('#chart-width');
    const ctx = canvas.getContext('2d');

    if (this.charts.width) {
      this.charts.width.destroy();
    }

    try {
      this.charts.width = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Ширина (мм)',
            data: chartData.values,
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#FF9800',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          }]
        },
        options: this.getChartOptions('Ширина, мм')
      });
    } catch (error) {
      console.error('Ошибка создания графика ширины:', error);
    }
  }

  // График площади
  createAreaChart(container, detections) {
    const chartData = this.prepareChartData(detections, 'area');

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'graph-container';
    chartWrapper.innerHTML = `
      <div class="graph-header">
        <span class="graph-title">Динамика площади</span>
        <span class="graph-unit">мм²</span>
      </div>
      <div class="graph-canvas-wrapper">
        <canvas class="detection-chart" id="chart-area"></canvas>
      </div>
    `;
    container.appendChild(chartWrapper);

    const canvas = chartWrapper.querySelector('#chart-area');
    const ctx = canvas.getContext('2d');

    if (this.charts.area) {
      this.charts.area.destroy();
    }

    try {
      this.charts.area = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Площадь (мм²)',
            data: chartData.values,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          }]
        },
        options: this.getChartOptions('Площадь, мм²')
      });
    } catch (error) {
      console.error('Ошибка создания графика площади:', error);
    }
  }

  // Подготовка данных для графика — сортировка по дате
  prepareChartData(detections, metric) {
    const sorted = [...detections].sort((a, b) => {
      const dateA = this.parseDate(a.date);
      const dateB = this.parseDate(b.date);
      return dateA - dateB;
    });

    const labels = sorted.map(d => {
      const [day, month] = d.date.split('.');
      return `${day}.${month}`;
    });

    const values = sorted.map(d => d.measurements[metric]);

    return { labels, values };
  }

  // Парсинг даты из формата ДД.ММ.ГГГГ
  parseDate(dateStr) {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  }

  // Общие опции для графиков
  getChartOptions(yAxisTitle) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 5,
          right: 10
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(33, 33, 33, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#3B6ACF',
          borderWidth: 1,
          padding: 8,
          titleFont: {
            size: 11,
            family: 'Inter'
          },
          bodyFont: {
            size: 11,
            family: 'Inter'
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: true
          },
          ticks: {
            maxRotation: 30,
            minRotation: 30,
            font: {
              size: 10,
              family: 'Inter',
              weight: '500'
            },
            color: '#666',
            maxTicksLimit: 8
          },
          title: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          position: 'left',
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: true
          },
          ticks: {
            font: {
              size: 10,
              family: 'Inter',
              weight: '500'
            },
            color: '#666',
            maxTicksLimit: 6,
            padding: 8,
            callback: function(value) {
              return value;
            }
          },
          title: {
            display: true,
            text: yAxisTitle,
            font: {
              size: 10,
              family: 'Inter',
              weight: 'normal'
            },
            color: '#666',
            padding: { top: 0, bottom: 0, left: 0, right: 0 }
          }
        }
      },
      elements: {
        line: {
          tension: 0.3,
          borderWidth: 2
        },
        point: {
          radius: 3,
          hoverRadius: 5,
          borderWidth: 1.5
        }
      }
    };
  }

  // Уничтожение всех графиков
  destroyCharts() {
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        this.charts[key].destroy();
        this.charts[key] = null;
      }
    });
  }
}
