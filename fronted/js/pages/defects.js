// Открытие модального окна фильтров
document.addEventListener("DOMContentLoaded", function () {
  // ===== ФИЛЬТРЫ НА ГЛАВНОЙ =====
  const filterBtn = document.getElementById("filter-btn");
  const filterModal = document.getElementById("filter-modal");
  const filterContent = document.querySelector(".filter-modal");

  if (filterBtn && filterModal && filterContent) {
    // Функция для обновления позиции модалки
    function updateFilterModalPosition() {
      const rect = filterBtn.getBoundingClientRect();

      // Базовая позиция под кнопкой
      let top = rect.bottom + 5; // 5px отступ снизу
      let left = rect.right - 400; // 400px - ширина модалки

      // Корректировка, если выходит за левый край
      if (left < 10) left = 10;

      // Корректировка, если выходит за правый край
      if (left + 400 > window.innerWidth - 10) {
        left = window.innerWidth - 410;
      }

      // Корректировка, если не помещается снизу
      if (top + 500 > window.innerHeight - 10) {
        top = rect.top - 500; // Показываем сверху
      }

      filterContent.style.position = "fixed";
      filterContent.style.top = top + "px";
      filterContent.style.left = left + "px";
    }

    filterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Обновляем позицию перед открытием
      updateFilterModalPosition();

      filterModal.classList.add("active");
      document.body.classList.add("modal-open");
    });

    // Обновляем позицию при скролле
    window.addEventListener("scroll", function () {
      if (filterModal.classList.contains("active")) {
        updateFilterModalPosition();
      }
    });

    // Обновляем позицию при ресайзе окна
    window.addEventListener("resize", function () {
      if (filterModal.classList.contains("active")) {
        updateFilterModalPosition();
      }
    });

    filterModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && filterModal.classList.contains("active")) {
        filterModal.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });
  }

  // Выпадающий список статуса
  const statusSelect = document.getElementById("status-select");
  const selectedStatus = document.getElementById("selected-status");
  const dropdownItems = document.querySelectorAll(".filter-dropdown__item");

  if (statusSelect) {
    statusSelect.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("active");
    });

    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        selectedStatus.textContent = this.textContent;
        statusSelect.classList.remove("active");
        statusSelect.dataset.value = this.dataset.value;
      });
    });

    document.addEventListener("click", function () {
      statusSelect.classList.remove("active");
    });
  }

  // Открытие модального окна параметров
  const paramsBtn = document.getElementById("params-btn");
  const paramsModal = document.getElementById("params-modal");

  if (paramsBtn && paramsModal) {
    paramsBtn.addEventListener("click", function () {
      paramsModal.classList.add("active");
      document.body.classList.add("modal-open");
    });

    paramsModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });
  }

  // Открытие модального окна истории обнаружений
  const detailBtns = document.querySelectorAll(".table-row__action-btn");
  const detectionsModal = document.getElementById("detections-modal");

  if (detailBtns.length > 0 && detectionsModal) {
    detailBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const defectId = this.dataset.id;
        detectionsModal.dataset.currentDefect = defectId;
        detectionsModal.classList.add("active");
        document.body.classList.add("modal-open");
      });
    });

    detectionsModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && detectionsModal.classList.contains("active")) {
        detectionsModal.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });
  }

  // Открытие модального окна подтверждения при нажатии на "Исправлен"
  const fixBtn = document.querySelector(".detections-header__btn");
  const fixModal = document.getElementById("fix-confirm-modal");

  if (fixBtn && fixModal) {
    fixBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      fixModal.classList.add("active");
    });

    fixModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && fixModal.classList.contains("active")) {
        fixModal.classList.remove("active");
      }
    });

    const cancelBtn = fixModal.querySelector(".alert-modal__btn--cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        fixModal.classList.remove("active");
      });
    }

    const confirmBtn = fixModal.querySelector(".alert-modal__btn--confirm");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        console.log("Дефект исправлен");
        fixModal.classList.remove("active");
      });
    }
  }
  // Открытие модального окна фильтров в обнаружениях с привязкой к кнопке
  const detectionsFilterBtn = document.getElementById("detections-filter-btn");
  const detectionsFilterModal = document.getElementById(
    "detections-filter-modal",
  );
  const detectionsFilterContent = document.querySelector(
    ".detections-filter-modal",
  );

  if (detectionsFilterBtn && detectionsFilterModal && detectionsFilterContent) {
    // Функция для обновления позиции модалки
    function updateFilterModalPosition() {
      const rect = detectionsFilterBtn.getBoundingClientRect();

      // Базовая позиция под кнопкой
      let top = rect.bottom + 5;
      let left = rect.right - 400; // 400px - ширина модалки

      // Корректировка, если выходит за левый край
      if (left < 10) left = 10;

      // Корректировка, если выходит за правый край
      if (left + 400 > window.innerWidth - 10) {
        left = window.innerWidth - 410;
      }

      // Корректировка, если выходит за нижний край
      if (top + 400 > window.innerHeight - 10) {
        top = rect.top - 405; // Показываем сверху от кнопки
      }

      detectionsFilterContent.style.position = "fixed";
      detectionsFilterContent.style.top = top + "px";
      detectionsFilterContent.style.left = left + "px";
    }

    detectionsFilterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Обновляем позицию перед открытием
      updateFilterModalPosition();

      detectionsFilterModal.classList.add("active");
    });

    // Обновляем позицию при скролле
    window.addEventListener("scroll", function () {
      if (detectionsFilterModal.classList.contains("active")) {
        updateFilterModalPosition();
      }
    });

    // Обновляем позицию при ресайзе окна
    window.addEventListener("resize", function () {
      if (detectionsFilterModal.classList.contains("active")) {
        updateFilterModalPosition();
      }
    });

    detectionsFilterModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        detectionsFilterModal.classList.contains("active")
      ) {
        detectionsFilterModal.classList.remove("active");
      }
    });
  }

  // ===== ВЫПАДАЮЩИЙ СПИСОК СТАТУСА В ФИЛЬТРАХ ОБНАРУЖЕНИЙ =====
  const detectionsStatusSelect = document.getElementById(
    "detections-status-select",
  );
  const detectionsSelectedStatus = document.getElementById(
    "detections-selected-status",
  );
  const detectionsDropdownItems = document.querySelectorAll(
    ".detections-filter-dropdown__item",
  );

  if (
    detectionsStatusSelect &&
    detectionsSelectedStatus &&
    detectionsDropdownItems.length
  ) {
    // Открытие/закрытие списка
    detectionsStatusSelect.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("active");
    });

    // Выбор элемента
    detectionsDropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        detectionsSelectedStatus.textContent = this.textContent;
        detectionsStatusSelect.classList.remove("active");
        detectionsStatusSelect.dataset.value = this.dataset.value;
      });
    });

    // Закрытие по клику вне списка
    document.addEventListener("click", function () {
      if (detectionsStatusSelect) {
        detectionsStatusSelect.classList.remove("active");
      }
    });
  }

  // ===== ПОКАЗ/СКРЫТИЕ КАРТИНКИ В ТАБЛИЦЕ =====
  // Функция для показа картинки
  function showImage(clickedLink) {
    // Находим родительскую строку
    const currentRow = clickedLink.closest(".detections-table-row");
    if (!currentRow) return;

    // Получаем ID строки
    const rowIndex = Array.from(
      document.querySelectorAll(".detections-table-row"),
    ).indexOf(currentRow);

    // Находим или создаем блок с картинкой для этой строки
    let imageRow = document.getElementById(`image-row-${rowIndex}`);

    if (!imageRow) {
      // Создаем блок с картинкой
      imageRow = document.createElement("div");
      imageRow.className = "detections-image-row";
      imageRow.id = `image-row-${rowIndex}`;
      imageRow.style.display = "none";

      // Копируем данные из текущей строки
      const dateCell = currentRow.querySelector(
        ".detections-table-row__cell--date",
      );
      const measurements = currentRow.querySelectorAll(
        ".detections-table-row__value",
      );
      const statusCell = currentRow.querySelector(
        ".detections-table-row__cell--status",
      );

      const dateHtml = dateCell ? dateCell.innerHTML : "";
      const length = measurements[0] ? measurements[0].textContent : "120";
      const width = measurements[1] ? measurements[1].textContent : "120";
      const area = measurements[2] ? measurements[2].textContent : "150";
      const statusText = statusCell ? statusCell.textContent : "Критичный";
      const statusClass = statusCell
        ? statusCell.className
        : "status--critical";

      // Создаем содержимое
      imageRow.innerHTML = `
<div class="detections-image-container">
  <!-- Строка с данными (такая же как оригинал, но с кнопкой "Скрыть") -->
  <div class="detections-table-row">
    <div class="detections-table-row__cell detections-table-row__cell--date">
      ${dateHtml}
    </div>
    <div class="detections-table-row__measurements">
      <span class="detections-table-row__value">${length}</span>
      <span class="detections-table-row__value">${width}</span>
      <span class="detections-table-row__value">${area}</span>
    </div>
    <div class="detections-table-row__cell detections-table-row__cell--status ${statusClass}">
      ${statusText}
    </div>
    <div class="detections-table-row__cell detections-table-row__cell--actions">
      <a href="#" class="detections-table-row__link hide-image">Скрыть</a>
    </div>
  </div>
  
  <!-- ТОЛЬКО ФОТО В ГОЛУБОМ ФОНЕ (без размеров) -->
  <div class="detections-image-frame">
    <div class="detections-image-wrapper">
      <img src="../images/detection-defect.png" alt="Дефект" class="detections-image">
    </div>
  </div>
</div>
`;

      // Вставляем после текущей строки
      currentRow.parentNode.insertBefore(imageRow, currentRow.nextSibling);
    }

    // Скрываем текущую строку и показываем блок с картинкой
    currentRow.style.display = "none";
    imageRow.style.display = "block";

    // Добавляем обработчик на кнопку "Скрыть"
    const hideLink = imageRow.querySelector(".hide-image");
    if (hideLink) {
      hideLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideImage(this);
      });
    }
  }

  // Функция для скрытия картинки
  function hideImage(clickedLink) {
    // Находим блок с картинкой
    const imageRow = clickedLink.closest(".detections-image-row");
    if (!imageRow) return;

    // Находим оригинальную строку (предыдущий элемент)
    const prevRow = imageRow.previousElementSibling;
    if (prevRow && prevRow.classList.contains("detections-table-row")) {
      prevRow.style.display = "";
    }

    // Удаляем блок с картинкой
    imageRow.remove();
  }

  // Навешиваем обработчики на все ссылки "Показать"
  document.querySelectorAll(".detections-table-row__link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // Проверяем, что это не ссылка "Скрыть"
      if (!this.classList.contains("hide-image")) {
        showImage(this);
      }
    });
  });
});
