import { Calendar } from '../modals/Calendar.js';
import { CalibrateModal } from '../modals/CalibrateModal.js';
import { NotificationsPanel } from '../modals/NotificationsPanel.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("Index.js loaded");
    
    // Инициализация календаря
    if (document.getElementById("date-trigger")) {
        const calendar = new Calendar();
        window.calendar = calendar;
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
});