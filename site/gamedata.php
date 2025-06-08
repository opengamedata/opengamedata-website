<?php
/*
    FILE README:
    This file is a bit complicated, as the page itself had/has a *lot* of object parsing, date manipulation, and other business logic in what ought to be the "view" portion of the code.
    While this has been cleaned up somewhat, there remains a lot going on in the page construction.
    To create a reasonable tradeoff between coupling and cohesion, the file is structured as follows:
    1. Declaration: A <?php?> tag containing imports, calls to services functions, and construction of a few elements that are used in multiple sections.
    2. Section Generation: A <?php?> tag containing function definitions to render each <section> of the page.
        These functions have a structure that mirrors the overall file structure:
        * Declaration: declaring of local variables, including defaults for elements of the <section>.
        * Element Generation: A check for null inputs, wrapped around logic to generate the "intended" elements of the <section>
            The defaults set in the "Declaration" section typically include a message saying the element could not be generated due to null data.
            Thus, if the check for null inputs fails, there will be a reasonable explanation rather than a crash.
        * Section Construction: A return statement that assembles the elements within the structure of the <section>.
    3. Page Construction: A <?php?> tag that assembles the sections together into the structure of the page.

    Keeping this structure in mind, it should be easier to navigate the file and update logic.
    In the future, some of the business logic embedded into the section generation functions could be factored out into proper control classes,
    and then it might be possible to push this file closer to a typical HTML-oriented PHP page script.
*/

require_once 'config/AppConfig.php';
require_once 'includes/services.php';
require_once 'models/GameDetails.php';
require_once 'models/GameFileInfo.php';
require_once 'components/PipelineButton.php';

// Declare variables
$game_id = null;
$game_details = null;
$game_files = null;

$buttons = null;

if (isset($_GET['game']) && $_GET['game'] != '') {

    // 1. sanitize game ID by removing any characters that aren't alpha-numeric or an underscore
    $game_id = strtoupper(preg_replace("/[^a-zA-Z0-9-_]+/", "", $_GET['game']));
    // 2. Get game details from the game_list file.
    $game_details = services\getGameDetails($game_id);
    if (!isset($game_details)) {
        $err_str = "Failed to find game details for game_id=".$game_id.", got no response object!";
        error_log($err_str);
    }
    // 3. Get game file info from API
    /* HACK ALERT! Dumb, stupid, awful hack that assumes a thing called
       "get game file-info by *month*" will be fine if you don't give it a month whose file info you want,
       and will say "that's alright good buddy, I'll just give you info on the most recent month."
       As if it's obvious that a thing that says "request a month" would consider the month optional...
       Future version of API should provide endpoint to allow request of most recent month for a game, directly.
    */
    $game_files = services\getGameFileInfoByMonth($game_id);
    if (!isset($game_files)) {
        $err_str = "getGameFileInfoByMonth request, for game_id=".$game_id." with year=null and month=null, got no response object!";
        error_log($err_str);
    }
    $buttons = generatePipelineButtons($game_files, $selected_date);
}
else {
    $err_str = "gamedata.php got request with no game parameter!";
    error_log($err_str);
}

?>
<?php
function renderOverviewSection(?GameDetails $game_details)
{
    $overview_elem = '<div class="col-md-7 my-auto">NO OVERVIEW AVAILABLE, GAME DETAILS NOT FOUND!</div>';
    $thumb_elem    = '<img class="img-fluid rounded" src="./assets/exter/images/graphics/robohead-512.png">';

    if (isset($game_details)) {
        $publications_link = count($game_details->getPublications()) > 0 ? '<a class="btn btn-secondary" href="#publications">Publications</a>' : '';
        $overview_elem = 
        '<div class="col-md-7 my-auto">
            <h2>'.htmlspecialchars($game_details->getName()).'</h2>
            <div class="d-flex align-items-center mb-3">
                <img class="avatar" src="assets/extern/images/logos/'.htmlspecialchars($game_details->getDeveloperIconFilename()).'">
                <div class="button-bar">
                    <a class="btn btn-secondary" href="' . htmlspecialchars($game_details->getDeveloperLink()) . '" target="_blank">Developer: ' . htmlspecialchars($game_details->getDeveloperName()) . '</a>
                    <a class="btn btn-secondary" href="' . htmlspecialchars($game_details->getPlayLink()) . '" target="_blank">Play Game</a>
                    <a class="btn btn-secondary" href="' . htmlspecialchars($game_details->getSourceLink()) . '" target="_blank">Source Code</a>'
                    . $publications_link .
                '</div>
            </div>
            <p>'
                .htmlspecialchars($game_details->getDescription()).
            '</p>
        </div>';
        $thumb_elem = '<img class="img-fluid rounded" src="' . htmlspecialchars($game_details->getThumbPath()) . '">';
    }
    else {
        error_log("Can not generate all elements for the overview in gamedata.php, did not get a valid set of game details!");
    }
    
    return 
    '<section id="game-overview">
        <div class="row mb-5">'.
            $overview_elem.'\n'.
            '<div class="col">'.'\n'.
                $thumb_elem.'\n'.
            '</div>
        </div>
    </section>';

}

