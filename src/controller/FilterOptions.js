export class FilterOptions {
   constructor(min_jobs=1, min_playtime=null, max_playtime=null) {
      this.min_jobs = min_jobs;
      this.min_playtime = min_playtime;
      this.max_playtime = max_playtime;
   }

   ToLocalStorageKey() {
      return [this.game_name, this.start_date, this.end_date, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
}