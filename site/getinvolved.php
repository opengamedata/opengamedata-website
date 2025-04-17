<?php
    require_once 'includes/app_config.php';
    require 'includes/header.php'; 
?>
<section class="hero hero-involved w-100 px-3 py-5 px-md-5 bg-dark text-white d-flex flex-wrap flex-sm-nowrap">
    <div class="col-sm-6 mt-auto my-md-auto">
        <h1 class="display-1">Get Involved</h1>
        <p class="lead">We work with researchers who want to use game data. We also partner with game studios to make data from their games available to partner with researchers.</p>
    </div>
</section>
<main id="getinvolved">
    <section class="container-fluid">
        <div class="d-flex flex-wrap flex-sm-nowrap mb-5">
            <div class="img-col mx-auto my-auto">
                <img class="img-fluid" src="assets/images/icons/ogd-community.svg" alt="">
            </div>
            <div class="flex-fill mt-4">
                <h2>Join the Community</h2>
                <p>We facilitate a regular online event, <a href="https://sites.google.com/andrew.cmu.edu/ogd-office-hours/home">Open Game Data Office Hours</a>, for folks to share work in progress for help, talk about upcoming events, and generally plan how our community should develop. You can also <a href="https://docs.google.com/forms/d/e/1FAIpQLScB8Vtlpit_t6dUrDa9bEKpSom8Ph7cAbOrnpzG8r5UAR038g/viewform?usp=sf_link" target="_blank">Join our Slack</a> for updates on events, publications, news, and grant opportunities.
            </div>
        </div>
        <div class="d-flex flex-wrap flex-sm-nowrap mb-5">
            <div class="img-col mx-auto my-auto">
                <img class="img-fluid" src="assets/images/icons/add-game.svg" alt="">
            </div>
            <div class="flex-fill mt-4">
                <h2>Add your game to OGD</h2>
                <p>Want to start logging to OGD? <a href = "https://github.com/opengamedata/opengamedata-website/issues/new?template=02-submit-new-game.yml">Submit your Game </a>(Github Account Required)</p>
            </div>
        </div>
        <div class="d-flex flex-wrap flex-sm-nowrap mb-5">
            <div class="img-col mx-auto my-auto">
                <img class="img-fluid" src="assets/images/icons/use-ogd.svg" alt="">
            </div>
            <div class="flex-fill mt-4">
                <h2>Use OGD for your research</h2>
                <p>You can use the data for free right now to get started with your analysis. If you want to design an experiment that requires a change to the game, get involved in the <a href="Setup an Open Game Data Consultation" target="_blank">slack community</a> or <a href="https://forms.gle/pe3VHPKKWUAwkFub9" target="_blank">contact us</a>.</p>
            </div>
        </div>
        <div class="d-flex flex-wrap flex-sm-nowrap mb-5">
            <div class="img-col mx-auto my-auto">
                <img class="img-fluid" src="assets/images/icons/cite-ogd.svg" alt="">
            </div>
            <div class="flex-fill mt-4">
                <h2>Cite OGD in your projects</h2>
                <p>
                    Gagnon, D., Swanson, L. (2023). Open Game Data: A Technical Infrastructure for Open Science with Educational Games. In: Haahr, M., Rojas-Salazar, A., Göbel, S. (eds) Serious Games. JCSG 2023. Lecture Notes in Computer Science, vol 14309. Springer, Cham. <a href ="https://doi.org/10.1007/978-3-031-44751-8_1">https://doi.org/10.1007/978-3-031-44751-8_1</a>
                </p>
            </div>
        </div>
        <div class="d-flex flex-wrap flex-sm-nowrap mb-5">
            <div class="img-col mx-auto my-auto">
                <img class="img-fluid" src="assets/images/icons/include-us.svg" alt="">
            </div>
            <div class="flex-fill mt-4">
                <h2>Include us on your research grants</h2>
                <p>Any large scale use of this project that will require support from our lab should include us in the grant. Using this data for larger scale projects will require support from our team. <a href="https://forms.gle/pe3VHPKKWUAwkFub9" target="_blank">Please set up a meeting with us</a> before including OGD in your grants.</p>
            </div>
        </div>
        <div class="d-flex flex-wrap flex-sm-nowrap mb-5">
            <div class="img-col mx-auto my-auto">
                <img class="img-fluid" src="assets/images/logos/creative-commons.svg" alt="">
            </div>
            <div class="flex-fill mt-4">
                <h2>Copyright license and Usage</h2>
                <p><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">https://creativecommons.org/publicdomain/zero/1.0/</a></p>
            </div>
        </div>
        <div class="d-flex flex-wrap flex-sm-nowrap mb-5">
            <div class="img-col mx-auto my-auto">
                <img class="img-fluid" id="envelope" src="assets/images/icons/envelope.svg" alt="">
            </div>
            <div class="flex-fill mt-4">
                <h2>Or just contact us</h2>
                <p>Luke Swanson<br>
                   <a href="mailto:lwswanson2@wisc.edu">lwswanson2@wisc.edu</a></p>
            </div>
        </div>
    </section>
</main>
<!-- Begin Footer Include -->
<?php require 'includes/footer.php'; ?>
