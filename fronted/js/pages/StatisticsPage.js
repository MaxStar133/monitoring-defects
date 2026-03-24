import { BaseModal } from "../core/BaseModal.js";
import { NotificationsPanel } from "../modals/NotificationsPanel.js";
import { StatisticsService } from "../services/StatisticsService.js";
import { StatsRangeCalendar } from "../modals/StatsRangeCalendar.js";
import { BeltHeatmap } from "../charts/BeltHeatmap.js";
import { BeltSchemaMarkers } from "../charts/BeltSchemaMarkers.js";

class StatisticsPage {

  constructor() {
    this.statisticsService = new StatisticsService();
    this.lineChart = null;
    this.pieChart = null;
    this.beltHeatmap    = new BeltHeatmap('belt-heatmap');
    this.schemaMarkers  = new BeltSchemaMarkers('belt-schema-wrap');

    this.init();
  }

  async init() {
    Chart.register(ChartDataLabels);

    this.initModals();
    this.initNotifications();
    this.initCalendar();
    this.initRefreshButton();

    await this.loadStatistics();
  }

  initModals() {
    this.heatmapModal = new BaseModal("heatmapModal", {
      closeOnEsc: true,
      closeOnOverlay: true
    });

    document.querySelectorAll(".heatmap-edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.heatmapModal.open();
      });
    });

    const cancelBtn = document.querySelector(".btn-cancel");
    const confirmBtn = document.querySelector(".btn-confirm");

    if (cancelBtn) cancelBtn.addEventListener("click", () => this.heatmapModal.close());
    if (confirmBtn) confirmBtn.addEventListener("click", () => this.heatmapModal.close());

    const overlay = document.getElementById("heatmapModal");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.heatmapModal.close();
      });
    }
  }

  initNotifications() {
    if (document.getElementById("notificationsPanel")) {
      this.notifications = new NotificationsPanel({
        onCardClick: (defectName) => {
          window.location.href = `defects.html?defect=${encodeURIComponent(defectName)}`;
        }
      });
    }
  }

  initCalendar() {
    this.rangeCalendar = new StatsRangeCalendar((start, end) => {
      this.updateDateDisplay(start, end);
      this.loadStatisticsForRange(start, end);
    });

    this.updateDateDisplay(this.rangeCalendar.startDate, this.rangeCalendar.endDate);
  }

  updateDateDisplay(start, end) {
    const startEl = document.getElementById("stats-date-start");
    const endEl = document.getElementById("stats-date-end");
    if (startEl && start) startEl.textContent = this.formatDate(start);
    if (endEl && end) endEl.textContent = this.formatDate(end);
  }

  formatDate(date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}.${m}.${date.getFullYear()}`;
  }

  initRefreshButton() {
    const btn = document.querySelector(".stats-btn--update");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const start = this.rangeCalendar?.startDate ?? null;
      const end = this.rangeCalendar?.endDate ?? null;
      this.loadStatisticsForRange(start, end);
    });
  }

  showLoading() {
    document.querySelectorAll(".stat-card").forEach(c => c.classList.add("loading"));
    document.querySelectorAll(".frame-image").forEach(c => c.classList.add("loading"));

    const btn = document.querySelector(".stats-btn--update");
    if (btn) btn.classList.add("loading");
  }

  hideLoading() {
    document.querySelectorAll(".stat-card").forEach(c => c.classList.remove("loading"));
    document.querySelectorAll(".frame-image").forEach(c => c.classList.remove("loading"));

    const btn = document.querySelector(".stats-btn--update");
    if (btn) btn.classList.remove("loading");
  }

  async loadStatistics() {
    const start = this.rangeCalendar?.startDate ?? null;
    const end = this.rangeCalendar?.endDate ?? null;
    await this.loadStatisticsForRange(start, end);
  }

  async loadStatisticsForRange(startDate, endDate) {
    this.showLoading();

    let statistics;

    if (startDate && endDate) {
      statistics = await this.statisticsService.getStatisticsForRange(startDate, endDate);
    } else {
      statistics = await this.statisticsService.getStatistics();
    }

    const dates = Object.keys(statistics).sort((a, b) => {
      const [d1, m1, y1] = a.split(".");
      const [d2, m2, y2] = b.split(".");
      return new Date(+y1, +m1 - 1, +d1) - new Date(+y2, +m2 - 1, +d2);
    });

    const cracks = [];
    const delamination = [];
    const rivets = [];

    dates.forEach(date => {
      cracks.push(statistics[date].cracks);
      delamination.push(statistics[date].delamination);
      rivets.push(statistics[date].rivets);
    });

    this.hideLoading();

    this.buildLineChart(dates, cracks, delamination, rivets);
    this.buildPieChart(cracks, delamination, rivets);
    this.updateStatsGrid(cracks, delamination, rivets);

    const heatmapData = await this.statisticsService.getHeatmapData();
    this.beltHeatmap.render(heatmapData);

    const schemaData = await this.statisticsService.getSchemaData();
    this.schemaMarkers.render(schemaData);
  }

  _setEmpty(canvasId, isEmpty) {
    const canvas    = document.getElementById(canvasId);
    const container = canvas?.closest('.frame-image');
    if (!container) return;
    if (isEmpty) {
      container.classList.add('frame-image--empty');
      container.setAttribute('data-empty', 'Нет данных за выбранный период');
      if (canvas) canvas.style.display = 'none';
    } else {
      container.classList.remove('frame-image--empty');
      container.removeAttribute('data-empty');
      if (canvas) canvas.style.display = '';
    }
  }

  buildLineChart(dates, cracks, delamination, rivets) {
    const ctx = document.getElementById("defectsLineChart");

    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }

    if (dates.length === 0) {
      this._setEmpty('defectsLineChart', true);
      return;
    }
    this._setEmpty('defectsLineChart', false);

    this.lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Трещина",
            data: cracks,
            borderColor: "#ff0000",
            backgroundColor: "#ff0000",
            tension: 0
          },
          {
            label: "Отслоение",
            data: delamination,
            borderColor: "#FFD700",
            backgroundColor: "#FFD700",
            tension: 0
          },
          {
            label: "Заклепка",
            data: rivets,
            borderColor: "#008000",
            backgroundColor: "#008000",
            tension: 0
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          datalabels: { display: false }
        }
      }
    });
  }

  buildPieChart(cracks, delamination, rivets) {
    const totalCracks = cracks.reduce((a, b) => a + b, 0);
    const totalDelamination = delamination.reduce((a, b) => a + b, 0);
    const totalRivets = rivets.reduce((a, b) => a + b, 0);
    const total = totalCracks + totalDelamination + totalRivets;

    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }

    if (total === 0) {
      this._setEmpty('defectsPieChart', true);
      return;
    }
    this._setEmpty('defectsPieChart', false);

    const ctx = document.getElementById("defectsPieChart");

    this.pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [{
          data: [
            Math.round((totalCracks / total) * 100),
            Math.round((totalDelamination / total) * 100),
            Math.round((totalRivets / total) * 100)
          ],
          backgroundColor: ["#ff0000", "#FFD700", "#008000"]
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          datalabels: {
            color: "#000000",
            font: { size: 20 },
            formatter: value => value + "%"
          }
        }
      }
    });
  }

  updateStatsGrid(cracks, delamination, rivets) {
    const totalCracks = cracks.reduce((a, b) => a + b, 0);
    const totalDelamination = delamination.reduce((a, b) => a + b, 0);
    const totalRivets = rivets.reduce((a, b) => a + b, 0);
    const total = totalCracks + totalDelamination + totalRivets;

    document.querySelector(".stat-card--total .stat-card__value").textContent = total;
    document.querySelector(".stat-card--cracks .stat-card__value").textContent = totalCracks;
    document.querySelector(".stat-card--delamination .stat-card__value").textContent = totalDelamination;
    document.querySelector(".stat-card--rivets .stat-card__value").textContent = totalRivets;
  }

}

document.addEventListener("DOMContentLoaded", () => {
  window.statisticsPage = new StatisticsPage();
});
