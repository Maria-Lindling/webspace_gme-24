'use strict' ;
import ElementBuilder from './ElementBuilder.js';
export default class AssetManager {

  static _elementIdLibrary = {
    "images": "imgsources",
  } ;

  /**
   * 
   * @param {HTMLImageElement} tilesheet 
   * @param {Rectangle} tileData 
   * @param {Rectangle} placement 
   * @param {Object} options 
   * @param {Boolean} options.collision 
   */
  constructor() {
    this.imageLibrary = {} ;
    this._loadImages() ;
  }

  _loadImages() {
    let imgsources = document.getElementById(AssetManager._elementIdLibrary.images) ;

    this.imageLibrary["background"] = new ElementBuilder('img')
      .withAttribute('src', "/client/hintergrund.png")
      .withAttribute('alt', "Background")
      .withAttribute('id', "gamebackground")
      .withParent( imgsources )
      .build() ;

    this.imageLibrary["tileset"] = new ElementBuilder('img')
      .withAttribute('src', "/client/tileset.png")
      .withAttribute('alt', "Tileset")
      .withAttribute('id', "tileset")
      .withParent( imgsources )
      .build() ;

    this.imageLibrary["spritesheet"] = new ElementBuilder('img')
      .withAttribute('src', "/client/laufbursche.png")
      .withAttribute('alt', "Spritesheet")
      .withAttribute('id', "spritesheet")
      .withParent( imgsources )
      .build() ;
  }

}