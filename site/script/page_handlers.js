/**
 * Function to initialize data and refresh loop when the page loads.
 */
const TABLE_HEADERS = {
  "start_date": "Start Date",
  "end_date": "End Date",
  "date_modified": "Date Uploaded",
  "dataset_id": "Dataset ID",
  "sessions": "Sessions",
  "downloads": "Downloads",
}
var SIMULATION_MODE = false;
var SIM_TIME = 0;
var PRINT_TRACE = true;
var dashboard = null;
var sess_list = null;

var game_files;
var table;

function onload()
{
  let loadIndexCallback = function(result){
    game_files = result;
    // Set up the game data table.
    generate_gamelist();
    console.debug(game_files, )
    // document.getElementById("readme_fname").href = `data/${Object.keys(game_files)[0]}/readme.md`;
  };
  jQuery.getJSON(`https://opengamedata.fielddaylab.wisc.edu/data/file_list.json`, loadIndexCallback);
  // Create a Dashboard and PlayerList instance for tracking state.
  dashboard = new PlayerDashboard();
  var NewSelectionHandler = function(session_id, player_id, game_id) {
    return
    // dashboard.DisplaySession(session_id, player_id, game_id);
  }
  sess_list = new PlayerList(selectionHandler=NewSelectionHandler);
  if (rt_config.custom_title !== null)
  {
    document.title = rt_config.custom_title;
  }
  SIMULATION_MODE = document.getElementById("sim_mode").checked;
  if (SIMULATION_MODE) {
    document.getElementById("require_pid").disabled = true;
    document.title = document.title.concat(" - SIMULATED");
  }
  change_games("CRYSTAL",is_onload=true);

  // Set up onclick and onupdate events.
  document.getElementById("require_pid").onclick = function() {
    sess_list.require_player_id = this.checked;
    // sess_list.refreshActivePlayerList();
    // if (sess_list.selected_session_id != -1)
    // {
    //   sess_list.refreshSelectedSession();
    // }
  };
  document.getElementById("sim_mode").onclick = function() {
    SIMULATION_MODE = this.checked;
    SIM_TIME = 0; // anytime we click, reset sim time.
    document.getElementById("require_pid").disabled = this.checked;
    // sess_list.refreshActivePlayerList();
    // if (sess_list.selected_session_id != -1)
    // {
    //   sess_list.refreshSelectedSession();
    // }
    // update the title bar.
    if (rt_config.custom_title !== null)
    {
      document.title = rt_config.custom_title;
    }
    if (this.checked) {
      document.title = document.title.concat(" - SIMULATED");
    }
  };
  // document.getElementById("btn_id_gen").onclick = function() {
  //   try {
  //     let classroom_id_box = document.getElementById("classroom_id");
  //     let portal_link_box = document.getElementById("portal_link")
  //     if (classroom_id_box.value === "") {
  //       // generate an id

  //       // store in cookie.
  //     }
  //     // else {
  //     //   portal_link_box.value = `https://fielddaylab.wisc.edu/studies/lakeland/?class_id=${classroom_id_box.value}`;
  //     // }
  //   }
  //   catch (error) {
  //     console.warn("Didn't find box for classroom ID in realtime dashboard");
  //   }
  // }
  // Finally, set up the page refresh timer.
  var ticks = 0;
  window.setInterval(() => {
    try {
      ticks++;
//       sess_list.refreshActivePlayerList();
//       if (dashboard.selected_session_id != -1)
//       {
//         dashboard.Update();
//       }
    }
    catch(err) {
      throw err;
    }
    finally {
      if (SIMULATION_MODE)
      {SIM_TIME += 5; console.log(`sim time: ${SIM_TIME}`);}
    }
  }, 5000);
}

function change_games(game_name, is_onload=false) {
  let table = document.getElementById("game_files_table");
  table.innerHTML = '';
  generateTableHead(table);
  generateTableBody(table, game_files[game_name]);
  document.getElementById('game_title').innerHTML = game_name;
  document.getElementById('game_title_2').innerHTML = game_name;
  document.getElementById('game_title_3').innerHTML = game_name;
  document.getElementById('game_events_readme').href = data_readmes[game_name];
  document.getElementById('game_events_readme_2').href = data_readmes[game_name];
  document.getElementById('game_features_readme').href = feature_readmes[game_name];
  document.getElementById('game_features_readme_2').href = feature_readmes[game_name];
  document.getElementById('game_link').href = game_links[game_name];
  document.getElementById('game_img').src = thumbs[game_name];
  document.getElementById('game_img').alt = "Example image of "+ game_name;
  if (dashboard != null && sess_list != null)
  {
    rt_change_games(game_name, sess_list, dashboard);
  }
  update_designer_dash(game_name);
}

