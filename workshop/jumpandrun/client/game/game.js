"use strict" ;
import Coordinate from "/client/geometry/Coordinate.js";
import Vector from "/client/geometry/Vector.js";
import Rectangle from "/client/geometry/Rectangle.js";
import Actor from "./Actor.js";
import Level from './Level.js';

/**
 * @namespace
 */
window.game = {
  /*** PUBLIC FIELDS ***/

  /*** PRIVATE FIELDS ***/

  _elementIdLibrary: {
    "images":"imgsources"
  },

  _imageLibrary: {},

  // Die Map als Array aus Strings, deren einzelne Zeichen die Tiles repräsentieren
  _map: [
    'DDDDZZDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD', // 00
    'M                                                M', // 01
    'M                                                M', // 02
    'M    PPPPPPP             PPPPP         T         M', // 03
    'M                                     PPPP       M', // 04
    'M              PPPPPPP                           M', // 05
    'M                        PPPPPPP                 M', // 06
    'M         T                    T      PPPPP      M', // 07
    'M       PPPPP                  PPPPP           T M', // 08
    'A                   PPPPPPP                  PPPPM', // 09
    'AGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGM', // 10
    'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', // 11
  //'01234567890123456789012345678901234567890123456789'
  // 0         1         2         3         4
  ],

  _tileSize: 40,

  _tiles: 'ADMPSEBGTZ',

  _blocker: 'BDEMPS',

  _playArea: null,

  _infoDisplay: null,

  _currentLevel: null,
  
  /*** PUBLIC FUNCTIONS ***/

  start: () => {
    window.setInterval( game.update, 1000/30 ) ;
  },

  initialize: () => {
    // Festhalten der benötigten HTML-Elemente aus dem <body>
    game._playArea     = document.getElementById("playarea") ;
    game._infoDisplay  = document.getElementById("infodisplay") ;

    let imgsources = document.getElementById(game._elementIdLibrary.images) ;
    game._loadImageToHTML(
      imgsources,
      "/client/hintergrund.png",
      "background",
      { "alt":"Background", "id": "gamebackground" }
    ) ;

    game._loadImageToHTML(
      imgsources,
      "/client/tileset.png",
      "tileset",
      { "alt":"Tileset", "id": "tileset" }
    ) ;

    game._loadImageToHTML(
      imgsources,
      "/client/laufbursche.png",
      "spritesheet",
      { "alt":"Spritesheet: Laufbursche", "id": "spritesheet" }
    ) ;

    game._currentLevel = new Level( document.getElementById("playarea") ) ;
    game._currentLevel.loadMap(
      game._map,
      game._imageLibrary["tileset"],
      game._tileSize,
      game._tiles,
      game._blocker
    ) ;
    game._currentLevel.setBackground( game._imageLibrary["background"] ) ;
    logToServer( `Created a canvas of size ${game._currentLevel.width}x${game._currentLevel.height} (pixels).` ) ;
  },

  update: () => { game._currentLevel.draw() ; },

  /*** PRIVATE FUNCTIONS ***/

  /**
   * 
   * @param {HTMLElement} domParent 
   * @param {string} imagePath 
   * @param {string} name 
   * @param {Object} attributes
   * @param {string} attributes.alt
   * @param {string} attributes.id
   */
  _loadImageToHTML: ( domParent, imagePath, name, attributes = {}) => {
    let imgElement = document.createElement( 'img' ) ;

    imgElement.setAttribute('src', imagePath) ;
    
    if( !(attributes?.alt) ) {
      imgElement.setAttribute('alt', name) ;
    }

    for(let [key,value] of Object.entries(attributes) ) {
      imgElement.setAttribute( key, value ) ;
    };

    game._imageLibrary[name] = imgElement ;
    domParent.appendChild( imgElement ) ;
  }

} ;


function logToServer( msg ) {
  var newEvent = new Event(
    "logToServer",
    { bubbles: true, cancelable: false }
  ) ;
  newEvent.msgData = msg ;
  let timestamp = new Date() ;
  console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] >>> "${newEvent.msgData}"`);
  document.dispatchEvent( newEvent ) ;
}

export default null ;