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
    memoryLibrary.createNewGameContols() ;
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
      `${playTime.seconds} second${playTime.seconds != 1 ? "s" : ""}!` +
      `\nRevealing all ${Math.floor(window.game.cards.length/2)} pairs took ` +
      `you ${window.game.attempts} attempts.`
    ) ;

    var newEvent = new Event(
      "uploadScore",
      { bubbles: true, cancelable: false }
    ) ;
    newEvent.scoreData = `User scored ${
      Math.floor(
        Math.pow( window.game.cards.length, 3 ) /
        window.game.attempts /
        playTime.raw *
        10000
      )
    } points!` ;
    console.log("local >>> " + newEvent.scoreData ) ;
    document.dispatchEvent( newEvent ) ;
    memoryLibrary.cleanup() ;
    memoryLibrary.createNewGameContols() ;
  },

  /**
   * Lists the names of all the available memory card motifs in the aside.
   * @param {HTMLElement} output
   * @param {Number} pairs
   */
  populateOutput: function ( output, pairs ) {
    output.appendChild( document.createElement( "ul" ) ) ;
    memoryLibrary.motive.slice(
      (pairs > 0) ? Math.max(memoryLibrary.motive.length-pairs,0) : 0
    ).forEach( motif => {
      output.firstElementChild
        .appendChild( document.createElement("li" ) )
        .innerText = motif ;
    } ) ;
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
   * @param {Number} pairs 
   */
  gameSetup: function ( pairs = -1 ) {
    memoryLibrary.cleanup() ;
    let body = document.getElementsByTagName("body")[0] ;
    let playArea = body.appendChild( document.createElement( "main" ) ) ;
    playArea.setAttribute("id","playArea") ; 
    let output = body.appendChild( document.createElement( "aside" ) ) ;
    output.setAttribute("id","output") ; 
    window.game = new MemoryGame( playArea, pairs ) ;
    memoryLibrary.populateOutput( output, pairs ) ;
    memoryLibrary.populateEventListeners( playArea ) ;
  },

  /**
   * Cleans up all HTML-Elements from the play area.
   */
  cleanup: function () {
    document.getElementById("playArea")?.remove() ;
    document.getElementById("output")?.remove() ;
    document.removeEventListener('memoryPairSolved', memoryLibrary.handleSolvedPair) ;
    document.removeEventListener('memoryGameSolved', memoryLibrary.handleGameSolved) ;
  },

  /**
   * Creates a button that starts a new game.
   */
  createNewGameContols: function () {
    let ngForm = document.getElementsByTagName("body")[0]
      .appendChild( document.createElement( "form" ) ) ;
    ngForm.appendChild( document.createElement( "input" ) ) ;
    ngForm.lastElementChild.setAttribute( "type","range" ) ;
    ngForm.lastElementChild.setAttribute( "name","pairs" ) ;
    ngForm.lastElementChild.setAttribute( "min","1" ) ;
    ngForm.lastElementChild.setAttribute( "max","18" ) ;
    ngForm.lastElementChild.value = 10 ;

    ngForm.appendChild( document.createElement( "output" ) ) ;
    ngForm.lastElementChild.setAttribute( "name","pairsOut" ) ;
    ngForm.lastElementChild.setAttribute( "for","pairs" ) ;
    ngForm.lastElementChild.value = 10 ;
    ngForm.setAttribute( "oninput", "pairsOut.value=parseInt(pairs.value)" ) ;

    ngForm.appendChild( document.createElement( "button" ) ) ;
    ngForm.lastElementChild.innerText = "Start New Game" ;
    ngForm.lastElementChild.addEventListener( "click", memoryLibrary.newGameViaButton ) ;
  },

  /**
   * Starts a new game.
   */
  newGameViaButton: function ( event ) {
    event.stopPropagation() ;
    memoryLibrary.gameSetup( parseInt( document.getElementsByName("pairs")[0].value ) ) ;
    event.target.parentElement.remove() ;
  }
}