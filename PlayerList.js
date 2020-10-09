
/**
 * Class to manage data related to sessions for each game.
 * This is responsible for maintaining a list of sessions,
 * as well as displaying the data in the view.
 * Technically, if this were a more complicated page,
 * we might want to split out the data from the display,
 * but this works well for what it is.
 */
class PlayerList
{
  /**
   * Constructor for the PlayerList class
   * Sets up variables to track the active game, lists of sessions ids
   * (one list is what's active, the other is what's actively displayed),
   * and a selected ID (for detailed display).
   */
  constructor(selectionHandler) {
    this.active_game = "LAKELAND";
    this.active_sessions = [];
    this.active_session_ids = [];
    this.displayed_session_ids = [];
    this.selected_session_id = -1;
    this.require_player_id = document.getElementById("require_pid").checked;
    this.statistics_NA_msg = false;
    this.request_count = 0;
    // Call this when selection changes.
    this.selectionHandler = selectionHandler;
    // this.selected_session_dash = new PlayerDashboard()
    this.refreshActivePlayerList();
  }

  /**
   * Function to retrieve a list of currently active sessions.
   * First, we call the CGI backend to get the list.
   * In the handler, the returned list updates the PlayerList data,
   * and then makes a further call to refresh the display list.
   */
  refreshActivePlayerList() {
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
      that.refreshDisplayedPlayerList();
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
  refreshDisplayedPlayerList() {
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

//   displaySelectedSession(session_id) {
//     this.clearSelected();
//     let player_id = this.active_sessions[session_id]['player_id']
//     this.selected_session_dash.DisplaySession(session_id, player_id, this.active_game);
//     this.selected_session_id = session_id;
//   }

//   refreshSelectedSession() {
//     this.selected_session_dash.Refresh();
//   }

  /**
   * Simple function to clear out data display for a selected session.
   * This is mostly intended for when switching to a new session or switching
   * to another game entirely.
   */
//   clearSelected() {
//     this.selected_session_dash.clear()
//   }
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

class PlayerCard
{
  constructor(session_id, player_id, session_list_area, game_theme, clickHandler)
  {
    let game_themes = {"CRYSTAL": "seascape", "WAVES":"daisygarden", "JOWILDER": "heatwave", "LAKELAND": "summerwarmth"}

    let session_div = document.createElement("div");
    session_div.id = session_id;
    let avatar_img = document.createElement('img');
    avatar_img.src = 'http://tinygraphs.com/spaceinvaders/' + session_id + `?theme=${game_themes[this.active_game]}&numcolors=4`;
    session_div.appendChild(avatar_img);
    let session_link = document.createElement("a");
    let that = this; // needed for onclick handler.
    session_link.onclick = function() { that.selectionHandler(session_id, player_id, that.active_game); return false;}
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

//   displaySelectedSession(session_id) {
//     this.clearSelected();
//     let player_id = this.active_sessions[session_id]['player_id']
//     this.selected_session_dash.DisplaySession(session_id, player_id, this.active_game);
//     this.selected_session_id = session_id;
//   }

//   refreshSelectedSession() {
//     this.selected_session_dash.Refresh();
//   }

  /**
   * Simple function to clear out data display for a selected session.
   * This is mostly intended for when switching to a new session or switching
   * to another game entirely.
   */
//   clearSelected() {
//     this.selected_session_dash.clear()
//   }
}

class PlayerCard
{

}