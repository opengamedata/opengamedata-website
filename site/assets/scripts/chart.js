var chartInstance = null;

function createChart (sessionsByDay, month) {
    var hoverLabels = [];
    var displaySessions = [];

    for (const [key, value] of Object.entries(sessionsByDay)) {
        var index = parseInt(key);
        hoverLabels[index - 1] = month + " " + index;
        displaySessions[index - 1] = value;
    }

    const ctx = document.getElementById('activityChart');

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hoverLabels,
            datasets: [{
                data: displaySessions,
                borderWidth: 1,
                backgroundColor: '#3E3498',  // This is the secondary theme color in _theme.scss
            }]
        },
        options: {
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, ticks) {
                            if (value >= 1000) {
                                return (value / 1000) + 'k';
                            }
                            else {
                                return value;
                            }
                        }
                    }
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                display: false
                },
                tooltip: {
                    xAlign: 'center',
                    yAlign: 'bottom',
                    backgroundColor: '#FFFFFF',
                    bodyColor: '#000000',
                    titleColor: '#000000',
                    borderColor: '#3E3498',  // This is the secondary theme color in _theme.scss
                    borderWidth: 2,
                    displayColors: false,
                    titleFont: {weight: 'normal'},
                    bodyFont: {weight: 'bold'},
                    callbacks: {
                        label: function(context) {
                            let label = context.parsed.y < 1000 ? context.parsed.y + ' sessions' : (context.parsed.y / 1000).toFixed(2) + 'K sessions';
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function updateChart(sessionsByDay, month) {
    var hoverLabels = [];
    var displaySessions = [];

    for (const [key, value] of Object.entries(sessionsByDay)) {
        var index = parseInt(key);
        hoverLabels[index - 1] = month + " " + index;
        displaySessions[index - 1] = value;
    }

    chartInstance.data.labels = hoverLabels;
    chartInstance.data.datasets[0].data = displaySessions;
    chartInstance.update();
}

export { createChart, updateChart }