/**
 * Initializes the game state.<br/>
 * ⚠️ Run only once and only if <c>window.gameCanvas</c> exists.<br/>
 * @todo Refactor this to be more extensible and create a 
 * <c>addGameObject</c> Method for <c>Canvas</c>.
 */
function initGame() {
  const nodeList = window.gameCanvas.domElement.getElementsByClassName("dvd") ;
  
  for( let i = 0 ; i < nodeList.length ; i++ ){
    let item = nodeList.item(i) ;
    if( item != null ) {
      let dvd = new BouncyObject( nodeList.item(i), gameCanvas ) ;
      dvd.dir.x = Math.floor( Math.random() * 2 ) > 0 ? 1 : -1 ;
      dvd.dir.y = Math.floor( Math.random() * 2 ) > 0 ? 1 : -1 ;
      gameCanvas.gameObjects.push( dvd ) ;
    }
  }
}

window.animate = function () {
  gameCanvas.CheckCollisions() ;
  gameCanvas.gameObjects.forEach(item=>{item.Update() ;}) ;
  
  window.requestAnimationFrame(window.animate);
}

window.onload = function() {
  window.gameCanvas  = new Canvas( document.getElementById("black") ) ;
  initGame()
  window.requestAnimationFrame(window.animate);
}