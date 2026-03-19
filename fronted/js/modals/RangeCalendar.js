import { PositionedModal } from '../core/PositionedModal.js';

export class RangeCalendar extends PositionedModal {
  constructor(triggerId, onDateRangeSelect) {
    super(
      "calendar-modal", 
      triggerId, 
      ".calendar-modal__container", 
      356,
      399,
      {
        closeOnEsc: true,
        closeOnOverlay: true
      }
    );

    // Дополнительные элементы
    this.calendarDays = document.getElementById("calendar-days");
    this.prevMonthBtn = document.getElementById("prev-month");
    this.nextMonthBtn = document.getElementById("next-month");
    this.currentMonthYearSpan = document.getElementById("current-month-year");

    if (!this.modal) return;

    // Состояние календаря
    this.currentDate = new Date();
    this.startDate = null;
    this.endDate = null;
    this.today = new Date();
    this.onDateRangeSelect = onDateRangeSelect;

    this.currentDate.setHours(0, 0, 0, 0);
    this.today.setHours(0, 0, 0, 0);

    this.monthsNominative = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
    ];

    this.monthDropdown = document.getElementById('calendar-month-dropdown');
    this.yearDropdown  = document.getElementById('calendar-year-dropdown');
    this.monthText     = document.getElementById('calendar-month-text');
    this.yearText      = document.getElementById('calendar-year-text');
    this.monthList     = document.getElementById('calendar-month-list');
    this.yearList      = document.getElementById('calendar-year-list');

