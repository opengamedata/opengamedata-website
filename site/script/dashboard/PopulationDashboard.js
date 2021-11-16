class PopulationDashboard {
  constructor(_init_game="None") {
    this.active_game = _init_game;
    this.PER_LEVEL_FEATS = population_features[this.active_game]['percount'];
    this.NUM_LEVELS = population_features[this.active_game]['levelcount'];
    this.PREFIX = population_features[this.active_game]['prefix'];
    this.working = false;
  }

  ChangeGames(game_id) {
    this.active_game = game_id
    this.PER_LEVEL_FEATS = population_features[this.active_game]['percount'];
    this.NUM_LEVELS = population_features[this.active_game]['levelcount'];
    this.PREFIX = population_features[this.active_game]['prefix'];
  }

  async Update(force=false) {
    if (force === true) {
      console.log("Manually refreshed population dashboard");
      try {
        this._update();
      }
      catch(err) {
        console.log(err.message);
        if (PRINT_TRACE)
        {
          console.trace();
        }
      }
      finally {
        this.working = false;
      }
    }
    else if (this.working === false) {
      this.working = true;
      try {
        await this._update();
      }
      catch(err) {
        console.log(err.message);
        if (PRINT_TRACE)
        {
          console.trace();
        }
      }
      finally {
        this.working = false;
      }
    }
    else {
      console.log(`Dashboard is already updating, waiting on next timer.`)
    }
  }
  // *** Ok, stuff for desginer dashboard here, to be refactored later.
  _update() {
    if (this.active_game in population_features) {
      const features = population_features[this.active_game]['percount'].concat(population_features[game_id]['aggregate']);

      let ipt_starttime = document.getElementById('ipt_starttime');
      let ipt_endtime = document.getElementById('ipt_endtime');

      let table = document.getElementById("data_table");
      table.innerHTML = null;
      let row = table.insertRow(0);
      row.innerHTML = "Waiting for data from server...";
      console.log("Waiting for data from server...");

      let designer_dash_callback = function(responseString) {
        let response_data = JSON.parse(responseString);
        console.log("...got data from server.");
        UpdateTable(response_data['val']);
      }
      Server.get_models_by_daterange(designer_dash_callback, game_id, encodeURIComponent(ipt_starttime.value), encodeURIComponent(ipt_endtime.value), features);
    }
    else {
      UpdateTable({}, game_id)
    }
  }

  UpdateTable(population_data) {
    let sess_ct = document.getElementById("sess_ct");
    let table = document.getElementById("data_table");
    if (this.active_game in population_features) {
      // set the session count
      if (population_data != null) {
        sess_ct.innerText = `Session Count: ${population_data['SessionCount']}`;
        table.innerHTML   = null;
        // set up table header
        let header = table.insertRow(0);
        let col = header.insertCell(0);
        col.innerText = "Level";
        for (let feature of this.PER_LEVEL_FEATS) {
            let col = header.insertCell(-1);
            col.innerText = feature;
        }
        // put data into table
        for (let i = 0; i <= this.NUM_LEVELS; i++) {
          let row = table.insertRow(-1);
          let col = row.insertCell(-1);
          col.innerText = i;
          for (let feature of this.PER_LEVEL_FEATS) {
            let col = row.insertCell(-1);
            let index = `${this.PREFIX}${i}_${feature}`;
            if (index in population_data) {
              let datum = population_data[index].toString();
              if (datum.includes('.') && !isNaN(parseFloat(datum))) {
                col.innerText = parseFloat(datum).toFixed(2);
              }
              else {
                col.innerText = datum;
              }
            }
            else {
              col.innerText = "N/A";
            }
          }
        }
      }
      else {
        sess_ct.innerText = `Session Count: Unknown`;
        table.innerHTML = null;
        table.appendChild(document.createTextNode(`Server Error, could not retrieve dashboard data.`));
      }
    }
    else {
        sess_ct.innerText = `Session Count: Unknown`;
        table.innerHTML = null;
        table.appendChild(document.createTextNode(`No features available for this game.`));
    }
  }
}
