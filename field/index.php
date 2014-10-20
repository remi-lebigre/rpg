<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8"/>
    <title>RPG by FoodySan & Remi</title>

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"/>

    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <!--<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
-->

    <script type="text/javascript" src="functions.js"></script>
    <script type="text/javascript" src="items.js"></script>
    <script type="text/javascript" src="main.js"></script>

    <link rel="stylesheet" href="style.css"/>

</head>
<body>
<div id="wrap">

    <div id="mainInfos"></div>
    <div id="commands">
        <p class="engage" id="movement">Déplacer</p>
        <p id="attack">Attaquer</p>
        <p id="pass">Passer</p>
    </div>
    <div id="infos"></div>
    <div id="subinfos"></div>
    <table>
    </table>

    <div id="menu">
        <div id="hud"></div>
        <div id="hud2"></div>
    </div>

    <div id="setups">
        <form action="" method="post">
            <label for="mvt"> Mouvement </label>
            <select id="mvt">
                <?php
                for ($i = 1; $i < 10; $i++) {
                    ?>
                    <option value="<?= $i ?>"><?= $i ?> tiles</option>
                    <?php if ($i == 3): ?>
                        <option selected value="<?= $i ?>"><?= $i ?> tiles</option>
                    <?php endif; ?>
                <?php } ?>
            </select>

            <input type="hidden"/>
            <button type="submit">Go</button>
        </form>
    </div>

</div>
</body>
</html>




