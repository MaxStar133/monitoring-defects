import { PositionedModal } from "../core/PositionedModal.js";
import { BaseModal } from "../core/BaseModal.js";
import { ImageManager } from "../modals/ImageManager.js";
import { NotificationsPanel } from "../modals/NotificationsPanel.js";
import { FilterCalendar } from "../modals/FilterCalendar.js";
import { Pagination } from "../utils/Pagination.js";
import { DefectsService, getStatusClass } from "../services/DefectsService.js";
import { ExportService } from "../services/ExportService.js";
import { DetectionCharts } from "../charts/DetectionCharts.js";

// Главный класс страницы
class DefectsPage {
  constructor() {
    this.defectsService = new DefectsService();
    this.allDefects = [];
    this.filteredDefects = [];
    this.currentPageDefects = [];
    this.currentDetections = [];
    this.filteredDetections = [];
    this.imageManager = null;
    this.chartsManager = null;

    this.init();
  }

  async init() {
    // Пагинация главной таблицы
    const paginationContainer = document.querySelector(".pagination");
    if (paginationContainer) {
      this.pagination = new Pagination(paginationContainer, 15);
      this.pagination.setOnPageChange((page) => this.loadPage(page));
    }

    await this.loadData();

    this.initModals();
    this.initFilters();
    this.initExport();
  }

