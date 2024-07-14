// place files you want to import through the `$lib` alias in this folder.
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export async function createChart(chartId, chartType, beginAtZero, displaylegend, legendPosition, zoom, labels, dataSets){
    if(typeof window !== "undefined") {
        const zoomPlugin = await import('chartjs-plugin-zoom');
        Chart.register(zoomPlugin.default);
    }

    const ctx = document.getElementById(chartId).getContext('2d');

    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: dataSets
        },
        options: {
            interaction: {
                mode: 'nearest'
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: false
                }
            },
            responsive: true,
            scales: {
                x: {
                    beginAtZero: beginAtZero,
                },
                y: {
                    beginAtZero: beginAtZero
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: zoom,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: zoom
                        },
                        pinch: {
                            enabled: zoom
                        },
                        mode: 'x'
                    }
                },
                legend: {
                    display: displaylegend,
                    position: legendPosition
                }
            }
        }
    });
}