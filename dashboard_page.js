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

class ModelBox
{
  constructor(model_type, name, title_str, playstats_list)
  {
    this.model_type = model_type;
    this.name = name;
    this.title_str = title_str;
    this.playstats_list = playstats_list;
    // first, make a div for everything to sit in.
    let span_next_model = document.createElement("span");
    span_next_model.id=model_name;
    span_next_model.className="playstat";
    // then, add an element with model title to the div
    let title = document.createElement("p");
    title.innerText = title_str;
    span_next_model.appendChild(title);
    // finally, add an element for the model value to the div.
    let value_elem = document.createElement("h3");
    value_elem.id = `${model_name}_val`;
    span_next_model.appendChild(value_elem);
    playstats_list.appendChild(span_next_model);
  }

  update(features_parsed, feature_request_list)
  {
    if (this.model_type === "feature") {
      this.populateFeatureBox(this.name, features_parsed, feature_request_list);
    }
    else if (this.model_type === "model") {
      this.populateModelBox(this.name, features_parsed, feature_request_list);
    }
    else {
      throw `Invalid ModelBox type ${this.model_type}!`;
    }
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

  populateModelBox(model_name, model_list) {
    let model_value = model_list[model_name]["value"];
    let value_elem = document.getElementById(`${model_name}_val`);
    value_elem.innerText = model_value;
  }

  static Visualize(val, val_type, vis, feature_name, html_elem, icon=null, reverse_color=false)
  {
      let ret_val;
      if (vis == "raw")
      {
        ret_val = ModelBox.formatValue(val, val_type);
        html_elem.innerText = ret_val;
      }
      else if (vis == "pct")
      {
        ret_val = ModelBox.formatValue(val, val_type);
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
        let chart = Visualizer.createBarChart(ModelBox.formatValue(val, val_type), chart_div.id);
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
        let chart = Visualizer.createGaugeChart(ModelBox.formatValue(val, val_type), chart_div.id, reverse_color);
        ret_val = chart_div.innerHTML
      }
      else if (vis == "count")
      {
        // first, clear old children
        while (html_elem.firstChild)
        { html_elem.removeChild(html_elem.lastChild); }
        // then, add instances of the icon to match the count.
        ret_val = ModelBox.formatValue(val, val_type);
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
