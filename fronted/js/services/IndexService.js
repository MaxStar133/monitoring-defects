// js/services/IndexService.js

// Мок-данные для разных дат
const mockStats = {
  // Статистика за 15.01.2026
  "15.01.2026": {
    total: 24,
    cracks: 8,
    delamination: 5,
    rivets: 11
  },
  // Статистика за 16.01.2026
  "16.01.2026": {
    total: 18,
    cracks: 6,
    delamination: 4,
    rivets: 8
  },
  // Статистика за 17.01.2026
  "17.01.2026": {
    total: 31,
    cracks: 12,
    delamination: 7,
    rivets: 12
  },
  // Статистика за 01.01.2026
  "01.01.2026": {
    total: 15,
    cracks: 4,
    delamination: 5,
    rivets: 6
  },
  // Статистика за сегодняшнюю дату
  [new Date().toLocaleDateString('ru-RU')]: {
    total: 27,
    cracks: 9,
    delamination: 6,
    rivets: 12
  }
};

// Мок-данные для уведомлений
const mockNotifications = [
  {
    id: "D-015",
    date: "01.01.2026",
    time: "14:30:12",
    status: "Критичный",
    type: "Отслоение"
  },
  {
    id: "D-014",
    date: "01.01.2026",
    time: "14:11:11",
    status: "Внимание",
    type: "Трещина"
  },
  {
    id: "D-013",
    date: "01.01.2026",
    time: "14:08:12",
    status: "Наблюдение",
    type: "Заклепка"
  }
];

export class IndexService {
  // Получить статистику за выбранную дату
  async getStatsForDate(date) {
    // TODO: заменить на реальный API
    // return await fetch(`/api/stats?date=${date}`).then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Если есть мок-данные для этой даты, возвращаем их
        if (mockStats[date]) {
          resolve(mockStats[date]);
        } else {
          // Иначе возвращаем случайную статистику
          resolve({
            total: Math.floor(Math.random() * 30) + 15,
            cracks: Math.floor(Math.random() * 10) + 5,
            delamination: Math.floor(Math.random() * 8) + 3,
            rivets: Math.floor(Math.random() * 12) + 5
          });
        }
      }, 200);
    });
  }

  // Получить список уведомлений
  async getNotifications() {
    // TODO: заменить на реальный API
    // return await fetch('/api/notifications').then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNotifications);
      }, 200);
    });
  }

  // Отметить уведомление как прочитанное
  async markNotificationAsRead(notificationId) {
    // TODO: заменить на реальный API
    // return await fetch(`/api/notifications/${notificationId}/read`, {
    //   method: 'POST'
    // }).then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 100);
    });
  }

  // Очистить все уведомления
  async clearAllNotifications() {
    // TODO: заменить на реальный API
    // return await fetch('/api/notifications/clear', {
    //   method: 'POST'
    // }).then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 100);
    });
  }

  // Калибровка координат
  async calibrateCoordinates(defectId) {
    // TODO: заменить на реальный API
    // return await fetch('/api/calibrate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ defectId })
    // }).then(res => res.json());
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `Координаты откалиброваны начиная с ${defectId}` 
        });
      }, 500);
    });
  }
}