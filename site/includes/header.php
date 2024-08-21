<?php
$title = isset($game) ? " - " . htmlspecialchars($game->getName()) : "";
?>
<!doctype html>
<html lang="en">
    <head>
        <title>Open Game Data
            <?php echo $title; ?>
        </title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="assets/extern/images/logos/ogd/OGD-16.png">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&family=Inter:wght@400;500;700">
        <link rel="stylesheet" href="https://use.typekit.net/zra8nem.css">
        <link rel="stylesheet" href="assets/styles/bootstrap.css">
        <link rel="stylesheet" href="assets/styles/styles.css">
        <script>const WEBSITE_API_URL_BASE = '<?php echo htmlspecialchars(\AppConfig::getConfig()['WEBSITE_API_URL_BASE']); ?>';</script>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2FZHES4D1G"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-2FZHES4D1G');
        </script>
    </head>
    <body>
        <header class="shadow">
            <nav class="navbar navbar-default" aria-label="Main navigation">
                <div class="navbar-header">
                    <a class="navbar-brand" href="index.php"><img class="logo" src="assets/images/logos/OpenGameData-logo.png" alt="Open Game Data"></a>
                </div>
                <ul class="navbar-nav flex-fill flex-row justify-content-end align-items-center">
                    <li class="nav-item"><a href="https://opengamedata-doc.readthedocs.io/en/latest" class="btn btn-header mx-3">Technical Documentation</a></li>
                    <li class="nav-item"><a href="about.php" class="btn btn-header mx-3">About Us</a></li>
                    <li class="nav-item"><a href="getinvolved.php" class="btn btn-header-dark">Get Involved</a></li>
                </ul>                
            </nav>
        </header>