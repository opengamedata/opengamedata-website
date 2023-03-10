import { getGameUsage, getGameFiles } from "./services.js";
import { createChart, updateChart } from "./chart.js";

let gameId = null;
let currentMonth = null;
let currentYear = null;
const prevMonth = document.getElementById('month-prev');
const nextMonth = document.getElementById('month-next');
const statsHeader = document.getElementById('stats-header');
const statsData = document.getElementById('stats-data-month');
const playerActivityDate = document.getElementById('player-activity-date');
const numPlays = document.getElementById('num-plays');
const eventsData = document.getElementById('events-data');
const playersData = document.getElementById('players-data');
const populationData = document.getElementById('population-data');
const sessionsData = document.getElementById('sessions-data');
// Pipeline dynamic elements
const rawBtn = document.getElementById('raw-btn');
const rawLink = document.getElementById('raw-link');
const rawMonth = document.getElementById('raw-month');
const rawHead = document.getElementById("raw-header");
const rawBody = document.getElementById('raw-body');
const eventBtn = document.getElementById('event-btn');
const eventLink = document.getElementById('event-link');
const eventMonth = document.getElementById('event-month');
const eventHead = document.getElementById("event-header");
const eventBody = document.getElementById('event-body');
const featureBtn = document.getElementById('feature-btn');
const featureLink = document.getElementById('feature-link');
const featureMonth = document.getElementById('feature-month');
// const featureHead = document.getElementById("feature-header");
// const featureBody = document.getElementById('feature-body');

// Pipeline popovers
const rawPop = bootstrap.Popover.getOrCreateInstance('#raw-btn');
const eventPop = bootstrap.Popover.getOrCreateInstance('#event-btn');
// const featurePop = bootstrap.Popover.getOrCreateInstance('#feature-btn');

document.addEventListener('DOMContentLoaded', () => {
    let params = new URLSearchParams(document.location.search);
    gameId = params.get("game");

    // Get Current month from #stats element
    const statsEl = document.getElementById('stats');
    if (statsEl) {
        currentMonth = Number(statsEl.dataset.month);
        currentYear = Number(statsEl.dataset.year);
    } else {
        // revert to current date
        const date = new Date();
        currentMonth = date.getMonth() + 1; // add 1 here because JS months run 0-11 and we want 1-12
        currentYear = date.getFullYear();    
    }

    getGameUsage(gameId, currentYear, currentMonth).then(function (response) {
        if (response.success) {
            // update the months and year
            var currentJSMonth = currentMonth - 1;
            var currentMonthName = new Date(currentYear, currentJSMonth).toLocaleString('default', { month: 'long' });
            statsData.innerHTML = 'In ' + currentMonthName;
            playerActivityDate.innerHTML = currentMonthName + ' ' + currentYear;
            // update the game usage information
            var monthlySessions = response.data.total_monthly_sessions < 1000 ? response.data.total_monthly_sessions : (response.data.total_monthly_sessions / 1000).toFixed(0) + 'K';
            numPlays.innerHTML = monthlySessions + ' Plays';
            // create the chart
            createChart(response.data.sessions_by_day, currentMonthName);
        }
    });

    // Pipeline close button listeners
    rawBtn.addEventListener('inserted.bs.popover', () => {
        const closeBtn = document.querySelector('.popover-header #raw-close');
        closeBtn.addEventListener('click', () => {
            rawPop.hide();
        });
    });
    eventBtn.addEventListener('inserted.bs.popover', () => {
        const closeBtn = document.querySelector('.popover-header #event-close');
        closeBtn.addEventListener('click', () => {
            eventPop.hide();
        });
    });
    /* Uncomment when Feature Data becomes available
    featureBtn.addEventListener('inserted.bs.popover', () => {
        const closeBtn = document.querySelector('.popover-header #feature-close');
        closeBtn.addEventListener('click', () => {
            featurePop.hide();
        });
    });
    */
});

var prevMonthFunc = function () {
    // setup year and month
    // we were in January, move back to December of previous year
    if (currentMonth === 1) {
        currentMonth = 12;
        currentYear--;
    }
    else {
        currentMonth--;
    }
    updateHtml(gameId, currentYear, currentMonth);
}

