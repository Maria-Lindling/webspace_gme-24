"use strict" ;
/**
 * A two-dimensional vector. Positive values point towards the bottom right.
 * @typedef {Object} Vector
 * @property {Number} x - Horizontal direction.
 * @property {Number} y - Vertical direction.
 */
export default class Vector {

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

  extend
}