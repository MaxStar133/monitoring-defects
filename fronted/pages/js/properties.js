document.addEventListener("DOMContentLoaded", function () {

    const openButtons = document.querySelectorAll('.heatmap-edit-btn');
    const modal = document.getElementById('heatmapModal');
    const cancelBtn = document.querySelector('.btn-cancel');
    const confirmBtn = document.querySelector('.btn-confirm');

    if (!modal || !cancelBtn || !confirmBtn) {
        console.error("Модальное окно или кнопки не найдены");
        return;
    }

    // Открытие (у тебя две кнопки "Изменить параметры")
    openButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    // Закрытие по кнопке Отменить
    cancelBtn.addEventListener('click', function () {
        modal.classList.remove('active');
    });

    // Закрытие по кнопке Подтвердить
    confirmBtn.addEventListener('click', function () {
        modal.classList.remove('active');
    });

    // Закрытие по клику вне окна
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

});