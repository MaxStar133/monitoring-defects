import { Calendar } from '../modals/Calendar.js';
import { CalibrateModal } from '../modals/CalibrateModal.js';
import { NotificationsPanel } from '../modals/NotificationsPanel.js';
import { IndexService } from '../services/IndexService.js';

class IndexPage {
  constructor() {
    console.log("IndexPage initialized");
    
    this.indexService = new IndexService();
    this.currentDate = new Date();
    
    this.init();
  }
  
  init() {
    // Инициализация календаря
    if (document.getElementById("date-trigger")) {
      this.calendar = new Calendar((date) => {
        this.onDateSelected(date);
      });
      window.calendar = this.calendar;
    }
    
    // Инициализация модального окна калибровки
    if (document.getElementById("calibrate-btn")) {
      const calibrateModal = new CalibrateModal();
      window.calibrateModal = calibrateModal;
    }
    
    // Инициализация панели уведомлений
    if (document.getElementById("notificationsPanel")) {
      const notifications = new NotificationsPanel();
      window.notifications = notifications;
    }
    
    // Загружаем статистику для сегодняшней даты
    this.loadStatsForDate(this.formatDate(this.currentDate));
    
    // Загружаем уведомления
    this.loadNotifications();
  }
  
  // Форматирование даты в ДД.ММ.ГГГГ
  formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  
  // Обработчик выбора даты в календаре
  onDateSelected(date) {
    console.log("Выбрана дата:", date);
    this.loadStatsForDate(date);
  }
  
  // Загрузка статистики для указанной даты
  async loadStatsForDate(date) {
    try {
      console.log(`Загрузка статистики за ${date}...`);
      
      // Добавляем класс загрузки к карточкам
      document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.add('loading');
      });
      
      const stats = await this.indexService.getStatsForDate(date);
      
      // Обновляем карточки статистики
      this.updateStatsCards(stats);
      
      console.log("Статистика загружена:", stats);
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      // Убираем класс загрузки
      document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.remove('loading');
      });
    }
  }
  
  // Загрузка уведомлений
  async loadNotifications() {
    try {
      const notifications = await this.indexService.getNotifications();
      console.log("Уведомления загружены:", notifications);
      
      // Обновляем счетчик уведомлений
      this.updateNotificationBadge(notifications.length);
      
      // Здесь можно обновить список уведомлений в панели
      // this.renderNotifications(notifications);
      
    } catch (error) {
      console.error("Ошибка загрузки уведомлений:", error);
    }
  }
  
  // Обновление счетчика уведомлений
  updateNotificationBadge(count) {
    const badge = document.querySelector('.header__badge');
    if (badge) {
      badge.textContent = `+${count}`;
    }
  }
  
  // Обновление значений в карточках статистики
  updateStatsCards(stats) {
    const totalCard = document.querySelector('.stat-card--total .stat-card__value');
    const cracksCard = document.querySelector('.stat-card--cracks .stat-card__value');
    const delaminationCard = document.querySelector('.stat-card--delamination .stat-card__value');
    const rivetsCard = document.querySelector('.stat-card--rivets .stat-card__value');
    
    if (totalCard) totalCard.textContent = stats.total;
    if (cracksCard) cracksCard.textContent = stats.cracks;
    if (delaminationCard) delaminationCard.textContent = stats.delamination;
    if (rivetsCard) rivetsCard.textContent = stats.rivets;
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  window.indexPage = new IndexPage();
});