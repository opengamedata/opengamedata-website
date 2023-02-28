<!-- *** TEMP File *** Provides theme style examples -->
<!-- TODO: delete -->
<!doctype html>
<html lang="en">
    <head>
        <title>Open Game Data - Theme</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&family=Inter:wght@400;700">
        <link rel="stylesheet" href="https://use.typekit.net/zra8nem.css">
        <link rel="stylesheet" href="/assets/styles/bootstrap.css">
        <link rel="stylesheet" href="/assets/styles/styles.css">
    </head>
    <body>
        <header class="hero w-100 p-5 bg-dark text-white">
            <h1 class="display-1">Display Heading 1</h1>
            <p class="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> 
            <h2 class="display-2">Display Heading 2</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <button type="button" class="btn btn-primary">Button</button> <button type="button" class="btn btn-dark">Button</button>
        </header>        
        <div class="container mt-4">
            <p>
                Plain body text. Inter regular 14pt.<br />
                <br />
                <button type="button" class="btn btn-secondary">Play Game</button><br />
                <button type="button" class="btn btn-outline-secondary">Button Outline <i class="bi bi-chevron-right"></i></button><br />
            </p>

            <!-- Card example e.g., Dashboard page -->
            <div class="card shadow mb-4" style="width: 18rem;">
                <img src="https://fielddaylab.wisc.edu/assets/img/gameplay/wake-gameplay.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h4 class="card-title">Card title</h4>
                    <p class="card-subtitle small">Card subtitle</p>
                </div>
                <div class="card-body">
                    Some quick example text to build on the card title and make up the bulk of the <a href="#">card's content</a>.
                </div>
            </div>

            <!-- Stats box example -->
            <div class="bg-primary text-secondary rounded p-3" style="width: 10rem;">
                <h4>Stats</h4>
                In June
            </div>

            <!-- Data Pipeline popover example -->
            <!-- TODO: Toggle on close button -->
            <div class="my-4">
                <button type="button" class="btn btn-primary"
                        data-bs-toggle="popover" data-bs-placement="right"
                        data-bs-html="true"
                        data-bs-custom-class="pipeline-popover shadow"
                        data-bs-title="Custom popover title <small>Subhead</small> <button type='button' class='btn-close' aria-label='Close'></button>"
                        data-bs-content="<p>Popover body text.</p><button class='btn btn-primary'>Download <i class='bi bi-arrow-down'></i></button>">
                    Custom popover
                </button>
            </div>
        </div>
        <!-- Begin Footer Include -->
        <footer class="bg-dark">
            <p class="h2">Open Game Data</p>
            <!-- <img src="fieldday-logo"> -->
        </footer>
    </body>
    <!-- Bootstrap 5 Javascript -->
    <script src="/assets/scripts/bootstrap.bundle.min.js"></script>    
    <!-- Custom Javascript -->
    <script src="/assets/scripts/app.js"></script> 
</html>