/**
 * A game object.
 * @property box {Rectangle} The bounding box of the object. Used for collision.
 * @property dir {Vector} The direction in which the object is moving.
 * @property speed {Number} The speed at which the object is moving in pixels 
 * per frame.
 */
class GameObject {
  
  static defaults ;
  static {
    /**
     * @property {Object} box
     * @property {Number} box.left
     * @property {Number} box.right
     * @property {Number} box.width
     * @property {Number} box.height
     * @property {Object} dir
     * @property {Number} dir.x
     * @property {Number} dir.y
     * @property {Number} speed
     */
    this.defaults = {
      "box" : {
        "left"   : 0,
        "top"    : 0,
        "width"  : 0,
        "height" : 0
      },
      "dir" : {
        "x" : 1,
        "y" : 1
      },
      "speed" : 2
    }
  }

  /**
   * @constructor
   * @param {Number} values.x - Horizontal coordinate of top left corner.
   * @param {Number} values.y - Vertical coordinate of top left corner.
   * @param {Number} values.w - Width.
   * @param {Number} values.h - Height.
   * @param {Number} values.dirX - Horizontal direction.
   * @param {Number} values.dirY - Vertical direction.
   * @param {Number} values.speed - Value is pixels per frame.
  */
  constructor(values) {
    this.box    = new Rectangle(
      ( ( typeof values.posX !== 'undefined') ?
        values.posX : GameObject.defaults.box.left ),
      ( ( typeof values.posY !== 'undefined') ?
      values.posY : GameObject.defaults.box.right ),
      ( ( typeof values.w    !== 'undefined') ?
      values.w : GameObject.defaults.box.width ),
      ( ( typeof values.h    !== 'undefined') ?
      values.h : GameObject.defaults.box.height )
    ) ;
    
    this.dir    = new Vector(
      ( ( typeof values.dirX !== 'undefined') ?
      values.dirX : GameObject.defaults.dir.x ),
      ( ( typeof values.dirY !== 'undefined') ?
      values.dirY : GameObject.defaults.dir.y )
    ) ;
    
    this.speed  = ( ( typeof values.spd !== 'undefined') ?
      values.spd : GameObject.defaults.speed ) ;
  }
  
  /**
   * The GameObject attempts to collide with another GameObject.<br/>
   * If it collides, this GameObject will be re-positioned the shortest 
   * distance out of the GameObject it collided with and then both GameObjects' 
   * dir(ection) property on that axis will be inverted.
   * @param {GameObject} gameObject - Another GameObject.
   * @return {Boolean} if it collided with the other GameObject.
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
 * A bouncy object!!
 * @property {HTMLDivElement} domElement
 * @property {Canvas} canvas
 * @property {Array} pallete
 * @property {Number} currentColorIndex
 * @property {Number} previousColorIndex
 */
class BouncyObject {
  
  /**
   * @constructor
   * @param {HTMLDivElement} domElement
   * @param {Canvas} displaySurface - The surface on which it is displayed.
   */
  constructor(domElement, displaySurface) {
    this.domElement = domElement ;
    this.canvas     = displaySurface ;
    
    /** @inheritdoc */
    this.__proto__ = new GameObject(
      {
        posX: this.domElement.offsetLeft,
        posY: this.domElement.offsetTop,
        w: this.domElement.clientWidth,
        h: this.domElement.clientHeight
      }
    ) ;
    
    this.pallete = [
      "#ff8800",
      "#e124ff",
      "#6a19ff",
      "#ff2188"
    ] ;
    
    this.currentColorIndex  = 0 ;
    this.previousColorIndex = 0 ;
    
    this.domElement.style.backgroundColor = this.pallete[0] ;
    
    /** Randomizes the color of the object's background.
     * @method
     */
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

    /** Advances the object's state by one frame.
     * @method
     */
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