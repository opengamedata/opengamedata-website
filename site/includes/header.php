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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&family=Inter:wght@400;700">
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
                <ul class="nav navbar-nav">
                    <li class="nav-item"><a href="about.php" class="btn btn-header mx-5">About</a></li>
                </ul>
            </nav>
        </header>