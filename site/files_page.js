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
  let table = document.querySelector("game_files_table");
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
    let table = document.querySelector("game_files_table");
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
  setIDs = Object.keys(data)
  setIDs.sort((x,y) => Date.parse(data[y]["start_date"]) - Date.parse(data[x]["start_date"]))
  for (let setID of setIDs) {
    var set = data[setID]
    let row = table.insertRow();
    for (key in TABLE_HEADERS) {
      let cell = row.insertCell();
      var text = null;
      switch (key) {
        case "dataset_id":
          text = document.createTextNode(setID);
          cell.appendChild(text);
          break;
        case "downloads":
          if (set["raw_f"] != null)
          {
            
            var raw_link = document.createElement('a');
            var linkText = document.createTextNode("Raw");
            raw_link.appendChild(linkText);
            raw_link.title = "Raw";
            if(!(document.getElementById('game_title').innerText.toUpperCase() === 'LAKELAND')){
            raw_link.href = set["raw_f"].replace('./', 'https://opengamedata.fielddaylab.wisc.edu/');
            }
            cell.appendChild(raw_link);
            cell.append(document.createTextNode(' - '))
          }
          if (set["sessions_f"] != null)
          {
            var proc_link = document.createElement('a');
            var linkText = document.createTextNode("Session");
            proc_link.appendChild(linkText);
            proc_link.title = "Session Features";
            proc_link.href = set["sessions_f"].replace('./', 'https://opengamedata.fielddaylab.wisc.edu/');
            cell.appendChild(proc_link);
            cell.append(document.createTextNode(' - '))
          }
          if (set["events_f"] != null)
          {
            var events_link = document.createElement('a');
            var linkText = document.createTextNode("Events");
            events_link.appendChild(linkText);
            events_link.title = "Database Events";
            if(!(document.getElementById('game_title').innerText.toUpperCase() === 'LAKELAND')){
              events_link.href = set["events_f"].replace('./', 'https://opengamedata.fielddaylab.wisc.edu/');
            }
            cell.appendChild(events_link);
          }
          break;
        default:
          let text_val;
          if (set[key] != null)
          {
            text_val = set[key].toString();
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

function generate_gamelist(){
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

change_games("CRYSTAL",true); // Note that the table name is irrelevant if start is marked "true"
