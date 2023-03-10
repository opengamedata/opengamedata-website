<?php

require_once 'includes/app_config.php';
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
                <h2>How Open Game Data Works</h2>
                <p>We have built an open-source and community-maintained data storage and processing pipeline for educational game data. From the logging libraries that studios can integrate into their games, all the way to the final visualizations that allow design researchers to build new theory, we are thinking about modularity, scalability and performance.</p> 
                <p>Gone are the days of ad hoc, glued together analysis! It's time we worked together.</p>
            </div>
            <div class="col-sm about-robot">
                <img class="img-fluid" src="/assets/images/about-robot.png" alt="robot">
            </div>
        </div>
        <div class="row top-buffer">
            <div class="col-sm my-auto order-sm-last">
                <h2>Data without Insight isn't worth much.</h2>
                <p>Everyone is excited about data science and analytics for learning. Games provide rich descriptions into how learners interact with complex systems. We are excited to develop new methods to transform that raw &quot;click steam&quot; data into insights that can be used by designers, educators, researchers and learners. Open Game Data is the infrastructure that will support those discoveries.</p>
            </div>            
            <div class="col-sm order-sm-first about-data my-auto">
                <img class="img-fluid" src="/assets/images/about-data.png" alt="data graph">
            </div>

        </div>
    </section>
</main>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>