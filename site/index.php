<?php

require_once 'config/AppConfig.php';
require_once 'includes/services.php';
require_once 'models/APIResponse.php';
require_once 'models/GameDetails.php';
require_once 'models/GameUsage.php';
require_once 'models/GameCard.php';
require_once 'components/Card.php';
require_once 'includes/profiler.php';

$profilers = [];
$profilers[] = new Profiler("Profile", 0);

// Get game list
$profilers[0]->ProfilePoint("Get game data list from server");
$gamelist = services\getGameList();
$games = [];
$profilers[0]->ProfilePoint("Process game list");
$i=0;
foreach($gamelist as $key => $value)
{
    // Get game usage from api for each game
    $profilers[] = new Profiler("{$key}Profile", 1);
    $i++;
    $profilers[$i]->ProfilePoint("Get usage for game {$key}");
    $game_usage = services\getGameUsage($key);

    $profilers[$i]->ProfilePoint("Create game card object for game {$key}");
    $game_card = new GameCard(GameDetails::fromArray($key, $value), $game_usage);
    array_push($games, $game_card);
    $profilers[$i]->EndPoint();
}
?>
<?php require 'includes/header.php'; ?>
<section class="hero w-100 px-3 py-5 px-md-5 bg-dark text-white d-flex">
    <div class="col-sm-6 mt-auto my-md-auto">
        <h1 class="display-1">Welcome to Open Game Data</h1>
        <p class="lead">We are leveraging data science to create meaningful insights out of mountains of player data.</p>
        <div class="text-nowrap">
            <a href="#gamelist" class="btn btn-primary me-3">View Games</a> 
            <a href="about.php" class="btn btn-dark">Learn More</a>
        </div>
    </div>
</section>
<main id="dashboard">
    <section id="gamelist" class="container-fluid mb-5">
        <h2 class="mb-5 text-center">Featured Data Sets</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <?php 
                $profilers[0]->ProfilePoint("Render game cards");
                foreach($games as $game_card) {
                    $card = new Card($game_card->getGame(),$game_card->getGameUsage());
                    echo $card->render();
                }
            ?>
        </div>
    </section>
</main>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php';?>
<?php 
    $profilers[0]->EndPoint();
    foreach ($profilers as $profile) {
        $profile->Complete();
    }
?>
