const TABLE_HEADERS = {
  "start_date": "Start Date",
  "end_date": "End Date",
  "date_modified": "Date Uploaded",
  "dataset_id": "Dataset ID",
  "sessions": "Sessions",
  "downloads": "Downloads",
}

class FilesTable {
	constructor(table) {
		this.table = table;
	}

	Update(data) {
		this.table.innerHTML = '';
		this.generateTableHead();

		let datasetIDs = Object.keys(data)
		datasetIDs.sort((x,y) => Date.parse(data[y]["start_date"]) - Date.parse(data[x]["start_date"]))
		for (let datasetID of datasetIDs) {
			var dataset = data[datasetID]
			let row = this.table.insertRow();
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
							this.add_raw_file(dataset['raw_file'], cell)
						}
						if (dataset['events_file'] != null)
						{
							this.add_event_file(dataset['events_file'], cell);
						}
						if (dataset['sessions_file'] != null)
						{
							this.add_sessions_file(dataset['sessions_file'], cell)
						}
						if (dataset['population_file'] != null)
						{
							this.add_population_file(dataset['population_file'], cell)
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

	generateTableHead() {
		this.table.createTHead();
		let row = this.table.insertRow();
		for (let key in TABLE_HEADERS) {
			let th = document.createElement("th");
			let text = document.createTextNode(TABLE_HEADERS[key]);
			th.appendChild(text);
			row.appendChild(th);
		}
	}

	add_raw_file(raw_file, cell) {
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

	add_event_file(events_file, cell) {
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

	add_sessions_file(sessions_file, cell) {
		var sess_link = document.createElement('a');
		var linkText = document.createTextNode("Sessions");
		sess_link.appendChild(linkText);
		sess_link.title = "Session Features";
		sess_link.href = 'https://opengamedata.fielddaylab.wisc.edu/' + sessions_file;
		cell.appendChild(sess_link);
		cell.append(document.createTextNode(' - '))
	}

	add_population_file(population_file, cell) {
		var pop_link = document.createElement('a');
		var linkText = document.createTextNode("Pop");
		pop_link.appendChild(linkText);
		pop_link.title = "Population Features";
		pop_link.href = 'https://opengamedata.fielddaylab.wisc.edu/' + population_file;
		cell.appendChild(pop_link);
	}

}
