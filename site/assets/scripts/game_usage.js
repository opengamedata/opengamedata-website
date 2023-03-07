import { getGameUsage } from "./services.js";

let params = new URLSearchParams(document.location.search);
let gameId = params.get("game_id");
let gameUsage = getGameUsage(gameId);
gameUsage.then(function (response) {
    // response.data
});
