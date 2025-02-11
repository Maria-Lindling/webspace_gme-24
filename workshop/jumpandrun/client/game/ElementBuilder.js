'use strict' ;
export default class ElementBuilder {

  domElement ;

  constructor( tag ) {
    this.domElement = document.createElement( tag ) ;
  }


  withAttribute(key,value) {
    this.domElement.setAttribute( key, value ) ;
    return this ;
  }

}