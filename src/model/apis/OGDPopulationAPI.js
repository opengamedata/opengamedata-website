import { API_ORIGIN } from '../../config';
import { PopulationSelectionOptions } from '../../controller/SelectionOptions';

export class OGDPopulationAPI {
   /**
    * @param {PopulationSelectionOptions} selection_options 
    * @param {string[]} metrics 
    * @returns {Promise<Response>}
    */
   static fetch(selection_options, metrics) {
      const path = OGDPopulationAPI.getURLPath(selection_options, metrics)
      return       fetch(path);
   }

   /**
    * @param {PopulationSelectionOptions} selection_options 
    * @param {string[]} metrics 
    * @returns {URL}
    */
   static getURLPath = (selection_options, metrics) => {
      // construct url path and params
      const urlPath = `game/${selection_options.game_name}/metrics`;
      if (selection_options.start_date === null) {
         console.warn("selection_options.start_date was null! Defaulting to ")
      }
      let start_date = selection_options.start_date || new Date();
      let end_date   = selection_options.end_date   || new Date();
      const searchParams = new URLSearchParams({
         start_datetime: encodeURIComponent(start_date.toISOString().split('T')[0]) + 'T00:00',
         end_datetime:   encodeURIComponent(  end_date.toISOString().split('T')[0]) + 'T23:59',
         metrics: `[${metrics}]`
      });

      // fetch by url
      return new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)
   }

}