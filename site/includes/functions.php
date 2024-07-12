<?php 
/* Round number to kilos (nearest 1K)
 * <params> number
 * Returns number in kilos or the number passed if under 1K 
 */ 
function num_in_kilo ( $num ) {
    if ($num < 1000) return $num;
    return round($num/1000) . "K"; 
}

/** Set next "breakpoint" for profiling.
 *  Based on example at https://stackoverflow.com/questions/21133/simplest-way-to-profile-a-php-script
 */
function profile_point($msg) {
    global $profiler_timing, $profiler_messages;
    $profiler_timing[] = microtime(true);
    $profiler_messages[] = $msg;
}

/** Print out all profiling points to a div.
 *  Based on example at https://stackoverflow.com/questions/21133/simplest-way-to-profile-a-php-script
 */
function profiler_print() {
    global $profiler_timing, $profiler_messages;
    $final_timing = microtime(true);
    $count = count($profiler_timing);
    echo "<div>";
    for ($i = 0; $i < $count-1; $i++) {
        echo "<b>{$profiler_messages[$i]}</b>";
        echo sprintf("&nbsp&nbsp;&nbsp;%f<br>", $profiler_timing[$i+1]-$profiler_timing[$i]);
    }
    echo "<b>{$profiler_messages[$count-1]}</b><br>";
    echo sprintf("&nbsp&nbsp;&nbsp;%f<br>", $final_timing-$profiler_timing[$count]);
    echo "</div>";
}