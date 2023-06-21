var chartInstance = null;
var rendered = false;
var activeBar = 0;
const breakpoints = [0,576,768];
const scale = breakpoints.findLastIndex((w) => window.innerWidth > w) + 1;

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
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    xAlign: function(tip) {
                        // dynamically set tooltip alignment based on bar position within scroll area
                        const containerWidth = tip.tooltip.chart.canvas.parentNode.parentElement.clientWidth;
                        const chartWidth = tip.tooltip.chart.canvas.parentNode.parentElement.scrollWidth;
                        const scrollPos = tip.tooltip.chart.canvas.parentNode.parentElement.scrollLeft;
                        const axisWidth = tip.tooltip.chart.scales.y.width;

                        if (tip.tooltip.dataPoints[0].element.x < scrollPos + axisWidth + (chartWidth * .05)) {
                            return 'left';
                        } else if (chartWidth - tip.tooltip.dataPoints[0].element.x + scrollPos < chartWidth - containerWidth + (chartWidth * .05)) {
                            return 'right';
                        } else {
                            return 'center';
                        }
                    },
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
                    if (chart.data.datasets[0].data.length >= scale*10) {
                        const axisWidth = chart.scales.y.width;
                        const containerWidth = chart.canvas.parentNode.parentElement.clientWidth;
                        // add scrollbar class to container
                        chart.canvas.parentNode.parentElement.classList.add('scrollbar');
                        // calculate total size of chart width
                        const barWidth = (containerWidth - axisWidth) / (scale*10);
                        const totalWidth = barWidth * chart.data.datasets[0].data.length + axisWidth;
                        chart.canvas.parentNode.style.width = totalWidth + 'px';
                        
                        // copy Y Axis scale to second static canvas element 
                        const dScale = window.devicePixelRatio; 
                        const sourceCanvas = chart.canvas;
                        const axisHeight = chart.scales.y.maxHeight;
                        const targetCtx = document.getElementById("chartYAxis").getContext("2d");
                        targetCtx.scale(dScale, dScale);
                        targetCtx.canvas.width = axisWidth * dScale;
                        targetCtx.canvas.height = axisHeight * dScale;
                        targetCtx.canvas.style.width = `${axisWidth}px`;
                        targetCtx.canvas.style.height = `${axisHeight}px`;
                        targetCtx.drawImage(sourceCanvas, 0, 0, axisWidth * dScale, axisHeight * dScale, 0, 0, axisWidth * dScale, axisHeight * dScale);
                        const sourceCtx = sourceCanvas.getContext('2d');
                        // normalize coordinate system to use css pixels.
                        sourceCtx.clearRect(0, 0, axisWidth * dScale, axisHeight * dScale);
                        // scroll to active element
                        chart.canvas.parentNode.parentNode.scroll((totalWidth - containerWidth), 0);
                        // update scroll position on window resize
                        window.addEventListener('resize', setScroll);
                    }
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
            },
        }]
    });
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

    if (chartInstance.data.datasets[0].data.length >= scale*10) {
        // Scroll to active element
        setScroll();
    }
}

function setScroll() {
    const clientWindow = chartInstance.canvas.parentNode.parentElement.clientWidth;
    const scrollPos = chartInstance.canvas.parentNode.parentElement.scrollLeft;
    const barEl = chartInstance.getActiveElements()[0].element;
    const catWidth = barEl.width / 0.9; // 0.9 = default bar percentage within category
    const axisWidth = chartInstance.scales.y.width;

    if ((barEl.x > scrollPos + axisWidth) && (barEl.x < scrollPos + clientWindow))
    {
        // bar Position within view, don't need to scroll
        return;
    }
    const scrollNew = barEl.x < (scrollPos - axisWidth + clientWindow) ? Math.max(0, barEl.x - clientWindow + axisWidth - catWidth/2) : barEl.x - axisWidth - catWidth/2;
 
    chartInstance.canvas.parentNode.parentNode.scroll(scrollNew, 0);
}

export { createChart, setActiveBar }