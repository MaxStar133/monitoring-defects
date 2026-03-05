// Календарь для главного экрана (ООП версия)
class Calendar {
  constructor() {
    // Инициализация DOM элементов
    this.dateTrigger = document.getElementById("date-trigger");
    this.calendarModal = document.getElementById("calendar-modal");
    this.calendarContainer = document.querySelector(
      ".calendar-modal__container",
    );
    this.selectedDateSpan = document.getElementById("selected-date");
    this.currentMonthYearSpan = document.getElementById("current-month-year");
    this.calendarDays = document.getElementById("calendar-days");
    this.prevMonthBtn = document.getElementById("prev-month");
    this.nextMonthBtn = document.getElementById("next-month");

    // Если модальное окно не найдено, прекращаем выполнение
    if (!this.calendarModal) return;

    // Состояние календаря
    this.currentDate = new Date();
    this.selectedDate = new Date();

    // Устанавливаем время в 00:00:00 для корректного сравнения
    this.currentDate.setHours(0, 0, 0, 0);
    this.selectedDate.setHours(0, 0, 0, 0);

    // Названия месяцев для заголовка
    this.monthsNominative = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    // Инициализация событий и рендеринг
    this.init();
  }

  // Форматирование даты для отображения (ДД.ММ.ГГГГ)
  formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Получение названия месяца в именительном падеже
  getMonthNameNominative(date) {
    return this.monthsNominative[date.getMonth()];
  }

  // Обновление отображения месяца и года в заголовке
  updateMonthYear() {
    this.currentMonthYearSpan.textContent = `${this.getMonthNameNominative(this.currentDate)} ${this.currentDate.getFullYear()}`;
  }

  // Проверка, совпадают ли две даты
  isSameDate(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // Обновление позиции календаря относительно кнопки
  updateCalendarPosition() {
    const rect = this.dateTrigger.getBoundingClientRect();

    // Базовая позиция под кнопкой
    let top = rect.bottom + 5; // 5px отступ снизу
    let left = rect.right - 356; // 356px - ширина календаря

    // Корректировка, если выходит за левый край
    if (left < 10) left = 10;

    // Корректировка, если выходит за правый край
    if (left + 356 > window.innerWidth - 10) {
      left = window.innerWidth - 366;
    }

    // Корректировка, если не помещается снизу
    if (top + 399 > window.innerHeight - 10) {
      top = rect.top - 404; // Показываем сверху
    }

    this.calendarContainer.style.top = top + "px";
    this.calendarContainer.style.left = left + "px";
  }

  // Генерация дней календаря
  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Первый день месяца и его день недели
    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay();
    // Преобразуем (0 - воскресенье в JS) в (0 - понедельник для нашего календаря)
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Последний день текущего месяца
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Последний день предыдущего месяца
    const prevLastDate = new Date(year, month, 0).getDate();

    // Массив дней для отображения
    const days = this.generateDaysArray(
      year,
      month,
      startDayOfWeek,
      lastDate,
      prevLastDate,
    );

    // Отрисовка дней в HTML
    this.renderDaysToHTML(days);

    // Добавление обработчиков событий на дни
    this.addDayClickHandlers();
  }

