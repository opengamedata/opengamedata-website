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
        return isset($this->sessions[0]) ? $this->sessions[count($this->sessions)-1]->total_sessions : 0;
    }

    // Find the most-recent month that had sessions
    // Sum up the number of sessions in that month and previous months, going back as many as 12 months
    // Return the average number of sessions per month over that range
    public function getAverageMonthlySessionsOverMostRecentActiveYear()
    {
        if(!is_array($this->sessions))
        {
            return 0;
        }

        $numMonthsCounted = 0;
        $sumOfSessions = 0;

        // Loop through months from most recent to oldest
        foreach(array_reverse($this->sessions) as $monthData)
        {
            // If this month has sessions
            if($monthData->total_sessions > 0)
            {
                // Add it to our sum
                $sumOfSessions += $monthData->total_sessions;
            }

            // If we've found a month with sessions (either this iteration or a previous iteration)
            if($sumOfSessions > 0)
            {
                // This month counts towards our 12 (whether or not it had sessions)
                $numMonthsCounted++;
            }

            // Once we have 12 months of data we can quit
            if($numMonthsCounted == 12)
            {
                break;
            }

        }

        // If we didn't have any months with sessions
        if($numMonthsCounted == 0)
        {
            return 0;
        }

        // Return an integer average
        return (int)($sumOfSessions / $numMonthsCounted);

    }

}