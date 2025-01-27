/** @module myLibrary */

"use strict" ;

/** @namespace */
const myLibrary = {
  /***
   * @class
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   */
  "Color" : function ( red, green, blue ) {
    this._red ;
    this._green ;
    this._blue ;
    if( typeof red == 'number' ) {
      this._red = red ;
    } else {
      this._red = Math.min(Math.max(parseInt(red, 16),0),255);
    }
    if( typeof green == 'number' ) {
      this._green = green ;
    } else {
      this._green = Math.min(Math.max(parseInt(green, 16),0),255);
    }
    if( typeof blue == 'number' ) {
      this._blue = blue  ;
    } else {
      this._blue = Math.min(Math.max(parseInt(blue, 16),0),255);
    }

    this.toString = function () {
      return `#${
        this._red.toString(16)}${
        this._green.toString(16)}${
        this._blue.toString(16)}` ;
    }
  }
}