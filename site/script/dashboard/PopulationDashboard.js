class PopulationDashboard {
  constructor(_init_game="None") {
    this.active_game = _init_game;
    if (this.active_game in population_features) {
      this.AGGREGATE_FEATS = population_features[this.active_game]['aggregate'];
      this.PER_LEVEL_FEATS = population_features[this.active_game]['percount'];
      this.NUM_LEVELS = population_features[this.active_game]['levelcount'];
      this.PREFIX = population_features[this.active_game]['prefix'];
      this.AGGREGATE_METAS = Object.keys(population_features[this.active_game]['aggregate_metas']);
      this.PER_LEVEL_METAS = Object.keys(population_features[this.active_game]['percount_metas']);
    }
    else {
      this.AGGREGATE_FEATS = [];
      this.PER_LEVEL_FEATS = [];
      this.NUM_LEVELS = [];
      this.PREFIX = [];
      this.AGGREGATE_METAS = [];
      this.PER_LEVEL_METAS = [];
    }
    document.getElementById("aggregate_row").hidden = this.AGGREGATE_FEATS.length === 0;
    document.getElementById("percount_row").hidden = this.PER_LEVEL_FEATS.length === 0;
    this.working = false;
  }

  ChangeGames(game_id) {
    this.active_game = game_id
    this.AGGREGATE_FEATS = population_features[this.active_game]['aggregate'];
    this.PER_LEVEL_FEATS = population_features[this.active_game]['percount'];
    this.NUM_LEVELS = population_features[this.active_game]['levelcount'];
    this.PREFIX = population_features[this.active_game]['prefix'];
    this.AGGREGATE_METAS = Object.keys(population_features[this.active_game]['aggregate_metas']);
    this.PER_LEVEL_METAS = Object.keys(population_features[this.active_game]['percount_metas']);
    document.getElementById("aggregate_row").hidden = this.AGGREGATE_FEATS.length === 0;
    document.getElementById("percount_row").hidden = this.PER_LEVEL_FEATS.length === 0;
  }

  async Update(force=false) {
    if (force === true) {
      this.working = true;
      console.log("Manually refreshed population dashboard");
      try {
        this._update();
      }
      catch(err) {
        console.warn(err.message);
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
        console.warn(err.message);
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

  _update() {
    if (this.active_game in population_features) {
      const features = population_features[this.active_game]['percount'].concat(population_features[this.active_game]['aggregate']);

      let ipt_starttime = document.getElementById('ipt_starttime');
      let ipt_endtime = document.getElementById('ipt_endtime');

      let agg_table = document.getElementById("aggregate_table");
      if (!agg_table.hidden) {
        agg_table.innerHTML = null;
        let row = agg_table.insertRow(0);
        row.innerHTML = "Waiting for data from server...";
      }
      let per_ct_table = document.getElementById("percount_table");
      if (!per_ct_table.hidden) {
        per_ct_table.innerHTML = null;
        let row = per_ct_table.insertRow(0);
        row.innerHTML = "Waiting for data from server...";
      }
      console.log("Waiting for data from server...");

      let that = this;
      let designer_dash_callback = function(responseString) {
        let response_data = JSON.parse(responseString);
        console.log("...got data from server.");
        that._updateAggregateTable(response_data['val']);
        that._updatePercountTable(response_data['val']);
      }
      Server.get_models_by_daterange(designer_dash_callback, this.active_game, encodeURIComponent(ipt_starttime.value), encodeURIComponent(ipt_endtime.value), features);
    }
    else {
      this._updateAggregateTable({})
      this._updatePercountTable({})
    }
  }

  _updateAggregateTable(population_data) {
    let table = document.getElementById("aggregate_table");
    table.innerHTML   = null;
    if (population_data != null) {
      if (this.active_game in population_features) {
        // set up table header and row
        let header = table.insertRow(0);
        let row = table.insertRow(-1);
        // fill in features
        for (let feature of this.AGGREGATE_FEATS) {
          let col = header.insertCell(-1);
          col.innerText = feature;
          col = row.insertCell(-1);
          this._genFeature(col, feature, population_data);
        }
        // fill in meta-features
        for (let meta of this.AGGREGATE_METAS) {
          let col = header.insertCell(-1);
          col.innerText = meta;
          col = row.insertCell(-1);
          this._genMeta(col, this.PER_LEVEL_METAS[meta], population_data)
        }
      }
      else {
          table.appendChild(document.createTextNode(`No features available for this game.`));
      }
    }
    else {
      table.appendChild(document.createTextNode(`Server Error, could not retrieve dashboard data.`));
    }
  }

  _updatePercountTable(population_data) {
    let table = document.getElementById("percount_table");
    table.innerHTML   = null;
    if (population_data != null) {
      if (this.active_game in population_features) {
        // set up table header
        let header = table.insertRow(0);
        let col = header.insertCell(0);
        col.innerText = "Level";
        for (let feature of this.PER_LEVEL_FEATS) {
            let col = header.insertCell(-1);
            col.innerText = feature;
        }
        for (let meta of this.PER_LEVEL_METAS) {
            let col = header.insertCell(-1);
            col.innerText = meta;
        }
        // put data into table
        for (let i = 0; i <= this.NUM_LEVELS; i++) {
          let row = table.insertRow(-1);
          let col = row.insertCell(-1);
          col.innerText = i;
          for (let feature of this.PER_LEVEL_FEATS) {
            let col = row.insertCell(-1);
            let index = `${this.PREFIX}${i}_${feature}`;
            this._genFeature(col, index, population_data);
          }
          for (let meta of this.PER_LEVEL_METAS) {
            let col = row.insertCell(-1);
            this._genMeta(col, this.PER_LEVEL_METAS[meta], population_data)
          }
        }
      }
      else {
          table.appendChild(document.createTextNode(`No features available for this game.`));
      }
    }
    else {
      table.appendChild(document.createTextNode(`Server Error, could not retrieve dashboard data.`));
    }
  }

  _genFeature(col, index, population_data) {
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

  _genMeta(col, meta_tokens, population_data) {
    let stack = [];
    for (let token of meta_tokens) {
      let as_num = Number(token);
      if (as_num !== NaN) {
        stack.push(as_num);
      }
      else {
        switch (token) {
          case '+':
            a = stack.pop();
            b = stack.pop();
            stack.push(a + b);
            break;
          case '-':
            a = stack.pop();
            b = stack.pop();
            stack.push(a - b);
            break;
          case '*':
            a = stack.pop();
            b = stack.pop();
            stack.push(a * b);
            break;
          case '/':
          case '\\':
            a = stack.pop();
            b = stack.pop();
            stack.push(a / b);
            break;
          case '%':
            a = stack.pop();
            b = stack.pop();
            stack.push(a % b);
            break;
          default:
            let as_feature = population_data[token];
            if (as_feature !== undefined) {
              stack.push(as_feature)
            }
            else {
              console.warn(`Found invalid feature in meta-feature expression: ${meta}`)
            }
        }
      }
    }
    col.innerText = stack.join();
  }
}
