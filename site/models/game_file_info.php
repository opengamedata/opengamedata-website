<?php
class GameFileInfo 
{
    protected $first_month;
    protected $first_year;
    protected $last_month;
    protected $last_year;
    protected $found_matching_range;
    protected $events_file;
    protected $events_template;
    protected $players_file;
    protected $players_template;
    protected $population_file;
    protected $population_template;
    protected $raw_file;
    protected $sessions_file;
    protected $sessions_template;    
    
    public function __construct(int $first_month, int $first_year, int $last_month, int $last_year, bool $found_matching_range, ?string $events_file = null, ?string $events_template = null, ?string $players_file = null, ?string $players_template = null, ?string $population_file = null, ?string $population_template = null, ?string $raw_file = null, ?string $sessions_file = null, ?string $sessions_template = null)
    {
        $this->first_month = $first_month;
        $this->first_year = $first_year;
        $this->last_month = $last_month;
        $this->last_year = $last_year;
        $this->found_matching_range = $found_matching_range;
        $this->events_file = $events_file;
        $this->events_template = $events_template;
        $this->players_file = $players_file;
        $this->players_template = $players_template;
        $this->population_file = $population_file;
        $this->population_template = $population_template;
        $this->raw_file = $raw_file;
        $this->sessions_file = $sessions_file;
        $this->sessions_template = $sessions_template;
    }

    public static function fromObj(object $obj): static {
        return new static($obj->{'first_month'},$obj->{'first_year'},$obj->{'last_month'},$obj->{'last_year'},$obj->{'found_matching_range'},$obj->{'events_file'},$obj->{'events_template'},$obj->{'players_file'},$obj->{'players_template'},$obj->{'population_file'},$obj->{'population_template'},$obj->{'raw_file'},$obj->{'sessions_file'},$obj->{'sessions_template'});
    }

    // Get methods
    public function getFirstMonth()
    {
        return $this->first_month;
    }
    public function getFirstYear()
    {
        return $this->first_year;
    }
    public function getLastMonth()
    {
        return $this->last_month;
    }
    public function getLastYear()
    {
        return $this->last_year;
    }
    public function getFoundRange()
    {
        return $this->found_matching_range;
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

    // Prev/next month functions

    /* Get range of dates from first month/year to last month/year
     * Returns array of DateTime objects
     */
    public function getUsageRange()
    {
        $first_date = DateTime::createFromFormat('Y-n-j|', $this->first_year . '-' . $this->first_month . '-1');
        $last_date = DateTime::createFromFormat('Y-n-j|', $this->last_year . '-' . $this->last_month . '-1');
        $current_date = $first_date;
        $usage_range = [];
        while ($current_date <= $last_date)
        {
            array_push($usage_range, new DateTimeImmutable($current_date->format('Y-m-d')));
            $current_date->modify('+1 month');
        }

        return $usage_range;
    }
    
    /* Get the previous month
     * Returns previous month number or selected month if no previous month exists
     * <param> DateTime selected_date
     */
    public function getPrevMonth(DateTimeImmutable $current_date): DateTimeImmutable 
    {
        $_first_date = DateTime::createFromFormat('Y-n-j|', $this->first_year . '-' . $this->first_month . '-1');
        if ($_first_date == $current_date) return $current_date;
        
        $_usage_array = $this->getUsageRange();

        // If date not found, return selected_date
        if (!in_array($current_date->format('Y-n-j'), array_map(fn($value): string => $value->format('Y-n-j'), $_usage_array))) return $current_date;

        $_date_index = array_search($current_date->format('Y-n-j'), array_map(fn($value): string => $value->format('Y-n-j'), $_usage_array));

        // Return previous month from usage_range
        return $_date_index+1 <= count($_usage_array) ? $_usage_array[$_date_index-1] : $current_date;
    }

    /* Get the next month
     * Returns next month number or selected month if no next month exists
     * <param> DateTime selected_date
     */
    public function getNextMonth(DateTimeImmutable $current_date): DateTimeImmutable 
    {
        $_last_date = DateTime::createFromFormat('Y-n-j|', $this->last_year . '-' . $this->last_month . '-1');
        if ($_last_date == $current_date) return $current_date;
        
        $_usage_array = $this->getUsageRange();

        // If date not found, return selected_date
        if (!in_array($current_date->format('Y-n-j'), array_map(fn($value): string => $value->format('Y-n-j'), $_usage_array))) return $current_date;
        
        $_date_index = array_search($current_date->format('Y-n-j'), array_map(fn($value): string => $value->format('Y-n-j'), $_usage_array));

        // Return next month from usage_range
        return count($_usage_array) >= $_date_index+1 ? $_usage_array[$_date_index+1] : $current_date;
    }
}
?>