<?php

require_once 'includes/app_config.php';
require_once 'includes/services.php';
require_once 'models/APIResponse.php';
require_once 'models/game.php';
require_once 'models/game_usage.php';
require_once 'models/game_card.php';
require_once 'components/card.php';

// Get game list
$gamelist_json = services\getGameList();
$gamelist = $gamelist_json ? json_decode($gamelist_json) : [];

$games = [];
foreach($gamelist as $key => $value)
{
    // Get game usage from api for each game
    $response_obj = services\getGameUsage($key);
    $game_usage = null;
    if (isset($response_obj)) {
        $api_response = APIResponse::fromObj($response_obj);
        if ($api_response->Status() == "SUCCESS") {
            $game_usage = GameUsage::fromObj($api_response->Value());
        }
        else {
            $err_str = "getGameUsage request, with game id=".$key.", was unsuccessful:\n".$api_response->Message()."\nFull response: ".json_encode($response_obj);
            error_log($err_str);
        }
    }
    else {
        $err_str = "getGameUsage request, with game_id=".$key.", got no response object!";
        error_log($err_str);
    }

    $game_card = new GameCard(Game::fromJson($key, json_encode($value)), $game_usage);
    array_push($games, $game_card);
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
                foreach($games as $game_card) {
                    $card = new Card($game_card->getGame(),$game_card->getGameUsage());
                    echo $card->render();
                }
            ?>
        </div>
    </section>
</main>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>