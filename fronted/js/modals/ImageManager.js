// js/modals/ImageManager.js

// Module-level reference so re-instantiation cleanly removes the old listener
let activeClickHandler = null;

export class ImageManager {
    constructor() {
        if (activeClickHandler) {
            document.removeEventListener('click', activeClickHandler);
        }
        activeClickHandler = this._onClick.bind(this);
        document.addEventListener('click', activeClickHandler);
    }

    // Kept for backward compatibility with Defects.js
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

    _showImage(link) {
        const currentRow = link.closest('.detections-table-row');
        if (!currentRow) return;

        // Already showing — skip
        const next = currentRow.nextElementSibling;
        if (next && next.classList.contains('detections-image-row')) return;

        const imageUrl = link.dataset.image || '../images/detection-defect.png';

        // Build image row (only the frame — original row stays untouched)
        const imageRow = document.createElement('div');
        imageRow.className = 'detections-image-row';
        // CSS sets order:1 on .detections-table-row; default order:0 would push
        // imageRow to the top of the flex table regardless of DOM position.
        imageRow.style.order = '1';
        imageRow.innerHTML = `
            <div class="detections-image-frame">
                <div class="detections-image-wrapper">
                    <img src="${imageUrl}" alt="Дефект" class="detections-image">
                </div>
            </div>
        `;

        // Swap link text in place so the row never leaves the DOM
        link.textContent = 'Скрыть';
        link.classList.add('hide-image');

        currentRow.after(imageRow);

        // Scroll so the clicked row stays visible; imageRow appears right below it.
        // block:'nearest' = no scroll if row is already fully visible.
        currentRow.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }

    _hideImage(link) {
        const currentRow = link.closest('.detections-table-row');
        if (!currentRow) return;

        // Remove image row
        const imageRow = currentRow.nextElementSibling;
        if (imageRow && imageRow.classList.contains('detections-image-row')) {
            imageRow.remove();
        }

        // Restore link text
        link.textContent = 'Показать';
        link.classList.remove('hide-image');

        currentRow.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
}
