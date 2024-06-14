<?php 
/* Round number to kilos (nearest 1K)
 * <params> number
 * Returns number in kilos or the number passed if under 1K 
 */ 
function num_in_kilo ( $num ) {
    if ($num < 1000) return $num;
    return round($num/1000) . "K"; 
}

/*
 * Based on example at https://stackoverflow.com/questions/21133/simplest-way-to-profile-a-php-script
 */
function profile_point($msg) {
    global $profiler_timing, $profiler_names;
    $profiler_timing[] = microtime(true);
    $profiler_names[] = $msg;
}

function profiler_print() {
    global $profiler_timing, $profiler_names;
    $count = count($profiler_timing);
    for ($i = 0; $i < $count-1; $i++) {
        echo "<b>{$profiler_names[$i]}</b><br>";
        echo sprintf("&nbsp&nbsp;&nbsp;%f<br>", $profiler_timing[$i+1]-$profiler_timing[$i]);
    }
    echo "<b>{$profiler_names[$count-1]}</b><br>";
}