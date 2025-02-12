"use strict" ;
function startGame() {
  window.removeEventListener('load',startGame) ;
  window.game.initialize() ;
  window.game.start() ;
}

function uploadScore( score ) {
  dispatchRequest('uploadScore',score) ;
}