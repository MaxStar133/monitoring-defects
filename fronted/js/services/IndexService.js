// Мок-данные статистики по датам
const mockStats = {
  "15.01.2026": { total: 24, cracks: 8, delamination: 5, rivets: 11 },
  "16.01.2026": { total: 18, cracks: 6, delamination: 4, rivets: 8 },
  "17.01.2026": { total: 31, cracks: 12, delamination: 7, rivets: 12 },
  "01.01.2026": { total: 15, cracks: 4, delamination: 5, rivets: 6 },
  [new Date().toLocaleDateString('ru-RU')]: { total: 27, cracks: 9, delamination: 6, rivets: 12 }
};

// Мок-данные уведомлений
const mockNotifications = [
  { name: "D-015", date: "01.01.2026", time: "14:30:12", status: "Критичный", type: "Отслоение" },
  { name: "D-014", date: "01.01.2026", time: "14:11:11", status: "Внимание",  type: "Трещина"   },
  { name: "D-013", date: "01.01.2026", time: "14:08:12", status: "Наблюдение", type: "Заклепка" }
];

export class IndexService {
  // Статистика за выбранную дату
  async getStatsForDate(date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStats[date] ?? { total: 0, cracks: 0, delamination: 0, rivets: 0 });
      }, 200);
    });
  }

  // Список уведомлений
  async getNotifications() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNotifications), 200);
    });
  }

  // Отметить уведомление как прочитанное
  async markNotificationAsRead(notificationName) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 100);
    });
  }

  // Очистить все уведомления
  async clearAllNotifications() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 100);
    });
  }

  // Калибровка координат
  async calibrateCoordinates(defectName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Координаты откалиброваны начиная с ${defectName}`
        });
      }, 500);
    });
  }
}
