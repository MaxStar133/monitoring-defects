import { Calendar } from '../modals/Calendar.js';
import { CalibrateModal } from '../modals/CalibrateModal.js';
import { NotificationsPanel } from '../modals/NotificationsPanel.js';
import { IndexService } from '../services/IndexService.js';

class IndexPage {
  constructor() {
    this.indexService = new IndexService();
    this.init();
  }

  async init() {
    if (document.getElementById("date-trigger")) {
      const calendar = new Calendar({
        onDateSelected: (_date, dateStr) => {
          this.loadStats(dateStr);
        }
      });
      window.calendar = calendar;

      this.loadStats(this.formatDate(new Date()));
    }

    if (document.getElementById("calibrate-btn")) {
      const calibrateModal = new CalibrateModal();
      window.calibrateModal = calibrateModal;
    }

    if (document.getElementById("notificationsPanel")) {
      new NotificationsPanel({
        onCardClick: (defectName) => {
          window.location.href = `pages/defects.html?defect=${encodeURIComponent(defectName)}`;
        }
      });
    }
  }

  formatDate(date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}.${m}.${date.getFullYear()}`;
  }

  async loadStats(dateStr) {
    document.querySelectorAll(".stat-card").forEach(c => c.classList.add("loading"));

    const data = await this.indexService.getStatsForDate(dateStr);

    document.querySelectorAll(".stat-card").forEach(c => c.classList.remove("loading"));

    document.querySelector(".stat-card--total .stat-card__value").textContent = data.total;
    document.querySelector(".stat-card--cracks .stat-card__value").textContent = data.cracks;
    document.querySelector(".stat-card--delamination .stat-card__value").textContent = data.delamination;
    document.querySelector(".stat-card--rivets .stat-card__value").textContent = data.rivets;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.indexPage = new IndexPage();
});
