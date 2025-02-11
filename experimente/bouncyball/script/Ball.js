'use strict';
/**
 * 
 */
class Ball {

  static speedFixedValue  = 200 ;
  static speedRandRange   = 400 ;

  static frameRate = 1000/60 ;
  static timeOflastFrame = Date.now() ;
  static timeSinceLastFrame = 0 ;

  static balls = [] ;

  static updateAll() {
    Ball.timeSinceLastFrame = Date.now() - Ball.timeOflastFrame ;
    Ball.balls.forEach((ball1,i)=>{
        ball1.aktualisieren() ;
        Ball.balls.slice(i).forEach(ball2=>{
          if( !(ball1.posX == ball2.posX && ball1.posY == ball2.posY) )
            ball1.kollidiereMitBall( ball2 ) ;
          }
        )
      }
    ) ;
    Ball.timeOflastFrame = Date.now() ;
  }

  /**
   * 
   * @param {PointerEvent} event 
   */
  static throw( event ) {
    console.log( event ) ;
    Ball.balls.push( new Ball( event.target, event.layerX, event.layerY ) ) ;
  }

  /**
   * 
   * @param {HTMLElement} domElement 
   */
  constructor( domElement, posX = -1, posY = -1 ) {
    /** @type {HTMLElement} */
    this.domElement = domElement ;

    /** @type {HTMLDivElement} */
    this.anzeige = document.createElement('div') ;
    this.anzeige.className = "ball" ;

    this.domElement.appendChild( this.anzeige ) ;

    /** @type {Number} */
    this.posX = posX != -1 ? posX : Math.floor(Math.random() *
      this.domElement.clientWidth - this.anzeige.clientWidth ) ;

    /** @type {Number} */
    this.posY = posY != -1 ? posY : Math.floor(Math.random() *
      this.domElement.clientHeight - this.anzeige.clientHeight ) ;

    /** @type {Number} */
    this.dirX = Math.ceil(Math.random() * Ball.speedRandRange +
      Ball.speedFixedValue ) * (Math.random()>0.5 ? 1 : -1 ) ;

    /** @type {Number} */
    this.dirY = Math.ceil(Math.random() * Ball.speedRandRange +
      Ball.speedFixedValue ) * (Math.random()>0.5 ? 1 : -1 ) ;

    Ball.balls.push( this ) ;
  }

  get sector () {
    return [
      Math.floor(this.anzeige.clientLeft / (this.domElement.clientWidth/2)),
      Math.floor(this.anzeige.clientTop / (this.domElement.clientHeight/2)),
    ] ;
  }

  aktualisieren () {
    this.bewegen() ;
    this.kollidieren() ;
    this.anzeigen() ;
  }

  bewegen() {
    this.posX += this.dirX * Ball.timeSinceLastFrame / 1000 ;
    this.posY += this.dirY * Ball.timeSinceLastFrame / 1000 ;
  }

  kollidieren() {
    this.kollidiereMitSpielfeld() ;
  }

  /**
   * 
   * @param {Ball} ball 
   */
  /**
   * The Ball attempts to collide with another Ball.<br/>
   * If it collides, this Ball will be re-positioned the shortest 
   * distance out of the Ball it collided with and then both Ball' 
   * dir(ection) property on that axis will be inverted.
   * @param {Ball} gameObject - Another Ball.
   * @return {Boolean} if it collided with the other Ball.
   */
  kollidiereMitBall( ball ) {
    
    let intersection = new Rectangle(
      this.posX,
      this.posY,
      this.anzeige.clientWidth,
      this.anzeige.clientHeight
      ).Intersection( new Rectangle(
        ball.posX,
        ball.posY,
        ball.anzeige.clientWidth,
        ball.anzeige.clientHeight
        )
    ) ;
    if( intersection == null ) { return false ; }
    
    if( intersection.width < intersection.height ) {
      if( this.anzeige.clientLeft == intersection.left ) {
        this.posY += intersection.width/2 + 1 ;
        ball.posY -= intersection.width/2 ;
        this.dirX = Math.abs(this.dirX) ;
        ball.dirX = -Math.abs(ball.dirX) ;
      } else {
        this.posY -= intersection.width/2 + 1 ;
        ball.posY += intersection.width/2 ;
        this.dirX = -Math.abs(this.dirX) ;
        ball.dirX = Math.abs(ball.dirX) ;
      }
    } else {
      if( this.anzeige.clientTop == intersection.top ) {
        this.posY += intersection.height/2 + 1 ;
        ball.posY -= intersection.height/2 ;
        this.dirY = Math.abs(this.dirY) ;
        ball.dirY = -Math.abs(ball.dirY) ;
      } else {
        this.posY -= intersection.height/2 + 1 ;
        ball.posY += intersection.height/2 ;
        this.dirY = -Math.abs(this.dirY) ;
        ball.dirY = Math.abs(ball.dirY) ;
      }
    }
    return true ;
  }

  kollidiereMitSpielfeld() {
    if(this.posX < 0 ||
      this.posX > this.domElement.clientWidth - this.anzeige.clientWidth
    ) {
      this.dirX *= -1 ;
      this.posX = Math.max( Math.min(
        this.posX,
        this.domElement.clientWidth - this.anzeige.clientWidth
      ), 0 ) ;
      this.umfaerben() ;
    }

    if(
      this.posY < 0 ||
      this.posY > this.domElement.clientHeight - this.anzeige.clientHeight
    ) {
      this.dirY *= -1 ;
      this.posY = Math.max( Math.min(
        this.posY,
        this.domElement.clientHeight - this.anzeige.clientHeight
      ), 0 ) ;
      this.umfaerben() ;
    }
  }

  anzeigen() {
    this.anzeige.style.left = `${this.posX}px` ;
    this.anzeige.style.top  = `${this.posY}px` ;
  }

  umfaerben() {
    this.anzeige.style.backgroundColor = `#${
      (Math.floor(Math.random()*96)+160).toString(16)
    }${
      (Math.floor(Math.random()*176)+80).toString(16)
    }${
      (Math.floor(Math.random()*136)+120).toString(16)
    }` ;
  }

}