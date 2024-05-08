import { getGameUsage, getGameFiles } from "../scripts/services.js";
import { createChart, setActiveBar } from "../scripts/chart.js";
import { GameUsage } from "../scripts/models.js";

let gameId = null;
let currentMonth = null;
let currentYear = null;
const prevMonth = document.getElementById('month-prev');
const nextMonth = document.getElementById('month-next');
const chartWrapEl = document.getElementById('chart-wrapper');
const chartEl = document.getElementById('chart');
const statsHeader = document.getElementById('stats-header');
const numPlays = document.getElementById('num-plays');

// Anchor elements in the Templates section
const eventsData = document.getElementById('events-data');
const playersData = document.getElementById('players-data');
const populationData = document.getElementById('population-data');
const sessionsData = document.getElementById('sessions-data');

// Pipeline buttons
const rawBtn = document.getElementById('raw-btn');
const detectorBtn = document.getElementById('detector-btn');
const eventBtn = document.getElementById('event-btn');
const extractorBtn = document.getElementById('extractor-btn');
const featureBtn = document.getElementById('feature-btn');

let gameUsage = null;
let currentSession = null;

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

    getGameUsage(gameId)
    .then(function (response) {
        if (response.success) {
            // update the months and year
            var currentJSMonth = currentMonth - 1;
            var currentMonthName = new Date(currentYear, currentJSMonth).toLocaleString('default', { month: 'long' });

            gameUsage = new GameUsage(response.data.gameId, response.data.sessions);
            currentSession = gameUsage.sessions.find(e => e.month === currentMonth && e.year === currentYear);
            // update the game usage information
            var monthlySessions = currentSession.total_sessions < 1000 ? currentSession.total_sessions : (currentSession.total_sessions / 1000).toFixed(0) + 'K';
            numPlays.innerHTML = monthlySessions + ' sessions';
            if (gameUsage.sessions.some(e => e.total_sessions > 0)) {
                // create the chart
                chartEl.style.height = '200px';
                chartWrapEl.classList.add('mb-4');
                createChart(gameUsage.chartSessions, goToMonth);
            }
        }
    });

    // Bind to the click event on all of the Data Pipeline buttons
    bindPipelineButtonClickEvents();

});