function renderChartSection(?GameFileInfo $game_files) {
    $play_count_element = '<div class="bg-primary rounded row">NO PLAY COUNT AVAILABLE, GAME DETAILS NOT FOUND!</div>';
    $nav_elements = '<nav class="text-nowrap"></nav>';

    if (isset($game_files)) {
        $selected_year = null;
        $selected_month = null;
        $month_name = null;

        $prev_month = null;
        $next_month = null;
        $prev_disabled = null;
        $next_disabled = null;

        $selected_date = $game_files->getLastDate();
        if ($selected_date) {
            $selected_year = $selected_date->format('Y');
            $selected_month = $selected_date->format('n');
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
            $play_count_element =
                    '<div class="bg-primary rounded row" id="stats" data-year="'.$selected_year.'" data-month="'.$selected_month.'">
                        <div class="col" id="stats-header">'.htmlspecialchars($month_name . ' ' . $selected_year).'</div>
                        <div class="col text-end" id="num-plays">No Plays</div>
                    </div>';
            $nav_elements =
                '<nav class="text-nowrap">
                    <button id="month-prev" type="button" class="btn btn-outline-secondary" ' . $prev_disabled . '><i class="bi bi-chevron-left"></i> ' . $prev_month . '</button>
                    <button id="month-next" type="button" class="ms-2 btn btn-outline-secondary" ' . $next_disabled . '>' . $next_month . ' <i class="bi bi-chevron-right"></i></button>
                </nav>';
        }
        else {
            error_log("Can not generate full month selection elements for the sessions chart in gamedata.php, did not get a valid selected date!\n\$selected_date=".strval($selected_date));
        }
    }
    return
    '<section id="monthly-sessions-chart">
        <div class="row mb-3">
            <div class="col">
                <h3 class="mb-0">Monthly Player Activity</h3>
            </div>
        </div>
        <!-- Chart -->
        <div class="position-relative">    
            <div id="chart-wrapper" class="position-relative">
                <div id="chart" class="position-relative">
                    <canvas id="activityChart" style="height: 0;"></canvas>
                </div>
            </div>
            <canvas id="chartYAxis" height="0" width="0"></canvas>
        </div>
        <script src="assets/scripts/chart.umd.js"></script>
        <script type="module" src="assets/scripts/chart.js"></script>
    </section>
    <div class="row mb-5 gy-2 ms-1">
        <div class="'.isset($game_files) ? 'col' : 'me-1 col'.'">'.'\n'.
            $play_count_element.'\n'.
        '</div>
        <div class="month-nav-wrapper col-md-3 col-sm-4 gy-2 text-end">'.'\n'.
            $nav_elements.'\n'.
        '</div>
    </div>';
}

