// js/modals/ImageManager.js

let activeClickHandler = null;

export class ImageManager {
    constructor() {
        if (activeClickHandler) {
            document.removeEventListener('click', activeClickHandler);
        }
        activeClickHandler = this._onClick.bind(this);
        document.addEventListener('click', activeClickHandler);
    }


    attachEventHandlers() {}
    init() {}

    _onClick(e) {
        const link = e.target.closest('.detections-table-row__link');
        if (!link) return;

        e.preventDefault();
        e.stopPropagation();
        link.blur();

        if (link.classList.contains('hide-image')) {
            this._hideImage(link);
        } else {
            this._showImage(link);
        }
    }

    _closeExistingImage(callback) {
        const existingRow = document.querySelector('.detections-image-row');
        if (!existingRow) {
            callback && callback();
            return;
        }

        const prevRow = existingRow.previousElementSibling;
        if (prevRow) {
            const activeLink = prevRow.querySelector('.detections-table-row__link.hide-image');
            if (activeLink) {
                activeLink.textContent = 'Показать';
                activeLink.classList.remove('hide-image');
            }
        }

        existingRow.classList.add('detections-image-row--closing');
        existingRow.addEventListener('animationend', () => {
            existingRow.remove();
            callback && callback();
        }, { once: true });
    }

    _showImage(link) {
        const currentRow = link.closest('.detections-table-row');
        if (!currentRow) return;

        const next = currentRow.nextElementSibling;
        if (next && next.classList.contains('detections-image-row')) return;

        const imageUrl = link.dataset.image || '../images/detection-defect.png';

        const insertImage = () => {
            const imageRow = document.createElement('div');
            imageRow.className = 'detections-image-row detections-image-row--animating';
            imageRow.style.order = '1';
            imageRow.innerHTML = `
                <div class="detections-image-frame">
                    <div class="detections-image-wrapper">
                        <img src="${imageUrl}" alt="Дефект" class="detections-image">
                    </div>
                </div>
            `;

            link.textContent = 'Скрыть';
            link.classList.add('hide-image');

            currentRow.after(imageRow);

            requestAnimationFrame(() => {
                imageRow.classList.remove('detections-image-row--animating');
            });

            currentRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        this._closeExistingImage(insertImage);
    }

    _hideImage(link) {
        const currentRow = link.closest('.detections-table-row');
        if (!currentRow) return;

        const imageRow = currentRow.nextElementSibling;
        if (imageRow && imageRow.classList.contains('detections-image-row')) {
            link.textContent = 'Показать';
            link.classList.remove('hide-image');

            imageRow.classList.add('detections-image-row--closing');
            imageRow.addEventListener('animationend', () => {
                imageRow.remove();
                currentRow.scrollIntoView({ behavior: 'instant', block: 'nearest' });
            }, { once: true });
        }
    }
}
