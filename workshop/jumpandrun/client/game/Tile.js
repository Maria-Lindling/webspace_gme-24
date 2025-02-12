'use strict' ;
import Rectangle from '/client/geometry/Rectangle.js';

export default class Tile {

  /**
   * 
   * @param {HTMLImageElement} tilesheet 
   * @param {Rectangle} tileData 
   * @param {Rectangle} placement 
   * @param {Object} options 
   * @param {Boolean} options.collision 
   */
  constructor( tilesheet, tileData, placement = null, options = {} ) {
    this.domElement   = tilesheet ;
    this.tileData     = tileData ;
    this.placement    = placement || new Rectangle(0,0,0,0) ;
    this.hasCollision = options?.collision ;
  }

  draw( ctx ) {
    ctx.drawImage(
      this.domElement,
      this.tileData.left, this.tileData.top,
      this.tileData.width, this.tileData.height,
      this.placement.left, this.placement.top,
      this.placement.width, this.placement.height
    ) ;
  }

}