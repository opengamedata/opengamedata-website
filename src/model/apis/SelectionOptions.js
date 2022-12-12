export class FilterOptions {
   constructor(game=null, start_date=null, end_date=null,
               min_app_version="", max_app_version="",
               min_log_version="", max_log_version="") {
      this.game_name = game;
      this.start_date = start_date;
      this.end_date = end_date;
      this.min_app_version = min_app_version;
      this.max_app_version = max_app_version;
      this.min_log_version = min_log_version;
      this.max_log_version = max_log_version;
   }

   ToLocalStorageKey() {
      return [this.game_name, this.start_date, this.end_date, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
}