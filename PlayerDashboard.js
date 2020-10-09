class PlayerDashboard
{
  constructor() {
    this.active_game = "None";
    this.selected_session_id = -1;
    this.require_player_id = document.getElementById("require_pid").checked;
    this.statistics_NA_msg = false;
    this.request_count = 0;
    this.feature_boxes = [];
    this.model_boxes = [];
  }

  clear() {
    // here we'll just clear the stuff displayed in the model area.
    let playstats = document.getElementById("playstats");
    while (playstats.firstChild) {
      playstats.removeChild(playstats.firstChild);
    }
    this.selected_session_id = -1;
    this.statistics_NA_msg = false;
  }

  /**
   * Function to set up display of models for a given session.
   * Once this has been run, another function can be used to update
   * the model values in place (without removing and replacing elements).
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
      // loop over all models, adding to the UI.
      for (let feature_name in features_parsed) {
        let next_box = ModelBox(feature_name, feature_request_list[feature_name]["name"], playstats);
        next_box.update(features_parsed, feature_request_list);
        that.feature_boxes.push(next_box);
      }

      if(features_raw === 'null'){
        playstats_message('No features available.')
      } 
    };
    let model_request_list = this.create_model_request_list();
    let models_handler = function(result) {
      let models_raw = that.parseJSONResult(result);
      let model_list = models_raw[that.selected_session_id]
      // loop over all models, adding to the UI.
      for (let model_name in model_list) {
        let next_box = ModelBox(model_name, model_list[model_name]["name"], playstats);
        next_box.update(models_parsed, model_request_list);
        that.model_boxes.push(next_box);
        that.populateModelBox(model_name, model_list);
      }
      if(models_raw === 'null'){
        playstats_message('No models available.')
      }
    };
    try {
      Server.get_models_by_sessID(models_handler, this.selected_session_id, this.active_game, SIM_TIME, Object.keys(model_request_list));
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
   * Function to update the model values for a displayed session.
   * This assumes a session has been selected, and its id stored in
   * the PlayerList selected_session_id variable.
   */
  Refresh()
  {
    let that = this;
    let feature_request_list = this.create_feature_request_list();
    let features_handler = function(result) {
      // console.log(`Got back models: ${result}`);
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
    let model_request_list = this.create_model_request_list();
    console.log("model list:");
    console.log(model_request_list);
    let models_handler = function(result) {
      // console.log(`Got back models: ${result}`);
      let models_raw = that.parseJSONResult(result);
      let model_list = models_raw[that.selected_session_id]
      // After getting the model values, loop over whole list,
      // updating values.
      for (let model_name in model_list) {
        let pred_span = document.getElementById(model_name);
        if (pred_span == null) {
          that.createModelBox(model_name, model_list[model_name]["name"], playstats);
        }
        that.populateModelBox(model_name, model_list);
      }
      that.request_count--;
    };
    try {
      if (this.request_count < rt_config.max_outstanding_requests)
      {
        this.request_count++;
        Server.get_models_by_sessID(models_handler, this.selected_session_id, this.active_game, SIM_TIME, Object.keys(model_request_list));
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

  create_model_request_list()
  {
    let model_request_list = active_models[this.active_game];
    return model_request_list;
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

class PlayerCard
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
    let vis = ModelBox.Visualize(raw_value, val_type, vis_type, feature_name, value_elem, icon, reverse_color);
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