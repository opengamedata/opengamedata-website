import { API_ORIGIN } from '../../config';

export class OGDPopulationAPI {
   static fetch(filter_options, metrics) {
      const path = OGDPopulationAPI.getURLPath(filter_options, metrics)
      return       fetch(path);
   }

   static getURLPath = (filter_options, metrics) => {
      // construct url path and params
      const urlPath = `game/${filter_options.game_name}/metrics`;
      const searchParams = new URLSearchParams({
         start_datetime: encodeURIComponent(filter_options.start_date) + 'T00:00',
         end_datetime: encodeURIComponent(filter_options.end_date) + 'T23:59',
         metrics: `[${metrics}]`
      });

      // fetch by url
      return new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)
   }

}