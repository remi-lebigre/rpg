/**
 * Created by Remi Lebigre & FoodySan
 * 06-2014
 */

//RETOUR : case 8: case 27: case69:

//////////////////////////////////////////////////////////////////////////////////////
// MAINMENU
/////////////////////////////////////////////////////////////////////////////////////

//nombre de tours que dure la partie
var iMainTurn = 0;
var iCharacterTurn = 0;
var aCharacters = [];
function initialize(){
    oEnnemyTeam['oEnnemy'] = oEnnemy;
    oEnnemyTeam['oBad'] = oBad;
    setTeamStartPosition(oEnnemyTeam);

    oHeroTeam['oHero'] = oHero;
    oHeroTeam['oSide'] = oSide;
    setTeamStartPosition(oHeroTeam);
}

function MainMenu(oHeroTeam, oEnnemyteam) {
    $('#mainInfos').html("<div id='turn'>TOUR : " + iMainTurn + "</div>");

    for (var key in oHeroTeam) {
        aCharacters.push(oHeroTeam[key]);
    }
    for (var key in oEnnemyteam) {
        aCharacters.push(oEnnemyteam[key]);
    }

    if (aCharacters.length !== 0) {

        var aHeroPosition = translateToTdCount(aCharacters[iCharacterTurn].position);

        MainActions(aCharacters[iCharacterTurn], oEnnemyteam);
        if (
            iCharacterTurn < aCharacters.length - 1) {
            iCharacterTurn++;
        }
        else {
            iCharacterTurn = 0;
            iMainTurn += 1;
        }
    }
    else {
        alert("équipe vaincue");
        if(window.confirm('Rejouer ?')){
            initialize();
            for(key in oHeroTeam){
                var oHero = oHeroTeam[key];
                oHero.stats.hp = oHero.stats.hpmax;
                oHero.stats.mp = oHero.stats.mpmax;
            }
            for(key in oEnnemyteam){
                var oEnnemy = oEnnemyteam[key];
                oEnnemy.stats.hp = oEnnemy.stats.hpmax;
                oEnnemy.stats.mp = oEnnemy.stats.mpmax;
            }
        }
    }


}


/**
 * Fonction principale, où démarre le jeu. Permet de se déplacer dans le menu.
 * @param oHero
 * @param oEnnemyTeam
 * @constructor
 */
function MainActions(oHero, oEnnemyTeam) {

    $('td').css("opacity", "1");
    $('#infos').html("");
    $('#infos2').html("");

    //rajoute la class 'true' à toutes les 'td' où se trouve un personnage
    setTdClassTrue(oEnnemyTeam, oHeroTeam);

    var aHeroTdPos = translateToTdCount(oHero.position);
    $('tr:nth-child('+aHeroTdPos[1]+') td:nth-child('+aHeroTdPos[0]+')').removeClass('true');
    $('tr:nth-child('+aHeroTdPos[1]+') td:nth-child('+aHeroTdPos[0]+')').addClass('false');

    //Initialise la position du curseur sur le héros
    $('#pointer').html("");
    setStartPosition(oHero.position, 'pointer', 40, 40);

    //Affiche le HUD du héros
    setHUD(oHero, '#hud');
    var iMenuNavigation = 1 ;

    $(document).keydown(function (key) {

        //lorsque la touche du clavier est enfoncée :
        switch (parseInt(key.which, 10)) {

            // On a appuyé sur la touche flèche haut ou Z
            case 90:
            case 38:
                if (iMenuNavigation > 1) {
                    iMenuNavigation--;
                    $('#commands p:nth-child('+ (iMenuNavigation+1) +')').removeClass('engage');
                    $('#commands p:nth-child('+ iMenuNavigation +')').addClass('engage');
                }
                break;

            // On a appuyé sur la touche flèche bas ou S
            case 83:
            case 40:
                if (iMenuNavigation < ($('#commands p').length)) {
                    iMenuNavigation++;
                    $('#commands p:nth-child('+ (iMenuNavigation-1) +')').removeClass('engage');
                    $('#commands p:nth-child('+ iMenuNavigation +')').addClass('engage');
                }
                break;

            // On a appuyé sur la touche entrée ou espace
            case 32:
            case 13:
                //si la div qui affiche "déplacer" a la class qui lui donne sa couleur rouge lorsqu'on appuie sur entrée
                //c'est donc qu'on souhaite déplacer le personnage
                if ($('#movement').hasClass('engage')) {

                    //.off termine le déplacement dans le main menu à l'aide du switch (keydown)
                    $(document).off(MainActions(oHero, oEnnemyTeam));

                    //.on démarre le déplacement dans la fonction premvoement via son switch (keydown)
                    $(document).on(preMovement(oHero, oEnnemyTeam, 'mvt'));

                    //on initialise la grille de mouvement du personnage
                    $('td').css("opacity", "1");
                    setGrid(oHero, 'mvt', '0.8');
                }

                //si lorsqu'on appuie sur entrée on se situe sur la div qui affiche "Attaquer"
                else if ($('#attack').hasClass('engage')) {
                    $(document).off(MainActions(oHero, oEnnemyTeam));

                    $('#infos').html('<p id="normal">Normal Attack</p> <p id="skill">Skill</p>');
                    //si on se situe sur "attaquer" on ouvre les sous menus attaque

                    $('#normal').addClass('sub');
                    setGrid(oHero, 'atk', 0.2);
                    $(document).on(attackMenu(oHero, oEnnemyTeam));
                }

                else if ($('#pass').hasClass('engage')) {

                    $('#pass').removeClass('engage');
                    $('#movement').addClass('engage');

                    $(document).off(MainActions(oHero, oEnnemyTeam));
                    $(document).on(MainActions(aCharacters[iCharacterTurn], oEnnemyTeam));

                    if (
                        iCharacterTurn < aCharacters.length - 1) {
                        iCharacterTurn++;
                    }
                    else {
                        iCharacterTurn = 0;
                        iMainTurn += 1;
                    }
                }

                break;
        }
    });
}
//////////////////////////////////////////////////////////////////////////////////////
// PREMOVEMENT
/////////////////////////////////////////////////////////////////////////////////////

