// place files you want to import through the `$lib` alias in this folder.
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export async function createChart(chartId, chartType, beginAtZero, displaylegend, legendPosition, zoom, displayBackground, labels, dataSets){
    if(typeof window !== "undefined") {
        const zoomPlugin = await import('chartjs-plugin-zoom');
        Chart.register(zoomPlugin.default);
    }

    const ctx = document.getElementById(chartId).getContext('2d');

    const chart =  new Chart(ctx, {
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
                    display: displayBackground,
                    grid: {
                        display: displayBackground
                    }
                },
                y: {
                    beginAtZero: beginAtZero,
                    display: displayBackground,
                    grid: {
                        display: displayBackground
                    }
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
                            enabled: false
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    }
                },
                legend: {
                    display: displaylegend,
                    position: legendPosition
                }
            }
        }
    });

    if(zoom) {
        let isDragging = false;

        ctx.canvas.addEventListener('mousedown', (event) => {
            if (event.button === 0 && chart !== null && chart.ctx !== null && chart.canvas !== null) { // Linke Maustaste
                chart.options.plugins.zoom.zoom.wheel.enabled = true;
                chart.update();
            }
        });

        ctx.canvas.addEventListener('mouseup', () => {
            if (isDragging && chart !== null && chart.ctx !== null && chart.canvas !== null) {
                isDragging = false;
                chart.options.plugins.zoom.zoom.wheel.enabled = false;
                chart.update();
            }
        });

        ctx.canvas.addEventListener('mouseleave', () => {
            if (isDragging && chart !== null && chart.ctx !== null && chart.canvas !== null) {
                isDragging = false;
                chart.options.plugins.zoom.zoom.wheel.enabled = false;
                chart.update();
            }
        });
    }

    return chart;
}