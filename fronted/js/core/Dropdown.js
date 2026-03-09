// Класс для выпадающих списков
export class Dropdown {
  constructor(selectId, selectedTextId, itemsSelector) {
    this.select = document.getElementById(selectId);
    this.selectedText = document.getElementById(selectedTextId);
    this.items = document.querySelectorAll(itemsSelector);
    
    if (!this.select) return;
    
    this.init();
  }

  init() {
    this.select.addEventListener("click", (e) => {
      e.stopPropagation();
      this.select.classList.toggle("active");
    });

    this.items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectedText.textContent = item.textContent;
        this.select.classList.remove("active");
        this.select.dataset.value = item.dataset.value;
      });
    });

    document.addEventListener("click", () => {
      this.select.classList.remove("active");
    });
  }

  destroy() {
    this.select.removeEventListener("click", this.toggle);
    this.items.forEach(item => {
      item.removeEventListener("click", this.selectItem);
    });
  }
}