  async loadData() {
    try {
      this.allDefects = await this.defectsService.getUniqueDefects();
      this.filteredDefects = [...this.allDefects];

      if (this.pagination) {
        this.pagination.setTotalItems(this.filteredDefects.length);
        this.loadPage(1);
      } else {
        this.renderMainTable(this.filteredDefects);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  }

  loadPage(page) {
    const start = (page - 1) * this.pagination.itemsPerPage;
    const end = start + this.pagination.itemsPerPage;
    this.currentPageDefects = this.filteredDefects.slice(start, end);
    this.renderMainTable(this.currentPageDefects, page);
  }

  renderMainTable(defects, currentPage = 1) {
    const tableBody = document.querySelector(".defects-table");

    if (!tableBody) {
      console.error("Таблица .defects-table не найдена!");
      return;
    }

    const header = tableBody.querySelector(".table-header");

    tableBody.innerHTML = "";
    tableBody.appendChild(header);

    const isLastPage = currentPage === this.pagination?.totalPages;

    defects.forEach((defect, index) => {
      const statusClass = `status--${getStatusClass(defect.status)}`;
      const row = document.createElement("div");
      row.className = "table-row";

      // Класс последней строки на последней странице
      if (isLastPage && index === defects.length - 1) {
        row.classList.add("table-row--last");
      }

      row.innerHTML = `
        <div class="table-row__cell table-row__cell--id">${defect.name}</div>
        <div class="table-row__cell table-row__cell--date">
            <span class="date">${defect.firstDetection.date}</span>
            <span class="time">${defect.firstDetection.time}</span>
        </div>
        <div class="table-row__coordinates">
            <span class="table-row__coord-value">${defect.firstDetection.length}</span>
            <span class="table-row__coord-value">${defect.firstDetection.width}</span>
        </div>
        <div class="table-row__cell table-row__cell--type">${defect.type}</div>
        <div class="table-row__cell table-row__cell--status ${statusClass}">
            ${defect.status}
        </div>
        <div class="table-row__action">
            <button class="table-row__action-btn" data-name="${defect.name}">Подробнее</button>
        </div>
      `;
      tableBody.appendChild(row);
    });

    this.initDetailButtons();
  }

  async renderDetectionsModal(defectName) {
    try {
      const details = await this.defectsService.getDefectDetails(defectName);

      this.currentDetections = details.detections;
      this.filteredDetections = [...details.detections];

      // Текущий дефект в модальном окне
      const modal = document.getElementById("detections-modal");
      if (modal) {
        modal.dataset.currentDefect = defectName;
      }

      // Заголовок модального окна
      const headerId = document.querySelector(".detections-header__id");
      const headerType = document.querySelector(".detections-header__type");
      if (headerId) headerId.textContent = details.name;
      if (headerType) headerType.textContent = details.type;

      // Статистика роста дефекта
      if (details.statistics && details.statistics.firstDetection) {
        const statItems = document.querySelectorAll(
          ".detections-statistics__item",
        );
        if (statItems.length >= 3) {
          statItems[0].innerHTML = `
            <span class="detections-statistics__label">Длина:</span>
            <span class="detections-statistics__value">
                ${details.statistics.firstDetection.measurements.length} →
                ${details.statistics.lastDetection.measurements.length}
            </span>
            <span class="detections-statistics__unit">мм</span>
            <span class="detections-statistics__percent">(${details.statistics.growth.length})</span>
          `;
          statItems[1].innerHTML = `
            <span class="detections-statistics__label">Ширина:</span>
            <span class="detections-statistics__value">
                ${details.statistics.firstDetection.measurements.width} →
                ${details.statistics.lastDetection.measurements.width}
            </span>
            <span class="detections-statistics__unit">мм</span>
            <span class="detections-statistics__percent">(${details.statistics.growth.width})</span>
          `;
          statItems[2].innerHTML = `
            <span class="detections-statistics__label">Площадь:</span>
            <span class="detections-statistics__value">
                ${details.statistics.firstDetection.measurements.area} →
                ${details.statistics.lastDetection.measurements.area}
            </span>
            <span class="detections-statistics__unit">мм²</span>
            <span class="detections-statistics__percent">(${details.statistics.growth.area})</span>
          `;
        }
      }

      // Графики динамики обнаружений
      if (!this.chartsManager) {
        this.chartsManager = new DetectionCharts();
      }
      setTimeout(() => {
        if (
          this.chartsManager &&
          details.detections &&
          details.detections.length > 0
        ) {
          this.chartsManager.renderCharts(details.detections);
        }
      }, 100);

      // Пагинация таблицы обнаружений
      if (this.detectionsPagination) {
        this.detectionsPagination.setTotalItems(details.detections.length);
        this.loadDetectionsPage(1, details.detections);
      } else {
        this.renderDetectionsTable(details.detections);

        const paginationInfo = document.querySelector(
          ".detections-pagination__info",
        );
        if (paginationInfo) {
          paginationInfo.textContent = `Результаты 1-${details.detections.length} из ${details.detections.length}`;
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки деталей дефекта:", error);
    }
  }

  // Загрузка страницы в модальном окне обнаружений
  loadDetectionsPage(page, allDetections) {
    const start = (page - 1) * this.detectionsPagination.itemsPerPage;
    const end = start + this.detectionsPagination.itemsPerPage;
    const pageDetections = allDetections.slice(start, end);

    this.renderDetectionsTable(pageDetections);

    const paginationInfo = document.querySelector(
      ".detections-pagination__info",
    );
    if (paginationInfo) {
      const startItem = start + 1;
      const endItem = Math.min(end, allDetections.length);
      paginationInfo.textContent = `Результаты ${startItem}-${endItem} из ${allDetections.length}`;
    }
  }

  // Таблица обнаружений
  renderDetectionsTable(detections) {
    const tableBody = document.querySelector(
      "#detections-modal .detections-table",
    );
    if (!tableBody) return;

    const header = tableBody.querySelector(".detections-table-header");
    tableBody.innerHTML = "";
    tableBody.appendChild(header);

    detections.forEach((detection, index) => {
      const statusClass = `status--${getStatusClass(detection.status)}`;
      const row = document.createElement("div");
      row.className = "detections-table-row";
      if (index === detections.length - 1) {
        row.classList.add("detections-table-row--last");
      }

      row.innerHTML = `
        <div class="detections-table-row__cell detections-table-row__cell--date">
            <span class="date">${detection.date}</span>
            <span class="time">${detection.time}</span>
        </div>
        <div class="detections-table-row__measurements">
            <span class="detections-table-row__value">${detection.measurements.length}</span>
            <span class="detections-table-row__value">${detection.measurements.width}</span>
            <span class="detections-table-row__value">${detection.measurements.area}</span>
        </div>
        <div class="detections-table-row__cell detections-table-row__cell--status ${statusClass}">
            ${detection.status}
        </div>
        <div class="detections-table-row__cell detections-table-row__cell--actions">
            <a href="#" class="detections-table-row__link show-image" data-image="${detection.imageUrl}">Показать</a>
        </div>
      `;
      tableBody.appendChild(row);
    });

    // Переинициализация обработчиков кнопок просмотра изображений
    if (document.querySelector(".detections-table-row__link")) {
      if (!this.imageManager) {
        this.imageManager = new ImageManager();
      } else {
        this.imageManager.attachEventHandlers();
      }
    }
  }

  initDetailButtons() {
    const detailBtns = document.querySelectorAll(".table-row__action-btn");

    detailBtns.forEach((btn) => {
      btn.removeEventListener("click", this.detailHandler);
      btn.addEventListener("click", this.detailHandler.bind(this));
    });
  }

  async detailHandler(e) {
    e.preventDefault();
    const defectName = e.currentTarget.dataset.name;

    await this.renderDetectionsModal(defectName);
    this.initDetectionsExport();
    this.detectionsModal.open();
  }

  initModals() {
    // Модальное окно истории обнаружений
    this.detectionsModal = new BaseModal("detections-modal", {
      closeOnEsc: true,
      closeOnOverlay: true,
    });

    // Уничтожение графиков при закрытии модального окна
    this.detectionsModal.setOnClose(() => {
      if (this.chartsManager) {
        this.chartsManager.destroyCharts();
      }
    });

    // Пагинация модального окна обнаружений
    const detectionsPaginationContainer = document.querySelector(
      ".detections-pagination",
    );

    if (detectionsPaginationContainer) {
      this.detectionsPagination = new Pagination(
        detectionsPaginationContainer,
        15,
        "detections-pagination",
      );
      this.detectionsPagination.setOnPageChange((page) => {
        if (this.currentDetections) {
          this.loadDetectionsPage(page, this.currentDetections);
        }
      });
    } else {
      console.error("Контейнер пагинации .detections-pagination не найден!");
    }

    // Модальное окно подтверждения исправления дефекта
    this.fixModal = new BaseModal("fix-confirm-modal", {
      closeOnEsc: true,
      closeOnOverlay: true,
    });

    const fixBtn = document.querySelector(".detections-header__btn");
    if (fixBtn) {
      fixBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.fixModal.open();
      });
    }

    const cancelBtn = document.querySelector(".alert-modal__btn--cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.fixModal.close());
    }

    const confirmBtn = document.querySelector(".alert-modal__btn--confirm");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", async () => {
        const defectName = this.detectionsModal.modal.dataset.currentDefect;
        if (defectName) {
          await this.defectsService.markAsFixed(defectName);
        }
        this.fixModal.close();
      });
    }

