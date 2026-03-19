export { getStatusClass };

function getStatusClass(status) {
    switch(status) {
        case 'Критичный': return 'critical';
        case 'Внимание': return 'warning';
        case 'Наблюдение': return 'normal';
        default: return 'normal';
    }
}

const mockUniqueDefects = [
    {
        name: "D-016",
        firstDetection: {
            date: "15.01.2026",
            time: "14:30:12",
            length: 350,
            width: 250
        },
        type: "Отслоение",
        status: "Критичный"
    },
     {
        name: "D-016",
        firstDetection: {
            date: "15.01.2026",
            time: "14:30:12",
            length: 350,
            width: 250
        },
        type: "Отслоение",
        status: "Критичный"
    }, {
        name: "D-016",
        firstDetection: {
            date: "15.01.2026",
            time: "14:30:12",
            length: 350,
            width: 250
        },
        type: "Отслоение",
        status: "Критичный"
    }, {
        name: "D-016",
        firstDetection: {
            date: "15.01.2026",
            time: "14:30:12",
            length: 350,
            width: 250
        },
        type: "Отслоение",
        status: "Критичный"
    }, {
        name: "D-016",
        firstDetection: {
            date: "15.01.2026",
            time: "14:30:12",
            length: 350,
            width: 250
        },
        type: "Отслоение",
        status: "Критичный"
    },
    {
        name: "D-015",
        firstDetection: {
            date: "01.01.2026",
            time: "14:30:12",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Критичный"
    },
    {
        name: "D-014",
        firstDetection: {
            date: "01.01.2026",
            time: "14:11:11",
            length: 150,
            width: 250
        },
        type: "Трещина",
        status: "Внимание"
    },
    {
        name: "D-013",
        firstDetection: {
            date: "01.01.2026",
            time: "14:08:12",
            length: 150,
            width: 250
        },
        type: "Заклепка",
        status: "Наблюдение"
    },
    {
        name: "D-012",
        firstDetection: {
            date: "01.01.2026",
            time: "12:30:17",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Наблюдение"
    },
    {
        name: "D-011",
        firstDetection: {
            date: "01.01.2026",
            time: "11:30:15",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Наблюдение"
    },
    {
        name: "D-010",
        firstDetection: {
            date: "01.01.2026",
            time: "08:30:17",
            length: 150,
            width: 250
        },
        type: "Заклепка",
        status: "Наблюдение"
    },
    {
        name: "D-009",
        firstDetection: {
            date: "01.01.2026",
            time: "05:26:16",
            length: 150,
            width: 250
        },
        type: "Трещина",
        status: "Наблюдение"
    },
    {
        name: "D-008",
        firstDetection: {
            date: "01.01.2026",
            time: "03:30:17",
            length: 150,
            width: 250
        },
        type: "Заклепка",
        status: "Наблюдение"
    },
    {
        name: "D-007",
        firstDetection: {
            date: "01.01.2026",
            time: "01:30:15",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Наблюдение"
    },
    {
        name: "D-006",
        firstDetection: {
            date: "01.01.2026",
            time: "00:32:15",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Наблюдение"
    },
    {
        name: "D-005",
        firstDetection: {
            date: "01.01.2026",
            time: "00:26:15",
            length: 150,
            width: 250
        },
        type: "Трещина",
        status: "Наблюдение"
    },
    {
        name: "D-004",
        firstDetection: {
            date: "01.01.2026",
            time: "00:22:55",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Наблюдение"
    },
    {
        name: "D-003",
        firstDetection: {
            date: "01.01.2026",
            time: "00:12:25",
            length: 150,
            width: 250
        },
        type: "Заклепка",
        status: "Наблюдение"
    },
    {
        name: "D-002",
        firstDetection: {
            date: "01.01.2026",
            time: "00:07:35",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Наблюдение"
    },
    {
        name: "D-001",
        firstDetection: {
            date: "01.01.2026",
            time: "00:01:55",
            length: 150,
            width: 250
        },
        type: "Отслоение",
        status: "Наблюдение"
    }
];

const mockDefectDetails = {
    "D-015": {
        name: "D-015",
        type: "Отслоение",
        detections: [
            {
                date: "05.01.2026",
                time: "16:55:55",
                measurements: {
                    length: 135,
                    width: 135,
                    area: 180
                },
                status: "Критичный",
                imageUrl: "/images/detections/detection1.jpg"
            },
            {
                date: "04.01.2026",
                time: "11:20:44",
                measurements: {
                    length: 130,
                    width: 130,
                    area: 170
                },
                status: "Критичный",
                imageUrl: "/images/detections/detection1.jpg"
            },
            {
                date: "03.01.2026",
                time: "14:45:33",
                measurements: {
                    length: 125,
                    width: 125,
                    area: 160
                },
                status: "Критичный",
                imageUrl: "/images/detections/detection1.jpg"
            },
            {
                date: "02.01.2026",
                time: "09:30:22",
                measurements: {
                    length: 122,
                    width: 122,
                    area: 155
                },
                status: "Критичный",
                imageUrl: "/images/detections/detection1.jpg"
            },
            {
                date: "01.01.2026",
                time: "14:11:11",
                measurements: {
                    length: 120,
                    width: 120,
                    area: 150
                },
                status: "Критичный",
                imageUrl: "/images/detections/detection1.jpg"
            }
        ],
        statistics: {
            firstDetection: {
                date: "01.01.2026",
                time: "14:11:11",
                measurements: {
                    length: 120,
                    width: 120,
                    area: 150
                }
            },
            lastDetection: {
                date: "05.01.2026",
                time: "16:55:55",
                measurements: {
                    length: 135,
                    width: 135,
                    area: 180
                }
            },
            growth: {
                length: "+12.5%",
                width: "+12.5%",
                area: "+20%"
            }
        }
    },
    "D-014": {
        name: "D-014",
        type: "Трещина",
        detections: [
            {
                date: "06.01.2026",
                time: "08:30:33",
                measurements: {
                    length: 110,
                    width: 110,
                    area: 140
                },
                status: "Внимание",
                imageUrl: "/images/detections/detection4.jpg"
            },
            {
                date: "03.01.2026",
                time: "10:15:22",
                measurements: {
                    length: 105,
                    width: 105,
                    area: 130
                },
                status: "Внимание",
                imageUrl: "/images/detections/detection4.jpg"
            },
            {
                date: "01.01.2026",
                time: "14:11:11",
                measurements: {
                    length: 100,
                    width: 100,
                    area: 120
                },
                status: "Внимание",
                imageUrl: "/images/detections/detection4.jpg"
            }
        ],
        statistics: {
            firstDetection: {
                date: "01.01.2026",
                time: "14:11:11",
                measurements: {
                    length: 100,
                    width: 100,
                    area: 120
                }
            },
            lastDetection: {
                date: "06.01.2026",
                time: "08:30:33",
                measurements: {
                    length: 110,
                    width: 110,
                    area: 140
                }
            },
            growth: {
                length: "+10%",
                width: "+10%",
                area: "+16.7%"
            }
        }
    },
    "D-013": {
        name: "D-013",
        type: "Заклепка",
        detections: [
            {
                date: "04.01.2026",
                time: "11:30:15",
                measurements: {
                    length: 6,
                    width: 6,
                    area: 8
                },
                status: "Наблюдение",
                imageUrl: "../../images/detection-defect.png"
            },
            {
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },
            {
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },{
                date: "02.01.2026",
                time: "12:30:17",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            },
            {
                date: "01.01.2026",
                time: "14:08:12",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                },
                status: "Наблюдение",
                imageUrl: "/images/detections/detection2.jpg"
            }
        ],
        statistics: {
            firstDetection: {
                date: "01.01.2026",
                time: "14:08:12",
                measurements: {
                    length: 5,
                    width: 5,
                    area: 7
                }
            },
            lastDetection: {
                date: "04.01.2026",
                time: "11:30:15",
                measurements: {
                    length: 6,
                    width: 6,
                    area: 8
                }
            },
            growth: {
                length: "+20%",
                width: "+20%",
                area: "+14.3%"
            }
        }
    }
};

export class DefectsService {
    async getUniqueDefects() {
        // return await fetch('/api/defects').then(res => res.json());
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockUniqueDefects);
            }, 100);
        });
    }
    
    async getDefectDetails(defectName) {
        // return await fetch(`/api/defects/${defectName}`).then(res => res.json());

        return new Promise((resolve) => {
            setTimeout(() => {
                const details = mockDefectDetails[defectName];
                if (details) {
                    resolve(details);
                } else {
                    resolve({
                        name: defectName,
                        type: "Неизвестно",
                        detections: [],
                        statistics: {
                            firstDetection: null,
                            lastDetection: null,
                            growth: {}
                        }
                    });
                }
            }, 100);
        });
    }

    async markAsFixed(defectName) {
        // return await fetch(`/api/defects/${defectName}/fix`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' }
        // }).then(res => res.json());

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Дефект отмечен как исправлен",
                    name: defectName
                });
            }, 100);
        });
    }
}

