<?php
    require_once 'includes/app_config.php';
    require 'includes/header.php'; 
?>
<section class="hero-about w-100 px-3 py-5 px-md-5 bg-dark text-white d-flex">
    <div class="col-sm-6 mt-auto my-md-auto">
        <h1 class="display-1">All About Open Game Data</h1>
        <p class="lead">What even is this?<br/>How do I get involved?</p>
        <p class="lead">We have answers:</p>
    </div>
</section>
<main id="about">
    <section id="about" class="container-fluid mb-5">
        <div class="row">
            <div class="col-sm my-auto">
                <h2>How Open Game Data Works</h2>
                <p>We have built an open-source and community-maintained data storage and processing pipeline for educational game data. From the logging libraries that studios can integrate into their games, all the way to the final visualizations that allow design researchers to build new theory, we are thinking about modularity, scalability and performance.</p> 
                <p>Gone are the days of ad hoc, glued together analysis! It's time we worked together.</p>
            </div>
            <div class="col-sm about-robot">
                <img class="img-fluid" src="assets/images/about-robot.png" alt="robot">
            </div>
        </div>
        <div class="row top-buffer">
            <div class="col-sm my-auto order-sm-last">
                <h2>Data without Insight isn't worth much.</h2>
                <p>Everyone is excited about data science and analytics for learning. Games provide rich descriptions into how learners interact with complex systems. We are excited to develop new methods to transform that raw &quot;click steam&quot; data into insights that can be used by designers, educators, researchers and learners. Open Game Data is the infrastructure that will support those discoveries.</p>
            </div>            
            <div class="col-sm order-sm-first about-data my-auto">
                <img class="img-fluid" src="assets/images/about-data.png" alt="data graph">
            </div>

        </div>
    </section>
</main>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>