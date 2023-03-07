<?php
class GameFileInfo 
{
    protected $start_date;
    protected $end_date;
    protected $events_file;
    protected $events_template;
    protected $players_file;
    protected $players_template;
    protected $population_file;
    protected $population_template;
    protected $raw_file;
    protected $sessions_file;
    protected $sessions_template;
    protected $sessions;

    public function __construct(string $start_date, string $end_date, ?string $events_file = null, ?string $events_template = null, ?string $players_file = null, ?string $players_template = null, ?string $population_file = null, ?string $population_template = null, ?string $raw_file = null, ?string $sessions_file = null, ?string $sessions_template = null, ?int $sessions = 0)
    {
        $this->start_date = $start_date;
        $this->end_date = $end_date;
        $this->events_file = $events_file;
        $this->events_template = $events_template;
        $this->players_file = $players_file;
        $this->players_template = $players_template;
        $this->population_file = $population_file;
        $this->population_template = $population_template;
        $this->raw_file = $raw_file;
        $this->sessions_file = $sessions_file;
        $this->sessions_template = $sessions_template;
        $this->sessions = $sessions;
    }

    public static function fromObj(object $obj): static {
        return new static($obj->{'start_date'},$obj->{'end_date'},$obj->{'events_file'},$obj->{'events_template'},$obj->{'players_file'},$obj->{'players_template'},$obj->{'population_file'},$obj->{'population_template'},$obj->{'raw_file'},$obj->{'sessions_file'},$obj->{'sessions_template'},$obj->{'sessions'});
    }

    // Get methods
    public function getStartDate()
    {
        return $this->start_date;
    }
    public function getEndDate()
    {
        return $this->end_date;
    }
    public function getEventsFile()
    {
        return $this->events_file;
    }
    public function getEventsTemplate()
    {
        return $this->events_template;
    }
    public function getPlayersFile()
    {
        return $this->players_file;
    }
    public function getPlayersTemplate()
    {
        return $this->players_template;
    }
    public function getPopulationFile()
    {
        return $this->population_file;
    }
    public function getPopulationTemplate()
    {
        return $this->population_template;
    }
    public function getRawFile()
    {
        return $this->raw_file;
    }
    public function getSessionsFile()
    {
        return $this->sessions_file;
    }
    public function getSessionsTemplate()
    {
        return $this->sessions_template;
    }
    public function getSessions()
    {
        return $this->sessions;
    }
}
?>