function generateTableHead(table) {
  table.createTHead();
  let row = table.insertRow();
  for (let key in TABLE_HEADERS) {
    let th = document.createElement("th");
    let text = document.createTextNode(TABLE_HEADERS[key]);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTableBody(table, data) {
  let datasetIDs = Object.keys(data)
  datasetIDs.sort((x,y) => Date.parse(data[y]["start_date"]) - Date.parse(data[x]["start_date"]))
  for (let datasetID of datasetIDs) {
    var dataset = data[datasetID]
    let row = table.insertRow();
    for (key in TABLE_HEADERS) {
      let cell = row.insertCell();
      var text = null;
      switch (key) {
        case "dataset_id":
          text = document.createTextNode(datasetID);
          cell.appendChild(text);
          break;
        case "downloads":
          if (dataset['raw_file'] != null)
          {
            add_raw_file(dataset['raw_file'], cell)
          }
          if (dataset['events_file'] != null)
          {
            add_event_file(dataset['events_file'], cell);
          }
          if (dataset['sessions_file'] != null)
          {
            add_sessions_file(dataset['sessions_file'], cell)
          }
          if (dataset['population_file'] != null)
          {
            add_population_file(dataset['population_file'], cell)
          }
          break;
        default:
          let text_val;
          if (dataset[key] != null)
          {
            text_val = dataset[key].toString();
          }
          else
          {
            text_val = "null";
          }
          text = document.createTextNode(text_val);
          cell.appendChild(text);
      }
    }
  }
}

function generate_gamelist() {
  for(let game_name in game_files){
    let li = document.createElement("li");
    let gamelink = document.createElement("a");
    gamelink.onclick = function(){
      let prev_active = document.getElementById('gameselect').getElementsByClassName('active_game');
      if (prev_active != null && prev_active.length != 0) {
        prev_active.classList.remove('active_game');
      }
      this.parentElement.classList.add('active_game');
      change_games(game_name);
      return false;
    }
    gamelink.href = '';
    gamelink.innerText= game_name;
    li.appendChild(gamelink);
    document.getElementById('gameselect').appendChild(li);
  }
}

function add_raw_file(raw_file, cell) {
  var raw_link = document.createElement('a');
  var linkText = document.createTextNode("Raw");
  raw_link.appendChild(linkText);
  raw_link.title = "Raw";
  if(!(document.getElementById('game_title').innerText.toUpperCase() === 'LAKELAND')){
    raw_link.href = 'https://opengamedata.fielddaylab.wisc.edu/' + raw_file;
  }
  cell.appendChild(raw_link);
  cell.append(document.createTextNode(' - '))
}

function add_event_file(events_file, cell) {
  var events_link = document.createElement('a');
  var linkText = document.createTextNode("Events");
  events_link.appendChild(linkText);
  events_link.title = "Database Events";
  if(!(document.getElementById('game_title').innerText.toUpperCase() === 'LAKELAND')){
    events_link.href = 'https://opengamedata.fielddaylab.wisc.edu/' + events_file;
  }
  cell.appendChild(events_link);
  cell.append(document.createTextNode(' - '))
}

function add_sessions_file(sessions_file, cell) {
  var sess_link = document.createElement('a');
  var linkText = document.createTextNode("Sessions");
  sess_link.appendChild(linkText);
  sess_link.title = "Session Features";
  sess_link.href = 'https://opengamedata.fielddaylab.wisc.edu/' + sessions_file;
  cell.appendChild(sess_link);
  cell.append(document.createTextNode(' - '))
}

function add_population_file(population_file, cell) {
  var pop_link = document.createElement('a');
  var linkText = document.createTextNode("Pop");
  pop_link.appendChild(linkText);
  pop_link.title = "Population Features";
  pop_link.href = 'https://opengamedata.fielddaylab.wisc.edu/' + population_file;
  cell.appendChild(pop_link);
}


/**
 * Handler function to change the game whose sessions are on display.
 * Fairly simple, just set the active game and refresh the displayed
 * data
 * @param {} list The PlayerList instance for tracking the game and its sessions.
 * @param {*} game_name The name of the game to switch to.
 */
function rt_change_games(game_name, list, player_dash){
  list.active_game = game_name;
  // list.refreshActivePlayerList();
  // player_dash.DisplaySession(-1,-1,game_name);

  document.getElementById('rt_game_title').innerHTML = game_name+ " Realtime Player Data";
  document.getElementById('rt_game_events_readme').href = data_readmes[game_name];
  document.getElementById('rt_game_features_readme').href = feature_readmes[game_name];
  document.getElementById('rt_game_link').href = game_links[game_name];  document.getElementById('rt_game_img').src = thumbs[game_name];
  document.getElementById('rt_game_img').alt = "Example image of "+game_name;


  let message = document.createElement("p")
  message.appendChild(document.createTextNode("Please choose a "+game_name+" session or another game."))
  let playstats = document.getElementById("playstats");
  playstats.appendChild(message);
}


// *** Ok, stuff for desginer dashboard here, to be refactored later.
function update_designer_dash(game_id) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let response_data = JSON.parse(this.responseText);
        console.log("...got data from server.");
        UpdateTable(response_data['val']);
      }
      else {
        console.log(`Got the following non-200 response from the server: ${this.responseText}`);
      }
    }
  }
  request.open("GET", "https://fieldday-web.wcer.wisc.edu/wsgi-bin/opengamedata.wsgi/game/WAVES/metrics")
  request.send()
  let table = document.getElementById("data_table");
  let row = table.insertRow(0);
  row.innerHTML = "Waiting for data from server...";
  console.log("Waiting for data from server...");
}

function UpdateTable(population_data) {
  const per_level_features = ["BeginCount", "CompleteCount", "TotalLevelTime", "TotalResets", "TotalSkips"]
  const session_features = ["SessionCount"]
  const NUM_LEVELS = 34;
  // set the session count
  let sess_ct = document.getElementById("sess_ct");
  sess_ct.innerText = `Session Count: ${population_data['SessionCount']}`;
  // set up the table
  let table = document.getElementById("data_table");
  table.innerHTML = null;
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
      let datum = population_data[index]
      if (datum.toString().includes('.') && !isNaN(parseFloat(datum))) {
        col.innerText = datum.toFixed(2);
      }
      else {
        col.innerText = datum;
      }
    }
  }
}