/**
 * Trace un chemin à partir de la position du héros, puis déplace le héros en appuyant sur entrée
 * @param oHero
 * @param oEnnemyTeam
 * @param type
 * @param skill
 */
function preMovement(oHero, oEnnemyTeam, type, skill) {

    //Sert à définir un chemin AVANT de déplacer le personnage
    //Récupère les positions passées en argument dans un array
    var aPremovement = [oHero.position[0], oHero.position[1]];

    //Sert à redéfinir le chemin aPremovement tracé par l'utilisateur pour lui faire prendre le chemin le plus court
    var aPathCorrect = [oHero.position[0], oHero.position[1]];

    //aide au pathfinding : se remplit lorsqu'on appuie sur une touche, prend la valeur de la touche.
    var aPathway = [];

    //limite de mouvement du personnage pas atteinte. passe à true si aPremovement > oHero.stats[6] (= mvt)
    var bMvtNoLimit = false;

    /**
     * Fonction principale utilisée à chaque input directionnel (haut bas gauche droite)
     * @param direction
     */
    function arrowDirection(direction) {
        //par défaut il n'y a pas de limite de mouvement puisqu'on se situe dans la grille de déplacement
        bMvtNoLimit = true;

        //Stop l'animation du personnage précédente
        clearInterval(oHero.animate);

        //Démarre l'animation du personnage dans la bonne direction
        oHero.animate = animateCharacter(oHero.id, 500, direction);

        switch (direction) {
            case 'left':
                //l'axe des X ( [0] ) est décalé de -1 (vers la gauche)
                aPremovement[0] -= 1;
                break;
            case 'up' :
                aPremovement[1] += 1;
                break;
            case 'right':
                aPremovement[0] += 1;
                break;
            case 'down':
                aPremovement[1] -= 1;
                break;
        }

        if (type !== 'mvt') {
            $('#hud2').html('');
            for (key in oEnnemyTeam) {

                var oEnnemy = oEnnemyTeam[key];
                if (aPremovement[0] == oEnnemy.position[0] && aPremovement[1] == oEnnemy.position[1]) {
                    setHUD(oEnnemy, '#hud2');
                }
            }
        }

        var aCurrentTdCountPos = translateToTdCount(aPremovement);
       /* console.log(oHero.aSteps);
        oHero.aSteps.push(oHero.position);
        console.log(oHero.aSteps);*/
        for (var iSteps = 0; iSteps < oHero.aSteps.length; iSteps++) {
            if ((aCurrentTdCountPos[0] == oHero.aSteps[iSteps][0]) && (aCurrentTdCountPos[1] == oHero.aSteps[iSteps][1])) {
                bMvtNoLimit = false;
                break;
            } else {
            }
        }


        //s'il y a un obstacle, ou (si on arrive à la limite de mouvement ET qu'on ne vient pas de la direction opposée
        if (bMvtNoLimit) {
            switch (direction) {
                case 'left':
                    //on replace le curseur à la limite de mouvement ou AVANT l'obstacle
                    aPremovement[0] += 1;
                    break;
                case 'up' :
                    aPremovement[1] -= 1;
                    break;
                case 'right':
                    aPremovement[0] -= 1;
                    break;
                case 'down':
                    aPremovement[1] += 1;
                    break;
            }
        }

        //s'il n'y a pas d'obstacle, ou (si à la limite de mouvement du personnage ET qu'on vient de la direction opposée)
        else {

            //la case est coloriée en opacity 0.5
            SetOpacity(aPremovement, 0.5);

            //le chemin tracé en opacité 0.5 est corrigé (ex. : si on input bas, droite, droite, haut, le chemin ne coloriera pas ces 4 cases, mais coloriera droite, droite, depuis la position du personnage)
            correctPathway(direction, oHero, aPathway, aPathCorrect, type, skill);

            //le chemin repart de la position du personnage
            aPathCorrect = [oHero.position[0], oHero.position[1]];

            //le booléen est réinitialisé. Donc si l'on a rencontré un obstacle, on peut toujours continuer de bouger dans d'autres directions.
            bMvtNoLimit = false;
        }

    }


    function reInitialize(type) {
        //après le déplacement, on remet toutes les cases opaques
        $('td').css("opacity", "1");

        $('#infos').html('');
        $('#subinfos').html('');

        //le tableau qui suit les inputs de l'utilisateur est remis à 0, ainsi que les obstacles.
        aPathway = [];

        //le contrôle est redonné au main menu, et plus au déplacement
        $(document).off(preMovement(oHero, oEnnemyTeam, type, skill));
        if (type == 'mvt') {
            $(document).on(MainActions(oHero, oEnnemyTeam));
        }
        else {

            //Initialise la position du curseur sur le héros
            $('#pointer').html("");
            setStartPosition(oHero.position, 'pointer', 40, 40);

            $(document).on(MainMenu(oHeroTeam, oEnnemyTeam));
        }
    }

    $(document).keydown(function (key) {
        //lorsque la touche du clavier est enfoncée :
        switch (parseInt(key.which, 10)) {

            //RETOUR : case 8: (retour) case 27: (esc) case69:(e)
            case 8:
            case 27:
            case 69:
                key.preventDefault();
                reInitialize(type);
                break;

            // On a appuyé sur la touche flèche gauche ou Q
            case 81:
            case 37:
                arrowDirection('left');
                break;

            // On a appuyé sur la touche flèche vers le haut ou Z
            case 90:
            case 38:
                arrowDirection('up');
                break;

            // On a appuyé sur la touche flèche droite ou D
            case 68:
            case 39:
                arrowDirection('right');
                break;

            // On a appuyé sur la touche flèche vers le bas ou S
            case 83:
            case 40:
                arrowDirection('down');
                break;

            // On a appuyé sur la touche entrée ou espace
            case 32:
            case 13:
                var bHit = true;
                var TdPos = translateToTdCount(oHero.position);
                $('tr:nth-child(' + TdPos[1] + ') td:nth-child(' + TdPos[0] + ')').removeClass('true').addClass('false');

                if (type == 'mvt') {
                    // le personnage est déplacé suivant les inputs rentrés par l'utilisateur dans aPathway
                    for (var i = 0; i < aPathway.length; i++) {
                        switch (aPathway[i]) {
                            case 'left':
                                moveX('left', oHero.id);
                                break;
                            case 'right':
                                moveX('right', oHero.id);
                                break;
                            case 'up':
                                moveY('up', oHero.id);
                                break;
                            case 'down':
                                moveY('down', oHero.id);
                                break;
                        }
                    }

                    //on actualise la nouvelle position X et Y du personnage
                    oHero.position[0] = aPremovement[0];
                    oHero.position[1] = aPremovement[1];
                }
                else {
                    bHit = ResolveDamages(oHero, aPremovement, oEnnemyTeam, type, skill);
                }
                //Enfin on réinitialise tout
                if (bHit) {
                    reInitialize(type);
                }
                else {
                    $('#infos').html('');
                    $('#subinfos').html('');
                    $(document).off(preMovement(oHero, oEnnemyTeam, 'atk'));
                    $(document).on(MainActions(oHero, oEnnemyTeam));
                }
                break;
        }
    });
}

