"use strict" ;
import Coordinate from "/client/geometry/Coordinate.js";
import Vector from "/client/geometry/Vector.js";
import Rectangle from "/client/geometry/Rectangle.js";
import Actor from "./Actor.js";
import Level from './Level.js';
import AssetManager from './AssetManager.js';

/**
 * @namespace
 */
window.game = {
  /*************************/
  /*** PUBLIC FIELDS     ***/



  /*************************/
  /*** PRIVATE FIELDS    ***/

  _assetManager: null,

  _running: false,

  _currentLevel: null,

  // setup of the game's controls, which indicates if a control-key is being
  // held down by the user
  _controls: {
    "left":  false,
    "right": false,
    "jump":  false
  },
  
  _previousFrame: new Date(),

  /*************************/
  /*** PUBLIC FUNCTIONS  ***/

  update: () => {
    let deltaTime = new Date() - game._previousFrame ;

    if( game._running ) {

      game._currentLevel.update( deltaTime ) ;

      window.requestAnimationFrame( game.update ) ;
    }
    game._previousFrame = new Date() ;
  },

  start: () => {
    game._currentLevel.drawMap() ;
    // begins the game-loop with regular updates of all game-objects
    window.requestAnimationFrame( game.update ) ;
  },

  initialize: () => {
    // Festhalten der benötigten HTML-Elemente aus dem <body>
    /* game._playArea     = document.getElementById("playarea") ;
    game._infoDisplay  = document.getElementById("infodisplay") ; */

    game._assetManager = new AssetManager() ;
    game.requestNewMap( null ) ;
  },

  requestNewMap: ( data ) => {
    let event = new Event( "changeMap", { bubbles: true, cancelable: false } ) ;
    event.requestData = data ;
    let timestamp = new Date() ;
    console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] >>> "${event.requestData}"`);
    document.dispatchEvent( event ) ;

    game._running = false ;
    game._currentLevel = null ;
    window.removeEventListener( 'keydown', game._inputControl ) ;
    window.removeEventListener( 'keyup',   game._inputControl ) ;
  },

  loadNewMap: ( data ) => {
    game._currentLevel = new Level( document.getElementById("playarea") ) ;
    game._currentLevel.loadMap(
      data.map,
      game._assetManager.imageLibrary[data.tileset],
      data.tileSize,
      data.tiles,
      data.blocker,
      data.nonstatic,
      data.collectible
    ) ;
    game._currentLevel.setBackground( game._assetManager.imageLibrary[data.background] ) ;
    game.dispatchRequest( 'logToServer', `Created a canvas of size ${game._currentLevel.width}x${game._currentLevel.height} (pixels).` ) ;
    
    game._currentLevel.setPlayerCharacter(
      new Actor( {
        pos: new Coordinate(400,360),
        speed: 240,
        jumpForce: 960,
        spritesheet: {
          element: game._assetManager.imageLibrary['spritesheet'],
          width: 62,
          height: 70,
        },
      } )
    ) ;

    window.addEventListener( 'keydown', game._inputControl ) ;
    window.addEventListener( 'keyup',   game._inputControl ) ;

    game._running = true ;
    console.log( game._currentLevel ) ;
    window.setTimeout( game.start, 200 ) ;
  },
  
  /*************************/
  /*** PRIVATE FUNCTIONS ***/

  _inputControl: ( event ) => {
    switch( event.keyCode ) {
      case 37: case 65:
        game._controls.left = (event.type == 'keydown') ; break ;
      case 39: case 68:
        game._controls.right = (event.type == 'keydown') ; break ;
      case 32: case 38: case 87:
        game._controls.jump = (event.type == 'keydown') ; break ;
      case 27:
        game._running = false ; break ;
      default:
        console.log(`invalid keyCode: ${event.keyCode}`) ;
    }
  },

  dispatchRequest: ( requestType, requestData ) => {
    let event = new Event( requestType, { bubbles: true, cancelable: false } ) ;
    event.requestData = requestData ;
    let timestamp = new Date() ;
    console.log( `[${('0'+timestamp.getHours()).slice(-2)}:${('0'+timestamp.getMinutes()).slice(-2)}:${('0'+timestamp.getSeconds()).slice(-2)}] >>> "${event.requestData}"`);
    document.dispatchEvent( event ) ;
  },
}

export default null ;