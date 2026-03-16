import { BaseModal } from '../core/BaseModal.js';
import { IndexService } from '../services/IndexService.js';
import { getStatusClass } from '../services/DefectsService.js';

export class NotificationsPanel extends BaseModal {
  constructor() {
    super('notificationsPanel', {
      closeOnEsc: true,
      closeOnOverlay: true
    });

    this.button = document.querySelector('.header__notifications');
    this.panel = document.getElementById('notificationsPanel');

    if (!this.button || !this.panel) return;

    this.indexService = new IndexService();
    this.notifications = [];

    this.initNotifications();
  }

  initNotifications() {
    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    const clearBtn = this.panel.querySelector('.clear');
    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.clearNotifications();
      });
    }

    this.loadNotifications();
  }

  async loadNotifications() {
    this.notifications = await this.indexService.getNotifications();
    this.renderList();
    this.updateBadge();
  }

  renderList() {
    const list = this.panel.querySelector('.list');
    if (!list) return;

    if (this.notifications.length === 0) {
      list.innerHTML = '<div class="notifications-empty">Нет новых уведомлений</div>';
      return;
    }

    list.innerHTML = this.notifications.map(n => `
      <div class="card">
        <div class="left">
          <div class="id">${n.name}</div>
          <div class="notification-date">${n.date} <span>${n.time}</span></div>
        </div>
        <div class="center">
          <div class="status status--${getStatusClass(n.status)}">${n.status}</div>
          <div class="type">${n.type}</div>
        </div>
        <div class="arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#333333" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `).join('');
  }

  updateBadge() {
    const count = this.notifications.length;
    const text = count > 9 ? '+9' : count > 0 ? `+${count}` : '';

    const headerBadge = this.button.querySelector('.header__badge');
    if (headerBadge) {
      headerBadge.textContent = text;
      headerBadge.style.display = count === 0 ? 'none' : '';
    }

    const panelBadge = this.panel.querySelector('.badge');
    if (panelBadge) {
      panelBadge.textContent = text;
      panelBadge.style.display = count === 0 ? 'none' : '';
    }
  }

  clearNotifications() {
    this.notifications = [];
    this.renderList();
    this.updateBadge();
    this.indexService.clearAllNotifications();
  }

  open() {
    this.panel.classList.add("active");
  }

  close() {
    this.panel.classList.remove("active");
  }

  toggle() {
    if (this.panel.classList.contains("active")) {
      this.close();
    } else {
      this.open();
    }
  }
}