function ResolveDamages(oHero, tilePosition, oEnnemyTeam, type, skill) {

    var iInflictedDamages;
    /* var aEnnemyPositions = [];

     for (var key in oEnnemyTeam) {
     var oEnnemy = oEnnemyTeam[key];
     var checkX = Math.abs(oHero.position[0] - oEnnemy.position[0]);
     var checkY = Math.abs(oHero.position[1] - oEnnemy.position[1]);
     if (((checkX <= 1 && checkY == 0) || (checkX == 0 && checkY <= 1)) && !(checkX == 0 && checkY == 0)) {

     aEnnemyPositions.push(oEnnemy.position);
     }

     $('#pointer').html("");
     setStartPosition(oEnnemy.position, 'pointer', 40, 40);   }*/

    //si l'ennemi est à portée
    var aEnnemyPosition = ennemyAtReach(tilePosition, oEnnemyTeam);
    if (aEnnemyPosition.length !== 0) {
        for (var key in oEnnemyTeam) {
            var oEnnemy = oEnnemyTeam[key];
            if (oEnnemy.position[0] == aEnnemyPosition[0] && oEnnemy.position[1] == aEnnemyPosition[1]) {

                if (type == 'atk') {

                    //On calcule les dégâts, basés sur : l'atk du personnage (oHero.stats[4]), le multiplicateur de l'arme (oHero.items[1]), et la défense de l'ennemi (oEnnemy.stats[5]
                    iInflictedDamages = ((oHero.stats.atk * oHero.items.lhand.mult) / 100) - oEnnemy.stats.def;
                    if (iInflictedDamages <= 0) {
                        iInflictedDamages = 1;
                    }
                } else if (type == 'skill') {
                    iInflictedDamages = ((oHero.stats.matk * oHero.skills.icebolt.mult) / 100) - oEnnemy.stats.mdef;
                    if (iInflictedDamages <= 0) {
                        iInflictedDamages = 1;
                    }
                }

                //On retire les dégâts aux HP actuels de l'ennemi
                oEnnemy.stats.hp -= iInflictedDamages;
                alert("Vous avez infligé " + iInflictedDamages + " dégâts.");

                //si l'ennemi n'a plus de vie
                if (oEnnemy.stats.hp <= 0) {
                    alert(oEnnemy.id + " vaincu");
                    oEnnemy.stats.hp = 0;
                    setHUD(oHero, '#hud');
                    setHUD(oEnnemy, '#hud2');
                    delete oEnnemyTeam[key];
                } else {
                    setHUD(oHero, '#hud');
                    setHUD(oEnnemy, '#hud2');
                }
            }
        }
        return true;
    } else {
        //on efface le contenu de #infos qui affichais "normal attack" et "skill"
        $('#infos').html("");
        alert("Pas à portée");
        $('#attack').addClass('engage');
        return false;
    }


}

