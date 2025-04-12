<?php

require_once 'config/AppConfig.php';
require_once 'includes/services.php';
require_once 'models/APIResponse.php';
require_once 'models/GameDetails.php';
require_once 'models/GameFileInfo.php';
require_once 'components/PipelineButton.php';

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
$raw_files = [];
$detectors_files = [];
$event_files = [];
$extractors_files = [];
$feature_files = [];

$game_json = null;

if (isset($_GET['game']) && $_GET['game'] != '') {

    $game_id = strtoupper(preg_replace("/[^a-zA-Z0-9-_]+/", "", $_GET['game']));
    
    // Get game details from api
    $game_json = services\getGameDetails($game_id);
    $game = $game_json ? GameDetails::fromJson($game_id, $game_json) : null;
   

    // Get game file info from API
    /* HACK ALERT! Dumb, stupid, awful hack that assumes a thing called
       "get game file-info by *month*" will be fine if you don't give it a month whose file info you want,
       and will say "that's alright good buddy, I'll just give you info on the most recent month."
       As if it's obvious that a thing that says "request a month" would consider the month optional...
       But not fixing yet because leaving a hack in place is easier than fucking around with which end is responsible for what.
    */
    $response_obj = services\getGameFileInfoByMonth($game_id);

    if (isset($response_obj)) {
        $api_response = APIResponse::fromObj($response_obj);

        if ($api_response->Status() == "SUCCESS") {
            $game_files = GameFileInfo::fromObj($api_response->Value());
            if (!isset($game_files) || $game_files == null) {
                $err_str = "Got empty game_files from request that had status=".$api_response->Status()." and val=".json_encode($api_response->Value());
                error_log($err_str);
            }

            $selected_year = isset($game_files) ? $game_files->getLastYear() : '';
            $selected_month = isset($game_files) ? $game_files->getLastMonth() : '';
            $selected_date = DateTimeImmutable::createFromFormat('Y-n-j|', $selected_year . '-' . $selected_month . '-1');
            if ($selected_date != false) {
                $month_name = $selected_date->format('F');
            }
            // Populate current, previous, and next dates
            if ($game_files->getNextMonth($selected_date) == $selected_date) {
                $next_disabled = 'disabled';
                $next_month = $selected_date->modify('+1 month')->format('F');
            } else {
                $next_disabled = '';
                $next_month = $game_files->getNextMonth($selected_date)->format('F');
            }
            if ($selected_date != false && $game_files->getPrevMonth($selected_date) == $selected_date) {
                $prev_disabled = 'disabled';
                $prev_month = $selected_date->modify('-1 month')->format('F');
            } else {
                $prev_disabled = '';
                $prev_month = $game_files->getPrevMonth($selected_date)->format('F');
            }

            $raw_files = $game_files->getRawFile() ? array('Raw Data' => $game_files->getRawFile()) : [];
            $detectors_files = $game_files->getDetectorsLink() ? array('Detectors' => $game_files->getDetectorsLink()) : [];
            $event_files = $game_files->getEventsFile() ? array('Calculated Events' => $game_files->getEventsFile()) : [];
            $extractors_files = $game_files->getFeaturesLink() ? array('Extractors' => $game_files->getFeaturesLink()) : []; // aka Extractors or Feature Extractors
            $feature_files = $game_files->getFeatureFiles() ? $game_files->getFeatureFiles(): [];
        }
        else {
            $err_str = "getGameFileInfoByMonth request, with year=null and month=null, was unsuccessful:\n".$api_response->Message()."\nDamn, maybe the authors shouldn't have written in a request for a specific month's data, but failed to supply a month! Who'd have thought?!?";
            error_log($err_str);
        }
    }
    else {
        $err_str = "getGameFileInfoByMonth request, with year=null and month=null, got no response object!";
        error_log($err_str);
    }
    
    // Create Pipeline buttons (including the transition buttons)

    // $title, $image, $image_active, $selector, $file_links, $month, $text, $is_a_transition_button)
    $button_raw = new PipelineButton('Raw Data', 'pipeline-raw.svg', 'pipeline-raw-active.svg', 'raw',
        $raw_files, $month_name, 'Time-sequenced data as provided by the game directly. Includes player events, system feedback and game progression.', count($raw_files) > 0, false);

    $button_detectors = new PipelineButton('Detectors', 'pipeline-transform-btn.png', 'pipeline-transform-active.svg', 'detector',
         $detectors_files, $month_name, '', count($raw_files) == 0 && count($detectors_files) > 0, true);

    $button_event = new PipelineButton('Calculated Events', 'pipeline-event.svg', 'pipeline-event-active.svg', 'event', 
        $event_files, $month_name, 'Raw time-sequenced data interwoven with with events generated by automated detectors.', count($raw_files) === 0 && count($detectors_files) === 0 && count($event_files) > 0, false);

    $button_extractors = new PipelineButton('Extractors', 'pipeline-transform-btn.png', 'pipeline-transform-active.svg', 'extractor',
        $extractors_files, $month_name, '', count($raw_files) == 0 && count($detectors_files) === 0 && count($event_files) === 0 && count($extractors_files) > 0, true);

    $button_feature = new PipelineButton('Feature Data', 'pipeline-feature.svg', 'pipeline-feature-active.svg', 'feature',
        $feature_files, $month_name, 'Feature-engineered data that describe game-play at different levels of aggregation.', count($raw_files) === 0 && count($event_files) === 0 && count($extractors_files) === 0 && count($feature_files) > 0, false);

    // If we don't have files for the selected month
    $have_no_files = count($raw_files) === 0 && count($event_files) === 0 && count($extractors_files) === 0 && count($feature_files) == 0;

}
else {
    $err_str = "Got request with no game parameter!";
    throw new ErrorException($err_str);
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
                    <img class="avatar" src="assets/extern/images/logos/<?php echo htmlspecialchars($game->getDeveloperIconFilename()); ?>">
                    <div class="button-bar">
                        <?php echo '<a class="btn btn-secondary" href="' . htmlspecialchars($game->getDeveloperLink()) . '" target="_blank">Developer: ' . htmlspecialchars($game->getDeveloperName()) . '</a>'; ?>
                        <?php echo '<a class="btn btn-secondary" href="' . htmlspecialchars($game->getPlayLink()) . '" target="_blank">Play Game</a>'; ?>
                        <?php echo '<a class="btn btn-secondary" href="' . htmlspecialchars($game->getSourceLink()) . '" target="_blank">Source Code</a>'; ?>
                        <?php if (count($game->getPublications()) > 0) : ?>
                            <a class="btn btn-secondary" href="#publications">Publications</a>
                        <?php endif ?> 
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
        <div class="row mb-3">
            <div class="col">
                <h3 class="mb-0">Monthly Player Activity</h3>
            </div>
        </div>
        <!-- Chart -->
        <?php require 'includes/chart.php'; ?>
    </section>
    
    <div class="row mb-5 gy-2 ms-1">
        <div class="<?php echo (isset($game_files) ? 'col' : 'me-1 col'); ?>">
            <div class="bg-primary rounded row" id="stats" data-year="<?php echo $selected_year; ?>" data-month="<?php echo $selected_month; ?>">
                <div class="col" id="stats-header"><?php echo htmlspecialchars($month_name . ' ' . $selected_year); ?></div>
                <div class="col text-end" id="num-plays">No Plays</div>
            </div>
        </div>
        <?php if (isset($game_files)) : ?>
        <div class="month-nav-wrapper col-md-3 col-sm-4 gy-2 text-end">
            <nav class="text-nowrap">
                    <?php echo '<button id="month-prev" type="button" class="btn btn-outline-secondary" ' . $prev_disabled . '><i class="bi bi-chevron-left"></i> ' . $prev_month . '</button>'; ?>
                    <?php echo '<button id="month-next" type="button" class="ms-2 btn btn-outline-secondary" ' . $next_disabled . '>' . $next_month . ' <i class="bi bi-chevron-right"></i></button>'; ?>
            </nav>
        </div>
        <?php endif; ?>
    </div>
    
    <div class="row mb-5">
        <div class="col-md col-lg-5">
            <section id="pipelines" class="<?php echo count($game->getPublications()) > 0 ? '' : ' mb-5'; ?>">
                <!-- Data Pipeline -->
                <div class="pipelines-wrapper">
                    <div class="pipelines-container">
                        <h3 id="pipeline-header">Data Pipeline</h3>

                        <?php if($month_name): ?>
                            <div id="pipeline-month">Month of <?php echo $month_name ?></div>
                        <?php else: ?>
                            <div id="pipeline-month"></div>
                        <?php endif; ?>

                        <div class="pipeline-segments-wrapper mt-2">
                            <?php echo $button_raw->renderPipelineSegment(); ?>
                            <?php echo $button_detectors->renderPipelineSegment(); ?>
                            <?php echo $button_event->renderPipelineSegment(); ?>
                            <?php echo $button_extractors->renderPipelineSegment(); ?>
                            <?php echo $button_feature->renderPipelineSegment(); ?>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div class="col-md col-lg-7 ps-lg-5 ps-xl-0">
            <section id="pipeline-target">
                
                <div class="pipeline-target-block<?php echo ($have_no_files ? '' : ' d-none'); ?>" id="pipeline-target-none">
                    <div class="d-flex">
                        <img src="assets/images/icons/pipeline-none.svg" class="me-4 mb-3">
                        <div id="pipeline-target-summary">
                            <h3>No Data</h3>
                            <?php if($month_name): ?>
                                <p class="pipeline-target-month">Month of <?php echo htmlspecialchars($month_name); ?></p>
                            <?php else: ?>
                                <p class="pipeline-target-month"></p>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php if($month_name): ?>
                        <p id="pipeline-target-no-data-for-month">There is currently no data for the month of <?php echo htmlspecialchars($month_name); ?>.</p>
                    <?php else: ?>
                        <p id="pipeline-target-no-data-for-month">There is currently no data.</p>
                    <?php endif; ?>
                </div>

                <?php echo $button_raw->renderPipelineTarget(); ?>
                <?php echo $button_detectors->renderPipelineTarget(); ?>
                <?php echo $button_event->renderPipelineTarget(); ?>
                <?php echo $button_extractors->renderPipelineTarget(); ?>
                <?php echo $button_feature->renderPipelineTarget(); ?>
                
            </section>
            <hr>                
            <section id="templates" class="mb-5">
                <!-- Templates -->
                <h3>Templates</h3>
                <p>These samples link out to a github codespace and are useful for exploration and visualization. They are also effective starting spots for your own experiments.</p>

                <div class="btn-group-vertical">
                    <a id="events-data" class="btn btn-secondary btn-outline-secondary mb-2<?php     echo (isset($game_files) && $game_files->getEventsTemplate()     ? '' : ' d-none'); ?>" href="<?php echo htmlspecialchars(isset($game_files) ? $game_files->getEventsTemplate()     : ""); ?>">Events Template</a>
                    <a id="players-data" class="btn btn-secondary btn-outline-secondary mb-2<?php    echo (isset($game_files) && $game_files->getPlayersTemplate()    ? '' : ' d-none'); ?>" href="<?php echo htmlspecialchars(isset($game_files) ? $game_files->getPlayersTemplate()    : ""); ?>">Player Features Template</a>
                    <a id="population-data" class="btn btn-secondary btn-outline-secondary mb-2<?php echo (isset($game_files) && $game_files->getPopulationTemplate() ? '' : ' d-none'); ?>" href="<?php echo htmlspecialchars(isset($game_files) ? $game_files->getPopulationTemplate() : ""); ?>">Population Features Template</a>
                    <a id="sessions-data" class="btn btn-secondary btn-outline-secondary mb-2<?php   echo (isset($game_files) && $game_files->getSessionsTemplate()   ? '' : ' d-none'); ?>" href="<?php echo htmlspecialchars(isset($game_files) ? $game_files->getSessionsTemplate()   : ""); ?>">Session Features Template</a>
                </div>

            </section>

           
        </div> <!-- end column -->
    </div> <!-- end row --> 

    <?php if (count($game->getPublications()) > 0) : ?>
    <hr>
    <div class="row mb-5 mt-3">
        <div class="col-md">
            <section id="publications" class="mb-5">
                <!-- Publications -->
                <h3>Publications</h3>
                <ul class="list-unstyled mt-4">
                <?php
                    foreach ($game->getPublications() as $value) {
                        echo '<li class="mb-4 d-flex align-items-start">
                                <img class="me-3" src="assets/images/icons/publication.svg">
                                <div>'. $value->getFormattedPublication() . '</div>
                            </li>';
                    }
                ?>
                </ul>
            </section>
        </div>
    </div>
    <?php endif; ?>

    <?php else : 
        echo '<h2 class="h3">No game data available.</h2>';
    endif; ?>
</main>
<script type="module" src="assets/scripts/services.js"></script>
<script type="module" src="assets/scripts/game_usage.js"></script>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>