// Bind to click events on the Data Pipeline buttons
let bindPipelineButtonClickEvents = function () {

    Array.from(document.getElementsByClassName('btn-pipeline')).forEach(button => {

        button.addEventListener('click', () => {

            // If the clicked button isn't disabled
            if(!button.disabled)
            {

                let selector = button.id.split('-')[0];

                // Show/Hide the appropriate target blocks
                Array.from(document.getElementsByClassName('pipeline-target-block')).forEach(target_block => {

                    // If it's the block we want to show
                    if(target_block.id === 'pipeline-target-' + selector)
                    {
                        target_block.classList.remove('d-none');
                    }
                    else
                    {
                        // Hide this block
                        target_block.classList.add('d-none');
                    }

                });

                // For each of the pipeline buttons
                Array.from(document.getElementsByClassName('btn-pipeline')).forEach(buttonInner => {
                    
                    // If this isn't the clicked button
                    if(buttonInner.id != button.id)
                    {
                        // Remove active attributes
                        buttonInner.classList.remove('btn-outline-secondary');

                        // If this is a segment button (not a transition button)
                        if(buttonInner.classList.contains('btn-pipeline-segment'))
                        {
                            // We need to show the inactive icon
                            document.getElementById('btn-image-' + buttonInner.id.split('-')[0]).classList.remove('d-none');
                            document.getElementById('btn-image-active-' + buttonInner.id.split('-')[0]).classList.add('d-none');
                        }
                        
                    }
                    else // this is the clicked button
                    {
                        // Add active attributes
                        button.classList.add('btn-outline-secondary');

                        // If this is a segment button (not a transition button)
                        if(buttonInner.classList.contains('btn-pipeline-segment'))
                        {
                            // We need to show the active icon
                            document.getElementById('btn-image-' + selector).classList.add('d-none');
                            document.getElementById('btn-image-active-' + selector).classList.remove('d-none');
                        }
                    }
                    
                });
               
            }
        });
    });
}

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
    numPlays.innerHTML = '-- sessions';

    if (gameUsage) {
        currentSession = gameUsage.sessions.find(e => e.month === currentMonth && e.year === currentYear);
        var monthlySessions = currentSession.total_sessions < 1000 ? currentSession.total_sessions : (currentSession.total_sessions / 1000).toFixed(0) + 'K';
        numPlays.innerHTML = currentSession.total_sessions > 0 ? monthlySessions + ' sessions' : 'No sessions';                    
        var currentIndex = gameUsage.chartSessions.findIndex(e => e.month === currentMonth && e.year === currentYear);
        if (gameUsage.sessions.some(e => e.total_sessions > 0)) {
            setActiveBar(currentIndex);
        }
    }

    // get game files for that month
    getGameFiles(gameId, currentYear, currentMonth)
    .then(function (response) {

        if (response.success) {
            
            // update the months and year
            var currentJSMonth = currentMonth - 1;
            var nextMonthName = new Date(currentYear, (currentJSMonth + 1) % 12).toLocaleString('default', {month: 'long'});
            var prevMonthName = new Date(currentYear, (currentJSMonth - 1) % 12).toLocaleString('default', {month: 'long'});
            var currentMonthName = new Date(currentYear, currentJSMonth).toLocaleString('default', {month: 'long'});
            prevMonth.innerHTML = '<i class="bi bi-chevron-left"></i> ' + prevMonthName;
            nextMonth.innerHTML = nextMonthName + ' <i class="bi bi-chevron-right"></i>';
            statsHeader.innerHTML = currentMonthName + ' ' + currentYear;
            
            // update next / previous to be enabled or disabled depending on what other data exists
            nextMonth.disabled = (response.data.last_year < currentYear || (response.data.last_year === currentYear && response.data.last_month <= currentMonth)) ? true : false;
            prevMonth.disabled = (response.data.first_year > currentYear || (response.data.first_year === currentYear && response.data.first_month >= currentMonth)) ? true : false;

            // Update the general template links, showing/hiding as appropriate
            
            if(response.data.events_template)
            {
                eventsData.href = response.data.events_template;
                eventsData.classList.remove('d-none');
            
            }
            else
            {
                eventsData.classList.add('d-none');
            }

              
            if(response.data.players_template)
            {
                playersData.href = response.data.players_template;
                playersData.classList.remove('d-none');
            
            }
            else
            {
                playersData.classList.add('d-none');
            }

              
            if(response.data.population_template)
            {
                populationData.href = response.data.population_template;
                populationData.classList.remove('d-none');
            
            }
            else
            {
                populationData.classList.add('d-none');
            }

              
            if(response.data.sessions_template)
            {
                sessionsData.href = response.data.sessions_template;
                sessionsData.classList.remove('d-none');
            
            }
            else
            {
                sessionsData.classList.add('d-none');
            }

            // Data Pipeline updates

            document.getElementById('pipeline-month').innerText = 'Month of ' + currentMonthName;

            // Enable/disable buttons in pipeline
            rawBtn.disabled = response.data.raw_file ? false : true;
            detectorBtn.disabled = response.data.detectors_link ? false : true;
            eventBtn.disabled = response.data.events_file ? false : true;
            extractorBtn.disabled = response.data.features_link ? false : true;
            featureBtn.disabled = response.data.population_file || response.data.players_file || response.data.sessions_file ? false : true;

            // Determine the selector for the earliest data pipeline button that has data
            // We'll make that button active
            let activeSelector = '';

            if(!featureBtn.disabled)
            {
                activeSelector = 'feature';
            }
            
            if(!extractorBtn.disabled)
            {
                activeSelector = 'extractor';
            }
            
            if(!eventBtn.disabled)
            {
                activeSelector = 'event';
            }

            if(!detectorBtn.disabled)
            {
                activeSelector = 'detector';
            }

            if(!rawBtn.disabled)
            {
                activeSelector = 'raw';
            }

            // For every pipeline button
            Array.from(document.getElementsByClassName('btn-pipeline')).forEach(button => {

                // If this is our active button
                if(activeSelector + '-btn' == button.id)
                {
                    // Make active
                    button.classList.add('btn-outline-secondary');

                    // If this is a segment button (not a transition button)
                    if(button.classList.contains('btn-pipeline-segment'))
                    {
                        // We need to show the active icon
                        document.getElementById('btn-image-' + activeSelector).classList.add('d-none');
                        document.getElementById('btn-image-active-' + activeSelector).classList.remove('d-none');
                    }

                }
                else // Not our active button
                {
                    // Make not active
                    button.classList.remove('btn-outline-secondary');
                    
                    // If this is a segment button (not a transition button)
                    if(button.classList.contains('btn-pipeline-segment'))
                    {
                        // We need to show the inactive icon
                        document.getElementById('btn-image-' + button.id.split('-')[0]).classList.remove('d-none');
                        document.getElementById('btn-image-active-' + button.id.split('-')[0]).classList.add('d-none');
                    }

                }                

            });


            // Pipeline target update

            // For every pipeline target block, update the current month text
            Array.from(document.getElementsByClassName('pipeline-target-month')).forEach(curMonthElement => {
                curMonthElement.innerText = 'Month of ' + currentMonthName;
            });

            // For the "no data" target block, update the error message as well
            document.getElementById('pipeline-target-no-data-for-month').innerText = "There is currently no data for the month of " + currentMonthName;


            // Update the links in each of the target blocks
            let linksRaw = '';

            if(response.data.raw_file)
            {
                linksRaw = '<a class="btn btn-primary mb-2" href="' + response.data.raw_file + '">Raw Data<i class="bi bi-arrow-down"></i></a>';
            }

            document.getElementById('pipeline-target-links-raw').innerHTML = linksRaw;

            let linksDetectors = '';

            if(response.data.detectors_link)
            {
                linksDetectors = '<a class="btn btn-primary mb-2" href="' + response.data.detectors_link + '">Detectors<i class="bi bi-arrow-down"></i></a>';
            }


            document.getElementById('pipeline-target-links-detector').innerHTML = linksDetectors;

            let linksEvents = '';

            if(response.data.events_file)
            {
                linksEvents = '<a class="btn btn-primary mb-2" href="' + response.data.events_file + '">Calculated Events<i class="bi bi-arrow-down"></i></a>';
            }

            document.getElementById('pipeline-target-links-event').innerHTML = linksEvents;

            let linksExtractors = '';
            
            if(response.data.features_link)
            {
                linksExtractors = '<a class="btn btn-primary mb-2" href="' + response.data.features_link + '">Extractors<i class="bi bi-arrow-down"></i></a>';
            }
            
            document.getElementById('pipeline-target-links-extractor').innerHTML = linksExtractors;

            let linksFeature = '';
            
            if(response.data.population_file)
            {
                linksFeature += '<a class="btn btn-primary mb-2" href="' + response.data.population_file + '">Population Features<i class="bi bi-arrow-down"></i></a>';
            }

            if(response.data.players_file)
            {
                linksFeature += '<a class="btn btn-primary mb-2" href="' + response.data.players_file + '">Player Features<i class="bi bi-arrow-down"></i></a>';
            }

            if(response.data.sessions_file)
            {
                linksFeature += '<a class="btn btn-primary mb-2" href="' + response.data.sessions_file + '">Session Features<i class="bi bi-arrow-down"></i></a>';
            }
            
            document.getElementById('pipeline-target-links-feature').innerHTML = linksFeature;

            // For every pipeline target block
            Array.from(document.getElementsByClassName('pipeline-target-block')).forEach(block => {
                
                // If this is the "No Data" block
                if(block.id == 'pipeline-target-none')
                {
                    // None of the pipeline segments have data
                    if(activeSelector === '')
                    {
                        block.classList.remove('d-none');
                    }
                    else
                    {
                        block.classList.add('d-none');
                    }
                    
                }
                else // This is a target block
                {
                    // If this is the active block
                    if(block.id == 'pipeline-target-' + activeSelector)
                    {
                        block.classList.remove('d-none');
                    }
                    else // not the active block
                    {
                        block.classList.add('d-none');
                    }
                }

            });


        }
    });

}