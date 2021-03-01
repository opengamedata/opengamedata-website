var tables;
var table;
var headers = {
  "start_date": "Start Date",
  "end_date": "End Date",
  "date_modified": "Date Modified",
  "Dataset ID": "Dataset ID",
  "sessions": "Sessions",
  "raw": "Downloads",
}
var active_game;

function change_tables(value, start=false) {
  let table = document.querySelector("table");
  table.innerHTML = '';
  let loadIndexCallback = function(result){
    tables = result;
    value = start ? Object.keys(tables)[0] : value
    let table = document.querySelector("table");
    let table_name;
    generateTableHead(table, headers);
    if(start)
    {
      generate_options();
      console.log(tables)
      // document.getElementById("readme_fname").href = `data/${Object.keys(tables)[0]}/readme.md`;
    }
    generateTable(table, tables[value], headers);
    document.getElementById('game_title').innerHTML = value;
    document.getElementById('game_title_2').innerHTML = value;
    document.getElementById('game_title_3').innerHTML = value;
    document.getElementById('game_events_readme').href = data_readmes[value];
    document.getElementById('game_events_readme_2').href = data_readmes[value];
    document.getElementById('game_features_readme').href = feature_readmes[value];
    document.getElementById('game_features_readme_2').href = feature_readmes[value];
    document.getElementById('game_link').href = game_links[value];
    document.getElementById('game_img').src = thumbs[value];
    document.getElementById('game_img').alt = "Example image of "+value;

    
  };
  jQuery.getJSON(`https://opengamedata.fielddaylab.wisc.edu/data/file_list.json`, loadIndexCallback);
}

function generateTableHead(table, headers) {
  let thead = table.createTHead();

  let row = table.insertRow();
  for (let key in headers) {
    let th = document.createElement("th");
    let text = document.createTextNode(headers[key]);
    th.appendChild(text);
    row.appendChild(th);
  }
}
function generateTable(table, data, headers) {
  setIDs = Object.keys(data)
  setIDs.sort((x,y) => Date.parse(data[y]["start_date"]) - Date.parse(data[x]["start_date"]))
  for (let setID of setIDs) {
    var set = data[setID]
    let row = table.insertRow();
    for (key in headers) {
      let cell = row.insertCell();
      var text = null;
      switch (key) {
        case "Dataset ID":
          text = document.createTextNode(setID);
          cell.appendChild(text);
          break;
        case "raw":
          if (set["raw"] != null)
          {
            
            var raw_link = document.createElement('a');
            var linkText = document.createTextNode("Raw");
            raw_link.appendChild(linkText);
            raw_link.title = "Raw";
            if(!(document.getElementById('game_title').innerText.toUpperCase() === 'LAKELAND')){
            raw_link.href = set["raw"].replace('./', 'https://opengamedata.fielddaylab.wisc.edu/');
            }
            cell.appendChild(raw_link);
            cell.append(document.createTextNode(' - '))
          }
          if (set["proc"] != null)
          {
            var proc_link = document.createElement('a');
            var linkText = document.createTextNode("Session");
            proc_link.appendChild(linkText);
            proc_link.title = "Session Features";
            proc_link.href = set["proc"].replace('./', 'https://opengamedata.fielddaylab.wisc.edu/');
            cell.appendChild(proc_link);
            cell.append(document.createTextNode(' - '))
          }
          if (set["events"] != null)
          {
            var events_link = document.createElement('a');
            var linkText = document.createTextNode("Events");
            events_link.appendChild(linkText);
            events_link.title = "Database Events";
            if(!(document.getElementById('game_title').innerText.toUpperCase() === 'LAKELAND')){
              events_link.href = set["events"].replace('./', 'https://opengamedata.fielddaylab.wisc.edu/');
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

function generate_options(){
  for(let game_name in tables){
    let li = document.createElement("li");
    let gamelink = document.createElement("a");
    gamelink.onclick = function(){
      change_tables(game_name);
      return false;
    }
    gamelink.href = '';
    gamelink.innerText= game_name;
    li.appendChild(gamelink);
    document.getElementById('gameselect').appendChild(li);
  }
}

change_tables("CRYSTAL",true); // Note that the table name is irrelevant if start is marked "true"
