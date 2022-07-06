/**
 * Function to initialize data and refresh loop when the page loads.
 */
var SIMULATION_MODE = false;
var SIMULATION_RUNNING = false;
var SIM_TIME = 0;
var PRINT_TRACE = true;
var pl_dashboard = null;
// var pop_dashboard = null;
var files_table = null;
var sess_list = null;

var game_files;
var table;

function onload()
{
  // load files for main game files page
  let loadIndexCallback = function(result){
    game_files = result;
    generate_gamelist();
    let table = document.getElementById("game_files_table");
    files_table = new FilesTable(table);
    // Set up the game data table.
    console.debug(game_files, )
    change_games(Object.keys(game_files)[0]);
  };
  jQuery.getJSON(`https://opengamedata.fielddaylab.wisc.edu/data/file_list.json`, loadIndexCallback);
  
  // Setup Teacher Dashboard page, with a Dashboard and PlayerList instance for tracking state.
  pl_dashboard = new PlayerDashboard();
  var NewSelectionHandler = function(session_id, player_id, game_id) {
    return
    // pl_dashboard.DisplaySession(session_id, player_id, game_id);
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

  // Set up the Designer Dashboard page
  let ipt_starttime = document.getElementById('ipt_starttime');
  let ipt_endtime = document.getElementById('ipt_endtime');
  let start_dt = new Date(Date.now() - 1000*60*60); // 1000 ms/start_dt * 60 start_dt/m * 60 m/hr = 1 hour of ms.
  let end_dt = new Date();
  ipt_starttime.value = toLocalISO(start_dt);
  ipt_endtime.value   = toLocalISO(end_dt);
  // below, the simpler way of doing things, if we ever switch to using GMT.
  // ipt_starttime.value = new Date(Date.now() - 1000*60*60).toISOString().slice(0,16); // 1000 ms/start_dt * 60 start_dt/m * 60 m/hr = 1 hour of ms.
  // ipt_endtime.value = new Date().toISOString().slice(0,16);
  // pop_dashboard = new PopulationDashboard();

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
    document.getElementById("btn_play").disabled = !this.checked;
    document.getElementById("btn_pause").disabled = !this.checked;
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
  document.getElementById("btn_play").onclick = function() {
    SIMULATION_RUNNING = true;
    console.log("Running simulation mode.");
  };
  document.getElementById("btn_pause").onclick = function() {
    SIMULATION_RUNNING = false;
    console.log("Simulation mode paused.");
  };
  document.getElementById("refresh_designer").onclick = function() {
    let game_name = document.getElementById("game_title").innerText;
    // pop_dashboard.Update(true);
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
  //     console.warn("Didn't find box for classroom ID in realtime pl_dashboard");
  //   }
  // }
  // Finally, set up the page refresh timer.
  var ticks = 0;
  window.setInterval(() => {
    try {
      ticks++;
//       sess_list.refreshActivePlayerList();
//       if (pl_dashboard.selected_session_id != -1)
//       {
//         pl_dashboard.Update();
//       }
    }
    catch(err) {
      throw err;
    }
    finally {
      if (SIMULATION_MODE && SIMULATION_RUNNING) {
        SIM_TIME += 5; console.info(`sim time: ${SIM_TIME}`);
      }
    }
  }, 5000);
}

function toLocalISO(date) {
  let month_num = date.getMonth()+1;
  let month_str = month_num < 10 ? `0${month_num}` : month_num.toString();
  let day_num = date.getDate();
  let day_str = day_num < 10 ? `0${day_num}` : day_num.toString();
  let hour_num = date.getHours();
  let hour_str = hour_num < 10 ? `0${hour_num}` : hour_num.toString();
  let minute_num = date.getMinutes();
  let minute_str = minute_num < 10 ? `0${minute_num}` : minute_num.toString();
  let second_num = date.getSeconds();
  let second_str = second_num < 10 ? `0${second_num}` : second_num.toString();
  return `${date.getFullYear()}-${month_str}-${day_str}T${hour_str}:${minute_str}:${second_str}`
}

function change_games(game_name) {
  files_table.Update(game_files[game_name]);
  document.getElementById('game_id').innerHTML = game_name;
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

  document.getElementById('rt_game_title').innerHTML = game_name+ " Realtime Player Data";
  document.getElementById('rt_game_events_readme').href = data_readmes[game_name];
  document.getElementById('rt_game_features_readme').href = feature_readmes[game_name];
  document.getElementById('rt_game_link').href = game_links[game_name];  document.getElementById('rt_game_img').src = thumbs[game_name];
  document.getElementById('rt_game_img').alt = "Example image of "+game_name;
  if (pl_dashboard != null && sess_list != null)
  {
    rt_change_games(game_name, sess_list, pl_dashboard);
  }
  // pop_dashboard.ChangeGames(game_name);
}

function generate_gamelist() {
  let first = true;
  for(let game_name in game_files){
    let li = document.createElement("li");
    let gamelink = document.createElement("a");
    gamelink.onclick = function(){
      let prev_active = document.getElementById('gameselect').getElementsByClassName('active_game');
      if (prev_active != null && prev_active.length != 0) {
        prev_active[0].classList.remove('active_game');
      }
      this.parentElement.classList.add('active_game');
      // use the callback to prompt a change of selected game page-wide.
      change_games(game_name);
      return false;
    }
    gamelink.href = '';
    gamelink.innerText= game_name;
    li.appendChild(gamelink);
    if (first) {
      li.classList.add('active_game');
      first = false;
    }
    document.getElementById('gameselect').appendChild(li);
  }
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

  let message = document.createElement("p")
  message.appendChild(document.createTextNode("Please choose a "+game_name+" session or another game."))
  let playstats = document.getElementById("playstats");
  playstats.appendChild(message);
}
