export class FilterOptions {
   constructor(min_jobs=1, min_playtime=null, max_playtime=null) {
      this.min_jobs = min_jobs;
      this.min_playtime = min_playtime;
      this.max_playtime = max_playtime;
   }
}