// chart data
// TODO=> get this via API
var sessionsByDay = [340, 3034, 504, 2333, 340, 3034, 504, 2333, 340, 3034, 504, 2333, 340, 3034, 504, 2333, 340, 3034, 504, 2333, 340, 3034, 504, 2333, 340, 3034, 504, 2333, 340, 3034, 504];
var hoverLabels = [];

// create labels, these are used in the hover
sessionsByDay.forEach((element, index) => {
    hoverLabels.push("March " + (index + 1));  // TODO: Update March with month variable
});

const ctx = document.getElementById('activityChart');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: hoverLabels,
        datasets: [{
            data: sessionsByDay,
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
                        let label = context.parsed.y + ' sessions';
                        return label;
                    }
                }
            }
        }
    }
});