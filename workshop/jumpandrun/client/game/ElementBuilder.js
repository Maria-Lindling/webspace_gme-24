'use strict' ;
export default class ElementBuilder {

  tag ;
  attributes ;
  style ;
  parentElement ;

  constructor( tag ) {
    this.tag = tag ;
    this.attributes = {} ;
    this.style = {} ;
    this.parentElement = null ;
  }

  withStyle(key,value) {
    this.style[key] = value ;
    return this ;
  }

  withAttribute(key,value) {
    this.attributes[key] = value ;
    return this ;
  }

  withParent(element) {
    this.parentElement = element ;
    return this ;
  }

  build() {
    let domElement = document.createElement( this.tag ) ;

    for( let [key,value] of Object.entries( this.attributes ) ) {
      domElement.setAttribute( key, value ) ;
    }

    for( let [key,value] of Object.entries( this.style ) ) {
      domElement.style[ key ] = value ;
    }

    if( this.parentElement != null ) {
      this.parentElement.appendChild( domElement ) ;
    }

    return domElement ;
  }

}