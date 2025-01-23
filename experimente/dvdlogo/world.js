/** The Canvas which handles GameObjects.
 * @property {HTMLDivElement} domElement 
 * @property {Number} width 
 * @property {Number} height 
 * @property {Array} gameObjects
 */
class Canvas {
  
  /** @constructor
   * @param {HTMLDivElement} domElement
   */
  constructor(domElement) {
    this.domElement   = domElement ;
    this.width        = document.body.clientWidth ;
    this.height       = document.body.clientHeight ;
    this.gameObjects  = [] ;
    
    /** Checks each object for collisions in ascending order.
    * @method
    */
    this.CheckCollisions = function () {this._checkCollisions() ;}
  }
  
  /** Checks each object for collisions in ascending order.
   * @private
   * @method
   */
  _checkCollisions() {
    for (let i=0;i<(this.gameObjects.length-1);i++)
    {
      for (let j=i+1;j<this.gameObjects.length;j++)
      {
        if ( this.gameObjects[i].CollideWith(this.gameObjects[j]) )
        {
          this.gameObjects[i].SetNewRandomColor() ;
          i++ ;
          j++ ;
        }
      }
    }
  }
}