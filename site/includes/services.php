<?php
namespace services;

/* Get Games from game_list
 * Returns list as JSON or false
 */ 
function getGameList()
{ 
    return file_get_contents('./data/game_list.json');
}

/* Get single game details from game_list
 * <param> string game_id
 * Returns JSON
 */
function getGameDetails(string $game_id)
{
    // Get full list of games
    $game_list = json_decode(getGameList());
    // API will return just one game, for now access $game_id and re-encode json
    return !empty($game_list->{$game_id}) ? json_encode($game_list->{$game_id}) : false;
}

/* Get game usage from API
 * <param> string game_id
 * <param> string year - optional
 * <param> string month - optional
 */
function getGameUsage(string $game_id, ?string $year = null, ?string $month = null)
{
    $params = array(
        'game_id' => $game_id,
        'year' => $year,
        'month' => $month
    );

    // TODO Get url from config
    $usage_url = "http://localhost:5000/getGameUsageByMonth";

    $curl = curl_init($usage_url . '?' . http_build_query($params));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);

    return $response ? json_decode(($response)) : null;
}

/* Get game file info from API
 * <param> string game_id
 * <param> string year
 * <param> string month
 */
function getGameFileInfoByMonth(string $game_id, string $year, string $month)
{
    $params = array(
        'game_id' => $game_id,
        'year' => $year,
        'month' => $month
    );
    // TODO Get url from config
    $info_url = "http://localhost:5000/getGameFileInfoByMonth";

    $curl = curl_init($info_url . '?' . http_build_query($params));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);

    return $response ? json_decode(($response)) : null;
}

?>