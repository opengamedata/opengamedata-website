export class ViewModes {
   static POPULATION = new ViewModes('POPULATION');
   static PLAYER = new ViewModes('PLAYER');
   static SESSION = new ViewModes('SESSION');

   constructor(name) { this.name = name; }
   toString() { return this.name; }
}