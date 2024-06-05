import axios from "../scripts/axios.min.js"
import APIResponse from "../scripts/APIResponse.js"

const getGameUsageByMonth = (gameId, year, month) => {
    const url = WEBSITE_API_URL_BASE + 'getGameUsageByMonth';
    let data = axios.get(url, {
        params: {
            game_id: gameId,
            year: year, //optional
            month: month //optional
        }
    })
    .then(function (response) {
        return new APIResponse(response.data);
    });

    return data;
}

const getGameFiles = (gameId, year, month) => {
    const url = WEBSITE_API_URL_BASE + 'getGameFileInfoByMonth';
    let data = axios.get(url, {
        params: {
            game_id: gameId,
            year: year, //optional
            month: month //optional
        }
    })
    .then(function (response) {
        return new APIResponse(response.data);
    });

    return data;
}

const getGameUsage = (gameId) => {
    const url = WEBSITE_API_URL_BASE + 'getMonthlyGameUsage';
    let data = axios.get(url, {
        params: {
            game_id: gameId
        }
    })
    .then(function (response) {
        return new APIResponse(response.data);
    });

    return data;
}

export { getGameUsageByMonth, getGameUsage, getGameFiles };