function generatePipelineButtons(?GameFileInfo $game_files)
{
    $raw_files = [];
    $detectors_files = [];
    $event_files = [];
    $extractors_files = [];
    $feature_files = [];
    $month_name = "NO MONTH AVAILABLE";

    if (isset($game_files)) {
        $raw_files        = $game_files->getRawFile()       ? array('Raw Data' => $game_files->getRawFile())             : [];
        $detectors_files  = $game_files->getDetectorsLink() ? array('Detectors' => $game_files->getDetectorsLink())      : [];
        $event_files      = $game_files->getEventsFile()    ? array('Calculated Events' => $game_files->getEventsFile()) : [];
        $extractors_files = $game_files->getFeaturesLink()  ? array('Extractors' => $game_files->getFeaturesLink())      : []; // aka Extractors or Feature Extractors
        $feature_files    = $game_files->getFeatureFiles()  ? $game_files->getFeatureFiles()                             : [];
        $month_name       = $game_files->getLastDate() ? $game_files->getLastDate()->format('F') : $month_name;
    }


    // Create Pipeline buttons (including the transition buttons)
    // $title, $image, $image_active, $selector, $file_links, $month, $text, $is_active, $is_a_transition_button)
    $raw_description      = 'Time-sequenced data as provided by the game directly. Includes player events, system feedback and game progression.';
    $events_description   = 'Raw time-sequenced data interwoven with with events generated by automated detectors.';
    $features_description = 'Feature-engineered data that describe game-play at different levels of aggregation.';
    return [
        "raw"
        => new PipelineButton('Raw Data', 'pipeline-raw.svg', 'pipeline-raw-active.svg',
                                'raw', $raw_files, $month_name, $raw_description,
                                count($raw_files) > 0,
                                false
        ),
        "detectors"
        => new PipelineButton('Detectors', 'pipeline-transform-btn.png', 'pipeline-transform-active.svg',
                                'detector', $detectors_files, $month_name, '',
                                count($raw_files) == 0 && count($detectors_files) > 0,
                                true
        ),
        "events"
        => new PipelineButton('Calculated Events', 'pipeline-event.svg', 'pipeline-event-active.svg',
                                'event', $event_files, $month_name, $events_description,
                                count($raw_files) === 0 && count($detectors_files) === 0 && count($event_files) > 0,
                                false
        ),
        "extractors"
        => new PipelineButton('Extractors', 'pipeline-transform-btn.png', 'pipeline-transform-active.svg',
                                'extractor', $extractors_files, $month_name, '',
                                count($raw_files) == 0 && count($detectors_files) === 0 && count($event_files) === 0 && count($extractors_files) > 0,
                                true
        ),
        "features"
        => new PipelineButton('Feature Data', 'pipeline-feature.svg', 'pipeline-feature-active.svg',
                                'feature', $feature_files, $month_name, $features_description,
                                count($raw_files) === 0 && count($event_files) === 0 && count($extractors_files) === 0 && count($feature_files) > 0,
                                false
        )
    ];
}

function renderPipelineSection(?GameDetails $game_details, ?DateTimeImmutable $selected_date, array $buttons)
{
    $section_class = isset($game_details) && count($game_details->getPublications()) > 0
                   ? ''
                   : 'mb-5';
    $month_element = isset($selected_date)
                   ? '<div id="pipeline-month">Month of '.$selected_date->format('n').'</div>'
                   : '<div id="pipeline-month"></div>';

    return
    '<section id="pipelines" class="'.$section_class.'">
        <!-- Data Pipeline -->
        <div class="pipelines-wrapper">
            <div class="pipelines-container">
                <h3 id="pipeline-header">Data Pipeline</h3>' . '\n'
                . $month_element . '\n' .
                '<div class="pipeline-segments-wrapper mt-2">' . '\n'
                    . $buttons["raw"]->renderPipelineSegment()       . '\n'
                    . $buttons["detectors"]->renderPipelineSegment() . '\n'
                    . $buttons["events"]->renderPipelineSegment()    . '\n'
                    . $buttons["extractors"]->renderPipelineSegment(). '\n'
                    . $buttons["features"]->renderPipelineSegment()  . '\n' .
                '</div>
            </div>
        </div>
    </section>';
}

function renderPipelineTargetSection(?GameFileInfo $game_files, array $buttons)
{
    $have_no_files = true;
    $month_name     = null;
    $month_element  = '<p class="pipeline-target-month"></p>';
    $nodata_element = '<p id="pipeline-target-no-data-for-month">There is currently no data, and no selected date.</p>';

    if (isset($game_files)) {
        // Determine stuff about the month that should be selected.
        $selected_date = $game_files->getLastDate();
        if ($selected_date) {
            $month_name     = htmlspecialchars( $selected_date->format('n') );
            $month_element  = '<p class="pipeline-target-month">Month of '.$month_name.'</p>';
            $nodata_element = '<p id="pipeline-target-no-data-for-month">There is currently no data for the month of '.$month_name.'.</p>';
        }
        // Determine if we don't have files for the selected month
        $have_no_files = $game_files->getRawFile() == false
                    // detectors link wasn't included in original logic, need to determine if that was a bug or if there was reason for not considering it.
                    //   && $game_files->getDetectorsLink() == false
                      && $game_files->getEventsFile() == false
                      && $game_files->getFeaturesLink() == false
                      && $game_files->getFeatureFiles() == false;
    }

    return
    '<section id="pipeline-target">
        <div class="pipeline-target-block' . $have_no_files ? '' : ' d-none' . '" id="pipeline-target-none">
            <div class="d-flex">
                <img src="assets/images/icons/pipeline-none.svg" class="me-4 mb-3">
                <div id="pipeline-target-summary">
                    <h3>No Data</h3>' . '\n' .
                    $month_element . '\n' .
                '</div>
            </div>' . '\n' .
            $nodata_element . '\n' .
        '</div>' . '\n' .
        $buttons["raw"]->renderPipelineTarget()       . '\n' .
        $buttons["detectors"]->renderPipelineTarget() . '\n' .
        $buttons["events"]->renderPipelineTarget()    . '\n' .
        $buttons["extractors"]->renderPipelineTarget(). '\n' .
        $buttons["features"]->renderPipelineTarget()  . '\n' .
    '</section>';
}

