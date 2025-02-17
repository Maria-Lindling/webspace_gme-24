"use strict" ;
/**
 * 
 */
export default class Animation {

  spritesheet ;

  offset ;
  currentFrame ;

  width ;
  height ;

  msPerFrame ;
  cycleTime ;

  constructor(spritesheet, width, height, msPerFrame, offset = 0, currentFrame = 0) {
    this.spritesheet  = spritesheet ;
    this.width        = width ;
    this.height       = height ;
    this.msPerFrame   = msPerFrame ;
    this.cycleTime    = 0 ;

    this.offset       = offset ;
    this.currentFrame = currentFrame ;
  }

  get left() { return this.currentFrame * this.width ; }
  get top() { return this.offset * this.height ; }

  animate( deltaTime, offset ) {
    if( offset != this.offset ) {
      this.offset = offset ;
      this.cycleTime = 0 ;
    }
    this.cycleTime += deltaTime ;

    this.currentFrame = Math.floor(this.cycleTime / this.msPerFrame) ;
    
    if( (this.left + this.width) >= this.spritesheet.width ) {
      this.cycleTime = 0 ;
      this.currentFrame = 0 ;
    }
  }

  draw( pos, ctx ) {
    ctx.drawImage(
      this.spritesheet,
      this.left, this.top, this.width, this.height,
      pos.x, pos.y, this.width, this.height
    ) ;
  }
}