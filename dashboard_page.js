/**
 * Function to initialize data and refresh loop when the page loads.
 */
var SIMULATION_MODE = true;
var NEW_FEATURE_SET = true;
var SIM_TIME = 0;
var PRINT_TRACE = true;

function onload()
{
  // Create a PlayerList instance for tracking state, and start the refresh loop.
  sess_list = new PlayerList();
  rt_change_games(sess_list, "LAKELAND");
  if (rt_config.custom_title !== null)
  {
    document.title = rt_config.custom_title;
  }
  SIMULATION_MODE = document.getElementById("sim_mode").checked;
  NEW_FEATURE_SET = document.getElementById("new_feature_set").checked;
  if (SIMULATION_MODE) {
    document.getElementById("require_pid").disabled = true;
    document.title = document.title.concat(" - SIMULATED");
  }
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
  document.getElementById("new_feature_set").onclick = function() {
    NEW_FEATURE_SET = this.checked;
    sess_list.refreshActivePlayerList();
    if (sess_list.selected_session_id != -1)
    {
      sess_list.refreshSelectedSession();
    }
  };
  window.setInterval(() => {
    try {
      sess_list.refreshActivePlayerList();
      if (sess_list.selected_session_id != -1)
      {
        sess_list.refreshSelectedSession();
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
function rt_change_games(list, game_name){
  list.active_game = game_name;
  list.refreshActivePlayerList();
  list.clearSelected();

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

/**
 * Simple set minus operation, based on a suggestion on StackOverflow.
 * just filter A based on B not having the element.
 * @param {*} A Set from which to subtract another set.
 * @param {*} B Set to subtract from A.
 */
function setMinus(A, B) {
  return new Set([...A].filter(x => !B.has(x)));
}

class Visualizer
{
  static createMultiBarChart(vals, bind_to_id) {
    let cols = [];
    for (let i=0; i < vals.length; i++) {
      let val = vals[i];
      cols.push([`data${i}`, val]);
    }
    return c3.generate(
      {
        bindto: "#" + bind_to_id,
        data: {
          columns: cols,
          type: 'bar'
        },
        axis : {
          y : {
              tick: { format: d3.format('d') },
          }
        },
        size: {
          height: 200-70,
          width: .28*200
        },
        legend: { show: false }
      });
  }

  static createBarChart(val, bind_to_id) {
    return c3.generate(
      {
        bindto: "#" + bind_to_id,
        data: {
          columns: [
            ['data1', val]
          ],
          type: 'bar'
        },
        axis : {
          y : {
              tick: { format: d3.format('d') },
          }
        },
        size: {
          height: 200-70,
          width: .28*200
        },
        legend: { show: false }
      });
  }

  static createGaugeChart(val, bind_to_id, reverse_color) {
    return c3.generate(
      {
        bindto: "#" + bind_to_id,
        data: {
          columns: [
            ['data1', val]
          ],
          type: 'gauge'
        },
        color: {
          pattern: reverse_color ? ['green', 'yellow', 'orange', 'red'] : ['red', 'orange', 'yellow', 'green'], // the three color levels for the percentage values.
          threshold: {
              values: reverse_color ? [50, 80, 90, 100] : [10, 20, 50, 100]
          }
        },
        size: {
          height: 200-140,
          width: .28*200
        }
      });
  }
}

function playstats_message(msg){
  let message = document.createElement("p")
  message.appendChild(document.createTextNode(msg))
  message.style.width = "-webkit-fill-available";
  let playstats = document.getElementById("playstats");
  playstats.appendChild(message);
}
