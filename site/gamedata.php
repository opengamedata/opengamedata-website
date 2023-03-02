<?php
// Declare variables
$game = null;
$month_name = null;
$year = null;
$prev_month = null;
$next_month = null;

// Response variables
// game_list
$game_name = null;
$game_description = null;
$play_link = null;
$source_link = null;
$thumbnail_path = null;
$developer_name = null;
$developer_link = null;

// file_list
$start_date = null;
$end_date = null;
$sessions = null;
$events_file = null;
$sessions_file = null;
$players_file = null;
$population_file = null;
$raw_file = null;
$events_template = null;
$sessions_template = null;
$players_template = null;
$population_template = null;

// game_data
$first_month = null;
$first_year = null;
$last_month = null;
$last_year = null;
$total_monthly_sessions = null;
$game_json = null;
$game_obj = null;

if (isset($_GET['game']) && $_GET['game'] != '') {

    $game = strtoupper(htmlspecialchars($_GET['game']));
    
    // $curl api for game data
    $game_json = json_decode(file_get_contents('data/game_list.json'));

    if (isset($game_json)) $game_obj = $game_json->{$game};

    // Game objects
    $game_name = $game_obj->{'game_name'};
    $game_description = $game_obj->{'game_description'}; 
    $thumbnail_path = $game_obj->{'thumbnail_path'};
    $developer_name = $game_obj->{'developers'}[0]->{'name'};
    $developer_link = $game_obj->{'developers'}[0]->{'link'};
    $play_link = $game_obj->{'play_link'};
    $source_link = $game_obj->{'source_link'};

    // temp
    $end_date = "03/31/2023";
    $start_date = "03/01/2023";


    $month_name = date("F",strtotime($end_date));
    $year = date("Y", strtotime($end_date));

    $first_month = 3;
    $first_year = 2022;
    $last_month = 3;
    $last_year = 2023;
    $total_monthly_sessions = 235235;

}
?>
<?php require 'includes/header.php'; ?>
<main id="gamedata" class="container-fluid">
    <section>
        <div class="row mb-5">
            <div class="col-md-7 my-auto">
                <h2><?php echo $game_name ?></h2>
                <div class="d-flex align-items-center mb-3">
                    <img class="avatar" src="/assets/images/avatar.png">
                    <div class="button-bar">
                        <?php if (isset($developer_name)) echo '<a class="btn btn-secondary" href="' . $developer_link . '">Developer: ' . $developer_name . '</a>'; ?>
                        <?php if (isset($play_link)) echo '<a class="btn btn-secondary" href="' . $play_link . '" target="_blank">Play Game</a>'; ?>
                        <?php if (isset($source_link)) echo '<a class="btn btn-secondary" href="' . $source_link . '" target="_blank">Source Code</a>'; ?>
                    </div>
                </div>
                <p>
                    <?php echo $game_description ?>
                </p>
            </div>
            <div class="col">
                <?php if (isset($thumbnail_path)) echo '<img class="img-fluid rounded" src="' . $thumbnail_path . '">'; ?>
            </div>
        </div>
    </section>
    <section>
        <div class="row mb-5">
            <div class="col">
                <h3 class="mb-0">Player Activity</h3>
                <strong><?php echo $month_name . " " . $year ?></strong>
            </div>
            <div class="col text-end">
                <nav class="text-nowrap">
                    <button type="button" class="btn btn-outline-secondary"><i class="bi bi-chevron-left"></i> March</button>
                    <button type="button" class="btn btn-outline-secondary" disabled>April <i class="bi bi-chevron-right"></i></button>
                </nav>
            </div>
        </div>
        <!-- Chart -->
    </section>
    <div class="row mb-5">
        <div class="col-md">
            <section class="mb-5">
                <!-- Stats -->
                <h3><?php echo $month_name . " Stats:" ?></h3>
                <div class="stats bg-primary text-secondary rounded d-inline-block">
                    <h4 class="mb-0">10K Plays</h4>
                    <?php echo "In " . $month_name ?>
                </div>
            </section>
            <section class="mb-5">
                <!-- Data Pipeline -->
                <h3>Data Pipelines:</h3>
            </section>
        </div>
        <div class="col-md">
            <section class="mb-5">
                <!-- Templates -->
                <h3>General Templates</h3>
            </section>
            <section class="mb-5">
                <!-- Publications -->
                <h3>Publications</h3>
            </section>
        </div>
    </div>
</main>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>