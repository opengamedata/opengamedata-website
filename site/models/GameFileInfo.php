<?php
/**
 * GameFileInfo
 * 
 * Realistically, should be named DatasetInfo
 * Contains all data for modeling a dataset, including date range, and links to files, templates, and generator code.
 */
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
    protected $feature_files = [];
    protected $detectors_link;
    protected $features_link; // Extractors in the UI
    
    public function __construct($first_month, $first_year, $last_month, $last_year, $found_matching_range, $events_file = null, $events_template = null,
     $players_file = null, $players_template = null, $population_file = null, $population_template = null, $raw_file = null, $sessions_file = null,
     $sessions_template = null, $detectors_link = null, $features_link = null)
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
        $this->detectors_link = $detectors_link;
        $this->features_link = $features_link;
    }

    public static function fromObj($obj) {
        return new static(
            $obj->{'first_month'},
            $obj->{'first_year'},
            $obj->{'last_month'},
            $obj->{'last_year'},
            $obj->{'found_matching_range'},
            $obj->{'events_file'},
            $obj->{'events_template'},
            $obj->{'players_file'},
            $obj->{'players_template'},
            $obj->{'population_file'},
            $obj->{'population_template'},
            $obj->{'raw_file'},
            $obj->{'sessions_file'},
            $obj->{'sessions_template'},
            $obj->{'detectors_link'},
            $obj->{'features_link'}
        );
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
    public function getLastDate() : ?DateTimeImmutable
    {
        $ret_val = null;

        if ($this->getLastYear() && $this->getLastMonth()) {
            $ret_val = DateTimeImmutable::createFromFormat('Y-n-j|', $this->getLastYear().'-'.$this->getLastMonth().'-1');
        }

        return $ret_val ? $ret_val : null;
    }
    public function getFoundRange()
    {
        return $this->found_matching_range;
    }
    public function getRawFileLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->raw_file) : $this->raw_file;
    }
    public function getEventsFileLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->events_file) : $this->events_file;
    }
    public function getEventsTemplateLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->events_template) : $this->events_template;
    }
    public function getPlayersFileLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->players_file) : $this->players_file;
    }
    public function getPlayersTemplateLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->players_template) : $this->players_template;
    }
    public function getPopulationFileLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->population_file) : $this->population_file;
    }
    public function getPopulationTemplateLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->population_template) : $this->population_template;
    }
    public function getSessionsFileLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->sessions_file) : $this->sessions_file;
    }
    public function getSessionsTemplateLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->sessions_template) : $this->sessions_template;
    }
    public function getFeatureFiles()
    {
        $this->feature_files['Population Features'] = $this->population_file;
        $this->feature_files['Player Features'] = $this->players_file;
        $this->feature_files['Session Features'] = $this->sessions_file;
        
        return $this->feature_files;
    }

    public function getDetectorsLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->detectors_link) : $this->detectors_link;
    }

    public function getFeaturesLink(bool $html_safe = true) : ?string
    {
        return $html_safe ? htmlspecialchars($this->features_link) : $this->features_link;
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
    public function getPrevMonth($current_date) 
    {
        $_first_date = DateTime::createFromFormat('Y-n-j|', $this->first_year . '-' . $this->first_month . '-1');
        if ($_first_date == $current_date) return $current_date;
        
        $_usage_array = $this->getUsageRange();

        // If date not found, return selected_date
        if (!in_array($current_date->format('Y-n-j'), array_map(array('GameFileInfo', 'doFormat'), $_usage_array))) return $current_date;

        $_date_index = array_search($current_date->format('Y-n-j'), array_map(array('GameFileInfo', 'doFormat'), $_usage_array));

        // Return previous month from usage_range
        return $_date_index+1 <= count($_usage_array) ? $_usage_array[$_date_index-1] : $current_date;
    }

    /* Get the next month
     * Returns next month number or selected month if no next month exists
     * <param> DateTime selected_date
     */
    public function getNextMonth($current_date)
    {
        $_last_date = DateTime::createFromFormat('Y-n-j|', $this->last_year . '-' . $this->last_month . '-1');
        if ($_last_date == $current_date) return $current_date;
        
        $_usage_array = $this->getUsageRange();

        // If date not found, return selected_date
        if (!in_array($current_date->format('Y-n-j'), array_map(array('GameFileInfo', 'doFormat'), $_usage_array))) return $current_date;
        
        $_date_index = array_search($current_date->format('Y-n-j'), array_map(array('GameFileInfo', 'doFormat'), $_usage_array));

        // Return next month from usage_range
        return count($_usage_array) >= $_date_index+1 ? $_usage_array[$_date_index+1] : $current_date;
    }

    public static function doFormat($value)
    {
        return $value->format('Y-n-j');
    }
}