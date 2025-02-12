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

  frameLength ;

  constructor(spritesheet, width, height, frameLength, offset, currentFrame) {
    this.spritesheet  = spritesheet ;
    this.width        = width ;
    this.height       = height ;
    this.frameLength  = frameLength ;

    this.offset       = offset || 0 ;
    this.currentFrame = currentFrame || 0 ;
  }

  get left() { return this.currentFrame * this.width ; }
  get top() { return this.offset * this.height ; }

  draw( pos, ctx ) {
    ctx.drawImage(
      this.spritesheet,
      this.left, this.top, this.width, this.height,
      pos.x, pos.y, this.width, this.height
    ) ;
  }
}