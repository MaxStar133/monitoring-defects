const mockSchemaData = {
  beltLength: 1200,
  zeroPosition: 400,
  segments: [
    { start: 0,   end: 130, density: 'high'   },
    { start: 130, end: 230, density: 'medium' },
    { start: 400, end: 580, density: 'high'   },
    { start: 650, end: 750, density: 'medium' },
    { start: 900, end: 980, density: 'high'   },
    { start: 980, end: 1060, density: 'low'   },
  ]
};

const mockHeatmapData = {
  beltLength: 1200,
  segments: [
    { start: 0,    end: 130,  density: 'high'   },
    { start: 130,  end: 230,  density: 'medium'  },
    { start: 230,  end: 370,  density: 'none'    },
    { start: 370,  end: 555,  density: 'none'    },
    { start: 555,  end: 645,  density: 'high'    },
    { start: 645,  end: 730,  density: 'none'    },
    { start: 730,  end: 775,  density: 'medium'  },
    { start: 775,  end: 820,  density: 'none'    },
    { start: 820,  end: 900,  density: 'none'    },
    { start: 900,  end: 980,  density: 'none'    },
    { start: 980,  end: 1060, density: 'low'     },
    { start: 1060, end: 1200, density: 'none'    },
  ]
};

const mockStatistics = {
  "01.01.2026": { total: 24, cracks: 8,  delamination: 5,  rivets: 11 },
  "02.01.2026": { total: 12, cracks: 4,  delamination: 3,  rivets: 5  },
  "03.01.2026": { total: 20, cracks: 7,  delamination: 6,  rivets: 7  },
  "04.01.2026": { total: 18, cracks: 6,  delamination: 4,  rivets: 8  },
  "05.01.2026": { total: 9,  cracks: 2,  delamination: 3,  rivets: 4  },
  "06.01.2026": { total: 31, cracks: 12, delamination: 7,  rivets: 12 },
  "07.01.2026": { total: 16, cracks: 5,  delamination: 4,  rivets: 7  },
  "08.01.2026": { total: 22, cracks: 8,  delamination: 6,  rivets: 8  },
  "09.01.2026": { total: 15, cracks: 4,  delamination: 5,  rivets: 6  },
  "10.01.2026": { total: 28, cracks: 10, delamination: 8,  rivets: 10 },
  "11.01.2026": { total: 11, cracks: 3,  delamination: 2,  rivets: 6  },
  "12.01.2026": { total: 35, cracks: 14, delamination: 9,  rivets: 12 },
  "13.01.2026": { total: 19, cracks: 7,  delamination: 5,  rivets: 7  },
  "14.01.2026": { total: 26, cracks: 9,  delamination: 7,  rivets: 10 },
  "15.01.2026": { total: 14, cracks: 5,  delamination: 4,  rivets: 5  },
  "16.01.2026": { total: 23, cracks: 8,  delamination: 6,  rivets: 9  },
  "17.01.2026": { total: 30, cracks: 11, delamination: 8,  rivets: 11 },
  "18.01.2026": { total: 17, cracks: 6,  delamination: 4,  rivets: 7  },
  "19.01.2026": { total: 21, cracks: 7,  delamination: 5,  rivets: 9  },
  "20.01.2026": { total: 13, cracks: 4,  delamination: 3,  rivets: 6  },
};

// Парсинг даты из строки формата ДД.ММ.ГГГГ
function parseDate(str) {
  const [d, m, y] = str.split(".");
  const date = new Date(+y, +m - 1, +d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export class StatisticsService {

  // Все данные статистики
  async getStatistics() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStatistics), 200);
    });
  }

  // Статистика за диапазон дат
  async getStatisticsForRange(startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = {};
        for (const [dateStr, data] of Object.entries(mockStatistics)) {
          const d = parseDate(dateStr);
          if (d >= startDate && d <= endDate) {
            result[dateStr] = data;
          }
        }
        resolve(result);
      }, 200);
    });
  }

  // Данные тепловой карты ленты
  async getHeatmapData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockHeatmapData), 200);
    });
  }

  // Данные схемы ленты
  async getSchemaData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSchemaData), 200);
    });
  }

}
