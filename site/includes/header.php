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
        <link rel="stylesheet" href="/assets/styles/bootstrap.css">
        <link rel="stylesheet" href="/assets/styles/styles.css">
    </head>
    <body>
        <header class="shadow">
            <img class="logo" src="/assets/images/logos/OpenGameData-logo.png" alt="Open Game Data">
        </header>