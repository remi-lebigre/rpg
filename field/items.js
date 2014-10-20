/**
 * Created by Remi Lebigre & FoodySan
 * 06-2014
 */

//////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS & ARRAYS
/////////////////////////////////////////////////////////////////////////////////////

// 1 Tile  == 1
//Chaque case fait 60px : un pas fera 60px (pour déplacer le personnage).
var ONE_STEP = 60;

//Object type de terrains
// Nom du terain, couleur de fond, obstacle:booléen
var oFields = {
    //Hauteur du terrain
    FieldHeight: 10,

    //Largeur du terrain
    FieldWidth: 10,

    sea: {
        name: 'sea',
        background: 'background: #31B9B9',
        obstacle: true
    },
    sand: {
        name: 'sand',
        background: 'background: #DFCA2D',
        obstacle: false
    },
    plain: {
        name: 'plain',
        background: 'background: #5DC61E',
        obstacle: false
    },
    river: {
        name: 'river',
        background: 'background: #45D2CB',
        obstacle: false
    },
    mountain: {
        name: 'mountain',
        background: 'background: #80582F',
        obstacle: true
    },
    road: {
        name: 'road',
        background: 'background: rgb(100,100,100)',
        obstacle: false
    }
};

//Object objets
// Nom de l'objet, multiplicateur de dégâts
var oItem = {
    sword: {
        name: 'Wooden Sword',
        type: 'sword',
        mult: '120',
        range: 1
    },
    stick: {
        name: 'Wooden Stick',
        type: 'stick',
        mult: '100',
        range: 1
    },
    bow: {
        name: 'Wooden Bow',
        type: 'bow',
        mult: '120',
        range: 4
    }
};

//Object skills
// Nom de la skill, multiplicateur de dégâts, conommation de MP
var oSkills = {
    slash: {
        id: 'slash',
        name: 'Slash',
        type: 'atk',
        mult: 120,
        mpconso: 5,
        ff: false,
        cd: 0,
        range: 1,
        zone: [
            [0, 2],
            [0, 2]
        ]
    },
    firebolt: {
        id: 'firebolt',
        name: 'FireBolt',
        type: 'matk',
        mult: 200,
        mpconso: 10,
        ff: false,
        cd: 0,
        range: 3,
        zone: [
            [0, 0],
            [0, 0]
        ]
    },
    icebolt: {
        id: 'icebolt',
        name: 'IceBolt',
        type: 'matk',
        mult: 1200,
        mpconso: 10,
        ff: false,
        cd: 0,
        range: 2,
        zone: [
            [0, 0],
            [0, 0]
        ]
    }
};


//////////////////////////////////////////////////////////////////////////////////////
// CHARACTERS
/////////////////////////////////////////////////////////////////////////////////////

//Object main character
var oHero = {
    id: 'hero',
    position: [5, 5],
    name: 'Bibi',
    stats: {
        hpmax: 200,
        hp: 165,
        mpmax: 50,
        mp: 50,
        atk: 30,
        matk: 40,
        mdef: 50,
        def: 20,
        vts: 3,
        mvt: 3
    },
    items: {
        lhand: oItem.stick
    },
    skills: {
        firebolt: oSkills.firebolt,
        icebolt: oSkills.icebolt
    },
    aSteps: [],
    animate: animateCharacter('hero', 500, 'right'),
    spriteOffset: [10,0]
};

//Object side character
var oSide = {
    id: 'side',
    position: [3, 8],
    name: 'Henry',
    stats: {
        hpmax: 300,
        hp: 300,
        mpmax: 30,
        mp: 20,
        atk: 30,
        matk: 20,
        mdef: 60,
        def: 60,
        vts: 2,
        mvt: 2
    },
    items: {
        lhand: oItem.sword
    },
    skills: {
        slash: oSkills.slash
    },
    aSteps: [],
    animate: animateCharacter('side', 500, 'right'),
    spriteOffset: [10,0]

};

//Object ennemi
var oEnnemy = {
    id: 'ennemy',
    position: [9, 3],
    name: 'OUALLEZ',
    stats: {
        hpmax: 100,
        hp: 65,
        mpmax: 50,
        mp: 35,
        atk: 20,
        matk: 20,
        mdef: 20,
        def: 20,
        vts: 2,
        mvt: 2
    },
    items: {
        lhand: oItem.sword
    },
    skills: {
        slash: oSkills.slash
    },
    aSteps: [],
    animate: animateCharacter('ennemy', 500, 'left'),
    spriteOffset: [10,0]

};

//Object side ennemy
var oBad = {
    id: 'bad',
    position: [8, 2],
    name: 'Brad',
    stats: {
        hpmax: 200,
        hp: 185,
        mpmax: 50,
        mp: 50,
        atk: 60,
        matk: 20,
        mdef: 20,
        def: 20,
        vts: 5,
        mvt: 5
    },
    items: {
        lhand: oItem.sword
    },
    skills: {
        slash: oSkills.slash
    },
    aSteps: [],
    animate: animateCharacter('bad', 500, 'left'),
    spriteOffset: [10,0]

};

var oHeroTeam = {};
var oEnnemyTeam = {};


//////////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
/////////////////////////////////////////////////////////////////////////////////////

/*
//Démarre dans le menu principal
var bInActionMenu = true;

//Ne démarre pas dans le menu attaque
var bInAttackMenu = false;

*/