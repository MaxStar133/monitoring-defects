// js/services/StatisticsService.js

// Мок-данные для разных дат
const mockStatistics = {
  // Статистика за 15.01.2026
  "01.01.2026": {
    total: 24,
    cracks: 8,
    delamination: 5,
    rivets: 11
  },
  // Статистика за 16.01.2026
  "04.01.2026": {
    total: 18,
    cracks: 6,
    delamination: 4,
    rivets: 8
  },
  // Статистика за 17.01.2026
  "06.01.2026": {
    total: 31,
    cracks: 12,
    delamination: 7,
    rivets: 12
  },
  // Статистика за 01.01.2026
  "09.01.2026": {
    total: 15,
    cracks: 4,
    delamination: 5,
    rivets: 6
  }
};
export class StatisticsService {

  async getStatistics() {

    return new Promise((resolve) => {

      setTimeout(() => {

        resolve(mockStatistics);

      }, 200);

    });

  }

}
//export class StatisticsService {
//  async getStatistics(date) {
//   // TODO: заменить на реальный API
//    // return await fetch(`/api/stats?date=${date}`).then(res => res.json());
//    
//    return new Promise((resolve) => {
//      setTimeout(() => {
//        // Если есть мок-данные для этой даты, возвращаем их
//        if (mockStatistics[date]) {
//          resolve(mockStatistics[date]);
//        } else {
//          // Иначе возвращаем статистику по умолчанию
//         resolve({
//            total: Math.floor(Math.random() * 30) + 10,
//            cracks: Math.floor(Math.random() * 10) + 2,
//            delamination: Math.floor(Math.random() * 8) + 1,
//            rivets: Math.floor(Math.random() * 12) + 3
//          });
//        }
//      }, 200); // Имитация задержки сети
//    });
//  }
//}