import { BaseModal } from '../core/BaseModal.js';

export class NotificationsPanel extends BaseModal {
    constructor() {
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
        this.button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });


        this.loadNotifications();
    }

    loadNotifications() {
    }

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