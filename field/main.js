/**
 * Created by Remi Lebigre & FoodySan
 * 06-2014
 */

$(document).ready(function () {

//////////////////////////////////////////////////////////////////////////////////////
// SUBMIT
/////////////////////////////////////////////////////////////////////////////////////
    //Récupère les valeurs du form
    $('form').submit(function (event) {
        oHero.stats.mvt = parseInt($('#mvt').val());
        setHUD(oHero, '#hud');
        event.preventDefault();
    });

//////////////////////////////////////////////////////////////////////////////////////
// FIELD
/////////////////////////////////////////////////////////////////////////////////////
    //initialise les lignes 'tr' du terrain par le nombre FieldHeight
    setFieldHeight(oFields.FieldHeight);

    //initialise les colonnes/cases 'td' du terrain par le nombre FieldWidth
    setFieldWidth(oFields.FieldWidth);

    // rajoute la class 'mer' à toutes les td du bord de la map
    // change son background-color
    setBorders();

    // rajoute la class 'river' depuis la position Argument1, Argument2, jusqu'aux bords droits et bas du terrain
    // change son background-color
    setRiver(6, 4, oFields.FieldWidth, oFields.FieldHeight);

    // rajoute la class 'river' de taille Argument1, Argument2, depuis la position Argument3, Argument4
    // change son background-color
    setDesert(5, 5, 4, 1);

//////////////////////////////////////////////////////////////////////////////////////
// INITIALIZE POSITIONS
/////////////////////////////////////////////////////////////////////////////////////
  /*  //Positionne l'ennemi
    setStartPosition(oEnnemy.position, 'ennemy', 10, 0);

    //Initialise l'animation du héros
    setStartPosition(oHero.position, 'hero', 10, 0);

    //Initialise l'animation du héros
    setStartPosition(oBad.position, 'bad', 10, 0);

    //Initialise l'animation du héros
    setStartPosition(oSide.position, 'side', 10, 0);*/

    //rajoute dans l'objet o____Team l'objet personnage

    initialize();

//////////////////////////////////////;////////////////////////////////////////////////
// MAIN FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////

    $('#mainInfos').prepend("<div id='turn'>TOUR : " + iMainTurn + "</div>");
    MainMenu(oHeroTeam, oEnnemyTeam);

//////////////////////////////////////;////////////////////////////////////////////////
//MISCELLANEOUS
/////////////////////////////////////////////////////////////////////////////////////



});
