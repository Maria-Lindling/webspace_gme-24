/**
 * A two-dimensional set of coordinates.
 * @constructor
 * @param {number} posX - Horizontal coordinate.
 * @param {number} posY - Vertical coordinate.
 */
class Coordinate {
  
  constructor(posX, posY) {
    this.x = posX ;
    this.y = posY ;
  }
}

/**
 * A two-dimensional vector. Positive values point towards the bottom right.
 * @constructor
 * @param {number} dirX - Horizontal direction.
 * @param {number} dirY - Vertical direction.
 * @property x {number} - Horizontal direction.
 * @property y {number} - Vertical direction.
 */
class Vector {
  
  constructor(dirX,dirY) {
    this._x = dirX ;
    this._y = dirY ;
  }
  
  get x() { return this._x ; }
  set x(value) { this._x = value ; }
  
  get y() { return this._y ; }
  set y(value) { this._y = value ; }
}

/**
 * A geometric rectangle.
 * @constructor
 * @param {number} x - Horizontal coordinate of top left corner.
 * @param {number} y - Vertical coordinate of top left corner.
 * @param {number} w - Width.
 * @param {number} h - Height.
 * @property left {number} - Horizontal coordinate of the Rectangle's left edge.
 * @property right {number} - Horizontal coordinate of the Rectangle's right 
 * edge.
 * @property top {number} - Vertical coordinate of the Rectangle's top edge.
 * @property bottom {number} - Vertical coordinate of the Rectangle's bottom 
 * edge.
 * @property width {number} - Width of the Rectangle.
 * @property height {number} - Height of the Rectangle.
 * @property center {Coordinate} - Center point of the Rectangle.
 */
class Rectangle {
  
  constructor( x, y, w, h ) {
    this.left   = x ;
    this.top    = y ;
    this.width  = w ;
    this.height = h ;
  }
  
  /**
   * 
   * @returns {number}
   */
  get right() { return this.left + this.width ; }
  
  /**
   * 
   * @returns {number}
   */
  get bottom() { return this.top + this.height ; }
  
  /**
   * Center point of the rectangle as a {Coordinate}
   * @returns {Coordinate}
   */
  get center() {
    return new Coordinate(
      this.left + this.width/2,
      this.top + this.height/2
    ) ;
  }
  
  /**
   * The Rectangle attempts to identify if it overlaps with another Rectangle.
   * @param {Rectangle} rectangle
   * @returns {boolean}
   */
  IntersectsWith( rectangle ) {
    if (
      (
        (
          this.left < rectangle.right
          && this.left > rectangle.left
        ) || (
          this.right < rectangle.right
          && this.right > rectangle.left
        )
      )
      && (
        (
          this.top < rectangle.bottom
          && this.top > rectangle.top
        ) || (
          this.bottom < rectangle.bottom
          && this.bottom > rectangle.top
        )
      )
    ) {
      return true ;
    }
    return false ;
  }
  
  /**
   * The Rectangle identifies which of its sides overlap with another
   * Rectangle.
   * @param {Rectangle} rectangle
   * @returns {Object} booleans in order: left, top, right, bottom
   */
  Overlap( rectangle ) {
    return {
      'left': this.left < rectangle.right &&
        this.left > rectangle.left,
      'top': this.top < rectangle.bottom &&
        this.top > rectangle.top,
      'right': this.right < rectangle.right &&
        this.right > rectangle.left,
      'bottom': this.bottom < rectangle.bottom &&
        this.bottom > rectangle.top
    } ;
  }
  
  /**
   * The Rectangle attempts to produce a new Rectangle that consists of the 
   * area in which it and the Rectangle it received as the argument overlap.
   * @param {Rectangle} rectangle
   * @returns {Rectangle} if there is overlap.
   * @returns {null} if there is no overlap.
   */
  Intersection( rectangle ) {
    
    let overlap = this.Overlap( rectangle ) ;
    
    if(
      overlap.left && overlap.right &&
      overlap.top && overlap.bottom
    ) {
      return this ;
    } else if(
      overlap.left && overlap.right &&
      (overlap.top || overlap.bottom)
    ) {
      return new Rectangle(
        this.left,
        this.top,
        this.width,
        ((overlapTop) ?
          rectangle.bottom - this.top :
          rectangle.top - this.bottom
        )
      ) ;
    } else if(
      (overlap.left || overlap.right) &&
      (overlap.top || overlap.bottom)
    ) {
      return new Rectangle(
        ((overlap.left) ?
          this.left :
          rectangle.left
        ),
        ((overlap.top) ?
          this.top :
          rectangle.top
        ),
        ((overlap.left) ?
          rectangle.right - this.left :
          this.right - rectangle.left 
        ),
        ((overlap.top) ?
          rectangle.bottom - this.top :
          this.bottom - rectangle.top
        )
      ) ;
    }
    
    return null ;
  }
}


