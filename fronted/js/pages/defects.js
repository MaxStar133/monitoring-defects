import { PositionedModal } from '../core/PositionedModal.js';
import { Dropdown } from '../core/Dropdown.js';
import { BaseModal } from '../core/BaseModal.js';
import { ImageManager } from '../modals/ImageManager.js';
import { NotificationsPanel } from '../modals/NotificationsPanel.js';
import { FilterCalendar } from '../modals/FilterCalendar.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("Defects.js loaded");
    
    const filterCalendar = new FilterCalendar();
    
    // Фильтры на странице дефектов
    if (document.getElementById("filter-btn")) {
        const filterModal = new PositionedModal("filter-modal", "filter-btn", ".filter-modal", 400, 500);
        
        const originalOpen = filterModal.open;
        filterModal.open = function() {
            originalOpen.call(this);
            setTimeout(() => {
                filterCalendar.initFilterButtons();
            }, 50);
        };
    }
    
    // Фильтры в обнаружениях
    if (document.getElementById("detections-filter-btn")) {
        const detectionsFilterModal = new PositionedModal(
            "detections-filter-modal", 
            "detections-filter-btn", 
            ".detections-filter-modal", 
            400, 
            400
        );
        
        const originalOpen = detectionsFilterModal.open;
        detectionsFilterModal.open = function() {
            originalOpen.call(this);
            setTimeout(() => {
                filterCalendar.initDetectionsFilterButtons();
            }, 50);
        };
    }
    
    // Выпадающие списки
    if (document.getElementById("status-select")) {
        new Dropdown("status-select", "selected-status", ".filter-dropdown__item");
    }
    
    if (document.getElementById("detections-status-select")) {
        new Dropdown(
            "detections-status-select", 
            "detections-selected-status", 
            ".detections-filter-dropdown__item"
        );
    }
    
    // Модальное окно параметров
    const paramsModal = new BaseModal("params-modal", {
        closeOnEsc: true,
        closeOnOverlay: true
    });
    
    const paramsBtn = document.getElementById("params-btn");
    if (paramsBtn && paramsModal.modal) {
        paramsBtn.addEventListener("click", () => paramsModal.open());
    }
    
    // ===== МОДАЛЬНОЕ ОКНО ИСТОРИИ ОБНАРУЖЕНИЙ =====
    const detectionsModal = new BaseModal("detections-modal", {
        closeOnEsc: true,
        closeOnOverlay: true
    });
    
    // Кнопки "Подробнее"
    const detailBtns = document.querySelectorAll(".table-row__action-btn");
    detailBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const defectId = btn.dataset.id;
            detectionsModal.modal.dataset.currentDefect = defectId;
            
            console.log("Открыт дефект:", defectId);
            
            detectionsModal.open();
        });
    });
    
    // ===== МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ =====
    const fixModal = new BaseModal("fix-confirm-modal", {
        closeOnEsc: true,
        closeOnOverlay: true
    });
    
    const fixBtn = document.querySelector(".detections-header__btn");
    if (fixBtn) {
        fixBtn.addEventListener("click", (e) => {
            e.preventDefault();
            fixModal.open();
        });
    }
    
    const cancelBtn = document.querySelector(".alert-modal__btn--cancel");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => fixModal.close());
    }
    
    const confirmBtn = document.querySelector(".alert-modal__btn--confirm");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            console.log("Дефект исправлен");
            fixModal.close();
        });
    }
    
    // Управление изображениями в таблице (для модального окна)
    if (document.querySelector(".detections-table-row__link")) {
        new ImageManager();
    }
    
    // Панель уведомлений
    if (document.getElementById("notificationsPanel")) {
        const notifications = new NotificationsPanel();
    }
});