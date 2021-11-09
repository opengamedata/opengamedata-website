// *** Ok, stuff for desginer dashboard here, to be refactored later.
function update_designer_dash(game_id) {
  const features = ["BeginCount", "CompleteCount", "TotalLevelTime", "TotalResets", "TotalSkips", "SessionCount"];

  let ipt_starttime = document.getElementById('ipt_starttime');
  let ipt_endtime = document.getElementById('ipt_endtime');

  let table = document.getElementById("data_table");
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

function UpdateTable(population_data) {
  const per_level_features = ["BeginCount", "CompleteCount", "TotalLevelTime", "TotalResets", "TotalSkips"]
  const session_features = ["SessionCount"]
  const NUM_LEVELS = 34;
  // set the session count
  let sess_ct = document.getElementById("sess_ct");
  let table = document.getElementById("data_table");
  if (population_data != null) {
    sess_ct.innerText = `Session Count: ${population_data['SessionCount']}`;
    table.innerHTML   = null;
    // set up table header
    let header = table.insertRow(0);
    let col = header.insertCell(0);
    col.innerText = "Level";
    for (let feature of per_level_features) {
        let col = header.insertCell(-1);
        col.innerText = feature;
    }
    // put data into table
    for (let i = 0; i <= NUM_LEVELS; i++) {
      let row = table.insertRow(-1);
      let col = row.insertCell(-1);
      col.innerText = i;
      for (let feature of per_level_features) {
        let col = row.insertCell(-1);
        let index = `lvl${i}_${feature}`;
        if (index in population_data) {
          let datum = population_data[index];
          if (datum.toString().includes('.') && !isNaN(parseFloat(datum))) {
            col.innerText = datum.toFixed(2);
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
