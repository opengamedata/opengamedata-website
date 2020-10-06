/**
 * Function to initialize data and refresh loop when the page loads.
 */
var SIMULATION_MODE = true;
var NEW_FEATURE_SET = true;
var SIM_TIME = 0;
var PRINT_TRACE = true;

function onload()
{
  // Create a SessionList instance for tracking state, and start the refresh loop.
  sess_list = new SessionList();
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
    sess_list.refreshActiveSessionList();
    if (sess_list.selected_session_id != -1)
    {
      sess_list.refreshSelectedSession();
    }
  };
  document.getElementById("sim_mode").onclick = function() {
    SIMULATION_MODE = this.checked;
    SIM_TIME = 0; // anytime we click, reset sim time.
    document.getElementById("require_pid").disabled = this.checked;
    sess_list.refreshActiveSessionList();
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
    sess_list.refreshActiveSessionList();
    if (sess_list.selected_session_id != -1)
    {
      sess_list.refreshSelectedSession();
    }
  };
  window.setInterval(() => {
    try {
      sess_list.refreshActiveSessionList();
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
 * @param {} list The SessionList instance for tracking the game and its sessions.
 * @param {*} game_name The name of the game to switch to.
 */
function rt_change_games(list, game_name){
  list.active_game = game_name;
  list.refreshActiveSessionList();
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

/**
 * Class to manage data related to sessions for each game.
 * This is responsible for maintaining a list of sessions,
 * as well as displaying the data in the view.
 * Technically, if this were a more complicated page,
 * we might want to split out the data from the display,
 * but this works well for what it is.
 */
class SessionList
{
  /**
   * Constructor for the SessionList class
   * Sets up variables to track the active game, lists of sessions ids
   * (one list is what's active, the other is what's actively displayed),
   * and a selected ID (for detailed display).
   */
  constructor() {
    this.active_game = "LAKELAND";
    this.active_sessions = [];
    this.active_session_ids = [];
    this.displayed_session_ids = [];
    this.selected_session_id = -1;
    this.require_player_id = document.getElementById("require_pid").checked;
    this.statistics_NA_msg = false;
    this.request_count = 0;
    this.selected_session_dash = new SessionDashboard()
    this.refreshActiveSessionList();
  }

  /**
   * Function to retrieve a list of currently active sessions.
   * First, we call the CGI backend to get the list.
   * In the handler, the returned list updates the SessionList data,
   * and then makes a further call to refresh the display list.
   */
  refreshActiveSessionList() {
    let that = this;
    function active_sessions_handler(result) {
      let parsed_sessions = 'null';
      try
      {
        parsed_sessions = JSON.parse(result);
      }
      catch (err)
      {
        console.log(`Could not parse result as JSON:\n ${result}`);
        if (PRINT_TRACE)
        {
          console.trace();
        }
        that.request_count--;
        return;
      }
      that.active_sessions = parsed_sessions;
      console.log('Refreshed session IDs:');
      console.log(that.active_sessions);
      that.active_session_ids = Array.from(Object.keys(that.active_sessions));
      that.refreshDisplayedSessionList();
      that.request_count--;
    };
    if (this.request_count < rt_config.max_outstanding_requests)
    {
      this.request_count++;
      Server.get_all_active_sessions(active_sessions_handler, this.active_game, this.require_player_id, SIM_TIME);
    }
    else
    {
      console.log(`Request count is ${this.request_count}, not making another.`);
    }
  }

  /**
   * Function to update the list of displayed session IDs.
   * This is done in a way that preserves the order of session IDs
   * as much as possible.
   */
  refreshDisplayedSessionList() {
    let display_set = new Set(this.displayed_session_ids);
    let active_set = new Set(this.active_session_ids);
    let remove_set = setMinus(display_set, active_set); // subtract active from display to get inactives, which are currently displayed.
    let add_set    = setMinus(active_set, display_set); // subtract display from active to get new sessions, which were not displayed yet.
    let session_list_area = document.getElementById("session_list");
    if(this.displayed_session_ids.length == 0){
      session_list_area.innerHTML = '';
    }

    // First, refresh what's in the list.
    let child_nodes = Array.from(session_list_area.children);
    for (let session_link_num in child_nodes) {
      let session_link = child_nodes[session_link_num];
      let session_id = session_link.id;
      // let session_link = child_nodes[`div_${session_id}`];
      // A) If object is in remove set, remove it.
      if (remove_set.has(session_id)) {
        session_link.remove();
        if (this.selected_session_id == session_link.id) { this.clearSelected(); }
      }
      // B) Else, update the max and current levels.
      else {
        this.populateDisplayedSession(session_id);
      }
    }
    // loop over all newly active sessions, adding them to the list.
    for (let id of add_set) {
      let session_id = id;
      let player_id = this.active_sessions[session_id]["player_id"];
      // start constructing the element
      let session_div = this.constructDisplayedSession(session_id, player_id);
      session_list_area.appendChild(session_div);
      this.populateDisplayedSession(session_id);
    }
    this.displayed_session_ids = [...this.active_session_ids]; // at this point, these should theoretically be the same.
    if(this.displayed_session_ids.length == 0){
      let message = document.createElement("p")
      let player_id_msg = this.require_player_id ? " Try viewing sessions without player IDs." : "";
      message.appendChild(document.createTextNode("No sessions currently available."+player_id_msg))
      session_list_area.appendChild(message);
    }
  }

  constructDisplayedSession(session_id, player_id)
  {
    let game_themes = {"CRYSTAL": "seascape", "WAVES":"daisygarden", "JOWILDER": "heatwave", "LAKELAND": "summerwarmth"}
    let that = this; // needed for onclick handler.

    let session_div = document.createElement("div");
    session_div.id = session_id;
    let avatar_img = document.createElement('img');
    avatar_img.src = 'http://tinygraphs.com/spaceinvaders/' + session_id + `?theme=${game_themes[this.active_game]}&numcolors=4`;
    session_div.appendChild(avatar_img);
    let session_link = document.createElement("a");
    session_link.onclick = function() { that.displaySelectedSession(session_id); return false;}
    session_link.innerText = !["", "null"].includes(player_id) ? player_id : session_id;
    session_link.href = `#${session_id}`;
    session_div.appendChild(session_link);
    let cur_level_div = document.createElement("div");
    cur_level_div.id = `cur_level_${session_id}`;
    session_div.appendChild(cur_level_div);
    let max_level_div = document.createElement("div");
    max_level_div.id = `max_level_${session_id}`;
    session_div.appendChild(max_level_div);
    session_div.appendChild(document.createElement("br"));

    let alert_msg = document.createElement("span");
    alert_msg.id = `idle_${session_id}`;
    alert_msg.innerText = "Inactive";
    alert_msg.classList.add("player_inactive");
    session_div.appendChild(alert_msg);

    return session_div
  }

  populateDisplayedSession(session_id) {
    let cur_level_div = document.getElementById(`cur_level_${session_id}`);
    cur_level_div.innerText = `current: ${this.active_sessions[session_id]["cur_level"].toString()}`;
    let max_level_div = document.getElementById(`max_level_${session_id}`);
    max_level_div.innerText = `max: ${this.active_sessions[session_id]["max_level"].toString()}`;
    let inactive_span = document.getElementById(`idle_${session_id}`);
    if (this.active_sessions[session_id]["idle_time"] > 60)
    {
      inactive_span.style.display = "inline";
    }
    else
    {
      inactive_span.style.display = "none";
    }
  }

  displaySelectedSession(session_id) {
    this.clearSelected();
    let player_id = this.active_sessions[session_id]['player_id']
    this.selected_session_dash.DisplaySession(session_id, player_id, this.active_game);
    this.selected_session_id = session_id;
  }

  refreshSelectedSession() {
    this.selected_session_dash.Refresh();
  }

  /**
   * Simple function to clear out data display for a selected session.
   * This is mostly intended for when switching to a new session or switching
   * to another game entirely.
   */
  clearSelected() {
    this.selected_session_dash.clear()
  }
}

class SessionDashboard {
  constructor() {
    this.active_game = "None";
    this.selected_session_id = -1;
    this.require_player_id = document.getElementById("require_pid").checked;
    this.statistics_NA_msg = false;
    this.request_count = 0;
  }

  clear() {
    // here we'll just clear the stuff displayed in the prediction area.
    let playstats = document.getElementById("playstats");
    while (playstats.firstChild) {
      playstats.removeChild(playstats.firstChild);
    }
    this.selected_session_id = -1;
    this.statistics_NA_msg = false;
  }

  /**
   * Function to set up display of predictions for a given session.
   * Once this has been run, another function can be used to update
   * the prediction values in place (without removing and replacing elements).
   * @param {*} session_id The id of the session to display.
   */
  DisplaySession(session_id, player_id, game_id) {
    let that = this;
    this.selected_session_id = session_id;
    this.active_game = game_id;
    let playstats = document.getElementById("playstats");
    let message = document.createElement("h4")
    let player_msg = !["", "null"].includes(player_id) ? " (Player "+player_id+")" : '';
    message.appendChild(document.createTextNode("Session "+session_id+player_msg));
    message.style.width = "-webkit-fill-available";
    playstats.appendChild(message);
    let feature_request_list = this.create_feature_request_list();
    let features_handler = function(result) {
      let features_raw = that.parseJSONResult(result);
      let features_parsed = features_raw[that.selected_session_id];
      // loop over all predictions, adding to the UI.
      for (let feature_name in features_parsed) {
        that.createFeatureBox(feature_name, feature_request_list[feature_name]["name"], playstats);
        that.populateFeatureBox(feature_name, features_parsed, feature_request_list);
      }

      if(features_raw === 'null'){
        playstats_message('No features available.')
      } 
    };
    let prediction_request_list = this.create_prediction_request_list();
    let predictions_handler = function(result) {
      let predictions_raw = that.parseJSONResult(result);
      let prediction_list = predictions_raw[that.selected_session_id]
      // loop over all predictions, adding to the UI.
      for (let prediction_name in prediction_list) {
        that.createPredictionBox(prediction_name, prediction_list[prediction_name]["name"], playstats);
        that.populatePredictionBox(prediction_name, prediction_list);
      }
      if(predictions_raw === 'null'){
        playstats_message('No predictions available.')
      }
    };
    try {
      Server.get_predictions_by_sessID(predictions_handler, this.selected_session_id, this.active_game, SIM_TIME, Object.keys(prediction_request_list));
      Server.get_features_by_sessID(features_handler, this.selected_session_id, this.active_game, SIM_TIME, Object.keys(feature_request_list));
    }
    catch(err) {
      console.log(err.message);
      if (PRINT_TRACE)
      {
        console.trace();
      }
    }
  }

  /**
   * Function to update the prediction values for a displayed session.
   * This assumes a session has been selected, and its id stored in
   * the SessionList selected_session_id variable.
   */
  Refresh()
  {
    let that = this;
    let feature_request_list = this.create_feature_request_list();
    let features_handler = function(result) {
      // console.log(`Got back predictions: ${result}`);
      let features_raw = that.parseJSONResult(result);
      let features_parsed = features_raw[that.selected_session_id]
      // After getting the feature values, loop over whole list,
      // updating values.
      for (let feature_name in features_parsed) {
        let feat_span = document.getElementById(feature_name);
        if (feat_span == null) {
          that.createFeatureBox(feature_name, feature_request_list[feature_name]["name"], playstats);
        }
        that.populateFeatureBox(feature_name, features_parsed, feature_request_list);
      }
      that.request_count--;
    };
    let predictions_handler = function(result) {
      // console.log(`Got back predictions: ${result}`);
      let predictions_raw = that.parseJSONResult(result);
      let prediction_list = predictions_raw[that.selected_session_id]
      // After getting the prediction values, loop over whole list,
      // updating values.
      for (let prediction_name in prediction_list) {
        let pred_span = document.getElementById(prediction_name);
        if (pred_span == null) {
          that.createPredictionBox(prediction_name, prediction_list[prediction_name]["name"], playstats);
        }
        that.populatePredictionBox(prediction_name, prediction_list);
      }
      that.request_count--;
    };
    try {
      if (this.request_count < rt_config.max_outstanding_requests)
      {
        this.request_count++;
        Server.get_predictions_by_sessID(predictions_handler, this.selected_session_id, this.active_game, SIM_TIME);
        this.request_count++;
        Server.get_features_by_sessID(features_handler, this.selected_session_id, this.active_game, SIM_TIME, Object.keys(feature_request_list));
      }
      else
      {
        console.log(`Request count is ${this.request_count}, not making another.`);
      }
    }
    catch(err) {
      console.log(err.message);
      if (PRINT_TRACE)
      {
        console.trace();
      }
    }
  }

  createFeatureBox(feature_name, title_str, playstats_list)
  {
    // first, make a div for everything to sit in.
    let next_feature_span = document.createElement("span");
    next_feature_span.id=feature_name;
    next_feature_span.className="playstat";
    // then, add an element with prediction title to the div
    let title = document.createElement("p");
    title.innerText = title_str;
    next_feature_span.appendChild(title);
    // finally, add an element for the prediction value to the div.
    let value_elem = document.createElement("h3");
    value_elem.id = `${feature_name}_val`;
    next_feature_span.appendChild(value_elem);
    playstats_list.appendChild(next_feature_span);
  }

  populateFeatureBox(feature_name, features_parsed, feature_request_list) {
    let value_elem = document.getElementById(`${feature_name}_val`);
    let raw_value = features_parsed[feature_name]["value"];
    let val_type = feature_request_list[feature_name]["type"];
    let vis_type = feature_request_list[feature_name]["vis"];
    let icon = feature_request_list[feature_name]["icon"];
    let reverse_color = feature_request_list[feature_name]["reverse_color"];
    let vis = SessionDashboard.Visualize(raw_value, val_type, vis_type, feature_name, value_elem, icon, reverse_color);
    // value_elem.appendChild(feature_value);
  }

  createPredictionBox(prediction_name, title_str, playstats_list)
  {
    // first, make a div for everything to sit in.
    let next_prediction = document.createElement("span");
    next_prediction.id=prediction_name;
    next_prediction.className="playstat";
    // then, add an element with prediction title to the div
    let title = document.createElement("p");
    title.innerText = title_str;
    next_prediction.appendChild(title);
    // finally, add an element for the prediction value to the div.
    let value_elem = document.createElement("h3");
    value_elem.id = `${prediction_name}_val`;
    next_prediction.appendChild(value_elem);
    playstats_list.appendChild(next_prediction);
  }

  populatePredictionBox(prediction_name, prediction_list) {
    let prediction_value = prediction_list[prediction_name]["value"];
    let value_elem = document.getElementById(`${prediction_name}_val`);
    value_elem.innerText = prediction_value;
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

  static Visualize(val, val_type, vis, feature_name, html_elem, icon=null, reverse_color=false)
  {
      let ret_val;
      if (vis == "raw")
      {
        ret_val = SessionDashboard.formatValue(val, val_type);
        html_elem.innerText = ret_val;
      }
      else if (vis == "pct")
      {
        ret_val = SessionDashboard.formatValue(val, val_type);
        html_elem.innerText = `${ret_val} %`;
      }
      else if (vis == "bar")
      {
        // html_elem.innerHTML = '';
        let chart_id = `bar_chart_${feature_name}`;
        // let chart_div = document.getElementById(chart_id);
        // if (!chart_div) {
        let chart_div = document.createElement('div');
        chart_div.id = chart_id;
        let chart = SessionDashboard.createBarChart(SessionDashboard.formatValue(val, val_type), chart_div.id);
        html_elem.appendChild(chart_div);
        // }
        // else { chart_div.innerHTML = ''; }
        ret_val = chart_div.innerHTML
      }
      else if (vis == "gauge")
      {
        let chart_id = `gauge_chart_${feature_name}`;
        let chart_div = document.getElementById(chart_id);
        if (!chart_div) {
          chart_div = document.createElement('div');
          chart_div.id = chart_id;
          html_elem.appendChild(chart_div);
        }
        else { chart_div.innerHTML = ''; }
        let chart = SessionDashboard.createGaugeChart(SessionDashboard.formatValue(val, val_type), chart_div.id, reverse_color);
        ret_val = chart_div.innerHTML
      }
      else if (vis == "count")
      {
        // first, clear old children
        while (html_elem.firstChild)
        { html_elem.removeChild(html_elem.lastChild); }
        // then, add instances of the icon to match the count.
        ret_val = SessionDashboard.formatValue(val, val_type);
        if (ret_val == 0) {
          html_elem.innerText = ret_val;
        }
        else {
          for (let i = 0; i < ret_val; i++) {
            let next_icon = document.createElement('i');
            next_icon.className = icon;
            html_elem.appendChild(next_icon);
          }
        }
      }
      else
      {
        console.log(`Display value had unrecognized format ${format}. Using raw value ${val}`);
        ret_val = val;
      }
      return ret_val;
  }

  static formatValue(val, format)
  {
      let ret_val;
      if (format == "int")
      {
        ret_val = parseFloat(val).toFixed(0);
      }
      else if (format == "float")
      {
        ret_val = parseFloat(val).toFixed(2);
      }
      else if (format == "pct")
      {
        ret_val = (parseFloat(val)*100).toFixed(0);
      }
      else
      {
        console.log(`Display value had unrecognized format ${format}. Using raw value ${val}`);
        ret_val = val;
      }
      return ret_val;
  }

  create_feature_request_list()
  {
    let feature_request_list = {};
    // Special case for Lakeland, as at the moment I've got two sets of features set up.
    // Eventually, there should just be the one.
    if(this.active_game === 'LAKELAND'){
      if (NEW_FEATURE_SET) {
        feature_request_list = active_features["LAKELAND"]["new_set"]
      }
      else {
        feature_request_list = active_features["LAKELAND"]["old_set"]
      }
    }
    else {
      feature_request_list = active_features[this.active_game]
    }
    return feature_request_list;
  }

  create_prediction_request_list()
  {
    return active_models[this.active_game];
  }

  parseJSONResult(json_result)
  {
    let ret_val = 'null';
    try
    {
      let models_raw = JSON.parse(json_result);
      ret_val = models_raw;
    }
    catch (err)
    {
      console.log(`Could not parse result as JSON:\n ${json_result}`);
      console.log(`Full error: ${err.toString()}`);
      if (PRINT_TRACE)
      {
        console.trace();
      }
      ret_val = {"message": json_result.toString()};
    }
    finally
    {
      return ret_val;
    }
  }

}

function playstats_message(msg){
  let message = document.createElement("p")
  message.appendChild(document.createTextNode(msg))
  message.style.width = "-webkit-fill-available";
  let playstats = document.getElementById("playstats");
  playstats.appendChild(message);
}
