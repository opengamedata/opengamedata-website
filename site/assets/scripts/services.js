import axios from "./axios.min.js"

const getGameUsage = (gameId) => {
    const url = "http://localhost:5000/getGameUsageByMonth";
    let data = axios.get(url, {
        params: {
            game_id: gameId
            // year: year, --optional
            // month: month --optional
        }
    })
    .then(function (response) {
        return response.data;
    });

    return data;
}

export { getGameUsage };