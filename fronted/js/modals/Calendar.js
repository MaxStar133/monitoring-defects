import { PositionedModal } from '../core/PositionedModal.js';

export class Calendar extends PositionedModal {
  constructor(options = {}) {
    super(
      "calendar-modal",
      "date-trigger",
      ".calendar-modal__container",
      356,
      399,
      {
        closeOnEsc: true,
        closeOnOverlay: true
      }
    );
    this.onDateSelected = options.onDateSelected || null;

    this.selectedDateSpan = document.getElementById("selected-date");
    this.currentMonthYearSpan = document.getElementById("current-month-year");
    this.calendarDays = document.getElementById("calendar-days");
    this.prevMonthBtn = document.getElementById("prev-month");
    this.nextMonthBtn = document.getElementById("next-month");

    if (!this.modal) return;

    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.today = new Date();

    this.currentDate.setHours(0, 0, 0, 0);
    this.selectedDate.setHours(0, 0, 0, 0);
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
  
  open() {
    this.currentDate = new Date(this.selectedDate);
    this.updateMonthYear();
    this.renderCalendar();
    this.positionManager.updatePosition();
    super.open();
  }

  formatDate(date) {
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

    // Список годов: −10 … +10 от текущего
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
      this.positionManager.updatePosition();
      this.monthDropdown.classList.remove('active');
    });

    this.yearList.addEventListener('click', (e) => {
      const item = e.target.closest('.calendar-dropdown__item');
      if (!item) return;
      this.currentDate.setFullYear(+item.dataset.value);
      this.updateMonthYear();
      this.renderCalendar();
      this.positionManager.updatePosition();
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
      this.monthDropdown.classList.remove('active');
      this.yearDropdown.classList.remove('active');
    });
  }

  _scrollToActive(list) {
    requestAnimationFrame(() => {
      const active = list.querySelector('.calendar-dropdown__item.active');
      if (active) active.scrollIntoView({ block: 'center' });
    });
  }

  isSameDate(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  isToday(date) {
    return this.isSameDate(date, this.today);
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
        isSelected: this.isSameDate(date, this.selectedDate),
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
        isSelected: this.isSameDate(date, this.selectedDate),
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
        isSelected: this.isSameDate(date, this.selectedDate),
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
        classes += day.isSelected ? " selected" : "";
        classes += day.isToday && !day.isSelected ? " today" : "";
        return `<div class="${classes}" data-date="${day.date.toISOString()}"><span>${day.day}</span></div>`;
      })
      .join("");
  }

  handleDayClick = (event) => {
    const dayElement = event.currentTarget;
    const dateStr = dayElement.dataset.date;
    const newSelectedDate = new Date(dateStr);

    this.selectedDate = newSelectedDate;
    this.selectedDateSpan.textContent = this.formatDate(this.selectedDate);
    this.close();

    if (this.onDateSelected) {
      this.onDateSelected(this.selectedDate, this.formatDate(this.selectedDate));
    }
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
    this.positionManager.updatePosition();
  }

  goToNextMonth = () => {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateMonthYear();
    this.renderCalendar();
    this.positionManager.updatePosition();
  }

  handleScroll = () => {
    if (this.modal.classList.contains("active")) {
      this.positionManager.updatePosition();
    }
  }

  handleResize = () => {
    if (this.modal.classList.contains("active")) {
      this.positionManager.updatePosition();
    }
  }

  initCalendar() {
    this.selectedDateSpan.textContent = this.formatDate(this.selectedDate);

    this.prevMonthBtn.addEventListener("click", this.goToPrevMonth);
    this.nextMonthBtn.addEventListener("click", this.goToNextMonth);
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);

    if (this.monthDropdown && this.yearDropdown) {
      this.initDropdowns();
    }

    this.updateMonthYear();
    this.renderCalendar();
  }

  destroy() {
    super.destroy();
    this.prevMonthBtn.removeEventListener("click", this.goToPrevMonth);
    this.nextMonthBtn.removeEventListener("click", this.goToNextMonth);
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  }
}