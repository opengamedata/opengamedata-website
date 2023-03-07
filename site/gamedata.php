<?php

require_once 'includes/services.php';
require_once 'models/game.php';
require_once 'models/game_usage.php';
require_once 'models/game_file_info.php';

// Declare variables
$game_id = null;
$game = null;

$month_name = null;
$prev_month = null;
$next_month = null;
$prev_disabled = null;
$next_disabled = null;

$game_json = null;

if (isset($_GET['game']) && $_GET['game'] != '') {

    $game_id = strtoupper(htmlspecialchars($_GET['game']));
    
    // Get game details from api
    $game_json = services\getGameDetails($game_id);
    $game = $game_json ? Game::fromJson($game_id, $game_json) : null;
   
    // Get game usage from api
    $response_obj = services\getGameUsage($game_id);

    if (isset($response_obj) && $response_obj->{'success'}) {
        $game_usage = GameUsage::fromObj($response_obj->{'data'});
    }

    $response_obj = null;

    // Get game file info from API
    $response_obj = services\getGameFileInfoByMonth($game_id, $game_usage->getSelectedYear(), $game_usage->getSelectedMonth());
    
    if (isset($response_obj) && $response_obj->{'success'}) {
        $game_files = GameFileInfo::fromObj($response_obj->{'data'});

        // TODO process file links    
        // Populate current, previous, and next dates
        $selected_date = DateTimeImmutable::createFromFormat('Y-n-j|', $game_usage->getSelectedYear() . '-' . $game_usage->getSelectedMonth() . '-1');
        $month_name = $selected_date->format('F');

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

/* Round number to kilos (nearest 1K)
 * <params> number
 * Returns number in kilos or the number passed if under 1K 
 */ 
function num_in_kilo ( $num ) {
    if ($num < 1000) return $num;
    return round($num/1000) . "K"; 
} 

?>
<?php require 'includes/header.php'; ?>
<main id="gamedata" class="container-fluid">
    <?php if (isset($game)) : ?>
    <section>
        <div class="row mb-5">
            <div class="col-md-7 my-auto">
                <h2><?php echo $game->getName() ?></h2>
                <div class="d-flex align-items-center mb-3">
                    <img class="avatar" src="/assets/images/avatar.png">
                    <div class="button-bar">
                        <?php echo '<a class="btn btn-secondary" href="' . $game->getDeveloperLink() . '">Developer: ' . $game->getDeveloperName() . '</a>'; ?>
                        <?php echo '<a class="btn btn-secondary" href="' . $game->getPlayLink() . '" target="_blank">Play Game</a>'; ?>
                        <?php echo '<a class="btn btn-secondary" href="' . $game->getSourceLink() . '" target="_blank">Source Code</a>'; ?>
                    </div>
                </div>
                <p>
                    <?php echo $game->getDescription() ?>
                </p>
            </div>
            <div class="col">
                <?php echo '<img class="img-fluid rounded" src="' . $game->getThumbPath() . '">'; ?>
            </div>
        </div>
    </section>
    <section>
        <div class="row mb-5">
            <div class="col">
                <h3 class="mb-0">Player Activity</h3>
                <strong><?php echo $month_name . " " . $game_usage->getSelectedYear() ?></strong>
            </div>
            <div class="col text-end">
                <nav class="text-nowrap">
                    <?php echo '<button id="month-prev" type="button" class="btn btn-outline-secondary" ' . $prev_disabled . '><i class="bi bi-chevron-left"></i> ' . $prev_month . '</button>'; ?>
                    <?php echo '<button id="month-next" type="button" class="btn btn-outline-secondary" ' . $next_disabled . '>' . $next_month . ' <i class="bi bi-chevron-right"></i></button>'; ?>
                </nav>
            </div>
        </div>
        <!-- Chart -->
    </section>
    <div class="row mb-5">
        <div class="col-md">
            <section class="mb-5">
                <!-- Stats -->
                <h3><?php echo $month_name . " Stats:" ?></h3>
                <div class="stats bg-primary text-secondary rounded d-inline-block">
                    <h4 class="mb-0">
                        <?php echo num_in_kilo($game_usage->getTotalMonthlySessions()) . " Plays"; ?>
                    </h4>
                    <?php echo "In " . $month_name ?>
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
            </section>
            <section class="mb-5">
                <!-- Publications -->
                <h3>Publications</h3>
                <?php
                    foreach ($game->getPublications() as $value) {
                        echo '<div class="card shadow mb-4">
                            <div class="card-body">
                                <a class="btn btn-secondary btn-publication" href="' . $value->Link . '">' . $value->StudyName . '</a>
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

<!-- Begin Footer Include -->
<script type="module" src="/assets/scripts/services.js"></script>
<script type="module" src="/assets/scripts/game_usage.js"></script>
<?php require 'includes/footer.php'; ?>