    this.initCalendar();
  }

  formatDate(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  getMonthNameNominative(date) {
    return this.monthsNominative[date.getMonth()];
  }

  updateMonthYear() {
    const month = this.currentDate.getMonth();
    const year  = this.currentDate.getFullYear();
    this.currentMonthYearSpan.textContent = `${this.monthsNominative[month]} ${year}`;
    if (this.monthText) this.monthText.textContent = this.monthsNominative[month];
    if (this.yearText)  this.yearText.textContent  = year;
    this._highlightDropdownItems();
  }

  _highlightDropdownItems() {
    const month = this.currentDate.getMonth();
    const year  = this.currentDate.getFullYear();
    this.monthList?.querySelectorAll('.calendar-dropdown__item').forEach(el => {
      el.classList.toggle('active', +el.dataset.value === month);
    });
    this.yearList?.querySelectorAll('.calendar-dropdown__item').forEach(el => {
      el.classList.toggle('active', +el.dataset.value === year);
    });
  }

  initDropdowns() {
    this.monthList.innerHTML = this.monthsNominative.map((name, i) =>
      `<div class="calendar-dropdown__item" data-value="${i}">${name}</div>`
    ).join('');

    const curYear = new Date().getFullYear();
    let yearsHtml = '';
    for (let y = curYear - 10; y <= curYear + 10; y++) {
      yearsHtml += `<div class="calendar-dropdown__item" data-value="${y}">${y}</div>`;
    }
    this.yearList.innerHTML = yearsHtml;

    this.monthList.addEventListener('click', (e) => {
      const item = e.target.closest('.calendar-dropdown__item');
      if (!item) return;
      this.currentDate.setMonth(+item.dataset.value);
      this.updateMonthYear();
      this.renderCalendar();
      if (this.positionManager) this.positionManager.updatePosition();
      this.monthDropdown.classList.remove('active');
    });

    this.yearList.addEventListener('click', (e) => {
      const item = e.target.closest('.calendar-dropdown__item');
      if (!item) return;
      this.currentDate.setFullYear(+item.dataset.value);
      this.updateMonthYear();
      this.renderCalendar();
      if (this.positionManager) this.positionManager.updatePosition();
      this.yearDropdown.classList.remove('active');
    });

    this.monthDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = this.monthDropdown.classList.contains('active');
      this.yearDropdown.classList.remove('active');
      this.monthDropdown.classList.toggle('active', !isOpen);
      if (!isOpen) this._scrollToActive(this.monthList);
    });

    this.yearDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = this.yearDropdown.classList.contains('active');
      this.monthDropdown.classList.remove('active');
      this.yearDropdown.classList.toggle('active', !isOpen);
      if (!isOpen) this._scrollToActive(this.yearList);
    });

    document.addEventListener('click', () => {
      this.monthDropdown?.classList.remove('active');
      this.yearDropdown?.classList.remove('active');
    });
  }

  _scrollToActive(list) {
    requestAnimationFrame(() => {
      const active = list.querySelector('.calendar-dropdown__item.active');
      if (active) active.scrollIntoView({ block: 'center' });
    });
  }

  isSameDate(date1, date2) {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  isToday(date) {
    return this.isSameDate(date, this.today);
  }

  isInRange(date) {
    if (!this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  isRangeStart(date) {
    return this.isSameDate(date, this.startDate);
  }

  isRangeEnd(date) {
    return this.isSameDate(date, this.endDate);
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const days = this.generateDaysArray(year, month, startDayOfWeek, lastDate, prevLastDate);
    this.renderDaysToHTML(days);
    this.addDayClickHandlers();
  }

  generateDaysArray(year, month, startDayOfWeek, lastDate, prevLastDate) {
    const days = [];

    for (let i = startDayOfWeek; i > 0; i--) {
      const day = prevLastDate - i + 1;
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: day,
        date: date,
        isCurrentMonth: false,
        isSelected: this.isSameDate(date, this.startDate) || this.isSameDate(date, this.endDate),
        isInRange: this.isInRange(date),
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date),
        isToday: this.isToday(date)
      });
    }

    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: i,
        date: date,
        isCurrentMonth: true,
        isSelected: this.isSameDate(date, this.startDate) || this.isSameDate(date, this.endDate),
        isInRange: this.isInRange(date),
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date),
        isToday: this.isToday(date)
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: i,
        date: date,
        isCurrentMonth: false,
        isSelected: this.isSameDate(date, this.startDate) || this.isSameDate(date, this.endDate),
        isInRange: this.isInRange(date),
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date),
        isToday: this.isToday(date)
      });
    }

    return days;
  }

  renderDaysToHTML(days) {
    this.calendarDays.innerHTML = days
      .map((day) => {
        let classes = "calendar-day";
        classes += day.isCurrentMonth ? " current-month" : " other-month";
        
        if (day.isSelected) {
          classes += " selected";
          if (this.endDate) {
            if (day.isRangeStart) classes += " range-start";
            if (day.isRangeEnd) classes += " range-end";
          }
        } else if (day.isInRange) {
          classes += " in-range";
        }
        
        if (day.isToday && !day.isSelected && !day.isInRange) {
          classes += " today";
        }

        return `<div class="${classes}" data-date="${day.date.toISOString()}"><span>${day.day}</span></div>`;
      })
      .join("");
  }

  handleDayClick = (event) => {
    const dayElement = event.currentTarget;
    const dateStr = dayElement.dataset.date;
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);

    if (!this.startDate || (this.startDate && this.endDate)) {
      // Первый клик: устанавливаем начало диапазона
      this.startDate = clickedDate;
      this.endDate = null;
    } else if (this.startDate && !this.endDate) {
      // Второй клик: устанавливаем конец, нормализуем порядок
      if (clickedDate < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = clickedDate;
      } else {
        this.endDate = clickedDate;
      }

      if (this.onDateRangeSelect) {
        this.onDateRangeSelect({
          start: this.formatDate(this.startDate),
          end: this.formatDate(this.endDate),
          startDate: this.startDate,
          endDate: this.endDate
        });
      }
    }

    this.renderCalendar();
  }

  addDayClickHandlers() {
    document.querySelectorAll(".calendar-day").forEach((dayElement) => {
      dayElement.removeEventListener("click", this.handleDayClick);
      dayElement.addEventListener("click", this.handleDayClick);
    });
  }

  goToPrevMonth = () => {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateMonthYear();
    this.renderCalendar();
    if (this.positionManager) {
      this.positionManager.updatePosition();
    }
  }

  goToNextMonth = () => {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateMonthYear();
    this.renderCalendar();
    if (this.positionManager) {
      this.positionManager.updatePosition();
    }
  }

  handleScroll = () => {
    if (this.modal && this.modal.classList.contains("active") && this.positionManager) {
      this.positionManager.updatePosition();
    }
  }

  handleResize = () => {
    if (this.modal && this.modal.classList.contains("active") && this.positionManager) {
      this.positionManager.updatePosition();
    }
  }

  resetRange() {
    this.startDate = null;
    this.endDate = null;
    this.renderCalendar();
  }

  setRange(start, end) {
    this.startDate = start;
    this.endDate = end;
    this.renderCalendar();
  }

  // Открытие без блокировки скролла (работает как dropdown)
  open() {
    if (this.startDate) {
      this.currentDate = new Date(this.startDate);
    }
    this.updateMonthYear();
    this.renderCalendar();
    if (this.positionManager) {
      this.positionManager.updatePosition();
    }
    this.modal.classList.add("active");
  }

  close() {
    this.modal.classList.remove("active");
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  initCalendar() {
    if (this.prevMonthBtn) {
      this.prevMonthBtn.addEventListener("click", this.goToPrevMonth);
    }
    if (this.nextMonthBtn) {
      this.nextMonthBtn.addEventListener("click", this.goToNextMonth);
    }
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);

    if (this.monthDropdown && this.yearDropdown) {
      this.initDropdowns();
    }

    this.updateMonthYear();
    this.renderCalendar();
  }

  destroy() {
    if (this.prevMonthBtn) {
      this.prevMonthBtn.removeEventListener("click", this.goToPrevMonth);
    }
    if (this.nextMonthBtn) {
      this.nextMonthBtn.removeEventListener("click", this.goToNextMonth);
    }
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
    super.destroy();
  }
}