//////////////////////////////////////////////////////////////////////////////////////
// ATTACK
/////////////////////////////////////////////////////////////////////////////////////
/**
 * Attaque du personnage oHero sur l'ennemi oEnnemy, de type normal ou skill
 * @param oHero
 * @param oEnnemyTeam
 */
function attackMenu(oHero, oEnnemyTeam) {
    $(document).keydown(function (key) {
        //lorsque la touche du clavier est enfoncée :
        switch (parseInt(key.which, 10)) {

            //RETOUR : case 8: (retour) case 27: (esc) case69:(e)
            case 8:
            case 27:
            case 69:
                key.preventDefault();
                reInitialize();
                break;

            // On a appuyé sur la touche flèche haut
            case 90:
            case 38:
                $('#normal').addClass('sub');
                $('#skill').removeClass('sub');
                setGrid(oHero, 'atk', 0.2);
                break;

            // On a appuyé sur la touche flèche bas
            case 83:
            case 40:
                $('#normal').removeClass('sub');
                $('#skill').addClass('sub');
                $('td').css("opacity", "1");
                break;

            // On a appuyé sur la touche entrée ou espace
            case 32:
            case 13:
                if ($('#normal').hasClass('sub')) {

                    $(document).off(attackMenu(oHero, oEnnemyTeam));
                    preMovement(oHero, oEnnemyTeam, 'atk');
                }
                else if ($('#skill').hasClass('sub')) {
                    var aSkills = [];

                    for (var key in oHero.skills) {
                        var sSkillName = oHero.skills[key];
                        aSkills.push(sSkillName.id);
                        $('#subinfos').append('<div id="' + sSkillName.id + '">' + sSkillName.name + '</div>');
                    }

                    $('#' + aSkills[0] + '').addClass('skill');
                    setGrid(oHero, 'skill', 0.2, aSkills[0]);
                    $(document).off(attackMenu(oHero, oEnnemyTeam));
                    $(document).on(skillsMenu(oHero, oEnnemyTeam));
                }
                break;
        }
    });

    function reInitialize() {
        $('td').css("opacity", "1");
        $('#infos').html("");
        $(document).off(attackMenu(oHero, oEnnemyTeam));
        $(document).on(MainActions(oHero, oEnnemyTeam));
    }
}


//////////////////////////////////////////////////////////////////////////////////////
// SKILLS
/////////////////////////////////////////////////////////////////////////////////////


/**
 * Attaque du personnage oHero sur l'ennemi oEnnemy, de type normal ou skill
 * @param oHero
 * @param oEnnemyTeam
 */
function skillsMenu(oHero, oEnnemyTeam) {
    var iSkillsCount = 0;
    var aSkills = [];

    for (var key in oHero.skills) {
        var sSkillName = oHero.skills[key];
        aSkills.push(sSkillName.id);
    }

    $(document).keydown(function (key) {
        //lorsque la touche du clavier est enfoncée :
        switch (parseInt(key.which, 10)) {

            //RETOUR : case 8: (retour) case 27: (esc) case69:(e)
            case 8:
            case 27:
            case 69:
                key.preventDefault();
                reInitialize();
                break;

            // On a appuyé sur la touche flèche haut
            case 90:
            case 38:
                if (iSkillsCount > 0) {
                    iSkillsCount--;
                    $('#' + aSkills[iSkillsCount + 1] + '').removeClass('skill');
                    $('#' + aSkills[iSkillsCount] + '').addClass('skill');
                    setGrid(oHero, 'skill', 0.2, aSkills[iSkillsCount]);
                }
                break;

            // On a appuyé sur la touche flèche bas
            case 83:
            case 40:
                if (iSkillsCount < aSkills.length - 1) {
                    iSkillsCount++;
                    $('#' + aSkills[iSkillsCount - 1] + '').removeClass('skill');
                    $('#' + aSkills[iSkillsCount] + '').addClass('skill');
                    setGrid(oHero, 'skill', 0.2, aSkills[iSkillsCount]);
                }
                break;

            // On a appuyé sur la touche entrée ou espace
            case 32:
            case 13:
                $(document).off(skillsMenu(oHero, oEnnemyTeam));
                if ($('#' + aSkills[0] + '').hasClass('skill')) {
                    preMovement(oHero, oEnnemyTeam, 'skill', aSkills[iSkillsCount]);
                }
                else if ($('#' + aSkills[1] + '').hasClass('skill')) {
                    preMovement(oHero, oEnnemyTeam, 'skill', aSkills[iSkillsCount]);
                }

                break;
        }
    });

    function reInitialize() {
        $('#subinfos').html("");
        $(document).off(skillsMenu(oHero, oEnnemyTeam));
        $(document).on(attackMenu(oHero, oEnnemyTeam));
    }
}


//////////////////////////////////////////////////////////////////////////////////////
// INTERFACE
/////////////////////////////////////////////////////////////////////////////////////

/**
 * Affiche le HUD à l'écran. Returns nothing
 * @param oHero
 * @param hudID
 */
