<section id="session_picker_section" class="col-xl-2 col-md-3 col-sm-4 col-xs-12 style="height: 100%; overflow-y:scroll">
	<p>Only sessions with Player ID: <input type="checkbox" id="require_pid" value="View only sessions with Player IDs"></p>
	<span>
		<p>SIMULATION MODE: <input type="checkbox" id="sim_mode" value="SIMULATION MODE" checked></p>
		<button type="button" id="btn_play">Run</button>
		<button type="button" id="btn_pause">Pause</button>
	</span>
	<h2 id="whatis">Choose a session:</h2>
	<ul class="session_list" id="session_list"></ul>
</section>
<div class="col-xl-10 col-md-9 col-sm-8 col-xs-10 ui_column">
	<div class="game_info">
		<div class="row">
			<div class="col-md-4">
				<img id="rt_game_img" src="" alt="">
			</div>
			<div class="col-md-8">
				<h2 id="rt_game_title">Game Title</h2>
				<a id="rt_game_events_readme" href="" target="_blank">View README for the game events</a><br>
				<a id="rt_game_features_readme" href="" target="_blank">View README for the processed features</a><br>
				<a id="rt_game_link" href="" target="_blank">Play the game</a>
			</div>
		</div>
		<div class="row" id="playstats_row">
			<h4 id="lbl_playstat_selection"></h4>
			<div class="playstats" id="playstats" style="height: 100%; overflow-y:scroll"></div>
		</div>
	</div>
	<section id="dashboard_info_section" class="pub-wrap">
		<h3>About Realtime Player Data</h3>
		<p class="small">Field Day Lab develops games and uses them as instruments to understand learning. We use game analytics, including machine learning, to understand how players interact with our games. Our research includes desktop, mobile, virtual reality, and augmented reality games. </p>
		<p class="small">This page uses fontawesome.</p>
	</section>
</div>