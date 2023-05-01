<?php 
require_once 'models/game_card.php';
require_once 'includes/functions.php';

class Card
{
    private $game;
    private $game_usage = null;
    private $game_link = "gamedata.php?game=";
    private $monthly_sessions = "0";

    public function __construct($game, $game_usage)
    {
        $this->game = $game;
        $this->game_usage = $game_usage;
        $this->game_link .= $this->game->getId();
        if (isset($game_usage)) {
            $this->monthly_sessions = num_in_kilo($this->game_usage->getLatestMonthlySessions());
        }
    }

    public function render() {
        return '<div class="col">
                    <a href="' . htmlspecialchars($this->game_link) . '" class="text-reset text-decoration-none">
                        <div class="card shadow">
                            <img src="' . htmlspecialchars($this->game->getThumbPath()) . '" class="card-img-top" alt="">
                            <div class="card-body">
                                <h4 class="card-title">' . htmlspecialchars($this->game->getName()) . '</h4>
                                <p class="card-subtitle small">' . htmlspecialchars($this->monthly_sessions) . ' Monthly Sessions</p>
                            </div>
                            <div class="card-footer d-flex align-items-center">
                                <img class="avatar me-2" src="../assets/images/avatar.png" alt="avatar"> 
                                <h5 class="mb-0">' . htmlspecialchars($this->game->getDeveloperName()) . '</h5> 
                            </div>
                        </div>
                    </a>
                </div>';
    }
}