  // Генерация массива дней для календаря
  generateDaysArray(year, month, startDayOfWeek, lastDate, prevLastDate) {
    const days = [];

    // Дни предыдущего месяца
    for (let i = startDayOfWeek; i > 0; i--) {
      const day = prevLastDate - i + 1;
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: day,
        date: date,
        isCurrentMonth: false,
        isSelected: this.isSameDate(date, this.selectedDate),
      });
    }

    // Дни текущего месяца
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: i,
        date: date,
        isCurrentMonth: true,
        isSelected: this.isSameDate(date, this.selectedDate),
      });
    }

    // Дни следующего месяца (чтобы заполнить сетку 6x7 = 42 ячейки)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      date.setHours(0, 0, 0, 0);
      days.push({
        day: i,
        date: date,
        isCurrentMonth: false,
        isSelected: this.isSameDate(date, this.selectedDate),
      });
    }

    return days;
  }

  // Отрисовка дней в HTML
  renderDaysToHTML(days) {
    this.calendarDays.innerHTML = days
      .map((day) => {
        let classes = "calendar-day";
        classes += day.isCurrentMonth ? " current-month" : " other-month";
        classes += day.isSelected ? " selected" : "";

        return `<div class="${classes}" data-date="${day.date.toISOString()}">${day.day}</div>`;
      })
      .join("");
  }

  // Обработчик клика по дню
  handleDayClick(event) {
    const dayElement = event.currentTarget;
    const dateStr = dayElement.dataset.date;
    const newSelectedDate = new Date(dateStr);

    // Обновляем выбранную дату
    this.selectedDate = newSelectedDate;

    // Обновляем текст на кнопке
    this.selectedDateSpan.textContent = this.formatDate(this.selectedDate);

    // Закрываем календарь
    this.closeCalendar();

    console.log("Выбрана дата:", this.formatDate(this.selectedDate));
  }

  // Добавление обработчиков на дни
  addDayClickHandlers() {
    document.querySelectorAll(".calendar-day").forEach((dayElement) => {
      dayElement.removeEventListener("click", this.boundHandleDayClick);
      dayElement.addEventListener("click", this.boundHandleDayClick);
    });
  }

  // Открытие календаря
  openCalendar() {
    // Устанавливаем текущий месяц на месяц выбранной даты
    this.currentDate = new Date(this.selectedDate);

    this.updateMonthYear();
    this.renderCalendar();
    this.updateCalendarPosition(); // Обновляем позицию перед открытием
    this.calendarModal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  // Закрытие календаря
  closeCalendar() {
    this.calendarModal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  // Переключение на предыдущий месяц
  goToPrevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateMonthYear();
    this.renderCalendar();
    this.updateCalendarPosition(); // Обновляем позицию после изменения месяца
  }

  // Переключение на следующий месяц
  goToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateMonthYear();
    this.renderCalendar();
    this.updateCalendarPosition(); // Обновляем позицию после изменения месяца
  }

  // Обработчик скролла
  handleScroll() {
    if (this.calendarModal.classList.contains("active")) {
      this.updateCalendarPosition();
    }
  }

  // Обработчик ресайза
  handleResize() {
    if (this.calendarModal.classList.contains("active")) {
      this.updateCalendarPosition();
    }
  }

  // Обработчик клика по оверлею
  handleOverlayClick(event) {
    if (event.target === this.calendarModal) {
      this.closeCalendar();
    }
  }

  // Обработчик нажатия Escape
  handleEscapeKey(event) {
    if (
      event.key === "Escape" &&
      this.calendarModal.classList.contains("active")
    ) {
      this.closeCalendar();
    }
  }

  // Инициализация всех событий и начального состояния
  init() {
    // Привязываем контекст для обработчиков
    this.boundHandleDayClick = this.handleDayClick.bind(this);
    this.boundOpenCalendar = this.openCalendar.bind(this);
    this.boundHandleOverlayClick = this.handleOverlayClick.bind(this);
    this.boundHandleEscapeKey = this.handleEscapeKey.bind(this);
    this.boundGoToPrevMonth = this.goToPrevMonth.bind(this);
    this.boundGoToNextMonth = this.goToNextMonth.bind(this);
    this.boundHandleScroll = this.handleScroll.bind(this);
    this.boundHandleResize = this.handleResize.bind(this);

    // Устанавливаем сегодняшнюю дату на кнопке при загрузке
    this.selectedDateSpan.textContent = this.formatDate(this.selectedDate);

    // Добавляем обработчики событий
    this.dateTrigger.addEventListener("click", this.boundOpenCalendar);
    this.calendarModal.addEventListener("click", this.boundHandleOverlayClick);
    document.addEventListener("keydown", this.boundHandleEscapeKey);
    this.prevMonthBtn.addEventListener("click", this.boundGoToPrevMonth);
    this.nextMonthBtn.addEventListener("click", this.boundGoToNextMonth);
    window.addEventListener("scroll", this.boundHandleScroll);
    window.addEventListener("resize", this.boundHandleResize);

    // Начальный рендеринг
    this.updateMonthYear();
    this.renderCalendar();
  }

  // Деструктор (опционально, для очистки событий)
  destroy() {
    this.dateTrigger.removeEventListener("click", this.boundOpenCalendar);
    this.calendarModal.removeEventListener(
      "click",
      this.boundHandleOverlayClick,
    );
    document.removeEventListener("keydown", this.boundHandleEscapeKey);
    this.prevMonthBtn.removeEventListener("click", this.boundGoToPrevMonth);
    this.nextMonthBtn.removeEventListener("click", this.boundGoToNextMonth);
    window.removeEventListener("scroll", this.boundHandleScroll);
    window.removeEventListener("resize", this.boundHandleResize);

    document.querySelectorAll(".calendar-day").forEach((dayElement) => {
      dayElement.removeEventListener("click", this.boundHandleDayClick);
    });
  }
}
// Добавьте в класс Calendar или создайте отдельный класс
class CalibrateModal {
  constructor() {
    this.calibrateBtn = document.getElementById("calibrate-btn");
    this.calibrateModal = document.getElementById("calibrate-modal");
    this.cancelBtn = document.getElementById("calibrate-cancel");
    this.confirmBtn = document.getElementById("calibrate-confirm");

    if (!this.calibrateModal) return;

    this.init();
  }

  openModal() {
    this.calibrateModal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  closeModal() {
    this.calibrateModal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  handleCalibrateClick = (e) => {
    e.preventDefault();
    this.openModal();
  };

  handleOverlayClick = (e) => {
    if (e.target === this.calibrateModal) {
      this.closeModal();
    }
  };

  handleCancelClick = () => {
    this.closeModal();
  };

  handleConfirmClick = () => {
    console.log("Калибровка подтверждена");
    // Здесь можно добавить логику калибровки
    this.closeModal();
  };

  handleEscapeKey = (e) => {
    if (
      e.key === "Escape" &&
      this.calibrateModal.classList.contains("active")
    ) {
      this.closeModal();
    }
  };

  init() {
    this.calibrateBtn.addEventListener("click", this.handleCalibrateClick);
    this.calibrateModal.addEventListener("click", this.handleOverlayClick);
    this.cancelBtn.addEventListener("click", this.handleCancelClick);
    this.confirmBtn.addEventListener("click", this.handleConfirmClick);
    document.addEventListener("keydown", this.handleEscapeKey);
  }

  destroy() {
    this.calibrateBtn.removeEventListener("click", this.handleCalibrateClick);
    this.calibrateModal.removeEventListener("click", this.handleOverlayClick);
    this.cancelBtn.removeEventListener("click", this.handleCancelClick);
    this.confirmBtn.removeEventListener("click", this.handleConfirmClick);
    document.removeEventListener("keydown", this.handleEscapeKey);
  }
}

// Добавьте инициализацию в DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  window.calendar = new Calendar();
  window.calibrateModal = new CalibrateModal();
});
