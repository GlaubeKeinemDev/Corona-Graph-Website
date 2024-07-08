// place files you want to import through the `$lib` alias in this folder.
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export async function createChart(chartId, labels, dataSets){
    if(typeof window !== "undefined") {
        const zoomPlugin = await import('chartjs-plugin-zoom');
        Chart.register(zoomPlugin.default);
    }

    const ctx = document.getElementById(chartId).getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: dataSets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x'
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}