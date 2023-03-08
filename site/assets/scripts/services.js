import axios from "./axios.min.js"

const getGameUsage = (gameId, year, month) => {
    const url = "http://localhost:5000/getGameUsageByMonth";
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
    const url = "http://localhost:5000/getGameFileInfoByMonth";
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