class SelectionOptions {
   constructor(game=null,
               min_app_version="", max_app_version="",
               min_log_version="", max_log_version="") {
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
   constructor(game=null,
               min_app_version="", max_app_version="",
               min_log_version="", max_log_version="",
               start_date=null, end_date=null) {
      super(game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.start_date = start_date;
      this.end_date = end_date;
   }
}

export class PlayerSelectionOptions extends SelectionOptions {
   constructor(game=null,
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
   constructor(game=null,
               min_app_version="", max_app_version="",
               min_log_version="", max_log_version="",
               session_ids=[]) {
      super(game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.session_ids = session_ids;
   }
}