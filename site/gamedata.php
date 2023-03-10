<?php

require_once 'includes/services.php';
require_once 'models/game.php';
require_once 'models/game_file_info.php';
require_once 'components/pipeline_button.php';

// Declare variables
$game_id = null;
$game = null;
$game_files = null;

$month_name = null;
$prev_month = null;
$next_month = null;
$prev_disabled = null;
$next_disabled = null;
$selected_year = null;
$selected_month = null;
$activity_text = 'No player activity to display.';
$stats_text = '';
$raw_file_link = null;
$event_file_link = null;
$feature_file_link = null;

$game_json = null;

if (isset($_GET['game']) && $_GET['game'] != '') {

    $game_id = strtoupper(preg_replace("/[^a-zA-Z0-9]+/", "", $_GET['game']));
    
    // Get game details from api
    $game_json = services\getGameDetails($game_id);
    $game = $game_json ? Game::fromJson($game_id, $game_json) : null;
   

    // Get game file info from API
    $response_obj = services\getGameFileInfoByMonth($game_id);

    if (isset($response_obj) && $response_obj->{'success'}) {
        $game_files = GameFileInfo::fromObj($response_obj->{'data'});

        $selected_year = isset($game_files) ? $game_files->getLastYear() : '';
        $selected_month = isset($game_files) ? $game_files->getLastMonth() : '';
        $selected_date = DateTimeImmutable::createFromFormat('Y-n-j|', $selected_year . '-' . $selected_month . '-1');
        $month_name = $selected_date->format('F');
        // Populate current, previous, and next dates
        if ($game_files->getNextMonth($selected_date) == $selected_date) {
            $next_disabled = 'disabled';
            $next_month = $selected_date->modify('+1 month')->format('F');
        } else {
            $next_disabled = '';
            $next_month = $game_files->getNextMonth($selected_date)->format('F');
        }
        if ($game_files->getPrevMonth($selected_date) == $selected_date) {
            $prev_disabled = 'disabled';
            $prev_month = $selected_date->modify('-1 month')->format('F');
        } else {
            $prev_disabled = '';
            $prev_month = $game_files->getPrevMonth($selected_date)->format('F');
        }

        $activity_text = $month_name . ' ' . htmlspecialchars($selected_year);
        $stats_text = 'In ' . $month_name;

        $raw_file_link = $game_files->getRawFile();
        $event_file_link = $game_files->getEventsFile();
        // $feature_file_link = null;
    
    } 
    
    // Create Pipeline buttons with popovers
    $button_raw = new PipelineButton('Raw Data', 'pipeline-raw-active.svg', 'btn-pipeline-1', 'raw', $raw_file_link, $month_name, 'Time-sequenced data as provided by the game directly. Includes player events, system feedback and game progression.');
    $button_event = new PipelineButton('Calculated Events', 'pipeline-event-active.svg', 'btn-pipeline-2', 'event', $event_file_link, $month_name, 'Raw time-sequenced data interwoven with with events generated by automated detectors.');
    // $feature_event = new PipelineButton ('Feature Data', ...)

}

