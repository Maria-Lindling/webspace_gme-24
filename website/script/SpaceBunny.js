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
    },
    
    /**
     * Produces an HTMLElement that from an array containing only strings.
     * @param {Array.<String>} list
     * @param {Boolean} [numbered] produces an &lt;ol&gt; if set to true and an
     * &lt;ul&gt; if set to false or not specified
     * @param {Boolean} [unsafe] When set to true, the function won't throw
     * an error if an entry of the Array is not a String.
     * @returns {HTMLElement}
     * @throws {TypeError} Throws an error if any entry in the Array is
     * not a String.
     */
    listToElement: function ( list, numbered = false, unsafe = false ) {
      let listElement = document.createElement( (numbered) ? "ol" : "ul" ) ;
      for( let entry of list ) {
        if( !unsafe && (typeof entry != 'string') ) { throw new TypeError() ; }
        listElement
          .appendChild( document.createElement("li") )
          .innerText = entry ;
      }
      return listElement ;
    },
  }
}