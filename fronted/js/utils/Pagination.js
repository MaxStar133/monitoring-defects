export class Pagination {
    constructor(container, itemsPerPage = 15, classPrefix = 'pagination') {
        this.container = container;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalItems = 0;
        this.totalPages = 1;
        this.onPageChange = null;
        this.classPrefix = classPrefix;

        this.init();
    }

    init() {
        this.prevBtn = this.container.querySelector(`.${this.classPrefix}__nav-btn--prev`);
        this.nextBtn = this.container.querySelector(`.${this.classPrefix}__nav-btn--next`);
        this.infoEl = this.container.querySelector(`.${this.classPrefix}__info`);
        this.controlsEl = this.container.querySelector(`.${this.classPrefix}__controls`);

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.goToPrevPage());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.goToNextPage());
        }
    }

    setTotalItems(total) {
        this.totalItems = total;
        this.totalPages = Math.ceil(total / this.itemsPerPage);
        this.render();
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.render();

        if (this.onPageChange) {
            this.onPageChange(this.currentPage);
        }
    }

    goToPrevPage() {
        this.goToPage(this.currentPage - 1);
    }

    goToNextPage() {
        this.goToPage(this.currentPage + 1);
    }

    render() {
        // Счётчик результатов
        if (this.infoEl) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
            this.infoEl.textContent = `Результаты ${start}-${end} из ${this.totalItems}`;
        }

        // Кнопки назад / вперёд
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentPage === 1;
            this.prevBtn.style.opacity = this.currentPage === 1 ? '0.5' : '1';
            this.prevBtn.style.cursor = this.currentPage === 1 ? 'not-allowed' : 'pointer';
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentPage === this.totalPages;
            this.nextBtn.style.opacity = this.currentPage === this.totalPages ? '0.5' : '1';
            this.nextBtn.style.cursor = this.currentPage === this.totalPages ? 'not-allowed' : 'pointer';
        }

        // Кнопки страниц
        if (this.controlsEl) {
            const oldPages = this.controlsEl.querySelectorAll(`.${this.classPrefix}__page, .${this.classPrefix}__dots`);
            oldPages.forEach(el => el.remove());

            const pagesContainer = document.createElement('div');
            pagesContainer.style.display = 'contents';

            const maxVisiblePages = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            // Первая страница и многоточие
            if (startPage > 1) {
                const firstPage = this.createPageButton(1);
                pagesContainer.appendChild(firstPage);

                if (startPage > 2) {
                    const dots = document.createElement('span');
                    dots.className = `${this.classPrefix}__dots`;
                    dots.textContent = '...';
                    pagesContainer.appendChild(dots);
                }
            }

            // Страницы диапазона
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = this.createPageButton(i);
                if (i === this.currentPage) {
                    pageBtn.classList.add(`${this.classPrefix}__page--active`);
                }
                pagesContainer.appendChild(pageBtn);
            }

            // Последняя страница и многоточие
            if (endPage < this.totalPages) {
                if (endPage < this.totalPages - 1) {
                    const dots = document.createElement('span');
                    dots.className = `${this.classPrefix}__dots`;
                    dots.textContent = '...';
                    pagesContainer.appendChild(dots);
                }

                const lastPage = this.createPageButton(this.totalPages);
                lastPage.classList.add(`${this.classPrefix}__page--last`);
                pagesContainer.appendChild(lastPage);
            }

            if (this.prevBtn) {
                this.prevBtn.insertAdjacentElement('afterend', pagesContainer);
            } else {
                this.controlsEl.appendChild(pagesContainer);
            }
        } else {
            console.error(`Pagination: controlsEl не найден (prefix: ${this.classPrefix})`);
        }
    }

    createPageButton(pageNumber) {
        const btn = document.createElement('button');
        btn.className = `${this.classPrefix}__page`;
        btn.textContent = pageNumber;
        btn.addEventListener('click', () => this.goToPage(pageNumber));
        return btn;
    }

    setOnPageChange(callback) {
        this.onPageChange = callback;
    }
}
