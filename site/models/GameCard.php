<?php
require_once 'GameDetails.php';
require_once 'GameUsage.php';

class GameCard
{
    private $game;
    private $game_usage = null;

    public function __construct($game, $game_usage)
    {
        $this->game = $game;
        $this->game_usage = $game_usage;
    }

    // Get methods
    public function getGame() 
    {
        return $this->game;
    }
    public function getGameUsage() 
    {
        return $this->game_usage;
    }
}