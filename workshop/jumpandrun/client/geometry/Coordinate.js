"use strict" ;
/**
 * A two-dimensional set of coordinates.
 * @typedef {Object} Coordinate
 * @property {Number} x - Horizontal coordinate.
 * @property {Number} y - Vertical coordinate.
 */
export default class Coordinate {
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