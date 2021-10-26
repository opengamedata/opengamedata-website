<!-- <!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>OpenGameData Designer Dashboard - <span id="game_id">Aqualab</span> Combinator</title>
	<meta name="author" content="Luke Swanson">
	<meta name="description" content="OpenGameData Designer Dashboard prototype for Wave Combinator">
</head> -->
<!-- <select id="game_selector">
	<option value="AQUALAB">Aqualab</option>
	<option value="WAVES">Waves</option>
</select> -->
<div>
	<span id="game_id">Aqualab</span> Game Data Dashboard<br>
	(Data for past hour)<br>
	<p id="sess_ct"></p>
	<table id="data_table"></table>
	<button type="button" onclick="UpdateData()">Refresh Data</button>
</div>
<!-- <style>
	table {
		border: 1px solid black;
	}
	td {
		text-align: right;
		border: 1px solid black;
	}
</style> -->
</html>