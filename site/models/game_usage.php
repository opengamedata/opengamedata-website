<?php
class GameUsage
{
    protected $game_id;
    protected $selected_month;
    protected $selected_year;
    protected $first_month;
    protected $first_year;
    protected $last_month;
    protected $last_year;
    protected $total_monthly_sessions;
    protected $sessions_by_day;

    public function __construct(string $id, int $selected_month, int $selected_year, int $first_month, int $first_year, int $last_month, int $last_year, int $total_monthly_sessions, object $sessions_by_day)
    {
        $this->game_id = $id;
        $this->selected_month = $selected_month;
        $this->selected_year = $selected_year;
        $this->first_month = $first_month;
        $this->first_year = $first_year;
        $this->last_month = $last_month;
        $this->last_year = $last_year;
        $this->total_monthly_sessions = $total_monthly_sessions;
        $this->sessions_by_day = $sessions_by_day;
    }

    public static function fromObj(object $obj): static {
        return new static($obj->{'game_id'},$obj->{'selected_month'},$obj->{'selected_year'},$obj->{'first_month'},$obj->{'first_year'},$obj->{'last_month'},$obj->{'last_year'},$obj->{'total_monthly_sessions'},$obj->{'sessions_by_day'});
    }

    public static function fromJson(string $json): static {
        $data = json_decode($json);
        return new static($data->{'game_id'},$data->{'selected_month'},$data->{'selected_year'},$data->{'first_month'},$data->{'first_year'},$data->{'last_month'},$data->{'last_year'},$data->{'total_monthly_sessions'},$data->{'sessions_by_day'});
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
    public function getTotalMonthlySessions()
    {
        return $this->total_monthly_sessions;
    }
    public function getSessionsByDay()
    {
        return $this->sessions_by_day;
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