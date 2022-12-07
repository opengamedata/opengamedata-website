export class FilterOptions {
   constructor(game=null, start_data=null, end_date=null, version="", min_playtime=0, max_playtime=0) {
      this.game_name = game;
      this.start_date = start_data;
      this.end_date = end_date;
      this.version = version;
      this.min_playtime = min_playtime;
      this.max_playtime = max_playtime;
   }

   ToLocalStorageKey() {
      return [this.game_name, this.start_date, this.end_date, this.version, this.min_playtime, this.max_playtime].join("/")
   }
}