function setHUD(oHero, hudID) {
    $('' + hudID + '').html(
        '<h2>' + oHero.name + '</h2><br/><div style="height:10px;background:white;">' +
            '<div class="' + oHero.name + 'hp" style="background:red;width:0;height:100%">HP' + oHero.stats.hp + '/' + oHero.stats.hpmax + '</div></div><br/>' +
            '<div style="height:10px;background:white;">' +
            '<div class="' + oHero.name + 'mp" style="background:blue;width:0;height:100%">MP' + oHero.stats.mp + '/' + oHero.stats.mpmax + '</div></div><br/>' +
            '<div class="stats"><p>Atk: ' + oHero.stats.atk + '</p></div>' +
            '<div class="stats"><p>mAtk: ' + oHero.stats.matk + '</p></div>' +
            '<div class="stats"><p>Def: ' + oHero.stats.def + '</p></div>' +
            '<div class="stats"><p>mDef: ' + oHero.stats.mdef + '</p></div>' +
            '<div class="stats"><p>Vts: ' + oHero.stats.vts + '</p></div>' +
            '<div class="stats"><p>Mvt: ' + oHero.stats.mvt + '</p></div>'
    );
    var iConvert = (oHero.stats.hp / oHero.stats.hpmax) * 100;
    $('.' + oHero.name + 'hp').css('width', iConvert + '%');
    iConvert = (oHero.stats.mp / oHero.stats.mpmax) * 100;
    $('.' + oHero.name + 'mp').css('width', iConvert + '%');
}

//////////////////////////////////////////////////////////////////////////////////////
// FIELD
/////////////////////////////////////////////////////////////////////////////////////
/**
 * Affiche le nombre de lignes sous forme 'tr'
 * @param CountTd
 */
function setFieldWidth(CountTd) {
    for (var i = 0; i < CountTd; i++) {
        $('tr').append('<td class="case ' + oFields.plain.name + ' ' + oFields.plain.obstacle + '" style=" ' + oFields.plain.background + ' " ></td>');
    }
}

/**
 * Affiche le nombre de cases sous forme 'td'
 * @param CountTr
 */
function setFieldHeight(CountTr) {
    for (var i = 0; i < CountTr; i++) {
        $('table').append('<tr></tr>');
    }
}

/**
 * Transforme les cases bordant le Field de 'sea'.
 * Les 'td' concernées prennent la classe 'sea'
 */
function setBorders() {
    $('tr:first-child td').attr("style", oFields.sea.background).addClass('sea ' + oFields.sea.obstacle);
    $('tr:last-child td').attr("style", oFields.sea.background).addClass('sea ' + oFields.sea.obstacle);
    for (var i = 0; i < $('tr').length; i++) {
        $('tr:nth-child(' + i + ') td:first-child').attr("style", oFields.sea.background).addClass('sea ' + oFields.sea.obstacle);
        $('tr:nth-child(' + i + ') td:last-child').attr("style", oFields.sea.background).addClass('sea ' + oFields.sea.obstacle);
    }
}

/**
 * Rajoute la classe true où se situe chaque personnage
 * @param oEnnemyTeam
 * @param oHeroTeam
 */
function setTdClassTrue(oEnnemyTeam, oHeroTeam) {

    for (var key in oEnnemyTeam) {
        var oEnnemy = oEnnemyTeam[key];
        var aEnnemyTdPos = translateToTdCount(oEnnemy.position);
        $('tr:nth-child(' + aEnnemyTdPos[1] + ') td:nth-child(' + aEnnemyTdPos[0] + ')').removeClass("false");
        $('tr:nth-child(' + aEnnemyTdPos[1] + ') td:nth-child(' + aEnnemyTdPos[0] + ')').addClass("true");
    }

    for (var key in oHeroTeam) {
        var oHero = oHeroTeam[key];
        var aHeroTdPos = translateToTdCount(oHero.position);
        $('tr:nth-child(' + aHeroTdPos[1] + ') td:nth-child(' + aHeroTdPos[0] + ')').removeClass("false");
        $('tr:nth-child(' + aHeroTdPos[1] + ') td:nth-child(' + aHeroTdPos[0] + ')').addClass("true");
    }

}

/**
 * Transforme un groupe de 'td' de taille [X, Y], démarrant à la position [XStart, YStart]
 * Les 'td' concernées prennent la classe 'sand'
 * @param X
 * @param Y
 * @param XStart
 * @param YStart
 */
function setDesert(X, Y, XStart, YStart) {
    for (var k = YStart; k < (YStart + Y); k++) {
        for (var i = XStart; i < (X + XStart); i++) {
            if ($('tr:nth-child(' + k + ') td:nth-child(' + i + ')').hasClass('sea') || $('tr:nth-child(' + k + ') td:nth-child(' + i + ')').hasClass('river')) {
            } else {
                $('tr:nth-child(' + k + ') td:nth-child(' + i + ')').attr("style", oFields.sand.background).addClass('sand ' + oFields.sand.obstacle);
            }
        }
    }
}

/**
 * Transforme la case  [XCross, YCross] en 'river', ainsi que toutes celles rejoignant le bord droit et bas du Field
 * ...sauf si la 'td' a la classe 'sea'
 * Les 'td' concernées prennent la classe 'river'
 * @param XCross
 * @param YCross
 * @param XBorder
 * @param YBorder
 */
