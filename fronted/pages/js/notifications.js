class NotificationsPanel {
    constructor(buttonSelector, panelSelector) {
        this.button = document.querySelector(buttonSelector);
        this.panel = document.querySelector(panelSelector);
        this.overlay = this.panel?.closest('.notifications-overlay'); // Находим оверлей
        
        this.boundHandleEscape = this.handleEscape.bind(this);
        
        this.init();
    }

    init() {
        if (!this.button || !this.panel) return;

        // Открытие/закрытие по кнопке
        this.button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Закрытие по клику на оверлей (затемненную область)
        if (this.overlay) {
            this.overlay.addEventListener("click", (e) => {
                // Если клик был именно по оверлею, а не по панели
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }

        // Закрытие по клику вне панели (альтернативный способ)
        document.addEventListener("click", (e) => {
            if (!this.panel.contains(e.target) && 
                !this.button.contains(e.target) && 
                this.panel.classList.contains("active")) {
                this.close();
            }
        });

        // Закрытие по Escape
        document.addEventListener("keydown", this.boundHandleEscape);
    }

    handleEscape(e) {
        if (e.key === "Escape" && this.panel.classList.contains("active")) {
            this.close();
        }
    }

    open() {
        this.panel.classList.add("active");
        if (this.overlay) {
            this.overlay.classList.add("active");
        }
    }

    close() {
        this.panel.classList.remove("active");
        if (this.overlay) {
            this.overlay.classList.remove("active");
        }
    }

    toggle() {
        if (this.panel.classList.contains("active")) {
            this.close();
        } else {
            this.open();
        }
    }

    destroy() {
        this.button.removeEventListener("click", this.toggle);
        document.removeEventListener("click", this.close);
        document.removeEventListener("keydown", this.boundHandleEscape);
        if (this.overlay) {
            this.overlay.removeEventListener("click", this.close);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new NotificationsPanel(
        ".header__notifications",
        "#notificationsPanel"
    );
});