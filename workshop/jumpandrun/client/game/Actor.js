"use strict" ;
import Rectangle from '/client/geometry/Rectangle.js';
import Coordinate from '/client/geometry/Coordinate.js';
import Animation from './Animation.js';
/**
 * 
 */
export default class Actor {

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

    this.animation   = new Animation( this.spritesheet, this.width, this.height, 125 ) ;
    this.jumpAudio   = new Audio( '/client/jump.mp3' ) ;

    this.lastGrounded = new Date() ;
  }

  update( deltaTime ) {
    this.move( deltaTime ) ;
    this.animate( deltaTime ) ;
    this.collect('T') ;
  }

  move( deltaTime ) {
    if( game._controls.left ) {
      this.pos.x -= this.speed / 1000 * deltaTime ;

    } else if ( game._controls.right ) {
      this.pos.x += this.speed / 1000 * deltaTime ;
    }

    if( game._controls.jump && (this.isGrounded || ((new Date() - this.lastGrounded) < 500)) ) {
      this.pos.y -= this.jumpForce / 1000 * deltaTime ;
      if( this.isGrounded ) {
        this.lastGrounded = new Date() ;
      }
      this.isGrounded = false ;
    }

    if( !this.isGrounded && ((new Date() - this.lastGrounded) > 500) ) {
      this.pos.y += game._currentLevel.gravity / 1000 * deltaTime ;
    }
  }

  animate( deltaTime ) {

  }

  collect( item ) {

  }
  
  collide( tile ) {
    if( tile.hasCollision ) {
      let intersection = new Rectangle( this.pos.x, this.pos.y, this.width, this.height)
        .Intersection( tile.placement ) ;
      if( intersection == null ) { return ; }
      
      //console.log( tile ) ;

      if( intersection.width < intersection.height ) {
        if( this.left == intersection.left ) {
          this.pos.x += intersection.width + 1 ;
        } else {
          this.pos.x -= intersection.width + 1 ;
        }
      } else {
        if( this.top == intersection.top ) {
          this.pos.y += intersection.height + 1 ;
        } else {
          this.pos.y -= intersection.height + 1 ;
          this.isGrounded = true ;
          this.lastGrounded = new Date() ;
        }
      }
    }
  }

  draw( ctx ) {
    this.animation.draw( this.pos, ctx ) ;
  }
}