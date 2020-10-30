/**
 * Function to initialize data and refresh loop when the page loads.
 */
var SIMULATION_MODE = document.getElementById("sim_mode").checked;
// var NEW_FEATURE_SET = true;
var SIM_TIME = 0;
var PRINT_TRACE = true;

function onload()
{
  // Create a PlayerList instance for tracking state, and start the refresh loop.
  var dashboard = new PlayerDashboard();
  var NewSelectionHandler = function(session_id, player_id, game_id) {
    dashboard.DisplaySession(session_id, player_id, game_id);
  }
  sess_list = new PlayerList(selectionHandler=NewSelectionHandler);
  rt_change_games(sess_list, dashboard, "LAKELAND");
  if (rt_config.custom_title !== null)
  {
    document.title = rt_config.custom_title;
  }
  SIMULATION_MODE = document.getElementById("sim_mode").checked;
  // NEW_FEATURE_SET = document.getElementById("new_feature_set").checked;
  if (SIMULATION_MODE) {
    document.getElementById("require_pid").disabled = true;
    document.title = document.title.concat(" - SIMULATED");
  }
  // Set up onclick and onupdate events.
  document.getElementById("require_pid").onclick = function() {
    sess_list.require_player_id = this.checked;
    sess_list.refreshActivePlayerList();
    if (sess_list.selected_session_id != -1)
    {
      sess_list.refreshSelectedSession();
    }
  };
  document.getElementById("sim_mode").onclick = function() {
    SIMULATION_MODE = this.checked;
    SIM_TIME = 0; // anytime we click, reset sim time.
    document.getElementById("require_pid").disabled = this.checked;
    sess_list.refreshActivePlayerList();
    if (sess_list.selected_session_id != -1)
    {
      sess_list.refreshSelectedSession();
    }
    // update the title bar.
    if (rt_config.custom_title !== null)
    {
      document.title = rt_config.custom_title;
    }
    if (this.checked) {
      document.title = document.title.concat(" - SIMULATED");
    }
  };
  document.getElementById("btn_id_gen").onclick = function() {
    let classroom_id_box = document.getElementById("classroom_id");
    let portal_link_box = document.getElementById("portal_link")
    if (classroom_id_box.value === "") {
      // generate an id

      // store in cookie.
    }
    portal_link_box.value = `https://fielddaylab.wisc.edu/studies/lakeland/?classroom_id=${classroom_id_box.value}`;
  }
  window.setInterval(() => {
    try {
      sess_list.refreshActivePlayerList();
      if (dashboard.selected_session_id != -1)
      {
        dashboard.Update();
      }
    }
    catch(err) {
      console.log(err.message);
      if (PRINT_TRACE)
      {
        console.trace();
      }
      throw err;
    }
    finally {
      if (SIMULATION_MODE)
      {SIM_TIME += 5; console.log(`sim time: ${SIM_TIME}`);}
    }
  }, 5000);
}


/**
 * Handler function to change the game whose sessions are on display.
 * Fairly simple, just set the active game and refresh the displayed
 * data
 * @param {} list The PlayerList instance for tracking the game and its sessions.
 * @param {*} game_name The name of the game to switch to.
 */
function rt_change_games(list, player_dash, game_name){
  list.active_game = game_name;
  list.refreshActivePlayerList();
  player_dash.DisplaySession(-1,-1,game_name);

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
