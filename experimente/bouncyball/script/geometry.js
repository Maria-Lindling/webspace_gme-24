/**
 * A two-dimensional set of coordinates.
 * @typedef {Object} Coordinate
 * @property {Number} x - Horizontal coordinate.
 * @property {Number} y - Vertical coordinate.
 */
class Coordinate {
  /**
   * A two-dimensional set of coordinates.
   * @constructor
   * @param {Number} posX - Horizontal coordinate.
   * @param {Number} posY - Vertical coordinate.
   */
  constructor(posX, posY) {
    this.x = posX ;
    this.y = posY ;
  }
}

/**
 * A two-dimensional vector. Positive values point towards the bottom right.
 * @typedef {Object} Vector
 * @property {Number} x - Horizontal direction.
 * @property {Number} y - Vertical direction.
 */
class Vector {

  /**
   * @constructor
   * @param {Number} dirX - Horizontal direction.
   * @param {Number} dirY - Vertical direction.
   */
  constructor(dirX,dirY) {
    this._x = dirX ;
    this._y = dirY ;
  }
  
  get x() { return this._x ; }
  set x(value) { this._x = value ; }
  
  get y() { return this._y ; }
  set y(value) { this._y = value ; }
}