/**
 * A game object.
 * @property box {Rectangle} The bounding box of the object. Used for collision.
 * @property dir {Vector} The direction in which the object is moving.
 * @property speed {number} The speed at which the object is moving in pixels 
 * per frame.
 */
class GameObject {
  
  /**
   * @constructor
   * @param {number} values.x - Horizontal coordinate of top left corner.
   * @param {number} values.y - Vertical coordinate of top left corner.
   * @param {number} values.w - Width.
   * @param {number} values.h - Height.
   * @param {number} values.dirX - Horizontal direction.
   * @param {number} values.dirY - Vertical direction.
   * @param {number} values.speed - Value is pixels per frame.
  */
  constructor(values) {
    this.box    = new Rectangle(
      ( ( typeof values.posX !== 'undefined') ? values.posX : 0 ),
      ( ( typeof values.posY !== 'undefined') ? values.posY : 0 ),
      ( ( typeof values.w    !== 'undefined') ? values.w    : 0 ),
      ( ( typeof values.h    !== 'undefined') ? values.h    : 0 )
    ) ;
    
    this.dir    = new Vector(
      ( ( typeof values.dirX !== 'undefined') ? values.dirX : 1 ),
      ( ( typeof values.dirY !== 'undefined') ? values.dirY : 1 )
    ) ;
    
    this.speed  = ( ( typeof values.spd !== 'undefined') ? values.spd : 2 ) ;
  }
  
  /**
   * The GameObject attempts to collide with another GameObject.<br/>
   * If it collides, this GameObject will be re-positioned the shortest 
   * distance out of the GameObject it collided with and then both GameObjects' 
   * dir(ection) property on that axis will be inverted.
   * @param {GameObject} gameObject - Another GameObject.
   * @return {boolean} if it collided with the other GameObject.
   */
  CollideWith(gameObject) {
    
    let intersection = this.box.Intersection( gameObject.box ) ;
    if( intersection == null ) { return false ; }
    
    if( intersection.width < intersection.height ) {
      if( this.box.left == intersection.left ) {
        this.left += intersection.width + 1 ;
        this.dir.x    = Math.abs(this.dir.x) ;
        gameObject.dir.x = -Math.abs(gameObject.dir.x) ;
      } else {
        this.left -= (intersection.width + 1) ;
        this.dir.x    = -Math.abs(this.dir.x) ;
        gameObject.dir.x = Math.abs(gameObject.dir.x) ;
      }
    } else {
      if( this.box.top == intersection.top ) {
        this.top += intersection.height + 1 ;
        this.dir.y    = Math.abs(this.dir.y) ;
        gameObject.dir.y = -Math.abs(gameObject.dir.y) ;
      } else {
        this.top -= (intersection.height + 1) ;
        this.dir.y    = -Math.abs(this.dir.y) ;
        gameObject.dir.y = Math.abs(gameObject.dir.y) ;
      }
    }
    return true ;
  }
}

/**
 * The Canvas which handles GameObjects.
 * @property domElement {HTMLDivElement}
 * @property width {number}
 * @property height {number}
 * @property gameObjects {array}
 * @method CheckCollisions Checks each object for collisions in ascending order.
 */
class Canvas {
  
  /**
   * @constructor
   * @param {HTMLDivElement} domElement
   */
  constructor(domElement) {
    this.domElement   = domElement ;
    this.width        = document.body.clientWidth ;
    this.height       = document.body.clientHeight ;
    this.gameObjects  = [] ;
    
    this.CheckCollisions = function () {this._checkCollisions() ;}
  }
  
  _checkCollisions() {
    for (let i=0;i<(this.gameObjects.length-1);i++)
    {
      for (let j=i+1;j<this.gameObjects.length;j++)
      {
        if ( this.gameObjects[i].CollideWith(this.gameObjects[j]) )
        {
          i++ ;
          j++ ;
        }
      }
    }
  }
}

