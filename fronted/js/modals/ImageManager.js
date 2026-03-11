// js/modals/ImageManager.js

export class ImageManager {
    constructor() {
        this.init();
    }

    showImage(clickedLink) {
        // Находим родительскую строку
        const currentRow = clickedLink.closest(".detections-table-row");
        if (!currentRow) return;

        // Получаем URL изображения из data-атрибута
        const imageUrl = clickedLink.dataset.image || "../images/detection-defect.png";

        // Получаем индекс строки
        const rowIndex = Array.from(
            document.querySelectorAll(".detections-table-row:not(.detections-image-row .detections-table-row)")
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
            const dateCell = currentRow.querySelector(".detections-table-row__cell--date");
            const measurements = currentRow.querySelectorAll(".detections-table-row__value");
            const statusCell = currentRow.querySelector(".detections-table-row__cell--status");

            const dateHtml = dateCell ? dateCell.innerHTML : "";
            const length = measurements[0] ? measurements[0].textContent : "120";
            const width = measurements[1] ? measurements[1].textContent : "120";
            const area = measurements[2] ? measurements[2].textContent : "150";
            const statusText = statusCell ? statusCell.textContent : "Критичный";
            const statusClass = statusCell ? statusCell.className : "status--critical";

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
                    
                    <!-- Фото -->
                    <div class="detections-image-frame">
                        <div class="detections-image-wrapper">
                            <img src="${imageUrl}" alt="Дефект" class="detections-image">
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
            hideLink.addEventListener("click", (e) => {
                e.preventDefault();
                this.hideImage(e.target);
            });
        }
    }

    hideImage(clickedElement) {
        // Находим блок с картинкой
        const imageRow = clickedElement.closest(".detections-image-row");
        if (!imageRow) return;

        // Находим оригинальную строку (предыдущий элемент)
        const prevRow = imageRow.previousElementSibling;
        if (prevRow && prevRow.classList.contains("detections-table-row")) {
            prevRow.style.display = "";
        }

        // Удаляем блок с картинкой
        imageRow.remove();
    }

    init() {
        // Используем MutationObserver для отслеживания новых ссылок
        const observer = new MutationObserver(() => {
            this.attachEventHandlers();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Первоначальная привязка обработчиков
        this.attachEventHandlers();
    }

    attachEventHandlers() {
        document.querySelectorAll(".detections-table-row__link").forEach((link) => {
            // Пропускаем ссылки "Скрыть"
            if (link.classList.contains("hide-image")) return;

            // Удаляем старый обработчик, если есть
            link.removeEventListener("click", this.handleClick);
            
            // Добавляем новый обработчик
            link.addEventListener("click", this.handleClick);
        });
    }

    handleClick = (e) => {
        e.preventDefault();
        // Проверяем, что это не ссылка "Скрыть"
        if (!e.currentTarget.classList.contains("hide-image")) {
            this.showImage(e.currentTarget);
        }
    }
}