import { RangeCalendar } from './RangeCalendar.js';

export class FilterCalendar {
    constructor() {
        
        this.activeDateRange = {
            start: null,
            end: null,
            source: null
        };
        
        this.rangeCalendar = new RangeCalendar('dummy-trigger', (range) => {
            console.log('Выбран диапазон:', range);
            if (this.activeDateRange.source) {
                this.updateDateDisplay(this.activeDateRange.source, range.start, range.end);
            }
        });
        

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
    
    openFilterCalendar(event) {
        event.preventDefault();
        event.stopPropagation();
        
        this.activeDateRange.source = 'filter';
        const button = event.currentTarget;
        
        if (this.rangeCalendar.positionManager) {
            this.rangeCalendar.positionManager.trigger = button;
            this.rangeCalendar.positionManager.updatePosition();
        }
        
        this.rangeCalendar.resetRange();
        this.rangeCalendar.open();
    }
    
    openDetectionsFilterCalendar(event) {
        event.preventDefault();
        event.stopPropagation();
        
        this.activeDateRange.source = 'detections-filter';
        const button = event.currentTarget;
        
        if (this.rangeCalendar.positionManager) {
            this.rangeCalendar.positionManager.trigger = button;
            this.rangeCalendar.positionManager.updatePosition();
        }
        
        this.rangeCalendar.resetRange();
        this.rangeCalendar.open();
    }
    
    // Инициализация кнопок в основном фильтре
    initFilterButtons() {
        const filterDateButton = document.querySelector('#filter-modal .filter-date');
        
        if (filterDateButton) {
            filterDateButton.removeEventListener('click', this.boundOpenFilterCalendar);
            filterDateButton.addEventListener('click', this.boundOpenFilterCalendar);
            console.log("Обработчик добавлен для основного фильтра");
        } else {
            console.warn("Кнопка в основном фильтре не найдена");
        }
    }
    
    // Инициализация кнопок в фильтре обнаружений
    initDetectionsFilterButtons() {
        const detectionsFilterDateButton = document.querySelector('#detections-filter-modal .filter-date');
        
        if (detectionsFilterDateButton) {
            detectionsFilterDateButton.removeEventListener('click', this.boundOpenDetectionsFilterCalendar);
            detectionsFilterDateButton.addEventListener('click', this.boundOpenDetectionsFilterCalendar);
            console.log("Обработчик добавлен для фильтра обнаружений");
        } else {
            console.warn("Кнопка в фильтре обнаружений не найдена");
        }
    }
}