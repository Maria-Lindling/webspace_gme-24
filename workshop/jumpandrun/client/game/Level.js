'use strict' ;
import Rectangle from '/client/geometry/Rectangle.js';
import Tile from './Tile.js';
import ElementBuilder from './ElementBuilder.js';

export default class Level {

  static _drawOrder = ['background','map'] ;
  static _updateOrder = ['nonstatic','actors'] ;
  /* static _drawOrer = ['actors'] ; */

  _level ;
  _levelCtx ;

  _active ;
  _activeCtx ;

  _screen ;
  _screenCtx ;

  _mapIsDrawn ;

  playerCharacter ;
  playerScore ;

  tileSize ;

  /**
   * Downward acceleration on Props and Actors in pixels per second per second.
   * @property {Number}
   */
  gravity = 400 ;

  get width() { return this._level.width ; }

  get height() { return this._level.height ; }

  constructor( playArea ) {
    this.playArea = playArea ;
    this.tilesets = { 'background': [], 'map': [], 'nonstatic': [], 'actors': [] } ;
    this.screenOffset = 0 ;
    this._mapIsDrawn = false ;
  }

  setBackground( image ) {
    this.tilesets['background'].push(
      new Tile(
        image,
        new Rectangle( 0, 0, this.width, this.height ),
        new Rectangle( 0, 0, this.width, this.height )
      )
    );
  }

  setPlayerCharacter( actor ) {
    this.playerScore = 0 ;
    this.tilesets.actors.push( actor ) ;
    this.playerCharacter = actor ;
  }

  loadMap( map, tilesheet, tileSize, tileLetters, blocker, nonstatic, collectible ) {

    this.tilesets['map'] = [] ;
    for( let row = 0 ; row < map.length ; row++ ) {
      for( let col = 0 ; col < map[row].length ; col++ ) {
        let pos = tileLetters.indexOf( map[ row ].charAt( col ) ) ;
        if( pos >= 0 ) {
          this.tilesets[
            (nonstatic.includes(map[row].charAt(col))?'nonstatic':'map')
          ].push(
            new Tile(
              tilesheet,
              new Rectangle( pos * tileSize, 0, tileSize, tileSize ),
              new Rectangle( tileSize * col,tileSize * row, tileSize, tileSize ),
              {
                "collision": ( blocker.indexOf( map[ row ].charAt( col ) ) != -1 ),
                "static": !(nonstatic.includes(map[row].charAt(col))),
                "collectible": (collectible.includes(map[row].charAt(col))),
              }
            )
          ) ;
        }
      }
    }

    this._screen = new ElementBuilder( 'canvas' )
      .withAttribute("width", 640)
      .withAttribute("height", 480)
      .withAttribute("id","screencanvas")
      .withStyle("width","100%")
      .withStyle("height","100%")
      .withStyle("objectFit","contain") 
      .withParent( this.playArea )
      .build() ;

    this._screenCtx = this._screen.getContext('2d') ;

    this._level = new ElementBuilder( 'canvas' )
      .withAttribute("width", map[0].length * tileSize )
      .withAttribute("height", map.length * tileSize )
      .withAttribute("id","gamecanvas")
      .withStyle("display","none") 
      .withParent( this.playArea )
      .build() ;

    this._levelCtx = this._level.getContext('2d') ;

    this._active = new ElementBuilder( 'canvas' )
      .withAttribute("width", map[0].length * tileSize )
      .withAttribute("height", map.length * tileSize )
      .withAttribute("id","activecanvas")
      .withStyle("display","none") 
      .withParent( this.playArea )
      .build() ;

    this._activeCtx = this._active.getContext('2d') ;

    this.tileSize = tileSize ;
  }

  drawMap() {
    Level._drawOrder.forEach(
      key=>{
        this.tilesets[key].forEach((tile)=>{
            tile.draw(this._levelCtx) ;
            this._levelCtx.strokeStyle = tile.hasCollision ? '#ff6666' : '#66ff66' ;
            this._levelCtx.strokeRect( tile.placement.left, tile.placement.top, tile.placement.width, tile.placement.height ) ;
        }) ;
      }
    ) ;
    this._mapIsDrawn = true ;
  }

  update( deltaTime ) {
    this.playerCharacter.update( deltaTime, this.tilesets ) ;

    this.draw() ;
  }

  draw() {
    if ( !this._mapIsDrawn ) { return ; }

    this._activeCtx.putImageData( this._levelCtx.getImageData( 0, 0, this._level.width, this._level.height ), 0, 0 ) ;

    Level._updateOrder.forEach(
      key=>{
        this.tilesets[key].forEach((tile)=>{
          tile.draw(this._activeCtx) ;
          if( key == 'actors' ) {
            this._activeCtx.strokeStyle = '#ff66ff' ;
            this._activeCtx.strokeRect( tile.left, tile.top, tile.width, tile.height ) ;
          } else if( key == 'nonstatic' ) {
            this._activeCtx.strokeStyle = '#ffff66' ;
            this._activeCtx.strokeRect( tile.placement.left, tile.placement.top, tile.placement.width, tile.placement.height ) ;
          }
        }) ;
      }
    ) ;

    let screenOffset = Math.max( 0, this.playerCharacter.pos.x - this.playerCharacter.width/2 - this._screen.width/2 ) ;
    this._screenCtx.putImageData( this._activeCtx.getImageData( screenOffset, 0, this.width, this.height ), 0, 0 ) ;
  }

}