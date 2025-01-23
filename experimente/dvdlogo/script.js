/**
 * Initializes the game state.<br/>
 * ⚠️ Run only once and only if <c>window.gameCanvas</c> exists.<br/>
 * @todo Refactor this to be more extensible and create a 
 * <c>addGameObject</c> Method for <c>Canvas</c>.
 */
function initGame() {
  gameCanvas.gameObjects.push(
    new BouncyObject( document.getElementById("dvd1"), gameCanvas )
  ) ;
  
  var secondLogo = new BouncyObject( document.getElementById("dvd2"), gameCanvas ) ;
  secondLogo.dir.y = -1 ;
  gameCanvas.gameObjects.push( secondLogo ) ;
  
  var thirdLogo = new BouncyObject( document.getElementById("dvd3"), gameCanvas ) ;
  thirdLogo.dir.x = -1 ;
  gameCanvas.gameObjects.push( thirdLogo ) ;
  
  var fourthLogo = new BouncyObject( document.getElementById("dvd4"), gameCanvas ) ;
  fourthLogo.dir.x = -1 ;
  fourthLogo.dir.y = -1 ;
  gameCanvas.gameObjects.push( fourthLogo ) ;
  
  var fifthLogo = new BouncyObject( document.getElementById("dvd5"), gameCanvas ) ;
  fifthLogo.dir.x = -1 ;
  fifthLogo.dir.y = -1 ;
  gameCanvas.gameObjects.push( fifthLogo ) ;
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