function renderTemplatesSection(?GameFileInfo $game_files)
{
    $events_class   = 'd-none';
    $players_class  = 'd-none';
    $pop_class      = 'd-none';
    $sessions_class = 'd-none';

    $events_template   = '';
    $players_template  = '';
    $pop_template      = '';
    $sessions_template = '';

    if (isset($game_files)) {

        $events_template   = $game_files->getEventsTemplate();
        $players_template  = $game_files->getPlayersTemplate();
        $pop_template      = $game_files->getPopulationTemplate();
        $sessions_template = $game_files->getSessionsTemplate();

        $events_class   = $events_template   ? '' : $events_class;
        $players_class  = $players_template  ? '' : $players_class;
        $pop_class      = $pop_template      ? '' : $pop_class;
        $sessions_class = $sessions_template ? '' : $sessions_class;
    }

    return '<section id="templates" class="mb-5">
        <!-- Templates -->
        <h3>Templates</h3>
        <p>These samples link out to a github codespace and are useful for exploration and visualization. They are also effective starting spots for your own experiments.</p>

        <div class="btn-group-vertical">
            <a id="events-data" class="btn btn-secondary btn-outline-secondary mb-2'.$events_class.'" href="'.htmlspecialchars($events_template).'">Events Template</a>
            <a id="players-data" class="btn btn-secondary btn-outline-secondary mb-2'.$players_class.'" href="'.htmlspecialchars($players_template).'">Player Features Template</a>
            <a id="population-data" class="btn btn-secondary btn-outline-secondary mb-2'.$pop_class.'" href="'.htmlspecialchars($pop_template).'">Population Features Template</a>
            <a id="sessions-data" class="btn btn-secondary btn-outline-secondary mb-2'.$sessions_class.'" href="'.htmlspecialchars($sessions_template).'">Session Features Template</a>
        </div>

    </section>';
}

function renderPublicationsSection(?GameDetails $game_details)
{
    $publications = '<li class="mb-4 d-flex align-items-start">NO PUBLICATIONS AVAILABLE, GAME DETAILS NOT FOUND!</li>';

    if (isset($game_details)) {
        $elements = [];
        foreach ($game_details->getPublications() as $value) {
            $elements[] =
                '<li class="mb-4 d-flex align-items-start">
                    <img class="me-3" src="assets/images/icons/publication.svg">
                    <div>'. $value->getFormattedPublication() . '</div>
                </li>';
        }
        $publications = implode("\n", $elements);
    }

    return
    '<section id="publications" class="mb-5">
        <!-- Publications -->
        <h3>Publications</h3>
        <ul class="list-unstyled mt-4">'
            . $publications .
        '</ul>
    </section>';
}
?>
<?php require 'includes/header.php'; ?>
<main id="gamedata" class="container-fluid">
    <?php echo renderOverviewSection($game_details) ?>
    <?php echo renderChartSection($game_files) ?>
    
    <div class="row mb-5">
        <div class="col-md col-lg-5">
        <?php echo renderPipelineSection($game_details, $selected_date, $buttons) ?>
        </div>
        <div class="col-md col-lg-7 ps-lg-5 ps-xl-0">
            <?php echo renderPipelineTargetSection($game_files, $buttons) ?>
            <hr>                
            <?php renderTemplatesSection($game_files) ?>
        </div> <!-- end column -->
    </div> <!-- end row --> 
    <?php if ( isset($game_details) && count($game_details->getPublications()) > 0 ) : ?>
        <hr>
        <div class="row mb-5 mt-3">
            <div class="col-md">
                <?php renderPublicationsSection($game_details) ?>
            </div>
        </div>
    <?php endif; ?>
</main>
<script type="module" src="assets/scripts/services.js"></script>
<script type="module" src="assets/scripts/game_usage.js"></script>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>
