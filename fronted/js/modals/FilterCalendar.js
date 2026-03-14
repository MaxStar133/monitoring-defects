import { RangeCalendar } from './RangeCalendar.js';
import { ModalPosition } from '../core/PositionedModal.js';

export class FilterCalendar {
    constructor() {
        this.activeDateRange = {
            start: null,
            end: null,
            source: null
        };

        // Сохранённые диапазоны по источнику
        this.savedRanges = {
            'filter': { startDate: null, endDate: null },
            'detections-filter': { startDate: null, endDate: null }
        };

        this.rangeCalendar = new RangeCalendar('dummy-trigger', (range) => {
            if (this.activeDateRange.source) {
                this.updateDateDisplay(this.activeDateRange.source, range.start, range.end);
                // Сохраняем выбранный диапазон
                this.savedRanges[this.activeDateRange.source] = {
                    startDate: this.rangeCalendar.startDate,
                    endDate: this.rangeCalendar.endDate
                };
            }
        });

        this.positionManager = null;

        this.boundOpenFilterCalendar = this.openFilterCalendar.bind(this);
        this.boundOpenDetectionsFilterCalendar = this.openDetectionsFilterCalendar.bind(this);
    }

    updateDateDisplay(source, startDate, endDate) {
        if (source === 'filter') {
            const filterStartText = document.querySelector('#filter-modal .date-picker:first-child .date-picker__text');
            const filterEndText = document.querySelector('#filter-modal .date-picker:last-child .date-picker__text');

            if (filterStartText && startDate) filterStartText.textContent = startDate;
            if (filterEndText && endDate) filterEndText.textContent = endDate;
        }

        if (source === 'detections-filter') {
            const detectionsStartText = document.querySelector('#detections-filter-modal .date-picker:first-child .date-picker__text');
            const detectionsEndText = document.querySelector('#detections-filter-modal .date-picker:last-child .date-picker__text');

            if (detectionsStartText && startDate) detectionsStartText.textContent = startDate;
            if (detectionsEndText && endDate) detectionsEndText.textContent = endDate;
        }
    }

    clearRange(source) {
        if (this.savedRanges[source]) {
            this.savedRanges[source] = { startDate: null, endDate: null };
        }
    }

    _openCalendar(button) {
        const calendarContent = document.querySelector('.calendar-modal__container');
        if (!calendarContent) return;

        if (!this.positionManager) {
            this.positionManager = new ModalPosition(button, calendarContent, 356, 399);
        } else {
            this.positionManager.trigger = button;
        }

        this.positionManager.updatePosition();

        // Восстанавливаем ранее выбранный диапазон для этого источника
        const saved = this.savedRanges[this.activeDateRange.source];
        if (saved && saved.startDate && saved.endDate) {
            this.rangeCalendar.setRange(saved.startDate, saved.endDate);
        } else {
            this.rangeCalendar.resetRange();
        }

        this.rangeCalendar.open();
    }

    openFilterCalendar(event) {
        event.preventDefault();
        event.stopPropagation();
        this.activeDateRange.source = 'filter';
        this._openCalendar(event.currentTarget);
    }

    openDetectionsFilterCalendar(event) {
        event.preventDefault();
        event.stopPropagation();
        this.activeDateRange.source = 'detections-filter';
        this._openCalendar(event.currentTarget);
    }

    initFilterButtons() {
        const filterDateButton = document.querySelector('#filter-modal .filter-date');

        if (filterDateButton) {
            filterDateButton.removeEventListener('click', this.boundOpenFilterCalendar);
            filterDateButton.addEventListener('click', this.boundOpenFilterCalendar);
        }
    }

    initDetectionsFilterButtons() {
        const detectionsFilterDateButton = document.querySelector('#detections-filter-modal .filter-date');

        if (detectionsFilterDateButton) {
            detectionsFilterDateButton.removeEventListener('click', this.boundOpenDetectionsFilterCalendar);
            detectionsFilterDateButton.addEventListener('click', this.boundOpenDetectionsFilterCalendar);
        }
    }
}
