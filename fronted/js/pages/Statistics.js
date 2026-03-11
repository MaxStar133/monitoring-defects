import { BaseModal } from '../core/BaseModal.js';
import { NotificationsPanel } from '../modals/NotificationsPanel.js';
import { StatisticsService } from "../services/StatisticsService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("Statistics.js loaded");
    Chart.register(ChartDataLabels);
    // ===== МОДАЛЬНОЕ ОКНО ТЕПЛОВОЙ КАРТЫ =====
    const heatmapModal = new BaseModal("heatmapModal", {
        closeOnEsc: true,
        closeOnOverlay: true
    });
    
    // Кнопки "Изменить параметры"
    const editButtons = document.querySelectorAll('.heatmap-edit-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            heatmapModal.open();
        });
    });
    
    // Кнопки в модальном окне
    const cancelBtn = document.querySelector('.btn-cancel');
    const confirmBtn = document.querySelector('.btn-confirm');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            console.log("Отмена");
            heatmapModal.close();
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            console.log("Параметры тепловой карты сохранены");
            heatmapModal.close();
        });
    }
    
    // Закрытие по клику на оверлей
    const modalOverlay = document.getElementById('heatmapModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                heatmapModal.close();
            }
        });
    }
    
    // ===== ПАНЕЛЬ УВЕДОМЛЕНИЙ =====
    if (document.getElementById("notificationsPanel")) {
        console.log("Инициализация панели уведомлений");
        const notifications = new NotificationsPanel();
    }

    // ===== Первые два графика =====
    async function buildCharts() {
    console.log("buildCharts started");

    const service = new StatisticsService();
    const statistics = await service.getStatistics();

    const dates = Object.keys(statistics).sort((a,b)=>{
        const [d1,m1,y1] = a.split(".");
        const [d2,m2,y2] = b.split(".");
        return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
    });

    const cracks = [];
    const delamination = [];
    const rivets = [];

    dates.forEach(date => {
        cracks.push(statistics[date].cracks);
        delamination.push(statistics[date].delamination);
        rivets.push(statistics[date].rivets);
    });

    buildLineChart(dates, cracks, delamination, rivets);
    buildPieChart(cracks, delamination, rivets);
    updateStatsGrid(cracks, delamination, rivets);
}

function buildLineChart(dates, cracks, delamination, rivets) {

    const ctx = document.getElementById("defectsLineChart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Трещина",
                    data: cracks,
                    borderColor: "#ff0000",
                    backgroundColor: "#ff0000",
                    tension: 0
                },
                {
                    label: "Отслоение",
                    data: delamination,
                    borderColor: "#FFD700",
                    backgroundColor: "#FFD700",
                    tension: 0
                },
                {
                    label: "Заклепка",
                    data: rivets,
                    borderColor: "#008000",
                    backgroundColor: "#008000",
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

function buildPieChart(cracks, delamination, rivets) {

    const totalCracks = cracks.reduce((a,b)=>a+b,0);
    const totalDelamination = delamination.reduce((a,b)=>a+b,0);
    const totalRivets = rivets.reduce((a,b)=>a+b,0);

    const total = totalCracks + totalDelamination + totalRivets;

    if(total === 0) return;

    const cracksPercent = Math.round((totalCracks / total) * 100);
    const delaminationPercent = Math.round((totalDelamination / total) * 100);
    const rivetsPercent = Math.round((totalRivets / total) * 100);

    const ctx = document.getElementById("defectsPieChart");

    new Chart(ctx, {
        type: "pie",
        data: {
            datasets: [{
                data: [
                    cracksPercent,
                    delaminationPercent,
                    rivetsPercent
                ],
                backgroundColor: [
                    "#ff0000",
                    "#FFD700",
                    "#008000"
                ]
            }]
        },
        options: {
            plugins: {

                // УБИРАЕМ подписи снизу
                legend: {
                    display: false
                },

                // ПРОЦЕНТЫ НА СЕКТОРАХ
                datalabels: {
                    color: "#000000",
                    font: {
                        weight: "",
                        size: 20
                    },
                    formatter: function(value) {
                        return value + "%";
                    }
                }
            }
        },
    });
}
function updateStatsGrid(cracks, delamination, rivets) {

    const totalCracks = cracks.reduce((a,b)=>a+b,0);
    const totalDelamination = delamination.reduce((a,b)=>a+b,0);
    const totalRivets = rivets.reduce((a,b)=>a+b,0);

    const total = totalCracks + totalDelamination + totalRivets;

    document.querySelector(".stat-card--total .stat-card__value").textContent = total;
    document.querySelector(".stat-card--cracks .stat-card__value").textContent = totalCracks;
    document.querySelector(".stat-card--delamination .stat-card__value").textContent = totalDelamination;
    document.querySelector(".stat-card--rivets .stat-card__value").textContent = totalRivets;
}
    buildCharts();
});
