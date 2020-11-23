class ModelConfig
{
    constructor(name, body) {
        this.name = name;
        this.display_name = body["name"];
        this.vis_type = body["vis"];
        this.val_type = body["type"];
        this.params   = body["params"];
        // this.icon = body["icon"];
        // this.reverse_color = body["reverse_color"];
    }
}

class PlayerDashboard
{
  constructor() {
    this.active_game = "None";
    this.selected_session_id = -1;
    // this.require_player_id = document.getElementById("require_pid").checked;
    this.statistics_NA_msg = false;
    this.request_count = 0;
    // this.feature_boxes = [];
    this.model_cards = {};
    this.working = false;
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
  DisplaySession(session_id, username, game_id) {
    this.clear();
    if (session_id != -1) {
      this.selected_session_id = session_id;
      this.active_game = game_id;
      let playstats = document.getElementById("playstats");
      let message = document.getElementById("lbl_playstat_selection");
      let player_msg = !["", "null"].includes(username) ? " (Player "+username+")" : '';
      message.innerHTML = `Session ${session_id} ${player_msg}`;
      message.style.width = "-webkit-fill-available";
      // Now that setup is done, create handler and send off request.
      let model_request_list = active_models[this.active_game];
      for (let model_name in model_request_list) {
          let next_config = new ModelConfig(model_name, model_request_list[model_name])
          this.model_cards[model_name] = new ModelCard(next_config, playstats);
          this.Update(false);
          // that.populateModelCard(model_name, model_list);
      }
    }
    // let that = this;
    // let feature_request_list = active_features[this.active_game]();
    // let features_handler = function(result) {
    //   let features_raw = that.parseJSONResult(result);
    //   let features_parsed = features_raw[that.selected_session_id];
    //   // loop over all models, adding to the UI.
    //   for (let feature_name in features_parsed) {
    //     let next_box = ModelCard(feature_name, feature_request_list[feature_name]["name"], playstats);
    //     next_box.Update(features_parsed, feature_request_list);
    //     that.feature_boxes.push(next_box);
    //   }

    //   if(features_raw === 'null'){
    //     playstats_message('No features available.')
    //   } 
    // };
  }

  async Update(force=false) {
    if (force === true) {
      console.log("Forced player dashboard refresh");
      try {
        this._update();
      }
      catch(err) {
        console.log(err.message);
        if (PRINT_TRACE)
        {
          console.trace();
        }
      }
      finally {
        this.working = false;
      }
    }
    else if (this.working === false) {
      this.working = true;
      try {
        await this._update();
      }
      catch(err) {
        console.log(err.message);
        if (PRINT_TRACE)
        {
          console.trace();
        }
      }
      finally {
        this.working = false;
      }
    }
    else {
      console.log(`Dashboard is already updating, waiting on next timer.`)
    }
  }

  /**
   * Function to update the model values for a displayed session.
   * This assumes a session has been selected, and its id stored in
   * the PlayerList selected_session_id variable.
   */
  _update()
  {
    let that = this;
    let model_request_list = active_models[this.active_game];
    // console.log(`model list: ${JSON.stringify(model_request_list)}`);
    let models_handler = function(result) {
      let models_raw = that.parseJSONResult(result);
      if (rt_config.debug_print["PlayerDashboard"] === true) {
        console.log(`Got back models: ${result}`);
      }
      else {
        console.log(`Timing data for getting models: ${models_raw["message"]}`);
      }
      delete models_raw["message"];

      let model_result_list = models_raw[that.selected_session_id]
      // After getting the model values, loop over whole list,
      // updating values.
      for (let model_name in model_request_list) {
        if (that.model_cards[model_name] === undefined) {
          let next_config = new ModelConfig(model_name, model_request_list[model_name])
          let next_box = new ModelCard(next_config, document.getElementById("playstats"));
          that.model_cards[model_name] = next_box;
        }
        try {
          if (model_result_list[model_name] !== undefined) {
              that.model_cards[model_name].Update(model_result_list[model_name]["success"], model_result_list[model_name]["value"]);
          }
          else {
            that.model_cards[model_name].Update(false, "Not Available");
          }
        }
        catch (err) {
          console.log(`ERROR: ${err}, attempting to process ${model_name}`);
          if (PRINT_TRACE) {
            console.trace();
          }
        }
      }
      if(models_raw === 'null'){
        playstats_message('No models available.')
      }
      that.request_count--;
    };

    try {
      if (this.request_count < rt_config.max_outstanding_requests)
      {
        this.request_count++;
        Server.get_models_by_sessID(models_handler, this.selected_session_id, this.active_game, SIM_TIME, Object.keys(model_request_list));
        // this.request_count++;
        // Server.get_features_by_sessID(features_handler, this.selected_session_id, this.active_game, SIM_TIME, Object.keys(feature_request_list));
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

    /*let feature_request_list = active_features[this.active_game];
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
    };*/
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

class ModelCard
{
  constructor(model_config, modelcard_list, model_type="model")
  {
    this.name = model_config.name;
    this.display_name = model_config.display_name;
    this.vis_type = model_config.vis_type;
    this.val_type = model_config.val_type;
    this.params   = model_config.params;
    // this.icon = model_config.icon;
    // this.reverse_color = model_config.reverse_color;

    // this.playstats_list = modelcard_list;
    // TODO: eventually, just do away with type, and only use models.
    this.model_type = model_type;
    // first, make a div for everything to sit in.
    let span_next_model = document.createElement("span");
    span_next_model.id=this.name;
    span_next_model.className="playstat";
    // then, add an element with model title to the div
    let title = document.createElement("p");
    title.innerText = this.display_name;
    span_next_model.appendChild(title);
    // finally, add an element for the model value to the div.
    let value_elem = document.createElement("h3");
    value_elem.id = `${this.name}_val`;
    span_next_model.appendChild(value_elem);
    modelcard_list.appendChild(span_next_model);
  }

  Update(success_state, raw_val)
  {
    // if (this.model_type === "feature") {
    //   this.populateFeatureBox(this.name, features_parsed, feature_request_list);
    // }
    if (this.model_type === "model") {
      // let model_value = model_list[model_name]["value"];
      let value_elem = document.getElementById(`${this.name}_val`);
      if (success_state === true) {
        let vis = ModelCard.Visualize(raw_val, this.val_type, this.vis_type, this.name, value_elem, this.params);
      }
      else if (success_state === false) {
        console.log(`When updating ${this.name}, success state is false.`);
        let vis = ModelCard.Visualize(raw_val, "raw", "raw", this.name, value_elem, this.params);
      }
      else {
        let vis = ModelCard.Visualize(`Something screwed up, success state is ${success_state}`, "raw", "raw", this.name, value_elem, this.params);
      }
    }
    else if (this.model_type === "feature") {
        throw "Feature data not currently supported.";
    }
    else {
      throw `Invalid ModelCard type ${this.model_type}!`;
    }
  }

//   populateFeatureBox(feature_name, features_parsed, feature_request_list) {
//     let value_elem = document.getElementById(`${feature_name}_val`);
//     let raw_value = features_parsed[feature_name]["value"];
//     let val_type = feature_request_list[feature_name]["type"];
//     let vis_type = feature_request_list[feature_name]["vis"];
//     let icon = feature_request_list[feature_name]["icon"];
//     let reverse_color = feature_request_list[feature_name]["reverse_color"];
//     let vis = ModelCard.Visualize(raw_value, val_type, vis_type, feature_name, value_elem, icon, reverse_color);
//     // value_elem.appendChild(feature_value);
//   }

  static Visualize(val, val_type, vis, feature_name, html_elem, params)
  {
      let color_map = [
        [  0,  0,  0,255], //null
        [148,179, 70,255], //land
        [150,150,150,255], //rock
        [ 50, 50, 50,255], //grave
        [255,220,220,255], //sign
        [102,153,255,255], //lake
        [214,183, 81,255], //shore
        [ 24, 77, 12,255], //forest
        [157,  0,255,255], //home
        [  0,255,  0,255], //farm
        [255,155,  0,255], //livestock
        [100,100,100,255], //road
      ]
      let ret_val;
      // First, check case where we got nothing.
      if (val === null || val === undefined || val === "None")
      {
        vis = "raw";
        val_type = "raw";
        val = "N/A";
      }
      // Then, handle actual data formatting.
      if (vis == "raw")
      {
        ret_val = ViewRenderer.formatValue(val, val_type);
        html_elem.style.fontSize = "8pt";
        html_elem.innerText = ret_val;
      }
      else if (vis == "pct")
      {
        ret_val = ViewRenderer.formatValue(val, val_type);
        html_elem.innerText = `Top ${ret_val.toFixed(0)}%`;
      }
      else if (vis == "bar")
      {
        // html_elem.innerHTML = '';
        let chart_id = `bar_chart_${feature_name}`;
        // let chart_div = document.getElementById(chart_id);
        // if (!chart_div) {
        let chart_div = document.createElement('div');
        chart_div.id = chart_id;
        let chart = ViewRenderer.createBarChart(ViewRenderer.formatValue(val, val_type), chart_div.id);
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
        let chart = ViewRenderer.createGaugeChart(ViewRenderer.formatValue(val, val_type), chart_div.id, params["reverse_color"]);
        ret_val = chart_div.innerHTML
      }
      else if (vis == "count")
      {
        let count_div_id = `count_disp_${feature_name}`;
        let count_div = document.getElementById(count_div_id);
        let count_val;
        let count_val_id = `count_val_${feature_name}`;
        if (!count_div) {
          count_div = document.createElement('div');
          count_div.id = count_div_id;

          let count_icon = document.createElement('i');
          count_icon.className = params["icon"];
          count_icon.style.fontSize = '40pt';

          count_val = document.createElement("span");
          count_val.id = count_val_id;
          count_val.style.fontSize = '36pt';

          count_div.id = count_div_id;
          count_div.appendChild(count_icon);
          count_div.appendChild(count_val);
          html_elem.appendChild(count_div);
        }
        else {
          count_val = document.getElementById(count_val_id);
        }
        ret_val = ViewRenderer.formatValue(val, val_type);
        count_val.innerHTML = ` x ${ret_val}`
      }
      else if (vis == "multicount")
      {
        // first, clear old children
        while (html_elem.firstChild)
        { html_elem.removeChild(html_elem.lastChild); }
        // then, add instances of the icon to match the count.
        ret_val = ViewRenderer.formatValue(val, val_type);
        if (ret_val == 0) {
          html_elem.innerText = ret_val;
        }
        else {
          let count_list = document.createElement("table");
          count_list.style.backgroundColor = 'inherit';
          for (let i = 0; i < params['icon'].length; i++)
          {
            let count_row = document.createElement("tr");
            count_row.style.backgroundColor = 'inherit';
            count_list.appendChild(count_row);
            let next_item = document.createElement("td");
            next_item.style.backgroundColor = 'inherit';
            next_item.style.color = '#000';

            let next_icon = document.createElement('i');
            next_icon.className = params["icon"][i];
            next_icon.style.fontSize = '18pt';
            if (params["col_map"] !== undefined) {
              let col_index = params["col_map"][i];
              let color = color_map[col_index];
              let intHex = function(i) {let h = i.toString(16); return h.length === 1 ? `0${h}` : h};
              
              next_icon.style.color = `#${intHex(color[0])}${intHex(color[1])}${intHex(color[2])}`;
            }

            let count = document.createElement("span");
            count.style.fontSize = '16pt';
            count.innerHTML = `x ${ret_val[i]}`

            next_item.appendChild(next_icon);
            next_item.appendChild(count);
            count_row.appendChild(next_item);
          }
          html_elem.appendChild(count_list);
        }
      }
      else if (vis === "countcomplete") {
        let count_div_id = `count_disp_${feature_name}`;
        let count_div = document.getElementById(count_div_id);
        if (!count_div) {
          count_div = document.createElement('div');
          count_div.id = count_div_id;
          html_elem.appendChild(count_div);
        }
        ret_val = ViewRenderer.formatValue(val, val_type);
        if (val_type === "dict") {
          let vals = Object.values(ret_val);
          // console.log(`For countcomplete, got the following: ${ret_val}, and values are ${vals}`);
          let count = 0;
          for (let val of vals) {
            if (val > 0) {
              count++;
            }
          }
          count_div.innerHTML = `${count}/${vals.length}`;
        }
      }
      else if (vis === "binary")
      {
        let binary_div_id = `binary_disp_${feature_name}`;
        let binary_div = document.getElementById(binary_div_id);

        let binary_icon;
        let binary_icon_id = `binary_icon_${feature_name}`;

        let debug_elem;
        let debug_elem_id = `debug_val_${feature_name}`;
        if (!binary_div) {
          binary_div = document.createElement('div');
          binary_div.id = binary_div_id;

          binary_icon = document.createElement('i');
          binary_icon.id = binary_icon_id;
          binary_icon.className = params["icon"];

          debug_elem = document.createElement('div');
          debug_elem.id = debug_elem_id;
          debug_elem.style.fontSize = '12pt';

          binary_div.appendChild(binary_icon);
          binary_div.appendChild(debug_elem);
          html_elem.appendChild(binary_div);
        }
        else {
          binary_icon = document.getElementById(binary_icon_id);
          debug_elem = document.getElementById(debug_elem_id);
        }
        let threshold_raw = params["threshold"];
        let threshold = ViewRenderer.formatValue(threshold_raw, val_type);
        ret_val = ViewRenderer.formatValue(val, val_type);
        if (params['type'] === 'good')
        {
          binary_icon.style.color = (ret_val > threshold) ? '#00ff00' : '#ff0000';
        }
        else
        {
          binary_icon.style.color = (ret_val > threshold) ? '#ff0000' : '#444444';
        }
        debug_elem.innerHTML = `${ret_val} sec`;
      }
      else if (vis === "trinary")
      {
          let threshold_raw = params["threshold"];
          let threshold = ViewRenderer.formatValue(threshold_raw, `multi${val_type}`);
          ret_val = ViewRenderer.formatValue(val, val_type);

          let trinary_icon = document.createElement('i');
          trinary_icon.className = params["icon"];
          trinary_icon.style.color = (ret_val > threshold[1]) ? '#00ff00' : (ret_val > threshold[0]) ? '#ffff00' : '#ff0000';

          let debug_elem = document.createElement('div');
          debug_elem.innerHTML = `val: ${ret_val}, thres: ${threshold}`;

          let trinary_div = document.createElement('div');
          trinary_div.appendChild(trinary_icon);
          trinary_div.appendChild(debug_elem);
          html_elem.appendChild(trinary_div);
      }
      else if (vis === "time") {
        ret_val = ViewRenderer.formatValue(val, val_type);
        if (params["format"] === "m:s") {
          let minutes = Math.floor(ret_val/60);
          let sec = `0${ret_val - (60*minutes)}`.slice(-2); // use two digits
          ret_val = `${minutes}:${sec}`;
        }
        else if (params["format"] === "s") {
          ret_val = `${ret_val} sec`;
        }
        else {
          console.log(`Invalid time format ${params["format"]}, defaulting to seconds only.`);
          ret_val = `${ret_val} sec`;
        }
        html_elem.innerText = ret_val;
      }
      else if (vis === "map")
      {
        ret_val = ViewRenderer.formatValue(val, val_type);
        let map_canvas_id = `canvas_${feature_name}`;
        let map_canvas = document.getElementById(map_canvas_id);
        if (!map_canvas) {
          map_canvas = document.createElement('canvas');
          map_canvas.id = map_canvas_id;

          html_elem.appendChild(map_canvas);
        }
        let scale = params['scale'];
        map_canvas.width = ret_val[0].length*scale;
        map_canvas.height = ret_val.length*scale;
        let ctx = map_canvas.getContext('2d');
        ctx.clearRect(0,0,map_canvas.width, map_canvas.height);
        let im_data = ViewRenderer.ArrayToImData(ret_val, color_map, scale);
        ctx.putImageData(im_data, 0, 0);
      }
      else if (vis === "diagonaldetector") {
        let binary_div_id = `binary_disp_${feature_name}`;
        let binary_div = document.getElementById(binary_div_id);

        let binary_icon;
        let binary_icon_id = `binary_icon_${feature_name}`;

        // let debug_elem;
        // let debug_elem_id = `debug_val_${feature_name}`;
        if (!binary_div) {
          binary_div = document.createElement('div');
          binary_div.id = binary_div_id;

          binary_icon = document.createElement('i');
          binary_icon.id = binary_icon_id;
          binary_icon.className = params["icon"];

          // debug_elem = document.createElement('div');
          // debug_elem.id = debug_elem_id;
          // debug_elem.style.fontSize = '12pt';

          binary_div.appendChild(binary_icon);
          // binary_div.appendChild(debug_elem);
          html_elem.appendChild(binary_div);
        }
        else {
          binary_icon = document.getElementById(binary_icon_id);
          // debug_elem = document.getElementById(debug_elem_id);
        }
        let list_vals = ViewRenderer.formatValue(val, val_type);
        let ratio = list_vals[1] / list_vals[0];
        ret_val = (list_vals[0] >= 3) && ( (list_vals[2] > 1) || (ratio > 0.8) || (ratio > 0.7 && list_vals[1] >= 3) || (ratio > 0.5 && list_vals[1] >= 4) || (ratio > 0.3 && list_vals[1] >= 5) );
        if (params['type'] === 'good')
        {
          binary_icon.style.color = (ret_val === true) ? '#00ff00' : '#444444';
        }
        else
        {
          binary_icon.style.color = (ret_val === true) ? '#ff0000' : '#444444';
        }
        // debug_elem.innerHTML = `${list_vals}`;
      }
      else
      {
        console.log(`Display value had unrecognized format ${format}. Using raw value ${val}`);
        ret_val = val;
      }
      return ret_val;
  }

}