function setRiver(XCross, YCross, XBorder, YBorder) {
    for (var k = XCross; k <= XBorder; k++) {
        if ($('tr:nth-child(' + YCross + ') td:nth-child(' + k + ')').hasClass('sea')) {
            break;
        } else {
            $('tr:nth-child(' + YCross + ') td:nth-child(' + k + ')').attr("style", oFields.river.background).addClass('river ' + oFields.river.obstacle);
        }
    }
    for (var i = YCross; i <= YBorder; i++) {
        if ($('tr:nth-child(' + i + ') td:nth-child(' + XCross + ')').hasClass('sea')) {
            break;
        } else {
            $('tr:nth-child(' + i + ') td:nth-child(' + XCross + ')').attr("style", oFields.river.background).addClass('river ' + oFields.river.obstacle);
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////
// TILES
/////////////////////////////////////////////////////////////////////////////////////

/**
 * Affiche l'ennemi avec l'id divID à la position [aXY[0], aXY[1]]
 * @param aXY
 * @param divID
 * @param iOffsetLeft
 * @param iOffsetTop
 */
function setStartPosition(aXY, divID, iOffsetLeft, iOffsetTop) {

    //Transforme la position dans la grille en position dans <table><tr>
    var aNthChildArray = translateToTdCount(aXY);
    var iX = aNthChildArray [0];
    var iY = aNthChildArray [1];
    var iTdOffset = $('tr:nth-child(' + iY + ') td:nth-child(' + iX + ')').position();
    var iTableOffset = $('table').offset();

    iTdOffset.top -= iTableOffset.top;
    iTdOffset.left -= iTableOffset.left;

    //place la div conteant le personnage divID au début de la table, AVANT la premiere 'tr'
    $('table').prepend("<div id=\"" + divID + "\"><div id=\"" + divID + "-content\"></div></div>");

    //déplace, depuis la div divID, le divID-content (qui est en position absolue) sur la carte, à l'endroit indiqué en argument par aXY
    $('#' + divID + '-content').css("top", "" + (iTdOffset.top + iOffsetTop) + "px").css("left", "" + (iTdOffset.left + iOffsetLeft) + "px");
}

/**
 *
 */
function setTeamStartPosition(oTeam) {

    for (var key in oTeam) {
        var oEnnemy = oTeam[key];
        setStartPosition(oEnnemy.position, oEnnemy.id, oEnnemy.spriteOffset[0], oEnnemy.spriteOffset[1]);
    }
}


/**
 *  * Rend la case 'td' passée en argument transparente de 'opacity' (valeur de 0 à 1).
 * @param aXY
 * @param opacity
 */
function SetOpacity(aXY, opacity) {              //Rend + opaque une case passée en argument.
    var aNthChildArray = translateToTdCount(aXY);
    var iX = aNthChildArray [0];
    var iY = aNthChildArray [1];

    $('tr:nth-child(' + iY + ') td:nth-child(' + iX + ')').css("opacity", " " + opacity + " ");
}

/**
 *
 * @param oHero
 * @param type
 * @param skill
 * @param opacity
 */
function setGrid(oHero, type, opacity, skill) {

    $('td').css("opacity", "1");
    var aHeroPositionTd = translateToTdCount(oHero.position);
    var aStep = [
        [aHeroPositionTd]
    ];
    var aObstacle = [false, false, false, false];

    /**
     *
     * @param aHeroPosTd
     * @param type
     * @returns {Array}
     * @constructor
     */
    function StepAndNewTilesPosition(aHeroPosTd, type) {


        var aReturn4Pos = [];

        if (type == 'mvt' && $('tr:nth-child(' + aHeroPosTd[1] + ') td:nth-child(' + (aHeroPosTd[0] + 1) + ')').hasClass("true")) {
            aObstacle[0] = true;
        }
        else {
            $('tr:nth-child(' + aHeroPosTd[1] + ') td:nth-child(' + (aHeroPosTd[0] + 1) + ')').css("opacity", " " + opacity + " ");
        }
        if (type == 'mvt' && $('tr:nth-child(' + aHeroPosTd[1] + ') td:nth-child(' + (aHeroPosTd[0] - 1) + ')').hasClass('true')) {
            aObstacle[1] = true;
        }
        else {
            $('tr:nth-child(' + aHeroPosTd[1] + ') td:nth-child(' + (aHeroPosTd[0] - 1) + ')').css("opacity", " " + opacity + " ");
        }
        if (type == 'mvt' && $('tr:nth-child(' + (aHeroPosTd[1] + 1) + ') td:nth-child(' + aHeroPosTd[0] + ')').hasClass("true")) {
            aObstacle[2] = true;
        }
        else {
            $('tr:nth-child(' + (aHeroPosTd[1] + 1) + ') td:nth-child(' + aHeroPosTd[0] + ')').css("opacity", " " + opacity + " ");
        }
        if (type == 'mvt' && $('tr:nth-child(' + (aHeroPosTd[1] - 1) + ') td:nth-child(' + aHeroPosTd[0] + ')').hasClass("true")) {
            aObstacle[3] = true;
        }
        else {
            $('tr:nth-child(' + (aHeroPosTd[1] - 1) + ') td:nth-child(' + aHeroPosTd[0] + ')').css("opacity", " " + opacity + " ");
        }
        if (!aObstacle[0]) {
            aReturn4Pos.push([(aHeroPosTd[0] + 1), (aHeroPosTd[1])]);
        }
        if (!aObstacle[1]) {
            aReturn4Pos.push([(aHeroPosTd[0] - 1), (aHeroPosTd[1])]);
        }
        if (!aObstacle[2]) {
            aReturn4Pos.push([(aHeroPosTd[0]), (aHeroPosTd[1] + 1)]);
        }
        if (!aObstacle[3]) {
            aReturn4Pos.push([(aHeroPosTd[0]), (aHeroPosTd[1] - 1)]);
        }
        aObstacle = [false, false, false, false];

        return aReturn4Pos;
    }

    /**
     *
     * @param aStep
     * @returns {*}
     */
    function sliceArray(aStep) {
        var aCheckArray = [];
        for (var iEachStep = 0; iEachStep < aStep.length; iEachStep++) {

            for (var iEachArray = 0; iEachArray < aStep[iEachStep].length; iEachArray++) {
                aCheckArray = aStep[iEachStep][iEachArray];

                for (var iEachPositions = 0; iEachPositions < aStep[iEachStep].length; iEachPositions++) {
                    if ((iEachArray != iEachPositions) && (aStep[iEachStep][iEachPositions][0] == aCheckArray[0]) && (aStep[iEachStep][iEachPositions][1] == aCheckArray[1])) {
                        var iIndexOf = $.inArray(aStep[iEachStep][iEachPositions], aStep[iEachStep]);
                        aStep[iEachStep].splice(iIndexOf, 1);
                    }
                }
            }
        }
        return aStep;
    }

    var iType;
    if (type == 'mvt') {
        iType = oHero.stats.mvt;
    }
    else if (type == 'skill') {
        iType = oHero.skills[skill].range;
    }
    else if (type == 'atk') {
        iType = oHero.items.lhand.range;
    }

    for (var iMvt = 0; iMvt < iType; iMvt++) {
        aStep[(iMvt + 1)] = [];

        for (var iSteps = 0; iSteps < aStep[iMvt].length; iSteps++) {      //pour la longueur de chaque case de aSteps

            var aTemp = StepAndNewTilesPosition(aStep[iMvt][iSteps], type);
            for (var iTemp = 0; iTemp < aTemp.length; iTemp++) {
                aStep[(iMvt + 1)].push(aTemp[iTemp]);
            }
        }
        aStep = sliceArray(aStep);
    }

    var aConcatenatedStep = [];
    for (var iStep = 0; iStep < aStep.length - 1; iStep++) {
        aConcatenatedStep = aStep[iStep].concat(aStep[iStep + 1]);
    }


    oHero.aSteps = aConcatenatedStep;
}

/**
 *  * Corrige le chemin tracé entre le personnage et la position du aPremovement. (la position du curseur).
 * @param Direction
 * @param oHero
 * @param aPathway
 * @param aPathCorrect
 * @param type
 * @param skill
 */
function correctPathway(Direction, oHero, aPathway, aPathCorrect, type, skill) {

    //vérifie s'il existe une direction opposée à l'argument Direction, en renvoie sa position dans le tableau aPathway
    var aOpposite = oppositeDirection(aPathway, '' + Direction + '');

    // s'il existe une direction opposée, alors :
    if (aOpposite[0]) {
        //on remet l'opacité neutre de la grille de déplacement à 0.8 pour cacher le tracé (qui était à opacité 0.5)


        //on effectue quand meme la direction pour déplacer correctement le curseur
        aPathway.push('' + Direction + '');
        moveX(aPathway[aPathway.length - 1], 'pointer');
        moveY(aPathway[aPathway.length - 1], 'pointer');

        //on supprime la direction opposée du tableau
        aPathway.splice((aOpposite[1]), 1);
        aPathway.splice(-1, 1);
        $('td').css("opacity", "1");
        if (type == 'mvt') {
            setGrid(oHero, type, '0.8');
        } else {
            setGrid(oHero, type, '0.2', skill);
        }
        //on réécrit le chemin de aPathway correctement, et on recolorie le tracé en opacité 0.5
        for (var iPath = 0; iPath < aPathway.length; iPath++) {
            switch (aPathway[iPath]) {
                case 'right':
                    aPathCorrect[0] += 1;
                    SetOpacity(aPathCorrect, 0.5);
                    break;
                case 'left':
                    aPathCorrect[0] -= 1;
                    SetOpacity(aPathCorrect, 0.5);
                    break;
                case 'up':
                    aPathCorrect[1] += 1;
                    SetOpacity(aPathCorrect, 0.5);
                    break;
                case 'down':
                    aPathCorrect[1] -= 1;
                    SetOpacity(aPathCorrect, 0.5);
                    break;
            }
        }
        //s'il n'y a pas de direction opposée, donc pas de chemin à re-tracer, on ajoute simplement la direction à la fin de aPathway
    } else {
        aPathway.push('' + Direction + '');
        moveX(aPathway[aPathway.length - 1], 'pointer');
        moveY(aPathway[aPathway.length - 1], 'pointer');
    }
}

//////////////////////////////////////////////////////////////////////////////////////
// ANIMATIONS
/////////////////////////////////////////////////////////////////////////////////////
/**
 * Déplace le personnage dont l'id est passée en argument vers gauche ou droite
 * @param aPathway
 * @param character
 */
function moveX(aPathway, character) {
    if (aPathway == 'right') {
        $('#' + character + '').animate({left: "+=" + ONE_STEP + "px"}, 'fast');
    } else if ((aPathway == 'left')) {
        $('#' + character + '').animate({left: "-=" + ONE_STEP + "px"}, 'fast');
    }
}

/**
 * Déplace le personnage dont l'id est passée en argument vers haut ou bas
 * @param aPathway
 * @param character
 */
function moveY(aPathway, character) {
    if (aPathway == 'up') {
        $('#' + character + '').animate({bottom: "+=" + ONE_STEP + "px"}, 'fast');
    } else if (aPathway == 'down') {
        $('#' + character + '').animate({bottom: "-=" + ONE_STEP + "px"}, 'fast');
    }
}

/**
 * Crée l'animation de la div dont l'id est passée en argument, à une vitesse et dans une direction donnée
 * @param id
 * @param speed
 * @param position
 * @returns {number}
 */
function animateCharacter(id, speed, position) {
    var left = 0;

    //va déplacer le background (le sprite) de -39px tous les pas de temps. -39 correspond ici à la largeur du personnage sur le sprite
    var leftCount = -39;
    var endSprite;

    //setinterval : répère la fonction tous les x millisecondes, passées dans l'argument speed
    return setInterval(function () {

        //après deux animations 2 décalages de background)
        if (left == leftCount * 2) {
            //on termine le décalage du background vers la gauche
            endSprite = true;
        } else if (left == 0) {
            endSprite = false;
        }
        if (endSprite) {
            left -= leftCount;
        } else {
            left += leftCount;
        }

        //On décalera le background de la div de façon à obtenir l'emplacement correct sur le sprite où se déplace le personnage
        switch (position) {
            case 'right':
                $('#' + id + '-content').css('background-position', left + 'px -68px');
                break;
            case 'left':
                $('#' + id + '-content').css('background-position', left + 'px -154px');
                break;
            case 'up':
                $('#' + id + '-content').css('background-position', left + 'px -260px');
                break;
            case 'down':
                $('#' + id + '-content').css('background-position', left + 'px -68px');
                break;
            default:
        }
    }, speed);
}

//////////////////////////////////////////////////////////////////////////////////////
// MISCELLANEOUS
/////////////////////////////////////////////////////////////////////////////////////
/**
 * La grille du terrain par d'en bas à gauche : [1,1], jusqu'en haut à droite [10,10].
 * Mais l'axe Y est inversé si l'on compte en <table> <tr>. Sur la grille, [1,1] correspond à la tr [10] et la td [1].
 * La fonction prend un tableau en mode "grille' et le transforme en mode "tr td"
 * @param aArray
 * @returns {Array}
 */
function translateToTdCount(aArray) {

    return [(aArray[0]), (11 - aArray[1])];     //Il faut donc inverser l'axe des Y .
}

//////////////////////////////////////////////////////////////////////////////////////
// BOOLEANS
/////////////////////////////////////////////////////////////////////////////////////
/**
 * Renvoie true s'il y a un obstacle sur le Premovement tracé par le joueur
 * @param aPremovement
 * @returns {*}
 */
/*function Obstacle(aPremovement,  aEnnemyPosition) {
 var bObstacle;

 //convertit la position "grille" en position "tr/td"
 var aCurrentTdCountPos = translateToTdCount(aPremovement);

 //si on se situe sur une case 'td' de classe "mer" ou sur l'ennemi
 if ($('tr:nth-child(' + aCurrentTdCountPos[0] + ') td:nth-child(' + aCurrentTdCountPos[1] + ')').hasClass('sea') || (aPremovement[0] == aEnnemyPosition[0] && aPremovement[1] == aEnnemyPosition[1])) {
 bObstacle = true;
 alert('obstacle');
 }

 //on renvoie un booléen. S'il n'est pas passé en true, renvoie false
 return bObstacle;
 }
 */
/**
 * Renvoie true s'il existe une direction opposée à celle passée en argument, DANS le tableau passé en argument.
 * Renvoie aussi la position de cette direction si elle existe
 * @param aPathway
 * @param cas
 * @returns {Array}
 */
function oppositeDirection(aPathway, cas) {
    var aOpposite = [];
    aOpposite[0] = false;
    for (var i = ((aPathway.length) - 1); i >= 0; i--) {
        if (aPathway[i] == 'down' && cas == 'up') {
            aOpposite[0] = true;
            aOpposite[1] = i;
            break;
        } else if (aPathway[i] == 'up' && cas == 'down') {
            aOpposite[0] = true;
            aOpposite[1] = i;
            break;
        } else if (aPathway[i] == 'right' && cas == 'left') {
            aOpposite[0] = true;
            aOpposite[1] = i;
            break;
        } else if (aPathway[i] == 'left' && cas == 'right') {
            aOpposite[0] = true;
            aOpposite[1] = i;
            break;
        }
    }
    return aOpposite;
}

/**
 * Calcule si l'ennemi est à portée du personnage
 * @param aPosition
 * @param oEnnemyTeam
 * @returns {oEnnemy.position|*}
 */
function ennemyAtReach(aPosition, oEnnemyTeam) {

    for (var key in oEnnemyTeam) {
        var oEnnemy = oEnnemyTeam[key];
        if (aPosition[0] == oEnnemy.position[0] && aPosition[1] == oEnnemy.position[1]) {
            return oEnnemy.position;
        }
    }
    return [];
}













