<?php
require_once 'includes/services.php';
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
    if (isset($response_obj) && $response_obj->{'success'}) {
        $game_usage = GameUsage::fromObj($response_obj->{'data'});
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
            <a href="#about" class="btn btn-dark">Learn More</a>
        </div>
    </div>
</section>
<main id="dashboard">
    <section id="gamelist" class="container-fluid">
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
    <section id="about" class="container-fluid mb-5">
        <div class="row">
            <div class="col-sm my-auto">
                <h2>About Open Game Data</h2>
                <p>In Wake: Tales from the Aqualab, kids take on the role of a budding scientist exploring exciting ecosystems in the ocean. Like real scientists, players will observe organisms in their natural habitat, devise and run experiments to collect data on how organisms interact with each other, construct scientific models in order to predict the trajectory of ecosystems, and argue their findings to other scientists.</p>
            </div>
            <div class="col-sm">
                <img class="img-fluid" src="/assets/images/hero-artwork.png" alt="robot">
            </div>
        </div>
        <div class="row">
            <div class="col-sm my-auto order-sm-last">
                <h2>How it Works:</h2>
                <p>In Wake: Tales from the Aqualab, kids take on the role of a budding scientist exploring exciting ecosystems in the ocean. Like real scientists, players will observe organisms in their natural habitat, devise and run experiments to collect data on how organisms interact with each other, construct scientific models in order to predict the trajectory of ecosystems, and argue their findings to other scientists.</p>
            </div>            
            <div class="col-sm order-sm-first">
                <img class="img-fluid" src="/assets/images/robot-xray.png" alt="robot xray">
            </div>

        </div>
    </section>
</main>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>