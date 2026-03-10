import { PositionedModal } from "../core/PositionedModal.js";
import { Dropdown } from "../core/Dropdown.js";
import { BaseModal } from "../core/BaseModal.js";
import { ImageManager } from "../modals/ImageManager.js";
import { NotificationsPanel } from "../modals/NotificationsPanel.js";
import { FilterCalendar } from "../modals/FilterCalendar.js";
import { Pagination } from "../utils/Pagination.js";
import { DefectsService, getStatusClass } from "../services/DefectsService.js";


// Главный класс страницы
class DefectsPage {
  constructor() {
    console.log("DefectsPage constructor");
    this.defectsService = new DefectsService();
    this.allDefects = [];
    this.filteredDefects = [];
    this.currentPageDefects = [];

    this.init();
  }

  async init() {
    console.log("DefectsPage initialized - начало");

    // Инициализируем пагинацию
    const paginationContainer = document.querySelector(".pagination");
    console.log("Pagination container:", paginationContainer);
    if (paginationContainer) {
      this.pagination = new Pagination(paginationContainer, 15);
      this.pagination.setOnPageChange((page) => this.loadPage(page));
    }

    // Загружаем данные
    console.log("Загружаем данные...");
    await this.loadData();
    console.log("Данные загружены");

    // Инициализируем все модальные окна и фильтры
    this.initModals();
    this.initFilters();
    console.log("DefectsPage initialized - конец");
  }

