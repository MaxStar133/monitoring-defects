import { BaseModal } from "../core/BaseModal.js";
import { NotificationsPanel } from "../modals/NotificationsPanel.js";
import { StatisticsService } from "../services/StatisticsService.js";

class StatisticsPage {

  constructor() {
    console.log("StatisticsPage constructor");

    this.statisticsService = new StatisticsService();

    this.init();
  }

  async init() {
    console.log("StatisticsPage initialized");

    Chart.register(ChartDataLabels);

    this.initModals();
    this.initNotifications();

    await this.loadStatistics();
  }

  // ===== МОДАЛЬНЫЕ ОКНА =====
  initModals() {

    this.heatmapModal = new BaseModal("heatmapModal", {
      closeOnEsc: true,
      closeOnOverlay: true
    });

    const editButtons = document.querySelectorAll(".heatmap-edit-btn");

    editButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.heatmapModal.open();
      });
    });

    const cancelBtn = document.querySelector(".btn-cancel");
    const confirmBtn = document.querySelector(".btn-confirm");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        console.log("Отмена");
        this.heatmapModal.close();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        console.log("Параметры тепловой карты сохранены");
        this.heatmapModal.close();
      });
    }

    const overlay = document.getElementById("heatmapModal");

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.heatmapModal.close();
        }
      });
    }
  }

  // ===== УВЕДОМЛЕНИЯ =====
  initNotifications() {

    if (document.getElementById("notificationsPanel")) {
      console.log("Инициализация панели уведомлений");
      this.notifications = new NotificationsPanel();
    }

  }

  // ===== ЗАГРУЗКА СТАТИСТИКИ =====
  async loadStatistics() {

    console.log("loadStatistics started");

    const statistics = await this.statisticsService.getStatistics();

    const dates = Object.keys(statistics).sort((a, b) => {
      const [d1, m1, y1] = a.split(".");
      const [d2, m2, y2] = b.split(".");
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });

    const cracks = [];
    const delamination = [];
    const rivets = [];

    dates.forEach(date => {
      cracks.push(statistics[date].cracks);
      delamination.push(statistics[date].delamination);
      rivets.push(statistics[date].rivets);
    });

    this.buildLineChart(dates, cracks, delamination, rivets);
    this.buildPieChart(cracks, delamination, rivets);
    this.updateStatsGrid(cracks, delamination, rivets);
  }

  // ===== ЛИНЕЙНЫЙ ГРАФИК =====
  buildLineChart(dates, cracks, delamination, rivets) {

    const ctx = document.getElementById("defectsLineChart");

    new Chart(ctx, {
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
          legend: {
            position: "bottom"
          }
        }
      }
    });
  }

  // ===== КРУГОВАЯ ДИАГРАММА =====
  buildPieChart(cracks, delamination, rivets) {

    const totalCracks = cracks.reduce((a, b) => a + b, 0);
    const totalDelamination = delamination.reduce((a, b) => a + b, 0);
    const totalRivets = rivets.reduce((a, b) => a + b, 0);

    const total = totalCracks + totalDelamination + totalRivets;

    if (total === 0) return;

    const ctx = document.getElementById("defectsPieChart");

    new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [{
          data: [
            Math.round((totalCracks / total) * 100),
            Math.round((totalDelamination / total) * 100),
            Math.round((totalRivets / total) * 100)
          ],
          backgroundColor: [
            "#ff0000",
            "#FFD700",
            "#008000"
          ]
        }]
      },
      options: {
        plugins: {

          legend: {
            display: false
          },

          datalabels: {
            color: "#000000",
            font: {
              size: 20
            },
            formatter: value => value + "%"
          }
        }
      }
    });
  }

  // ===== ОБНОВЛЕНИЕ КАРТОЧЕК =====
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

// ===== ЗАПУСК СТРАНИЦЫ =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded Statistics");
  window.statisticsPage = new StatisticsPage();
});