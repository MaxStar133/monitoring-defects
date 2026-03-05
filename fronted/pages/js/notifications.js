class NotificationsPanel {

    constructor(buttonSelector, panelSelector) {

        this.button = document.querySelector(buttonSelector);
        this.panel = document.querySelector(panelSelector);

        this.init();
    }

    init() {

        if (!this.button || !this.panel) return;

        this.button.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggle();
        });

        document.addEventListener("click", (e) => {

            if (!this.panel.contains(e.target) &&
                !this.button.contains(e.target)) {

                this.close();
            }

        });
    }

    open() {
        this.panel.classList.add("active");
    }

    close() {
        this.panel.classList.remove("active");
    }

    toggle() {

        if (this.panel.classList.contains("active")) {
            this.close();
        } else {
            this.open();
        }

    }

}


document.addEventListener("DOMContentLoaded", () => {

    new NotificationsPanel(
        ".header__notifications",
        "#notificationsPanel"
    );

});