  async loadData() {
    try {
      console.log("loadData: начало");
      this.allDefects = await this.defectsService.getUniqueDefects();
      console.log("loadData: получены дефекты:", this.allDefects);
      this.filteredDefects = [...this.allDefects];
      console.log("loadData: filteredDefects:", this.filteredDefects);

      if (this.pagination) {
        console.log("loadData: есть пагинация, total:", this.filteredDefects.length);
        this.pagination.setTotalItems(this.filteredDefects.length);
        this.loadPage(1);
      } else {
        console.log("loadData: нет пагинации, рендерим сразу");
        this.renderMainTable(this.filteredDefects);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  }

  loadPage(page) {
    console.log("loadPage:", page);
    const start = (page - 1) * this.pagination.itemsPerPage;
    const end = start + this.pagination.itemsPerPage;
    this.currentPageDefects = this.filteredDefects.slice(start, end);
    console.log("loadPage: currentPageDefects:", this.currentPageDefects);
    this.renderMainTable(this.currentPageDefects, page);
  }

  renderMainTable(defects, currentPage = 1) {
    console.log("renderMainTable: defects:", defects);
    const tableBody = document.querySelector(".defects-table");
    console.log("renderMainTable: tableBody:", tableBody);
    
    if (!tableBody) {
      console.error("Таблица .defects-table не найдена!");
      return;
    }

    const header = tableBody.querySelector(".table-header");
    console.log("renderMainTable: header:", header);
    
    tableBody.innerHTML = "";
    tableBody.appendChild(header);

    const isLastPage = currentPage === this.pagination?.totalPages;
    console.log("renderMainTable: isLastPage:", isLastPage);

    defects.forEach((defect, index) => {
      const statusClass = `status--${getStatusClass(defect.status)}`;
      const row = document.createElement("div");
      row.className = "table-row";

      // Добавляем класс table-row--last только для последней строки на последней странице
      if (isLastPage && index === defects.length - 1) {
        row.classList.add("table-row--last");
      }

      row.innerHTML = `
        <div class="table-row__cell table-row__cell--id">${defect.id}</div>
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
            <button class="table-row__action-btn" data-id="${defect.id}">Подробнее</button>
        </div>
      `;
      tableBody.appendChild(row);
    });

    console.log("renderMainTable: добавлено строк:", defects.length);
    this.initDetailButtons();
  }

  async renderDetectionsModal(defectId) {
    try {
      const details = await this.defectsService.getDefectDetails(defectId);

      // Сохраняем ID в модальном окне
      const modal = document.getElementById("detections-modal");
      if (modal) {
        modal.dataset.currentDefect = defectId;
      }

      // Обновляем заголовок
      const headerId = document.querySelector(".detections-header__id");
      const headerType = document.querySelector(".detections-header__type");
      if (headerId) headerId.textContent = details.id;
      if (headerType) headerType.textContent = details.type;

      // Обновляем статистику
      if (details.statistics && details.statistics.firstDetection) {
        const statItems = document.querySelectorAll(".detections-statistics__item");
        if (statItems.length >= 3) {
          statItems[0].innerHTML = `
            <span class="detections-statistics__label">Длина:</span>
            <span class="detections-statistics__value">
                ${details.statistics.firstDetection.measurements.length} → 
                ${details.statistics.lastDetection.measurements.length} мм
            </span>
            <span class="detections-statistics__percent">(${details.statistics.growth.length})</span>
          `;
          statItems[1].innerHTML = `
            <span class="detections-statistics__label">Ширина:</span>
            <span class="detections-statistics__value">
                ${details.statistics.firstDetection.measurements.width} → 
                ${details.statistics.lastDetection.measurements.width} мм
            </span>
            <span class="detections-statistics__percent">(${details.statistics.growth.width})</span>
          `;
          statItems[2].innerHTML = `
            <span class="detections-statistics__label">Площадь:</span>
            <span class="detections-statistics__value">
                ${details.statistics.firstDetection.measurements.area} → 
                ${details.statistics.lastDetection.measurements.area} мм²
            </span>
            <span class="detections-statistics__percent">(${details.statistics.growth.area})</span>
          `;
        }
      }

      // Обновляем таблицу обнаружений
      const tableBody = document.querySelector("#detections-modal .detections-table");
      if (tableBody) {
        const header = tableBody.querySelector(".detections-table-header");
        tableBody.innerHTML = "";
        tableBody.appendChild(header);

        details.detections.forEach((detection, index) => {
          const statusClass = `status--${getStatusClass(detection.status)}`;
          const row = document.createElement("div");
          row.className = "detections-table-row";
          if (index === details.detections.length - 1) {
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
      }

      // Обновляем пагинацию в модальном окне
      const paginationInfo = document.querySelector(".detections-pagination__info");
      if (paginationInfo) {
        paginationInfo.textContent = `Результаты 1-${details.detections.length} из ${details.detections.length}`;
      }
    } catch (error) {
      console.error("Ошибка загрузки деталей дефекта:", error);
    }
  }

  initDetailButtons() {
    console.log("initDetailButtons: инициализация кнопок");
    const detailBtns = document.querySelectorAll(".table-row__action-btn");
    console.log("initDetailButtons: найдено кнопок:", detailBtns.length);
    
    detailBtns.forEach((btn) => {
      btn.removeEventListener("click", this.detailHandler);
      btn.addEventListener("click", this.detailHandler.bind(this));
    });
  }

  async detailHandler(e) {
    e.preventDefault();
    const defectId = e.currentTarget.dataset.id;
    console.log("detailHandler: клик по дефекту", defectId);

    await this.renderDetectionsModal(defectId);
    this.detectionsModal.open();

    console.log("Открыт дефект:", defectId);
  }

  initModals() {
    console.log("initModals: инициализация модальных окон");
    
    // Модальное окно истории обнаружений
    this.detectionsModal = new BaseModal("detections-modal", {
      closeOnEsc: true,
      closeOnOverlay: true,
    });

    // Модальное окно подтверждения
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
        const defectId = this.detectionsModal.modal.dataset.currentDefect;
        if (defectId) {
          const response = await this.defectsService.markAsFixed(defectId);
          if (response.success) {
            console.log(response.message);
          }
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
    console.log("initFilters: инициализация фильтров");
    
    const filterCalendar = new FilterCalendar();

    // Фильтры на странице дефектов
    if (document.getElementById("filter-btn")) {
      const filterModal = new PositionedModal(
        "filter-modal",
        "filter-btn",
        ".filter-modal",
        400,
        500,
      );

      const originalOpen = filterModal.open;
      filterModal.open = function () {
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
        400,
      );

      const originalOpen = detectionsFilterModal.open;
      detectionsFilterModal.open = function () {
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
        ".detections-filter-dropdown__item",
      );
    }

    // Управление изображениями
    if (document.querySelector(".detections-table-row__link")) {
      new ImageManager();
    }

    // Панель уведомлений
    if (document.getElementById("notificationsPanel")) {
      const notifications = new NotificationsPanel();
    }
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  window.defectsPage = new DefectsPage();
});