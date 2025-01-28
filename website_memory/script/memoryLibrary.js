"use strict" ;

/** @namespace */
const memoryLibrary = {
  
  /**
   * Motif names of the images available for use as cards.<br/>
   * Each must conform to a 4:3 aspect ratio and the filename must be
   * "[motif].jpg", or else it will not work.
   * @type {Array.<String>}
   */
  motive: ['abend', 'andendorf', 'andenstrasse', 'baltimore', 'blockhaus',
    'bus','chambord', 'cockpit', 'dorfstrasse', 'felsen', 'fluss', 'gorchfock',
    'grabmal', 'hotel', 'insel', 'karibikdorf', 'landung', 'lastesel'],

  /**
  * The entry-point for the program.
  */
  main: function () {
    window.removeEventListener('load', memoryLibrary.main) ;
    let playArea = document.getElementById("playArea") ;
    let output   = document.getElementById("output") ;
    memoryLibrary.gameSetup( playArea, output ) ;
  },
  
  /**
   * @deprecated Not used anywhere.
   * @param {Array.<String>} liste
   * @param {Boolean} [nummeriert] - produces an &lt;ol&gt; if set to true and an
   * &lt;ul&gt; if set to false or not specified
   * @returns {Node}
   */
  auflisten: function ( liste, nummeriert = false ) {
    let domListe = document.createElement( (nummeriert) ? "ol" : "ul" ) ;
    for( let eintrag of liste ) {
      domListe.appendChild( document.createElement("li") ).innerText = eintrag ;
    }
    return domListe ;
  },

  /**
   * Swaps the values at index1 and index2 within an Array.<br/>
   * ⚠️ Warning! This returns the original array, which is mutated by this
   * function!
   * @param {Array.<*>} values
   * @param {Number} index1
   * @param {Number} index2
   * @returns {Array.<*>}
   */
  swapValues: function (values, index1, index2) {
    let tmp = values[index1] ;
    values[index1] = values[index2] ;
    values[index2] = tmp ;
    return values ;
  },

  /**
   * Shuffles the provided Array and returns a new Array that has been
   * randomized.<br/>
   * This function does not mutate the original Array.
   * @param {Array.<*>} values
   * @param {Number} [thoroughness]
   * @returns {Array.<*>}
   */
  shuffle: function (values, thoroughness = 3) {
    const result = values.slice() ;
    for(let cycle = 0; cycle < thoroughness; cycle++) {
      for(let i = result.length - 1; i > 0 ; i--) {
        let index = Math.floor( Math.random() * result.length ) ;
        if( i != index ) {
          memoryLibrary.swapValues(result, i, index) ;
        }
      }
    }
    return result ;
  },

  /**
  * Handles PointerEvent instances that ocurred within the play area.<br/>
  * Will stop propagation if the event matches a valid card, but otherwise will
  * let the event bubble upwards.<br/>
  * Fires a "memoryPairSolved" Event if a match is found.
  * @see memoryLibrary.handleSolvedPair
  * @param {PointerEvent} event
  */
  handleClick: function ( event ) {
    let card = window.game.findCard( event ) ;
    if( card == null) { return ; }
    event.stopPropagation() ;

    if ( !window.game.tryMatch( card ) ) { return ; }

    var newEvent = new Event(
      "memoryPairSolved",
      { bubbles: true, cancelable: false }
    ) ;

    newEvent.motiv = card.motiv ;

    newEvent.cards = window.game.cards.filter( (item) => {
      return (item.motiv == card.motiv) ;
    } ) ;

    newEvent.parentEvent = event ;

    newEvent.listElement = Array.from(
      document.querySelectorAll("#output > ul > li")
    ).filter(
      (item) => {
        return (item.innerText == card.motiv) ;
    } ).pop() ;

    document.dispatchEvent( newEvent ) ;
  },

  /**
  * Handles what to do when the user successfully matches a pair of memory
  * cards.<br/>
  * Fires a "memoryGameSolved" Event if all cards in the current MemoryGame
  * instance are marked as solved.
  * @see memoryLibrary.handleGameSolved
  * @param {Event} event 
  */
  handleSolvedPair: function ( event ) {
    /* console.log( event ) ; */
    event.listElement.setAttribute("style","background-color: red") ;
    if ( window.game.isSolved ) {
      var newEvent = new Event(
        "memoryGameSolved",
        { bubbles: true, cancelable: false }
      ) ;
      newEvent.parentEvent = event ;
      document.dispatchEvent( newEvent ) ;
    }
  },

  /**
  * Handles what to do when the user successfully solves the game.
  * @param {Event} event 
  */
  handleGameSolved: function ( event ) {
    /* console.log( event ) ; */
    /* var intervalLoop = window.setInterval( victoryAnimation, 33.3334 ) ; */
    let playTime = window.game.elapsedTime ;
    alert(
      "Congratulations! You are a master of memory.\n" +
      "You beat the game in just " +
      ( playTime.minutes > 0 ?
        `${playTime.minutes} minute${playTime.minutes != 1 ? "s" : ""} and ` :
        "" ) +
      `${playTime.seconds} second${playTime.seconds != 1 ? "s" : ""}!`
    ) ;
    if( confirm("Do you want to play again?") ) {
      memoryLibrary.gameSetup(
        document.getElementById("playArea"),
        document.getElementById("output")
      ) ;
    } else {
      memoryLibrary.cleanup() ;
    }
  },

  /**
  * Lists the names of all the available memory card motifs in the aside.
  * @param {HTMLElement} output 
  */
  populateOutput: function ( output ) {
    output.appendChild( document.createElement("ul") ) ;
    for( let motiv of memoryLibrary.motive ) {
      output.firstElementChild.appendChild( document.createElement("li") ) ;
      output.firstElementChild.lastElementChild.innerText = motiv ;
    }
  },

  /**
  * Adds game-relevant event-listeners to the document and play area.
  * @param {HTMLElement} playArea 
  */
  populateEventListeners: function ( playArea ) {
    playArea.addEventListener('click', memoryLibrary.handleClick) ;
    document.addEventListener('memoryPairSolved', memoryLibrary.handleSolvedPair) ;
    document.addEventListener('memoryGameSolved', memoryLibrary.handleGameSolved) ;
  },

  /**
  * Creates a new play area and game objects to play with.
  * @see memoryLibrary.cleanup
  * @param {HTMLElement} playArea 
  * @param {HTMLElement} output 
  */
  gameSetup: function ( playArea, output ) {
    memoryLibrary.cleanup() ;
    window.game = new MemoryGame(playArea) ;
    memoryLibrary.populateOutput( output ) ;
    memoryLibrary.populateEventListeners( playArea ) ;
  },

  /**
  * Cleans up all HTML-Elements from the play area.
  */
  cleanup: function () {
    Array.from(document.getElementById("playArea").childNodes)
      .forEach( (child) => {child.remove()} ) ;
    Array.from(document.getElementById("output").childNodes)
      .forEach( (child) => {child.remove()} ) ;
    document.getElementById("playArea").removeEventListener('click', memoryLibrary.handleClick) ;
    document.removeEventListener('memoryPairSolved', memoryLibrary.handleSolvedPair) ;
    document.removeEventListener('memoryGameSolved', memoryLibrary.handleGameSolved) ;
  }
}