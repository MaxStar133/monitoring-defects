import { BaseModal } from './BaseModal.js';

// Класс для управления позиционированием
export class ModalPosition {
  constructor(trigger, content, width, height) {
    this.trigger = trigger;
    this.content = content;
    this.width = width;
    this.height = height;
  }

  updatePosition() {
    const rect = this.trigger.getBoundingClientRect();

    let top = rect.bottom + 5;
    let left = rect.right - this.width;

    if (left < 10) left = 10;
    if (left + this.width > window.innerWidth - 10) {
      left = window.innerWidth - (this.width + 10);
    }
    if (top + this.height > window.innerHeight - 10) {
      top = rect.top - (this.height + 5);
    }

    this.content.style.position = "fixed";
    this.content.style.top = top + "px";
    this.content.style.left = left + "px";
  }
}

// Модальное окно с позиционированием
export class PositionedModal extends BaseModal {
  constructor(modalId, triggerId, contentSelector, width, height, options = {}) {
    super(modalId, options);
    
    this.trigger = document.getElementById(triggerId);
    this.content = document.querySelector(contentSelector);
    this.width = width;
    this.height = height;
    
    if (!this.trigger || !this.content) return;
    
    this.positionManager = new ModalPosition(this.trigger, this.content, width, height);
    this.initPositioned();
  }

  initPositioned() {
    this.trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.positionManager.updatePosition();
      this.open();
    });

    window.addEventListener("scroll", () => {
      if (this.modal.classList.contains("active")) {
        this.positionManager.updatePosition();
      }
    });

    window.addEventListener("resize", () => {
      if (this.modal.classList.contains("active")) {
        this.positionManager.updatePosition();
      }
    });
  }

  destroy() {
    super.destroy();
    this.trigger.removeEventListener("click", this.open);
    window.removeEventListener("scroll", this.positionManager.updatePosition);
    window.removeEventListener("resize", this.positionManager.updatePosition);
  }
}