    // Модальное окно параметров
    const paramsModal = new BaseModal("params-modal", {
      closeOnEsc: true,
      closeOnOverlay: true,
    });

    const paramsBtn = document.getElementById("params-btn");
    if (paramsBtn && paramsModal.modal) {
      paramsBtn.addEventListener("click", () => paramsModal.open());
    }
  }

  initFilters() {
    this.filterCalendar = new FilterCalendar();

    // ── Фильтр дефектов ──────────────────────────────────────────
    if (document.getElementById("filter-btn")) {
      this.filterModal = new PositionedModal(
        "filter-modal",
        "filter-btn",
        ".filter-modal",
        420,
        500,
      );

      const origFilterOpen = this.filterModal.open.bind(this.filterModal);
      this.filterModal.open = () => {
        origFilterOpen();
        document.body.classList.remove('modal-open');
        setTimeout(() => this.filterCalendar.initFilterButtons(), 50);
      };

      const applyBtn = document.querySelector("#filter-modal .filter-btn--apply");
      if (applyBtn) {
        applyBtn.addEventListener("click", () => {
          this.applyDefectsFilter();
          this.filterModal.close();
        });
      }

      const resetBtn = document.querySelector("#filter-modal .filter-btn--reset");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.resetDefectsFilter();
          this.filterModal.close();
        });
      }
    }

    // ── Фильтр обнаружений ────────────────────────────────────────
    if (document.getElementById("detections-filter-btn")) {
      this.detectionsFilterModal = new PositionedModal(
        "detections-filter-modal",
        "detections-filter-btn",
        ".detections-filter-modal",
        420,
        400,
      );

      const origDetOpen = this.detectionsFilterModal.open.bind(this.detectionsFilterModal);
      this.detectionsFilterModal.open = () => {
        origDetOpen();
        document.body.classList.remove('modal-open');
        setTimeout(() => this.filterCalendar.initDetectionsFilterButtons(), 50);
      };

      const detApplyBtn = document.querySelector("#detections-filter-modal .filter-btn--apply");
      if (detApplyBtn) {
        detApplyBtn.addEventListener("click", () => {
          this.applyDetectionsFilter();
          this.detectionsFilterModal.close();
        });
      }

      const detResetBtn = document.querySelector("#detections-filter-modal .filter-btn--reset");
      if (detResetBtn) {
        detResetBtn.addEventListener("click", () => {
          this.resetDetectionsFilter();
          this.detectionsFilterModal.close();
        });
      }
    }

    // Управление изображениями
    if (document.querySelector(".detections-table-row__link")) {
      this.imageManager = new ImageManager();
    }

    // Панель уведомлений
    if (document.getElementById("notificationsPanel")) {
      new NotificationsPanel({
        onCardClick: async (defectName) => {
          await this.renderDetectionsModal(defectName);
          this.initDetectionsExport();
          this.detectionsModal.open();
        }
      });
    }
  }

  // Парсинг даты из формата "дд.мм.гггг"
  parseDate(str) {
    if (!str || str === "дд.мм.гггг") return null;
    const parts = str.split(".");
    if (parts.length !== 3) return null;
    const [d, m, y] = parts;
    const date = new Date(+y, +m - 1, +d);
    return isNaN(date.getTime()) ? null : date;
  }

  //Фильтрация таблицы дефектов
  applyDefectsFilter() {
    const modal = "#filter-modal";

    // Типы
    const checkedTypes = [...document.querySelectorAll(`${modal} .checkbox-input:not(.status-checkbox-input):checked`)]
      .map((cb) => cb.closest(".filter-checkbox").querySelector(".checkbox-text").textContent.trim());

    // Дата
    const startDate = this.parseDate(
      document.querySelector(`${modal} .date-picker:first-child .date-picker__text`)?.textContent?.trim()
    );
    const endDate = this.parseDate(
      document.querySelector(`${modal} .date-picker:last-child .date-picker__text`)?.textContent?.trim()
    );

    // Статус
    const checkedStatuses = [...document.querySelectorAll(`${modal} .status-checkbox-input:checked`)]
      .map(cb => cb.dataset.value);

    // Координаты
    const inputs = [...document.querySelectorAll(`${modal} .coord-input`)];
    const lengthFrom = inputs[0]?.value !== "" ? parseFloat(inputs[0].value) : null;
    const lengthTo   = inputs[1]?.value !== "" ? parseFloat(inputs[1].value) : null;
    const widthFrom  = inputs[2]?.value !== "" ? parseFloat(inputs[2].value) : null;
    const widthTo    = inputs[3]?.value !== "" ? parseFloat(inputs[3].value) : null;

    this.filteredDefects = this.allDefects.filter((d) => {
      if (checkedTypes.length > 0 && !checkedTypes.includes(d.type)) return false;

      if (startDate || endDate) {
        const dt = this.parseDate(d.firstDetection.date);
        if (dt) {
          if (startDate && dt < startDate) return false;
          if (endDate && dt > endDate) return false;
        }
      }

      if (checkedStatuses.length > 0 && !checkedStatuses.includes(d.status)) return false;

      if (lengthFrom !== null && d.firstDetection.length < lengthFrom) return false;
      if (lengthTo   !== null && d.firstDetection.length > lengthTo)   return false;
      if (widthFrom  !== null && d.firstDetection.width  < widthFrom)  return false;
      if (widthTo    !== null && d.firstDetection.width  > widthTo)    return false;

      return true;
    });

    this.pagination.setTotalItems(this.filteredDefects.length);
    this.loadPage(1);
  }

  resetDefectsFilter() {
    const modal = "#filter-modal";

    document.querySelectorAll(`${modal} .checkbox-input`).forEach((cb) => (cb.checked = false));

    document.querySelectorAll(`${modal} .date-picker__text`).forEach((el) => (el.textContent = "дд.мм.гггг"));
    this.filterCalendar.clearRange("filter");

    document.querySelectorAll(`${modal} .status-checkbox-input`).forEach(cb => (cb.checked = false));

    document.querySelectorAll(`${modal} .coord-input`).forEach((inp) => (inp.value = ""));

    this.filteredDefects = [...this.allDefects];
    this.pagination.setTotalItems(this.filteredDefects.length);
    this.loadPage(1);
  }

  //  Фильтрация таблицы обнаружений 
  applyDetectionsFilter() {
    const modal = "#detections-filter-modal";

    const startDate = this.parseDate(
      document.querySelector(`${modal} .date-picker:first-child .date-picker__text`)?.textContent?.trim()
    );
    const endDate = this.parseDate(
      document.querySelector(`${modal} .date-picker:last-child .date-picker__text`)?.textContent?.trim()
    );

    const checkedStatuses = [...document.querySelectorAll(`${modal} .detections-status-checkbox-input:checked`)]
      .map(cb => cb.dataset.value);

    const inputs = [...document.querySelectorAll(`${modal} .coord-input`)];
    const lengthFrom = inputs[0]?.value !== "" ? parseFloat(inputs[0].value) : null;
    const lengthTo   = inputs[1]?.value !== "" ? parseFloat(inputs[1].value) : null;
    const widthFrom  = inputs[2]?.value !== "" ? parseFloat(inputs[2].value) : null;
    const widthTo    = inputs[3]?.value !== "" ? parseFloat(inputs[3].value) : null;
    const areaFrom   = inputs[4]?.value !== "" ? parseFloat(inputs[4].value) : null;
    const areaTo     = inputs[5]?.value !== "" ? parseFloat(inputs[5].value) : null;

    const filtered = this.currentDetections.filter((det) => {
      if (startDate || endDate) {
        const dt = this.parseDate(det.date);
        if (dt) {
          if (startDate && dt < startDate) return false;
          if (endDate && dt > endDate) return false;
        }
      }

      if (checkedStatuses.length > 0 && !checkedStatuses.includes(det.status)) return false;

      if (lengthFrom !== null && det.measurements.length < lengthFrom) return false;
      if (lengthTo   !== null && det.measurements.length > lengthTo)   return false;
      if (widthFrom  !== null && det.measurements.width  < widthFrom)  return false;
      if (widthTo    !== null && det.measurements.width  > widthTo)    return false;
      if (areaFrom   !== null && det.measurements.area   < areaFrom)   return false;
      if (areaTo     !== null && det.measurements.area   > areaTo)     return false;

      return true;
    });

    this.filteredDetections = filtered;

    if (this.detectionsPagination) {
      this.detectionsPagination.setTotalItems(filtered.length);
      this.loadDetectionsPage(1, filtered);
    } else {
      this.renderDetectionsTable(filtered);
    }
  }

  resetDetectionsFilter() {
    const modal = "#detections-filter-modal";

    document.querySelectorAll(`${modal} .date-picker__text`).forEach((el) => (el.textContent = "дд.мм.гггг"));
    this.filterCalendar.clearRange("detections-filter");

    document.querySelectorAll(`${modal} .detections-status-checkbox-input`).forEach(cb => (cb.checked = false));

    document.querySelectorAll(`${modal} .coord-input`).forEach((inp) => (inp.value = ""));

    this.filteredDetections = [...this.currentDetections];

    if (this.detectionsPagination) {
      this.detectionsPagination.setTotalItems(this.currentDetections.length);
      this.loadDetectionsPage(1, this.currentDetections);
    } else {
      this.renderDetectionsTable(this.currentDetections);
    }
  }

  // Экспорт таблицы дефектов
  initExport() {
    this.exportService = new ExportService();

    const excelLink = document.querySelector(".excel-link");
    const pdfLink = document.querySelector(".pdf-link");
    const csvLink = document.querySelector(".csv-link");

    if (excelLink) {
      excelLink.removeEventListener("click", this.mainExcelHandler);
      this.mainExcelHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.exportService.exportData("excel", this.filteredDefects, "defects_list");
      };
      excelLink.addEventListener("click", this.mainExcelHandler);
    }

    if (pdfLink) {
      pdfLink.removeEventListener("click", this.mainPdfHandler);
      this.mainPdfHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.exportService.exportData("pdf", this.filteredDefects, "defects_list");
      };
      pdfLink.addEventListener("click", this.mainPdfHandler);
    }

    if (csvLink) {
      csvLink.removeEventListener("click", this.mainCsvHandler);
      this.mainCsvHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.exportService.exportData("csv", this.filteredDefects, "defects_list");
      };
      csvLink.addEventListener("click", this.mainCsvHandler);
    }
  }

  // Экспорт таблицы обнаружений
  initDetectionsExport() {
    const exportService = new ExportService();

    const excelLink = document.querySelector(".detections-excel-link");
    const pdfLink = document.querySelector(".detections-pdf-link");
    const csvLink = document.querySelector(".detections-csv-link");

    const buildData = () =>
      this.filteredDetections.map((d) => ({
        name: this.detectionsModal.modal.dataset.currentDefect,
        date: d.date,
        time: d.time,
        length: d.measurements.length,
        width: d.measurements.width,
        area: d.measurements.area,
        type: this.getDefectType(this.detectionsModal.modal.dataset.currentDefect),
        status: d.status,
      }));

    const fileName = () =>
      `defect_${this.detectionsModal.modal.dataset.currentDefect}_detections`;

    if (excelLink) {
      excelLink.removeEventListener("click", this.excelHandler);
      this.excelHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        exportService.exportDetectionsData("excel", buildData(), fileName());
      };
      excelLink.addEventListener("click", this.excelHandler);
    }

    if (pdfLink) {
      pdfLink.removeEventListener("click", this.pdfHandler);
      this.pdfHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        exportService.exportDetectionsData("pdf", buildData(), fileName());
      };
      pdfLink.addEventListener("click", this.pdfHandler);
    }

    if (csvLink) {
      csvLink.removeEventListener("click", this.csvHandler);
      this.csvHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        exportService.exportDetectionsData("csv", buildData(), fileName());
      };
      csvLink.addEventListener("click", this.csvHandler);
    }
  }

  // Получение типа дефекта по наименованию
  getDefectType(defectName) {
    const defect = this.allDefects.find((d) => d.name === defectName);
    return defect ? defect.type : "Неизвестно";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.defectsPage = new DefectsPage();
});
