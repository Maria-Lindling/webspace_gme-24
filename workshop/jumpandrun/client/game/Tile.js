'use strict' ;
import Rectangle from '/client/geometry/Rectangle.js';
import Coordinate from '/client/geometry/Coordinate.js';

export default class Tile {

  /**
   * 
   * @property {Coordinate}
   */
  get mapSector() { return new Coordinate(
    Math.floor(this.placement.left / game._currentLevel.tileSize),
    Math.floor(this.placement.top  / game._currentLevel.tileSize)
  ) ; }

  /**
   * 
   * @param {HTMLImageElement} tilesheet 
   * @param {Rectangle} tileData 
   * @param {Rectangle} placement 
   * @param {Object} options 
   * @param {Boolean} options.collision 
   * @param {Boolean} options.static
   * @param {Boolean} options.collectible
   */
  constructor( tilesheet, tileData, placement = null, options = {} ) {
    this.domElement     = tilesheet ;
    this.tileData       = tileData ;
    this.placement      = placement || new Rectangle(0,0,0,0) ;
    this.hasCollision   = options?.collision ;
    this.isStatic       = options?.static ;
    this.isCollectible  = options?.collectible ;
    this.isCollected    = false ;
  }

  draw( ctx ) {
    if( this.isCollectible && this.isCollected ) { return ; }
    ctx.drawImage(
      this.domElement,
      this.tileData.left, this.tileData.top,
      this.tileData.width, this.tileData.height,
      this.placement.left, this.placement.top,
      this.placement.width, this.placement.height
    ) ;
  }

}