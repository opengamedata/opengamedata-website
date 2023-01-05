import { vis_games } from '../config';

class SelectionOptions {
   /**
    * @param {string} game
    * @param {string?} min_app_version
    * @param {string?} max_app_version
    * @param {string?} min_log_version
    * @param {string?} max_log_version
    */
   constructor(game=vis_games[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      this.game_name = game;
      this.min_app_version = min_app_version;
      this.max_app_version = max_app_version;
      this.min_log_version = min_log_version;
      this.max_log_version = max_log_version;
   }

   ToLocalStorageKey() {
      return [this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
}

export class PopulationSelectionOptions extends SelectionOptions {
   /**
    * @param {string} game
    * @param {string?} min_app_version
    * @param {string?} max_app_version
    * @param {string?} min_log_version
    * @param {string?} max_log_version
    * @param {Date?} start_date
    * @param {Date?} end_date
    */
   constructor(game=vis_games[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               start_date=null, end_date=null) {
      super(game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.start_date = start_date;
      this.end_date = end_date;
   }
}

export class PlayerSelectionOptions extends SelectionOptions {
   /**
    * @param {string} game
    * @param {string} min_app_version
    * @param {string} max_app_version
    * @param {string} min_log_version
    * @param {string} max_log_version
    * @param {Array.<string>} player_ids
    */
   constructor(game=vis_games[0],
               min_app_version="", max_app_version="",
               min_log_version="", max_log_version="",
               player_ids=[]) {
      super(game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.player_ids = player_ids;
   }
}

export class SessionSelectionOptions extends SelectionOptions {
   /**
    * @param {string} game
    * @param {string} min_app_version
    * @param {string} max_app_version
    * @param {string} min_log_version
    * @param {string} max_log_version
    * @param {Array.<string>} session_ids
    */
   constructor(game=vis_games[0],
               min_app_version="", max_app_version="",
               min_log_version="", max_log_version="",
               session_ids=[]) {
      super(game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.session_ids = session_ids;
   }
}