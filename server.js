/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
const socket = io();

const revenueCtx = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(revenueCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Hourly Revenue',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75,192,192,0.1)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        scales: {
            x: {
                display: true,
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0
                }
            },
            y: {
                display: true,
                beginAtZero: false,
                ticks: {
                    callback: function(value) {
                        if (typeof value === 'number') {
                            return value.toLocaleString();
                        }
                        return value;
                    }
                }
            }
        }
    }
});

socket.on('statsUpdate', (data) => {
    updateCharts(data);
});

function updateCharts(data) {
    revenueChart.data.labels = data.timeLabels;
    revenueChart.data.datasets[0].data = data.revenue;
    revenueChart.update('active');
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const raw = document.getElementById('analyticsData').value;
        if (raw) {
            const analyticsData = JSON.parse(raw);
            updateCharts(analyticsData);
        }
    } catch (err) {
        console.error('Failed to initialize analytics data', err);
    }
});

document.getElementById('exportCSV').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/analytics/export/csv');
        if (!response.ok) {
            throw new Error('Failed to fetch CSV');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'booth-analytics.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('CSV export failed', err);
        alert('CSV export failed. Check console for details.');
    }
});