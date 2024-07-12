<?php 
/* Round number to kilos (nearest 1K)
 * <params> number
 * Returns number in kilos or the number passed if under 1K 
 */ 
function num_in_kilo ( $num ) {
    if ($num < 1000) return $num;
    return round($num/1000) . "K"; 
}
