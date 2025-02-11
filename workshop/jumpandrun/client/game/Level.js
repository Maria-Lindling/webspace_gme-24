'use strict' ;
import Rectangle from '/client/geometry/Rectangle.js';
import Tile from '/client/game/Tile.js';

export default class Level {

  static _drawOrer = ['background','map','actors'] ;

  _level ;
  _ctx ;

  get width() { return this._level.width ; }

  get height() { return this._level.height ; }

  constructor( playArea ) {
    this.playArea = playArea ;
    this.tilesets = { 'background': [], 'map': [], 'actors': [] } ;
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

  loadMap( map, tilesheet, tileSize, tileLetters, blocker ) {
    this._level = document.createElement( 'canvas' ) ;
    this._level.width   = 640 ; // tileSize * Math.max( ...map.map((row)=>{return row.length}) ) ;
    this._level.height  = 480 ; // tileSize * map.length ;
    this._level.setAttribute("id","gamecanvas") ;

    this._level.style.width     = "100%" ;
    this._level.style.height    = "100%" ;
    this._level.style.objectFit = "contain" ;

    this.playArea.appendChild( this._level ) ;
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

  draw() {
    Level._drawOrer.forEach(
      key=>{
        this.tilesets[key].forEach((tile)=>{
          tile.draw(this._ctx);
        });
      }
    );
  }

}