<?php
class GameUsage
{
    protected $game_id;
    protected $sessions;

    public function __construct($id, $sessions)
    {
        $this->game_id = $id;
        $this->sessions = $sessions;
    }

    public static function fromObj($obj) {
        return new static($obj->{'game_id'},$obj->{'sessions'});
    }

    public static function fromJson($json) {
        $data = json_decode($json);
        return new static($data->{'game_id'},$data->{'sessions'});
    }

    // Get methods
    public function getId()
    {
        return $this->game_id;
    }
    public function getSessions()
    {
        return $this->sessions;
    }
    public function getLatestMonthlySessions()
    {
        return array_is_list($this->sessions) ? $this->sessions[count($this->sessions)-1]->total_sessions : 0;
    }

}