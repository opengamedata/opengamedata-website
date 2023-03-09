<?php

require_once 'includes/services.php';
require_once 'models/game.php';
require_once 'models/game_usage.php';
require_once 'models/game_file_info.php';
require_once 'includes/functions.php';

// Declare variables
$game_id = null;
$game = null;
$game_usage = null;
$game_files = null;

$month_name = null;
$prev_month = null;
$next_month = null;
$prev_disabled = null;
$next_disabled = null;

$game_json = null;

if (isset($_GET['game']) && $_GET['game'] != '') {

    $game_id = strtoupper(preg_replace("/[^a-zA-Z0-9]+/", "", $_GET['game']));
    
    // Get game details from api
    $game_json = services\getGameDetails($game_id);
    $game = $game_json ? Game::fromJson($game_id, $game_json) : null;
   
    // Get game usage from api
    $response_obj = services\getGameUsage($game_id);

    if (isset($response_obj) && $response_obj->{'success'}) {
        $game_usage = GameUsage::fromObj($response_obj->{'data'});
        $selected_date = DateTimeImmutable::createFromFormat('Y-n-j|', $game_usage->getSelectedYear() . '-' . $game_usage->getSelectedMonth() . '-1');
        $month_name = $selected_date->format('F');
    }

    $response_obj = null;

    // Get game file info from API
    if ($game_usage != null) {
        $response_obj = services\getGameFileInfoByMonth($game_id, $game_usage->getSelectedYear(), $game_usage->getSelectedMonth());

        if (isset($response_obj) && $response_obj->{'success'}) {
            $game_files = GameFileInfo::fromObj($response_obj->{'data'});

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
        }
    }

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
                <?php if (isset($game_usage)) : ?>
                    <strong><span id="player-activity-date"><?php echo $month_name . " " . htmlspecialchars($game_usage->getSelectedYear()) ?></span></strong>
                    <?php else : 
                        echo 'No player activity to display';
                    endif; ?>
            </div>
            <?php if (isset($game_usage)) : ?>
                <div class="col text-end">
                    <nav class="text-nowrap">
                        <?php echo '<button id="month-prev" type="button" class="btn btn-outline-secondary" ' . $prev_disabled . '><i class="bi bi-chevron-left"></i> ' . $prev_month . '</button>'; ?>
                        <?php echo '<button id="month-next" type="button" class="btn btn-outline-secondary" ' . $next_disabled . '>' . $next_month . ' <i class="bi bi-chevron-right"></i></button>'; ?>
                    </nav>
                </div>
            <?php endif; ?>
        </div>
        <!-- Chart -->
    </section>
    <div class="row mb-5">
        <div class="col-md">
            <section class="mb-5">
                <!-- Stats -->
                <h3 id="stats-header"><?php echo $month_name . " Stats:" ?></h3>
                <div class="stats bg-primary text-secondary rounded d-inline-block">
                    <?php if (isset($game_usage)) : ?>
                        <h4 id="num-plays" class="mb-0">
                            <?php echo num_in_kilo(htmlspecialchars($game_usage->getTotalMonthlySessions())) . " Plays"; ?>
                        </h4>
                        <span id="stats-data-month"><?php echo "In " . $month_name ?></span>
                    <?php else : 
                        echo 'None';
                    endif; ?>
                </div>
            </section>
            <section class="mb-5">
                <!-- Data Pipeline -->
                <h3>Data Pipelines:</h3>
            </section>
        </div>
        <div class="col-md">
            <section class="mb-5">
                <!-- Templates -->
                <h3>General Templates</h3>
                <p>These templates link out to a github codespace and are useful for exploration and visualization. They are also effective starting spots for your own experiments.</p>
                <?php if (isset($game_files) && $game_files->getEventsTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="events-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getEventsTemplate()) . '">Events Data</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (isset($game_files) && $game_files->getPlayersTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="players-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getPlayersTemplate()) . '">Players Data</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (isset($game_files) && $game_files->getPopulationTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="population-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getPopulationTemplate()) . '">Population Data</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (isset($game_files) && $game_files->getSessionsTemplate() !== null) : ?>
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <?php echo '<a id="sessions-data" class="btn btn-secondary btn-general" href="' . htmlspecialchars($game_files->getSessionsTemplate()) . '">Sessions Data</a>'; ?>
                    </div>
                </div>
                <?php endif; ?>
            </section>
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