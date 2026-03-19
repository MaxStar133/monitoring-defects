import { PositionedModal } from '../core/PositionedModal.js';

export class StatsRangeCalendar extends PositionedModal {
  constructor(onRangeSelected) {
    super(
      "stats-calendar-modal",
      "stats-date-trigger",
      ".stats-calendar__container",
      356,
      399,
      { closeOnEsc: true, closeOnOverlay: true }
    );

    this.calendarDays = document.getElementById("stats-cal-days");
    this.prevMonthBtn = document.getElementById("stats-cal-prev");
    this.nextMonthBtn = document.getElementById("stats-cal-next");
    this.currentMonthYearSpan = document.getElementById("stats-cal-month-year");

    if (!this.modal) return;

    this.currentDate = new Date();
    this.today = new Date();

    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    this.startDate = monday;
    this.endDate = sunday;
    this.onRangeSelected = onRangeSelected;

    this.currentDate.setHours(0, 0, 0, 0);
    this.today.setHours(0, 0, 0, 0);
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(0, 0, 0, 0);

    this.monthsNominative = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
    ];

    this.initCalendar();
  }

  formatDate(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}.${date.getFullYear()}`;
  }

  updateMonthYear() {
    this.currentMonthYearSpan.textContent =
      `${this.monthsNominative[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  isSameDate(date1, date2) {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
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
        day,
        date,
        isCurrentMonth: false,
        isSelected: this.isSameDate(date, this.startDate) || this.isSameDate(date, this.endDate),
        isInRange: this.isInRange(date),
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date),
        isToday: this.isToday(date),
      });
    }

    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: i,
        date,
        isCurrentMonth: true,
        isSelected: this.isSameDate(date, this.startDate) || this.isSameDate(date, this.endDate),
        isInRange: this.isInRange(date),
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date),
        isToday: this.isToday(date),
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: i,
        date,
        isCurrentMonth: false,
        isSelected: this.isSameDate(date, this.startDate) || this.isSameDate(date, this.endDate),
        isInRange: this.isInRange(date),
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date),
        isToday: this.isToday(date),
      });
    }

    return days;
  }

  renderDaysToHTML(days) {
    this.calendarDays.innerHTML = days.map((day) => {
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
    }).join("");
  }

  handleDayClick = (event) => {
    const dateStr = event.currentTarget.dataset.date;
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);

    if (!this.startDate || (this.startDate && this.endDate)) {

      this.startDate = clickedDate;
      this.endDate = null;
    } else if (this.startDate && !this.endDate) {

      if (clickedDate < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = clickedDate;
      } else {
        this.endDate = clickedDate;
      }

      this.close();
      if (this.onRangeSelected) {
        this.onRangeSelected(this.startDate, this.endDate);
      }
    }

    this.renderCalendar();
  }

  addDayClickHandlers() {
    this.calendarDays.querySelectorAll(".calendar-day").forEach((el) => {
      el.removeEventListener("click", this.handleDayClick);
      el.addEventListener("click", this.handleDayClick);
    });
  }

  goToPrevMonth = () => {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateMonthYear();
    this.renderCalendar();
    if (this.positionManager) this.positionManager.updatePosition();
  }

  goToNextMonth = () => {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateMonthYear();
    this.renderCalendar();
    if (this.positionManager) this.positionManager.updatePosition();
  }

  open() {
    if (this.startDate) {
      this.currentDate = new Date(this.startDate);
    }
    this.updateMonthYear();
    this.renderCalendar();
    if (this.positionManager) this.positionManager.updatePosition();
    this.modal.classList.add("active");
  }

  initCalendar() {
    if (this.prevMonthBtn) this.prevMonthBtn.addEventListener("click", this.goToPrevMonth);
    if (this.nextMonthBtn) this.nextMonthBtn.addEventListener("click", this.goToNextMonth);
    this.updateMonthYear();
    this.renderCalendar();
  }

  getRange() {
    return { start: this.startDate, end: this.endDate };
  }
}