?>
<?php require 'includes/header.php'; ?>
<main id="gamedata" class="container-fluid">
    <?php if (isset($game)) : ?>
    <section>
        <div class="row mb-5">
            <div class="col-md-7 my-auto">
                <h2><?php echo htmlspecialchars($game->getName()) ?></h2>
                <div class="d-flex align-items-center mb-3">
                    <img class="avatar" src="/assets/images/avatar.png">
                    <div class="button-bar">
                        <?php echo '<a class="btn btn-secondary" href="' . htmlspecialchars($game->getDeveloperLink()) . '">Developer: ' . htmlspecialchars($game->getDeveloperName()) . '</a>'; ?>
                        <?php echo '<a class="btn btn-secondary" href="' . htmlspecialchars($game->getPlayLink()) . '" target="_blank">Play Game</a>'; ?>
                        <?php echo '<a class="btn btn-secondary" href="' . htmlspecialchars($game->getSourceLink()) . '" target="_blank">Source Code</a>'; ?>
                    </div>
                </div>
                <p>
                    <?php echo htmlspecialchars($game->getDescription()) ?>
                </p>
            </div>
            <div class="col">
                <?php echo '<img class="img-fluid rounded" src="' . htmlspecialchars($game->getThumbPath()) . '">'; ?>
            </div>
        </div>
    </section>
    <section>
        <div class="row mb-5">
            <div class="col">
                <h3 class="mb-0">Player Activity</h3>
                <?php echo '<strong><span id="player-activity-date">' . $activity_text . '</span></strong>' ?>
            </div>
            <?php if (isset($game_files)) : ?>
                <div class="col text-end">
                    <nav class="text-nowrap">
                        <?php echo '<button id="month-prev" type="button" class="btn btn-outline-secondary" ' . $prev_disabled . '><i class="bi bi-chevron-left"></i> ' . $prev_month . '</button>'; ?>
                        <?php echo '<button id="month-next" type="button" class="btn btn-outline-secondary" ' . $next_disabled . '>' . $next_month . ' <i class="bi bi-chevron-right"></i></button>'; ?>
                    </nav>
                </div>
            <?php endif; ?>
        </div>
        <!-- Chart -->
        <?php require 'includes/chart.php'; ?>
    </section>
    <div class="row mb-5">
        <div class="col-md">
            <?php echo '<section id="stats" class="mb-5" data-year="' . $selected_year . '" data-month="' . $selected_month . '">'; ?>
                <!-- Stats -->
                <h3 id="stats-header"><?php echo $month_name . " Stats:" ?></h3>
                <div class="stats bg-primary text-secondary rounded d-inline-block">
                    <h4 id="num-plays" class="mb-0">No Plays</h4>
                    <span id="stats-data-month"><?php echo $stats_text ?></span>
                </div>
            </section>
            <section id="pipelines" class="mb-5">
                <!-- Data Pipeline -->
                <h3 class="mb-3">Data Pipelines:</h3>
                <div class="pipeline-row d-flex">
                    <?php echo $button_raw->renderButton(); ?>
                    <div class="mt-2 ms-3 pipeline-text">
                        <h4 class="mb-0">Raw Data</h4>
                        Event data directly from the game
                    </div>
                </div>
                <div class="pipeline-row d-flex">
                    <?php echo $button_event->renderButton(); ?>
                    <div class="mt-2 ms-3 pipeline-text">
                        <h4 class="mb-0">Calculated Events</h4>
                        Raw data interwoven with detected events
                    </div>
                </div>
                <div class="pipeline-row d-flex">
                    <button class="btn btn-pipeline-3 position-relative" type="button" disabled>
                    </button>
                    <div class="mt-2 ms-3 pipeline-text">
                        <h4 class="mb-0">Feature Data</h4>
                        Descriptions of sessions, players or populations
                        <p class="mt-2">No Features yet.</p>
                    </div>
                </div>
                <?php 
                    echo $button_raw->renderElements(); 
                    echo $button_event->renderElements();    
                ?>
            </section>
        </div>
        <div class="col-md">
            <section id="templates" class="mb-5">
                <!-- Templates -->
                <h3>General Templates</h3>
                <p>These templates link out to a github codespace and are useful for exploration and visualization. They are also effective starting spots for your own experiments.</p>
                <?php if (isset($game_files) && $game_files->getEventsTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="events-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getEventsTemplate()) . '">Events Template</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (isset($game_files) && $game_files->getPlayersTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="players-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getPlayersTemplate()) . '">Player Features Template</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (isset($game_files) && $game_files->getPopulationTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="population-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getPopulationTemplate()) . '">Population Features Template</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (isset($game_files) && $game_files->getSessionsTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="sessions-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getSessionsTemplate()) . '">Session Features Template</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
            </section>
            <?php if (count($game->getPublications()) > 0) : ?>
            <section class="mb-5">
                <!-- Publications -->
                <h3>Publications</h3>
                <?php
                    foreach ($game->getPublications() as $value) {
                        echo '<div class="card shadow mb-4">
                            <div class="card-body">
                                <a class="btn btn-secondary btn-publication" href="' . htmlspecialchars($value->Link) . '">' . htmlspecialchars($value->StudyName) . '</a>
                            </div>
                        </div>';
                    }
                ?>
            </section>
            <?php endif; ?>
        </div>
    </div>
    <?php else : 
        echo '<h2 class="h3">No game data available.</h2>';
    endif; ?>
</main>
<script type="module" src="/assets/scripts/services.js"></script>
<script type="module" src="/assets/scripts/game_usage.js"></script>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>