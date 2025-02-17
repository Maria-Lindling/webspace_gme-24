"use strict" ;
function startGame() {
  window.removeEventListener('load',startGame) ;
  window.game.initialize() ;
}

function uploadScore( score ) {
  dispatchRequest('uploadScore',score) ;
}