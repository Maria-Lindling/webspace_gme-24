"use strict" ;
import Rectangle from '/client/geometry/Rectangle.js';
import Coordinate from '/client/geometry/Coordinate.js';
import Animation from './Animation.js';
/**
 * 
 */
export default class Actor {

  get left() { return Math.floor(this.pos.x) ; }
  set left( value ) { this.pos.x = value ; }

  get right() { return Math.floor(this.pos.x + this.width) ; }
  set right( value ) { this.pos.x = value - this.width ; }

  get top() { return Math.floor(this.pos.y) ; }
  set top( value ) { this.pos.y = value ; }

  get bottom() { return Math.floor(this.pos.y + this.height) ; }
  set bottom( value ) { this.pos.y = value - this.height ; }

  /**
   * 
   * @property {Coordinate}
   */
  get mapSector() { return new Coordinate(
    Math.floor(this.pos.x/game._currentLevel.tileSize),
    Math.floor(this.pos.y/game._currentLevel.tileSize)
  ) ; }

  /**
   * The number of collectibles collected.
   * @property {Number}
   */
  score ;

  /**
   * Right is 0. Left is 1.
   * @property {Number}
   */
  facing ;

  /**
   * Width of the Actor's spritesheet segments.
   * @property {Number}
   */
  width ;

  /**
   * Height of the Actor's spritesheet segments.
   * @property {Number}
   */
  height ;

  /**
   * The actor's spritesheet.
   * @property {HTMLImageElement}
   */
  spritesheet ;

  /**
   * Logical position of the Actor within the level.
   * @property {Coordinate}
   */
  pos ;

  /**
   * Speed measured in pixels per second.
   * @property {Number}
   */
  speed ;

  /**
   * Upward accelleration in pixels per second.
   * @property {Number}
   */
  jumpForce ;

  /**
   * Vertical speed of the Actor.
   * @property {Number}
   */
  fall = 0 ;

  /**
   * 
   * @property {Boolean}
   */
  isGrounded = false ;

  /**
   * 
   * @property {Date}
   */
  lastGrounded ;

  /**
   * 
   * @property {Animation}
   */
  animation ;

  /**
   * @property {Audio}
   */
  jumpAudio ;

  /**
   * 
   * @param {Object} options
   * @param {Coordinate} options.pos
   * @param {Number} options.speed
   * @param {Number} options.jumpForce
   * @param {Object} options.spritesheet
   * @param {HTMLImageElement} options.element
   * @param {Number} options.spritesheet.width
   * @param {Number} options.spritesheet.height
   */
  constructor(options = {}) {
    this.pos         = options?.pos || new Coordinate(400,360) ;
    this.spritesheet = options?.spritesheet?.element || null ;
    this.width       = options?.spritesheet?.width  || 62 ;
    this.height      = options?.spritesheet?.height || 70 ;
    this.speed       = options?.speed     || 200 ;
    this.jumpForce   = options?.jumpForce || 320 ;

    this.facing      = 0 ;
    this.animation   = new Animation( this.spritesheet, this.width, this.height, 85 ) ;
    this.jumpAudio   = new Audio( '/client/jump.mp3' ) ;

    this.lastGrounded = new Date() ;
    this.isInMotion   = false ;
    
    this.score        = 0 ;
  }

  update( deltaTime, tilesets ) {

    this.move( deltaTime ) ;

    tilesets['map'].filter((t)=>{
      return ((t.mapSector.x) >= (this.mapSector.x-2) && (t.mapSector.x) <= (this.mapSector.x+3)) ;
    }).forEach((tile)=>{
      this.collide( tile ) ;
    }) ;

    tilesets['nonstatic'].forEach((tile)=>{
      this.collect( tile ) ;
    }) ;
    
    this.animate( deltaTime ) ;
  }

  move( deltaTime ) {
    this.isInMotion = false ;

    if( game._controls.left ) {

      this.pos.x -= this.speed / 1000 * deltaTime ;
      this.facing = 1 ;
      this.isInMotion = true ;

    } else if ( game._controls.right ) {

      this.pos.x += this.speed / 1000 * deltaTime ;
      this.facing = 0 ;
      this.isInMotion = true ;
    }

    if( game._controls.jump && (this.isGrounded || ((new Date() - this.lastGrounded) < 250)) ) {

      this.pos.y -= this.jumpForce / 1000 * deltaTime ;

      if( this.isGrounded ) {

        this.lastGrounded = new Date() ;
        this.jumpAudio.play() ;

      }

      this.isGrounded = false ;
    }

    if( !this.isGrounded && ((new Date() - this.lastGrounded) > 375) ) {
      this.pos.y += game._currentLevel.gravity / 1000 * deltaTime ;
    } else if( this.isGrounded ) {
      this.pos.y += game._currentLevel.gravity / 1000 * deltaTime ;
    }
  }

  animate( deltaTime ) {
    if( this.isInMotion ) {
      this.animation.animate( deltaTime, this.facing ) ;
    }
  }

  collect( tile ) {
    if( !tile.isCollectible || tile.isCollected ) { return ; }

    if(
      new Rectangle( this.pos.x, this.pos.y, this.width, this.height )
        .IntersectsWith( tile.placement )
    ) {
      this.score++ ;
      tile.isCollected = true ;
    }
  }
  
  collide( tile ) {
    if( !tile.hasCollision ) { return ; }

    let intersection = new Rectangle( this.pos.x, this.pos.y, this.width, this.height)
      .Intersection( tile.placement ) ;

    if( intersection == null ) { return ; }

    if(
      intersection.width >= intersection.height &&
      (
        this.top    == intersection.top ||
        this.bottom == intersection.bottom
      )
    ) {

      this._collideVertical( intersection ) ;

      intersection = new Rectangle( this.pos.x, this.pos.y, this.width, this.height)
      .Intersection( tile.placement ) ;

    }

    if( intersection == null ) { return ; }
    
    if(
      intersection.width < intersection.height &&
      (
        this.left  == intersection.left ||
        this.right == intersection.right
      )
    ) {

      this._collideHorizontal( intersection ) ;

    }
  }

  _collideVertical( intersection ) {

    if( this.top == intersection.top ) {

      this.top = intersection.bottom + 1 ;

    } else if ( this.bottom == intersection.bottom ) {

      this.bottom = intersection.top - 1 ;

      this.isGrounded = true ;
      this.lastGrounded = new Date() ;
    }
  }

  _collideHorizontal( intersection ) {

      if( this.left == intersection.left ) {

        this.left = intersection.right + 1 ;

      } else if ( this.right == intersection.right ) {

        this.right = intersection.left - 1 ;
      }
  }

  draw( ctx ) {
    this.animation.draw( this.pos, ctx ) ;
  }
}