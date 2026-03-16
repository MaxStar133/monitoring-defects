import { BaseModal } from '../core/BaseModal.js';

export class HeatmapModal extends BaseModal {
    constructor() {
        super('heatmapModal', {
            closeOnEsc: true,
            closeOnOverlay: true
        });

        this.openButtons = document.querySelectorAll('.heatmap-edit-btn');
        this.cancelBtn = document.querySelector('.btn-cancel');
        this.confirmBtn = document.querySelector('.btn-confirm');

        if (!this.modal) {
            console.error("Модальное окно heatmapModal не найдено");
            return;
        }

        this.initHeatmap();
    }

    initHeatmap() {
        this.openButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.close());
        }

        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', () => this.close());
        }
    }

    saveParameters() {
        const highValue = document.querySelector('.modal-row input').value;
        const mediumFrom = document.querySelectorAll('.modal-row--medium input')[0]?.value;
        const mediumTo = document.querySelectorAll('.modal-row--medium input')[1]?.value;
        const lowValue = document.querySelector('.modal-row--low input').value;

        return { high: highValue, medium: { from: mediumFrom, to: mediumTo }, low: lowValue };
    }
}
