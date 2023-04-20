import { getGameUsage, getGameFiles } from "./services.js";
import { createChart, updateOrCreateChart, setActiveBar } from "./chart.js";
import { GameUsage } from "./models.js";

let gameId = null;
let currentMonth = null;
let currentYear = null;
const prevMonth = document.getElementById('month-prev');
const nextMonth = document.getElementById('month-next');
const chartEl = document.getElementById('chart');
const statsHeader = document.getElementById('stats-header');
const statsData = document.getElementById('stats-data-month');
const playerActivityDate = document.getElementById('player-activity-date');
const numPlays = document.getElementById('num-plays');
const eventsData = document.getElementById('events-data');
const playersData = document.getElementById('players-data');
const populationData = document.getElementById('population-data');
const sessionsData = document.getElementById('sessions-data');
// Pipeline dynamic elements
const pipeHeader = document.getElementById('pipeline-header');
const rawBtn = document.getElementById('raw-btn');
const rawLink = document.getElementById('raw-link-0');
const rawMonth = document.getElementById('raw-month');
const rawHead = document.getElementById("raw-header");
const rawBody = document.getElementById('raw-body');
const eventBtn = document.getElementById('event-btn');
const eventLink = document.getElementById('event-link-0');
const eventMonth = document.getElementById('event-month');
const eventHead = document.getElementById("event-header");
const eventBody = document.getElementById('event-body');
const featureBtn = document.getElementById('feature-btn');
const featureLinks = [];
const featureMonth = document.getElementById('feature-month');
const featureHead = document.getElementById("feature-header");
const featureBody = document.getElementById('feature-body');
// Add link elements to featureLinks
if (document.getElementById('feature-link-0')) featureLinks.push(document.getElementById('feature-link-0'));
if (document.getElementById('feature-link-1')) featureLinks.push(document.getElementById('feature-link-1'));
if (document.getElementById('feature-link-2')) featureLinks.push(document.getElementById('feature-link-2'));

// Pipeline popovers
const rawPop = bootstrap.Popover.getOrCreateInstance('#raw-btn');
const eventPop = bootstrap.Popover.getOrCreateInstance('#event-btn');
const featurePop = bootstrap.Popover.getOrCreateInstance('#feature-btn');

let gameUsage = null;
let currentSession = null;
let updateChart = false;

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

    getGameUsage(gameId).then(function (response) {
        if (response.success) {
            // update the months and year
            var currentJSMonth = currentMonth - 1;
            var currentMonthName = new Date(currentYear, currentJSMonth).toLocaleString('default', { month: 'long' });
            statsData.innerHTML = 'In ' + currentMonthName;
            playerActivityDate.innerHTML = currentMonthName + ' ' + currentYear;

            gameUsage = new GameUsage(response.data.gameId, response.data.sessions);
            currentSession = gameUsage.sessions.find(e => e.month === currentMonth && e.year === currentYear);
            // update the game usage information
            var monthlySessions = currentSession.total_sessions < 1000 ? currentSession.total_sessions : (currentSession.total_sessions / 1000).toFixed(0) + 'K';
            numPlays.innerHTML = monthlySessions + ' Plays';
            // create the chart
            chartEl.style.height = '200px';
            chartEl.classList.add('mb-5');

            if (gameUsage.chartSessions.length > 30) {
                // slice the chart sessions array to 30 elements
                gameUsage.chartSlice(gameUsage.chartSessions.length-30, gameUsage.chartSessions.length);    
            } 
            createChart(gameUsage.chartSessions, goToMonth);
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
    featureBtn.addEventListener('inserted.bs.popover', () => {
        const closeBtn = document.querySelector('.popover-header #feature-close');
        closeBtn.addEventListener('click', () => {
            featurePop.hide();
        });
    });
});

var prevMonthFunc = function () {
    // find the current chart array index
    var chartIndex = gameUsage.chartSessions.findIndex(e => e.month === currentMonth && e.year === currentYear);
    // find the full sessions array index
    var sessionIndex = gameUsage.sessions.findIndex(e => e.month === currentMonth && e.year === currentYear);
    if (chartIndex === 0) {
        // update the chart array with subset of full sessions array
        gameUsage.chartSlice(Math.max(0,sessionIndex - 30), sessionIndex);
        updateChart = true;
    }
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
    // find the current chart array index
    var chartIndex = gameUsage.chartSessions.findIndex(e => e.month === currentMonth && e.year === currentYear);
    // find the full sessions array index
    var sessionIndex = gameUsage.sessions.findIndex(e => e.month === currentMonth && e.year === currentYear);
    if (chartIndex === gameUsage.chartSessions.length-1) {
        // update the chart array with subset of full sessions array
        gameUsage.chartSlice(sessionIndex+1, Math.min(sessionIndex+31, gameUsage.sessions.length));
        updateChart = true;
    }
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

// callback function called when chart bars are clicked
var goToMonth = function (index) {
    const currentSession = gameUsage.chartSessions[index];
    currentYear = currentSession.year;
    currentMonth = currentSession.month;
    updateHtml(gameId, currentYear, currentMonth);
}

// add event listeners
if (prevMonth !== null) prevMonth.addEventListener('click', prevMonthFunc, false);
if (nextMonth !== null) nextMonth.addEventListener('click', nextMonthFunc, false);

function updateHtml(gameId, currentYear, currentMonth) {
    // set loading values
    numPlays.innerHTML = '-- Plays';

    if (gameUsage) {
        currentSession = gameUsage.sessions.find(e => e.month === currentMonth && e.year === currentYear);
        var monthlySessions = currentSession.total_sessions < 1000 ? currentSession.total_sessions : (currentSession.total_sessions / 1000).toFixed(0) + 'K';
        numPlays.innerHTML = currentSession.total_sessions > 0 ? monthlySessions + ' Plays' : 'No Plays';                    
        // update or create the chart
        if (updateChart) {
            chartEl.style.height = '200px';
            if (!chartEl.classList.contains('mb-5')) {
                chartEl.classList.add('mb-5');
            }
            updateOrCreateChart(gameUsage.chartSessions, goToMonth); 
            updateChart = false;
        }
        var currentIndex = gameUsage.chartSessions.findIndex(e => e.month === currentMonth && e.year === currentYear);
        setActiveBar(currentIndex);    
    }

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
            pipeHeader.innerHTML = currentMonthName + ' Data Downloads:';
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

            featureBtn.disabled = true;
            // Build array for Feature Data links
            const responseLinks = [];
            responseLinks.push({link: response.data.population_file});
            responseLinks.push({link: response.data.players_file});
            responseLinks.push({link: response.data.sessions_file});
            // Update Feature file links
            featureLinks.forEach((link, index) => { 
                link.href = responseLinks[index].link ? responseLinks[index].link : '';
                link.classList = responseLinks[index].link ? 'btn btn-primary mb-2' : 'd-none';
                if (responseLinks[index].link) { featureBtn.disabled = false; }
            });
            if (featureLinks.length > 0) {
                featureMonth.innerHTML = pipelineMonth;
                // Set Popover content to updated elements
                featurePop.setContent({
                    '.popover-header': featureHead,
                    '.popover-body': featureBody
                }); 
            } 
        }
    });

}