// Открытие модального окна фильтров
document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.getElementById("filter-btn");
  const modal = document.getElementById("filter-modal");

  if (filterBtn && modal) {
    filterBtn.addEventListener("click", function () {
      modal.classList.add("active");
      document.body.classList.add("modal-open");
    });

    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        modal.classList.remove("active");
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

  // Открытие модального окна фильтров в обнаружениях
  const detectionsFilterBtn = document.getElementById("detections-filter-btn");
  const detectionsFilterModal = document.getElementById(
    "detections-filter-modal",
  );

  if (detectionsFilterBtn && detectionsFilterModal) {
    detectionsFilterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      detectionsFilterModal.classList.add("active");
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
});