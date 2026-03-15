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

    // Дополнительные DOM элементы
    this.selectedDateSpan = document.getElementById("selected-date");
    this.currentMonthYearSpan = document.getElementById("current-month-year");
    this.calendarDays = document.getElementById("calendar-days");
    this.prevMonthBtn = document.getElementById("prev-month");
    this.nextMonthBtn = document.getElementById("next-month");

    if (!this.modal) return;

    // Состояние календаря
    this.currentDate = new Date();
    this.selectedDate = new Date(); // Выбранная пользователем дата
    this.today = new Date(); // Сегодняшняя дата для подсветки

    this.currentDate.setHours(0, 0, 0, 0);
    this.selectedDate.setHours(0, 0, 0, 0);
    this.today.setHours(0, 0, 0, 0);

    this.monthsNominative = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
    ];

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
    this.currentMonthYearSpan.textContent = 
      `${this.getMonthNameNominative(this.currentDate)} ${this.currentDate.getFullYear()}`;
  }

  isSameDate(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // Проверка, является ли дата сегодняшней
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