import { API_ORIGIN } from '../../constants';
import * as d3 from 'd3';

export class OGDPlayerAPI {
   static fetchPlayer(player_id, filter_options, metrics) {
      const path = OGDPlayerAPI.#getURLPath(player_id, filter_options, metrics)
      return       fetch(path)
   }

   static #getURLPath = (player_id, filter_options, view_metrics) => {
      let searchParams, urlPath
      // construct url path and params
      urlPath = `game/${filter_options.game_name}/player/${player_id}/metrics`;
      searchParams = new URLSearchParams({
         metrics: view_metrics
      });

      // fetch by url
      return new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)
   }
}