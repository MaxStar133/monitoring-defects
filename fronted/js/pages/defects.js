// Открытие модального окна фильтров
document.addEventListener('DOMContentLoaded', function() {
  const filterBtn = document.getElementById('filter-btn');
  const modal = document.getElementById('filter-modal');
  
  if (filterBtn && modal) {
    filterBtn.addEventListener('click', function() {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    });
    
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  }

  // Выпадающий список статуса
  const statusSelect = document.getElementById('status-select');
  const selectedStatus = document.getElementById('selected-status');
  const dropdownItems = document.querySelectorAll('.filter-dropdown__item');
  
  if (statusSelect) {
    statusSelect.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
    });
    
    dropdownItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        selectedStatus.textContent = this.textContent;
        statusSelect.classList.remove('active');
        statusSelect.dataset.value = this.dataset.value;
      });
    });
    
    document.addEventListener('click', function() {
      statusSelect.classList.remove('active');
    });
  }
  
  // Открытие модального окна параметров
  const paramsBtn = document.getElementById('params-btn');
  const paramsModal = document.getElementById('params-modal');

  if (paramsBtn && paramsModal) {
    paramsBtn.addEventListener('click', function() {
      paramsModal.classList.add('active');
      document.body.classList.add('modal-open');
    });
    
    paramsModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  }

  // Открытие модального окна истории обнаружений
  const detailBtns = document.querySelectorAll('.table-row__action-btn');
  const detectionsModal = document.getElementById('detections-modal');
  
  if (detailBtns.length > 0 && detectionsModal) {
    detailBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const defectId = this.dataset.id;
        detectionsModal.dataset.currentDefect = defectId;
        detectionsModal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });
    
    detectionsModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && detectionsModal.classList.contains('active')) {
        detectionsModal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  }
});