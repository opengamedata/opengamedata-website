<?php
class GameUsage
{
    protected $game_id;
    protected $selected_month;
    protected $selected_year;
    protected $total_monthly_sessions;
    protected $sessions_by_day;

    public function __construct($id, $selected_month, $selected_year, $total_monthly_sessions, $sessions_by_day)
    {
        $this->game_id = $id;
        $this->selected_month = $selected_month;
        $this->selected_year = $selected_year;
        $this->total_monthly_sessions = $total_monthly_sessions;
        $this->sessions_by_day = $sessions_by_day;
    }

    public static function fromObj($obj) {
        return new static($obj->{'game_id'},$obj->{'selected_month'},$obj->{'selected_year'},$obj->{'total_monthly_sessions'},$obj->{'sessions_by_day'});
    }

    public static function fromJson($json) {
        $data = json_decode($json);
        return new static($data->{'game_id'},$data->{'selected_month'},$data->{'selected_year'},$data->{'total_monthly_sessions'},$data->{'sessions_by_day'});
    }

    // Get methods
    public function getId()
    {
        return $this->game_id;
    }
    public function getSelectedMonth()
    {
        return $this->selected_month;
    }
    public function getSelectedYear()
    {
        return $this->selected_year;
    }
    public function getTotalMonthlySessions()
    {
        return $this->total_monthly_sessions;
    }
    public function getSessionsByDay()
    {
        return $this->sessions_by_day;
    }

}