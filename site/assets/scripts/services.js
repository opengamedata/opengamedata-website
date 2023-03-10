import axios from "./axios.min.js"

const getGameUsage = (gameId, year, month) => {
    const url = WEBSITE_API_URL_BASE + 'getGameUsageByMonth';
    let data = axios.get(url, {
        params: {
            game_id: gameId,
            year: year, //optional
            month: month //optional
        }
    })
    .then(function (response) {
        return response.data;
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
        return response.data;
    });

    return data;
}

export { getGameUsage, getGameFiles };