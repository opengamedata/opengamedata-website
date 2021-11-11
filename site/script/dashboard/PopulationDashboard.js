// *** Ok, stuff for desginer dashboard here, to be refactored later.
function update_designer_dash(game_id) {
  if (game_id in population_features) {
    const features = population_features[game_id]['percount'].concat(population_features[game_id]['aggregate']);

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
      UpdateTable(response_data['val'], game_id);
    }
    Server.get_models_by_daterange(designer_dash_callback, game_id, encodeURIComponent(ipt_starttime.value), encodeURIComponent(ipt_endtime.value), features);
  }
  else {
    UpdateTable({}, game_id)
  }
}

function UpdateTable(population_data, game_id) {
  let sess_ct = document.getElementById("sess_ct");
  let table = document.getElementById("data_table");
  if (game_id in population_features) {
    const PER_LEVEL_FEATS = population_features[game_id]['percount'];
    const NUM_LEVELS = population_features[game_id]['levelcount'];
    const PREFIX = population_features[game_id]['prefix'];
    // set the session count
    if (population_data != null) {
      sess_ct.innerText = `Session Count: ${population_data['SessionCount']}`;
      table.innerHTML   = null;
      // set up table header
      let header = table.insertRow(0);
      let col = header.insertCell(0);
      col.innerText = "Level";
      for (let feature of PER_LEVEL_FEATS) {
          let col = header.insertCell(-1);
          col.innerText = feature;
      }
      // put data into table
      for (let i = 0; i <= NUM_LEVELS; i++) {
        let row = table.insertRow(-1);
        let col = row.insertCell(-1);
        col.innerText = i;
        for (let feature of PER_LEVEL_FEATS) {
          let col = row.insertCell(-1);
          let index = `${PREFIX}${i}_${feature}`;
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
