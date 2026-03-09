// Базовый класс для всех модальных окон
export class BaseModal {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.options = {
      closeOnEsc: true,
      closeOnOverlay: true,
      onOpen: null,
      onClose: null,
      ...options
    };
    
    if (!this.modal) return;
    
    this.init();
  }

  init() {
    if (this.options.closeOnOverlay) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    if (this.options.closeOnEsc) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.modal.classList.contains("active")) {
          this.close();
        }
      });
    }
  }

  open() {
    this.modal.classList.add("active");
    document.body.classList.add("modal-open");
    if (this.options.onOpen) this.options.onOpen();
  }

  close() {
    this.modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    if (this.options.onClose) this.options.onClose();
  }

  toggle() {
    if (this.modal.classList.contains("active")) {
      this.close();
    } else {
      this.open();
    }
  }

  destroy() {
    // Метод для очистки событий
    this.modal.removeEventListener("click", this.close);
    document.removeEventListener("keydown", this.close);
  }
}