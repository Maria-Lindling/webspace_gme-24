'use strict';
/**
 * A geometric rectangle.
 * @property {Number} left - Horizontal coordinate of the Rectangle's left edge.
 * @property {Number} right - Horizontal coordinate of the Rectangle's right 
 * edge.
 * @property {Number} top - Vertical coordinate of the Rectangle's top edge.
 * @property {Number} bottom - Vertical coordinate of the Rectangle's bottom 
 * edge.
 * @property {Number} width - Width of the Rectangle.
 * @property {Number} height - Height of the Rectangle.
 * @property {Coordinate} center - Center point of the Rectangle.
 */
class Rectangle {

  /**
   * @constructor
   * @param {Number} x - Horizontal coordinate of top left corner.
   * @param {Number} y - Vertical coordinate of top left corner.
   * @param {Number} w - Width of the Rectangle.
   * @param {Number} h - Height of the Rectangle.
   */
  constructor( x, y, w, h ) {
    this.left   = x ;
    this.top    = y ;
    this.width  = w ;
    this.height = h ;
  }
  
  /** Horizontal coordinate of the Rectangle's right edge.
   * @property {Number}
   * @returns {Number}
   */
  get right() { return this.left + this.width ; }
  
  /**
   * @property {Number}
   * @returns {Number}
   */
  get bottom() { return this.top + this.height ; }
  
  /** Center point of the rectangle.
   * @property {Coordinate}
   * @returns {Coordinate}
   */
  get center() {
    return new Coordinate(
      this.left + this.width/2,
      this.top + this.height/2
    ) ;
  }
  
  /** The Rectangle attempts to identify if it overlaps with another Rectangle.
   * @method
   * @param {Rectangle} rectangle
   * @returns {Boolean}
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
  
  /** The Rectangle identifies which of its sides overlap with another
   * Rectangle.
   * @method
   * @param {Rectangle} rectangle
   * @returns {Object} Booleans in order: left, top, right, bottom
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
  
  /** The Rectangle attempts to produce a new Rectangle that consists of the 
   * area in which it and the Rectangle it received as the argument overlap.
   * @method
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
        ((overlap.top) ?
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