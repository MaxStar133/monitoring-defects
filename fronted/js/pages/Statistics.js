import { BaseModal } from '../core/BaseModal.js';
import { NotificationsPanel } from '../modals/NotificationsPanel.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("Statistics.js loaded");
    
    // ===== МОДАЛЬНОЕ ОКНО ТЕПЛОВОЙ КАРТЫ =====
    const heatmapModal = new BaseModal("heatmapModal", {
        closeOnEsc: true,
        closeOnOverlay: true
    });
    
    // Кнопки "Изменить параметры"
    const editButtons = document.querySelectorAll('.heatmap-edit-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            heatmapModal.open();
        });
    });
    
    // Кнопки в модальном окне
    const cancelBtn = document.querySelector('.btn-cancel');
    const confirmBtn = document.querySelector('.btn-confirm');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            console.log("Отмена");
            heatmapModal.close();
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            console.log("Параметры тепловой карты сохранены");
            heatmapModal.close();
        });
    }
    
    // Закрытие по клику на оверлей
    const modalOverlay = document.getElementById('heatmapModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                heatmapModal.close();
            }
        });
    }
    
    // ===== ПАНЕЛЬ УВЕДОМЛЕНИЙ =====
    if (document.getElementById("notificationsPanel")) {
        console.log("Инициализация панели уведомлений");
        const notifications = new NotificationsPanel();
    }
});