/**
 * A bouncy object!!
 * @property domElement {HTMLDivElement}
 * @property canvas {Canvas}
 * @property pallete {array}
 * @property currentColorIndex {number}
 * @property previousColorIndex {number}
 * @method Update Advances the object's state by one frame. 
 * @method SetNewRandomColor Randomizes the color of the object's background.
 */
class BouncyObject {
  
  /**
   * @constructor
   * @param {HTMLDivElement} domElement
   * @param {Canvas} displaySurface - The surface on which it is displayed.
   */
  constructor(domElement, displaySurface) {
    this.domElement         = domElement ;
    this.canvas             = displaySurface ;
    
    Object.setPrototypeOf(this, new GameObject(
        {
          posX: this.domElement.offsetLeft,
          posY: this.domElement.offsetTop,
          w: this.domElement.clientWidth,
          h: this.domElement.clientHeight
        }
      )
    ) ;
    
    this.pallete            = [
      "#ff8800",
      "#e124ff",
      "#6a19ff",
      "#ff2188"
    ] ;
    
    this.currentColorIndex  = 0 ;
    this.previousColorIndex = 0 ;
    
    this.domElement.style.backgroundColor = this.pallete[0] ;
    
    
    this.SetNewRandomColor = function () {
      this.previousColorIndex = this.currentColorIndex ;
      while (this.currentColorIndex === this.previousColorIndex )
      {
        this.currentColorIndex = Math.floor(Math.random() * this.pallete.length) ;
      }
      this.domElement.style.backgroundColor = this.pallete[
        this.currentColorIndex
      ] ;
    }
    
    this.Update = function () {
      if (this.box.right >= this.canvas.width || this.box.left < 0) {
        this.dir.x *= -1 ;
        this.SetNewRandomColor() ;
      }
      if (this.box.bottom >= this.canvas.height || this.box.top < 0) {
        this.dir.y *= -1 ;
        this.SetNewRandomColor() ;
      }
      this.box.left += this.dir.x * this.speed ;
      this.box.top  += this.dir.y * this.speed ;
      this.domElement.style.left  = this.box.left + "px" ;
      this.domElement.style.top   = this.box.top + "px" ;
    }
  }

/*   Update() {
    if (this.box.right >= this.canvas.width || this.box.left < 0) {
      this.dir.x *= -1 ;
      this.SetNewRandomColor() ;
    }
    if (this.box.bottom >= this.canvas.height || this.box.top < 0) {
      this.dir.y *= -1 ;
      this.SetNewRandomColor() ;
    }
    this.box.left += this.dir.x * this.speed ;
    this.box.top  += this.dir.y * this.speed ;
    this.domElement.style.left  = this.box.left + "px" ;
    this.domElement.style.top   = this.box.top + "px" ;
  } */
}

var canvas ;

window.animate = function () {
  canvas.CheckCollisions() ;
  canvas.gameObjects.forEach(item=>{item.Update() ;}) ;
  
  window.requestAnimationFrame(window.animate);
}

window.onload = function() {
  canvas  = new Canvas( document.getElementById("black") ) ;

  canvas.gameObjects.push(
    new BouncyObject( document.getElementById("dvd1"), canvas )
  ) ;
  
  var secondLogo = new BouncyObject( document.getElementById("dvd2"), canvas ) ;
  secondLogo.dir.y = -1 ;
  canvas.gameObjects.push( secondLogo ) ;
  
  var thirdLogo = new BouncyObject( document.getElementById("dvd3"), canvas ) ;
  thirdLogo.dir.x = -1 ;
  canvas.gameObjects.push( thirdLogo ) ;
  
  var fourthLogo = new BouncyObject( document.getElementById("dvd4"), canvas ) ;
  fourthLogo.dir.x = -1 ;
  fourthLogo.dir.y = -1 ;
  canvas.gameObjects.push( fourthLogo ) ;
  
  var fifthLogo = new BouncyObject( document.getElementById("dvd5"), canvas ) ;
  fifthLogo.dir.x = -1 ;
  fifthLogo.dir.y = -1 ;
  canvas.gameObjects.push( fifthLogo ) ;
  
  fifthLogo.Update() ;
  
  window.requestAnimationFrame(window.animate);
}