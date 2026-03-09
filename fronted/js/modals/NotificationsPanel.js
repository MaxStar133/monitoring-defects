import { BaseModal } from '../core/BaseModal.js';

export class NotificationsPanel extends BaseModal {
    constructor() {
        // Вызываем конструктор BaseModal с ID панели
        super('notificationsPanel', {
            closeOnEsc: true,
            closeOnOverlay: true
        });
        
        this.button = document.querySelector('.header__notifications');
        this.panel = document.getElementById('notificationsPanel');
        this.overlay = this.panel?.closest('.notifications-overlay');
        
        if (!this.button || !this.panel) return;
        
        this.initNotifications();
    }

    initNotifications() {
        // Открытие/закрытие по кнопке
        this.button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Специфичная логика для панели уведомлений
        // Например, загрузка уведомлений
        this.loadNotifications();
    }

    loadNotifications() {
        // Загрузка уведомлений с сервера или из базы
        console.log("Загрузка уведомлений...");
    }

    // Переопределяем методы если нужно
    open() {
        super.open();
        if (this.overlay) {
            this.overlay.classList.add("active");
        }
    }

    close() {
        super.close();
        if (this.overlay) {
            this.overlay.classList.remove("active");
        }
    }
}