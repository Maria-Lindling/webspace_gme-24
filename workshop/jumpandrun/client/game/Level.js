'use strict' ;
import Rectangle from '/client/geometry/Rectangle.js';
import Tile from './Tile.js';
import ElementBuilder from './ElementBuilder.js';

export default class Level {

  static _drawOrer = ['background','map','actors'] ;
  /* static _drawOrer = ['actors'] ; */

  _level ;
  _ctx ;

  _screen ;
  _stx ;

  playerCharacter ;
  playerScore ;

  /**
   * Downward acceleration on Props and Actors in pixels per second per second.
   * @property {Number}
   */
  gravity = 800 ;

  get width() { return this._level.width ; }

  get height() { return this._level.height ; }

  constructor( playArea ) {
    this.playArea = playArea ;
    this.tilesets = { 'background': [], 'map': [], 'actors': [] } ;
    this.screenOffset = 0 ;
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

  loadMap( map, tilesheet, tileSize, tileLetters, blocker ) {

    this._screen= new ElementBuilder( 'canvas' )
      .withAttribute("width", 640)
      .withAttribute("height",480)
      .withAttribute("id","screencanvas")
      .withStyle("width","100%")
      .withStyle("height","100%")
      .withStyle("objectFit","contain") 
      .withParent( this.playArea )
      .build() ;

    this._stx = this._screen.getContext('2d') ;

    this._level = new ElementBuilder( 'canvas' )
      .withAttribute("width", map[0].length * tileSize )
      .withAttribute("height", map.length * tileSize )
      .withAttribute("id","gamecanvas")
      .withStyle("display","none") 
      .withParent( this.playArea )
      .build() ;

    this._ctx = this._level.getContext('2d') ;

    this.tilesets['map'] = [] ;
    for( let row = 0 ; row < map.length ; row++ ) {
      for( let col = 0 ; col < map[row].length ; col++ ) {
        let pos = tileLetters.indexOf( map[ row ].charAt( col ) ) ;
        if( pos >= 0 ) {
          this.tilesets['map'].push(
            new Tile(
              tilesheet,
              new Rectangle( pos * tileSize, 0, tileSize, tileSize ),
              new Rectangle( tileSize * col,tileSize * row, tileSize, tileSize ),
              { "collision": ( blocker.indexOf( map[ row ].charAt( col ) ) != -1 ), }
            )
          ) ;
        }
      }
    }
  }

  update( deltaTime ) {

    this.tilesets['map'].forEach((tile)=>{
      this.playerCharacter.collide( tile ) ;
    }) ;

    this.draw( deltaTime ) ;
  }

  draw( deltaTime ) {
    Level._drawOrer.forEach(
      key=>{
        this.tilesets[key].forEach((tile)=>{
          if( key == 'actors' ) {
            tile.update( deltaTime ) ;
            this._ctx.strokeStyle = '#ff66ff' ;
            this._ctx.strokeRect( tile.pos.x, tile.pos.y, tile.width, tile.height ) ;
          }
          tile.draw(this._ctx) ;
          if( key != 'actors' ) {
            this._ctx.strokeStyle = tile.hasCollision ? '#ff6666' : '#66ff66' ;
            this._ctx.strokeRect( tile.placement.left, tile.placement.top, tile.placement.width, tile.placement.height ) ;
          }
        });
      }
    );

    this._stx.putImageData( 
      this._ctx.getImageData(
        Math.max( 0, this.playerCharacter.pos.x - this.playerCharacter.width/2 - this._screen.width/2 ),
        0,
        this.width,
        this.height
      ),
      0,
      0
    ) ;
  }

}