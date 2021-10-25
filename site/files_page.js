var game_files;
var table;
const TABLE_HEADERS = {
  "start_date": "Start Date",
  "end_date": "End Date",
  "date_modified": "Date Uploaded",
  "dataset_id": "Dataset ID",
  "sessions": "Sessions",
  "downloads": "Downloads",
}

function change_games(game_name, start=false) {
  let table = document.getElementById("game_files_table");
  table.innerHTML = '';
  let loadIndexCallback = function(result){
    game_files = result;
    // game_name = start ? Object.keys(game_files)[0] : game_name
    if(start)
    {
      game_name = Object.keys(game_files)[0]
      generate_gamelist();
      console.debug(game_files, )
      // document.getElementById("readme_fname").href = `data/${Object.keys(game_files)[0]}/readme.md`;
    }
    let table = document.getElementById("game_files_table");
    generateTableHead(table);
    generateTable(table, game_files[game_name]);
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
  };
  jQuery.getJSON(`https://opengamedata.fielddaylab.wisc.edu/data/file_list.json`, loadIndexCallback);
  rt_change_games(sess_list, dashboard, game_name);
}

function generateTableHead(table) {
  let thead = table.createTHead();
  let row = table.insertRow();
  for (let key in TABLE_HEADERS) {
    let th = document.createElement("th");
    let text = document.createTextNode(TABLE_HEADERS[key]);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
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

change_games("CRYSTAL",true); // Note that the table name is irrelevant if start is marked "true"
