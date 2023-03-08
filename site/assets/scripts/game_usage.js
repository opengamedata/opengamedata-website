import { getGameUsage, getGameFiles } from "./services.js";

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

document.addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(document.location.search);
    gameId = params.get("game");
    const date = new Date();
    currentMonth = date.getMonth() + 1; // add 1 here because JS months run 0-11 and we want 1-12
    currentYear = date.getFullYear();
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
prevMonth.addEventListener('click', prevMonthFunc, false);
nextMonth.addEventListener('click', nextMonthFunc, false);

function updateHtml(gameId, currentYear, currentMonth) {
    console.log("updateHtml");
    // get game usage for that month
    getGameUsage(gameId, currentYear, currentMonth).then(function (response) {
        // update the months and year
        var currentJSMonth = currentMonth - 1;
        var currentMonthName = new Date(currentYear, currentJSMonth).toLocaleString('default', {month: 'long'});
        var nextMonthName = new Date(currentYear, (currentJSMonth + 1) % 12).toLocaleString('default', {month: 'long'});
        var prevMonthName = new Date(currentYear, (currentJSMonth - 1) % 12).toLocaleString('default', {month: 'long'});
        prevMonth.innerHTML = '<i class="bi bi-chevron-left"></i> ' + prevMonthName;
        nextMonth.innerHTML = nextMonthName + ' <i class="bi bi-chevron-right"></i>';
        statsHeader.innerHTML = currentMonthName + ' Stats:';
        statsData.innerHTML = 'In ' + currentMonthName;
        playerActivityDate.innerHTML = currentMonthName + ' ' + currentYear;
        // update the game usage information
        var monthlySessions = response.data.total_monthly_sessions < 1000 ? response.data.total_monthly_sessions : (response.data.total_monthly_sessions / 1000).toFixed(0) + 'K';
        numPlays.innerHTML = monthlySessions + ' Plays';
    });

    // get game files for that month
    getGameFiles(gameId, currentYear, currentMonth).then(function (response) {
        // update next / previous to be enabled or disabled depending on what other data exists
        nextMonth.disabled = (response.data.last_year < currentYear || (response.data.last_year === currentYear && response.data.last_month <= currentMonth)) ? true : false;
        prevMonth.disabled = (response.data.first_year > currentYear || (response.data.first_year === currentYear && response.data.first_month >= currentMonth)) ? true : false;
        // update general templates
        eventsData.href = response.data.events_template;
        playersData.href = response.data.players_template;
        populationData.href = response.data.population_template;
        sessionsData.href = response.data.sessions_template;
    });
}