<?php
namespace services;

use GameFileInfo;
use GameUsage;

require_once 'models/APIResponse.php';
require_once 'models/GameFileInfo.php';
require_once 'models/GameUsage.php';

/* Get Games from game_list
 * Returns list as JSON or false
 */ 
function getGameList()
{ 
    $game_list = file_get_contents('config/game_list.json');
    return json_decode($game_list) ?? [];
}

/* Get single game details from game_list
 * <param> string game_id
 * Returns Array object associated with given game_id
 */
function getGameDetails(string $game_id)
{
    // Get full list of games
    $game_list = getGameList();
    // API will return just one game, for now access $game_id and re-encode json
    return !empty($game_list->{$game_id}) ? $game_list->{$game_id} : false;
}

/* Get game usage from API
 * <param> string game_id
 * <param> string year - optional
 * <param> string month - optional
 */
function getGameUsageByMonth(string $game_id, $year = null, $month = null): ?GameUsage
{
    $ret_val = null;

    $params = array(
        'game_id' => $game_id,
        'year' => $year,
        'month' => $month
    );

    # 1. Make request to API via cURL
    $usage_url = \AppConfig::GetConfig()['WEBSITE_API_URL_BASE'] . 'getGameUsageByMonth';

    $curl = curl_init($usage_url . '?' . http_build_query($params));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    $response_raw = curl_exec($curl);
    curl_close($curl);

    # 2. Convert response to a GameUsage object
    if ($response_raw != false) {
        $response_object = $response_raw ? json_decode(($response_raw)) : null;

        $api_response = \APIResponse::fromObj($response_object);
        if ($api_response->Status() == "SUCCESS") {
            $ret_val = \GameUsage::fromObj($api_response->Value());
        }
        else {
            $err_str = "getGameUsageByMonth request, for game_id=".$game_id." with year=".$year." and month=".$month.", was unsuccessful:\n".$api_response->Message();
            error_log($err_str);
        }
    }
    else {
        $err_str = "getGameUsageByMonth request, for game_id=".$game_id." with year=".$year." and month=".$month.", got no response object!";
        error_log($err_str);
    }

    return $ret_val;
}

/* Get game file info from API
 * <param> string game_id
 * <param> string year --optional
 * <param> string month --optional
 */
function getGameFileInfoByMonth(string $game_id, $year = null, $month = null) : ?GameFileInfo
{
    $ret_val = null;

    $params = array(
        'game_id' => $game_id,
        'year' => $year,
        'month' => $month
    );
    
    # 1. Make request to API via cURL
    $info_url =  \AppConfig::GetConfig()['WEBSITE_API_URL_BASE'] . 'getGameFileInfoByMonth';

    $curl = curl_init($info_url . '?' . http_build_query($params));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    $response_raw = curl_exec($curl);
    curl_close($curl);

    # 2. Convert response to a GameFileInfo object
    if ($response_raw != false) {
        $response_object = $response_raw ? json_decode(($response_raw)) : null;

        $api_response = \APIResponse::fromObj($response_object);
        $game_files = null;
        if ($api_response->Status() == "SUCCESS") {
            $game_files = \GameFileInfo::fromObj($api_response->Value());
        }
        else {
            $err_str = "getGameFileInfoByMonth request, for game_id=".$game_id." with year=".$year." and month=".$month.", was unsuccessful:\n".$api_response->Message();
            error_log($err_str);
        }
    }
    else {
        $err_str = "getGameFileInfoByMonth request, for game_id=".$game_id." with year=".$year." and month=".$month.", got no response object!";
        error_log($err_str);
    }

    return $game_files;
}

/* Get game usage from API
 * <param> string game_id
 */
function getGameUsage(string $game_id): ?GameUsage
{
    $params = array(
        'game_id' => $game_id
    );
    
    # 1. Make request to API via cURL
    $usage_url = \AppConfig::GetConfig()['WEBSITE_API_URL_BASE'] . 'getMonthlyGameUsage';

    $curl = curl_init($usage_url . '?' . http_build_query($params));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    $response_raw = curl_exec($curl);
    curl_close($curl);

    error_log("Sent a request for getGameUsage to ".$usage_url);

    # 2. Convert response to a GameUsage object
    if ($response_raw != false) {
        $response_object = $response_raw ? json_decode(($response_raw)) : null;

        $api_response = \APIResponse::fromObj($response_object);
        $game_files = null;
        if ($api_response->Status() == "SUCCESS") {
            $game_files = \GameUsage::fromObj($api_response->Value());
        }
        else {
            $err_str = "getGameUsage request, with game_id=".$game_id.", was unsuccessful:\n".$api_response->Message();
            error_log($err_str);
        }
    }
    else {
        $err_str = "getGameUsage request, with game_id=".$game_id.", got no response object!";
        error_log($err_str);
    }

    return $game_files;
}