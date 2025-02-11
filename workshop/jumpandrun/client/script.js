"use strict" ;
function startGame() {
  window.removeEventListener('load',startGame) ;
  window.game.initialize() ;
  window.game.start() ;
}

function uploadScore( score ) {
  var newEvent = new Event(
    "uploadScore",
    { bubbles: true, cancelable: false }
  ) ;
  newEvent.scoreData = `User scored ${score} points!` ;
  let timestamp = new Date() ;
  console.log( `[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}] >>> "${newEvent.scoreData}"`);
  document.dispatchEvent( newEvent ) ;
}