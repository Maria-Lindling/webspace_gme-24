/** @module SpaceBunny */

"use strict" ;

/** @namespace */
const SpaceBunny = {

  
  /** @namespace */
  Array: {

    /**
     * Shuffles the provided Array.<*> and returns a new
     * Array.<*> that has been randomized.
     * @param {Array.<*>} list
     * @returns {Array.<*>}
     */
    shuffle: function ( list ) {
      /** @const @type {Array.<*>} */
      const tmpList = list.slice() ;
      /** @type {Array.<*>} */
      let result = [] ;
      while( tmpList.length > 0 ) {
        /** @type {Number} */
        let randomIndex = Math.floor( Math.random() * tmpList.length ) ;
        /** @type {*} */
        let entry = tmpList.splice(randomIndex,1).pop() ;
        result.push( entry ) ;
      }
      return result ;
    }
  }
}