var nextMonthFunc = function () {
    // setup year and month
    // we were in December, move to January of next year
    if (currentMonth === 12) {
        currentMonth = 1;
        currentYear++;
    }
    else {
        currentMonth++;
    }
    updateHtml(gameId, currentYear, currentMonth);
}

// add event listeners
if (prevMonth !== null) prevMonth.addEventListener('click', prevMonthFunc, false);
if (nextMonth !== null) nextMonth.addEventListener('click', nextMonthFunc, false);

function updateHtml(gameId, currentYear, currentMonth) {
    // set loading values
    numPlays.innerHTML = '-- Plays';
    // get game usage for that month
    getGameUsage(gameId, currentYear, currentMonth).then(function (response) {
        if (response.success) {
            // update the months and year
            var currentJSMonth = currentMonth - 1;
            var currentMonthName = new Date(currentYear, currentJSMonth).toLocaleString('default', { month: 'long' });
            // update the game usage information
            var monthlySessions = response.data.total_monthly_sessions < 1000 ? response.data.total_monthly_sessions : (response.data.total_monthly_sessions / 1000).toFixed(0) + 'K';
            numPlays.innerHTML = monthlySessions + ' Plays';
            // update the chart
            updateChart(response.data.sessions_by_day, currentMonthName);
        } else {
            numPlays.innerHTML = 'No Plays';
        }
    });
    // get game files for that month
    getGameFiles(gameId, currentYear, currentMonth).then(function (response) {
        if (response.success) {
            // update the months and year
            var currentJSMonth = currentMonth - 1;
            var nextMonthName = new Date(currentYear, (currentJSMonth + 1) % 12).toLocaleString('default', {month: 'long'});
            var prevMonthName = new Date(currentYear, (currentJSMonth - 1) % 12).toLocaleString('default', {month: 'long'});
            var currentMonthName = new Date(currentYear, currentJSMonth).toLocaleString('default', {month: 'long'});
            prevMonth.innerHTML = '<i class="bi bi-chevron-left"></i> ' + prevMonthName;
            nextMonth.innerHTML = nextMonthName + ' <i class="bi bi-chevron-right"></i>';
            statsHeader.innerHTML = currentMonthName + ' Stats:';
            statsData.innerHTML = 'In ' + currentMonthName;
            playerActivityDate.innerHTML = currentMonthName + ' ' + currentYear;
            // update next / previous to be enabled or disabled depending on what other data exists
            nextMonth.disabled = (response.data.last_year < currentYear || (response.data.last_year === currentYear && response.data.last_month <= currentMonth)) ? true : false;
            prevMonth.disabled = (response.data.first_year > currentYear || (response.data.first_year === currentYear && response.data.first_month >= currentMonth)) ? true : false;            
            // update general templates
            eventsData.href = response.data.events_template;
            playersData.href = response.data.players_template;
            populationData.href = response.data.population_template;
            sessionsData.href = response.data.sessions_template;
            // update pipelines
            const pipelineMonth = 'Month of ' + currentMonthName;
            if (rawLink) {
                rawLink.href = response.data.raw_file;
                rawMonth.innerHTML = pipelineMonth; 
                // Set Popover content to updated elements
                rawPop.setContent({
                    '.popover-header': rawHead,
                    '.popover-body': rawBody
                });
            } 
            rawBtn.disabled = response.data.raw_file ? false : true;
            if (eventLink) { 
                eventLink.href = response.data.events_file;
                eventMonth.innerHTML = pipelineMonth;
                // Set Popover content to updated elements
                eventPop.setContent({
                    '.popover-header': eventHead,
                    '.popover-body': eventBody
                });
            } 
            eventBtn.disabled = response.data.events_file ? false : true;
            if (featureLink) {
                featureLink.href = ''; // Not in file_list yet
                featureMonth.innerHTML = pipelineMonth;
                // Set Popover content to updated elements
                /* Uncomment when Feature Data becomes available
                featurePop.setContent({
                    '.popover-header': featureHead,
                    '.popover-body': featureBody
                }); 
                */
            } 
            // featureBtn.disabled = true; // Not in file_list yet
        }
    });

}