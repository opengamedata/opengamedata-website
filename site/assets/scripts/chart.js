var chartInstance = null;
var rendered = false;
var activeBar = 0;

function createChart (sessions, fnCallback) {
    var hoverLabels = [];
    var displaySessions = [];

    sessions.forEach(element => {
        hoverLabels.push(element.label);
        displaySessions.push(element.totalSessions);
    });

    const ctx = document.getElementById('activityChart');
    activeBar = sessions.length-1;
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hoverLabels,
            datasets: [{
                data: displaySessions,
                borderWidth: 1,
                backgroundColor: '#3E3498',  // This is the secondary theme color in _theme.scss
                hoverBackgroundColor: '#A2FFEB',
                hoverBorderColor: '#3E3498',
                hoverBorderWidth: 2,
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
            },
            onClick: (event, active) => {
                // Find active element index
                const bar = active.find(e => e.element.hasValue());
                if (bar === undefined) {
                    return;
                }
                // Execute callback function
                fnCallback(bar.index);
            },
            onHover: (event, chartElement) => {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                if (!rendered) {
                    // set active element on initial chart draw
                    chart.setActiveElements([
                        {
                          datasetIndex: 0,
                          index: activeBar,
                        }
                    ]);
                    rendered = true;
                }
            },
            afterEvent: function(chart, args) {
                // reset active element on mouseout (after hovers)
                if (args.event.type === "mouseout") {
                    chart.setActiveElements([
                        {
                          datasetIndex: 0,
                          index: activeBar,
                        }
                    ]);
                    chart.update();
                }
            }
        }]
    });
}

function updateOrCreateChart(sessions, fnCallback) {
    // Create chart if it isn't already created.
    if (chartInstance === null) {
        createChart(sessions, fnCallback);
        return;
    }
    // Else update
    var hoverLabels = [];
    var displaySessions = [];

    sessions.forEach(element => {
        hoverLabels.push(element.label);
        displaySessions.push(element.totalSessions);
    });

    chartInstance.data.labels = hoverLabels;
    chartInstance.data.datasets[0].data = displaySessions;
    chartInstance.update();
}

function setActiveBar(index) {
    activeBar = index;
    chartInstance.setActiveElements([
      {
        datasetIndex: 0,
        index: index,
      }
    ]);
    chartInstance.update();
}

export { createChart, updateOrCreateChart, setActiveBar }