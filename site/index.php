<!--include head
------------------------>
<?php $path = $_SERVER['DOCUMENT_ROOT']; $path .= "/includes/header.php"; include_once($path); ?>
<title>Field Day - Open Game Data</title>
</head>

<body class="singleapp page opengamedata" onload="onload()">
  <!--include Main Navigation
  ------------------------>
  <?php $path = $_SERVER['DOCUMENT_ROOT']; $path .= "/includes/main-nav.php"; include_once($path); ?>

  <!--Start page content
  ------------------------>
  <div id="mainwrapper">
    <section class="singlehero page_hero">
      <div class="info">
        <h1 class="corrected">Open Game Data</h1>
        <p class="">These anonymous data are provided in service of future educational data mining research. They are made available under the <a target="_blank" href="https://creativecommons.org/publicdomain/zero/1.0/">Creative Commons CCO 1.0 Universal license.</a> Source code for this website and related data processing is available on <a target="_blank" href="https://github.com/fielddaylab/opengamedata">github</a></p>
      </div>
      <!-- <div class="info">
        <h1 class="corrected">Lakeland Teacher Dashboard</h1>
        <p class="">This dashboard tool allows you to observe the in-game progress of players in Lakeland. To see only the players who are in your classroom, enter your "classroom ID," and use the button to generate a link for players to sign in to the classroom.</p>
        <div id="classroom_setup" style="color: black">
          <input type="text" id="classroom_id" placeholder="Class ID">
          <input type="text" id="portal_link" size=65 readonly>
          <br>
          <button type="button" class="btn btn-secondary" id="btn_id_gen">Generate Classroom Link</button>
        </div>
      </div> -->
      <div class="graphic">
        <img class="graph_img" src="/assets/img/illustrations/mountainrange.png">
      </div>
      <!--Page tabs
      ------------------------>
      <nav class="nav nav-tabs press-toggles">
        <ul>
          <li class="press-toggle press-toggle1 active"><a href="#data" role="tab" data-toggle="tab">Game Data</a></li>
          <li class="press-toggle press-toggle2"><a href="#teacher" role="tab" data-toggle="tab">Realtime player data</a></li>
          <li class="press-toggle press-toggle3"><a href="#designer" role="tab" data-toggle="tab">Designer Dashboard</a></li>
        </ul>
      </nav>
    </section>

    <div class="row">
      <div class="pub-nav-wrap pub-nav sticky col-sm-3 ui_column">
        <h2>Choose a Game:</h2>
        <ul id="gameselect"></ul>
      </div>
      <div class="tab-content ui_column">
        <!-- OpenGameData tab
        ------------------------>
        <div role="tabpanel" class="tab-pane fade in active" id="data">
          <section class="publications">
            <?php $path = $_SERVER['DOCUMENT_ROOT']; $path .= "/opengamedata/src/downloads.php"; include_once($path); ?>
          </section>
        </div>
        <!-- Classroom dashboard tab
        ------------------------>
        <div role="tabpanel" class="tab-pane fade in" id="teacher">
          <?php $path = $_SERVER['DOCUMENT_ROOT']; $path .= "/opengamedata/src/teacher_dash.php"; include_once($path); ?>
        </div>
        <!-- Designer dashboard tab
        ------------------------>
        <div role="tabpanel" class="tab-pane fade in" id="designer">
          <?php $path = $_SERVER['DOCUMENT_ROOT']; $path .= "/opengamedata/src/designer_dash.php"; include_once($path); ?>
        </div>
      </div>
    </div>
    <span class="spreader"></span>
    <!----------------------
  End page content -->
  </div>

  <!--include footer
------------------------>
  <?php $path = $_SERVER['DOCUMENT_ROOT'];
  $path .= "/includes/footer.php";
  include_once($path); ?>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css" rel="stylesheet" />
  <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script> -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>
  <script src="script/page_handlers.js"></script>
  <script src="script/games_list.js"></script>
  <script src="script/dashboard/RTServer.js"></script>
  <script src="script/dashboard/ViewRenderer.js"></script>
  <script src="script/dashboard/PlayerList.js"></script>
  <script src="script/dashboard/PlayerDashboard.js"></script>
  <script src="config/realtime_config.js"></script>
  <script>
    $(function() {

      // Call Gridder
      $('.gridder').gridderExpander({
        scroll: true,
        scrollOffset: 100,
        scrollTo: "panel", // panel or listitem
        animationSpeed: 900,
        animationEasing: "easeInOutExpo",
        showNav: true, // Show Navigation
        nextText: "Next", // Next button text
        prevText: "Previous", // Previous button text
        closeText: "Close", // Close button text
        onStart: function() {
          //Gridder Inititialized
        },
        onContent: function() {
          //Gridder Content Loaded
        },
        onClosed: function() {
          //Gridder Closed
        }
      });
    });
  </script>
</body>

</html>