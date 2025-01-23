

/**
 * @property {string} name
 * @property {number} quantity
 */
class ShoppingListItem {
  
  /**
   * @param {string} name
   * @param {number} quantity
   */
  constructor( name, quantity ) {
    this.name     = name ;
    this.quantity = (typeof quantity != 'undefined' && !isNaN(quantity)) ?
      quantity :
      1 ;
    
    this.__proto__.toString = function() {
      return `${this.quantity}x ${this.name}`;
    }
  }
}

/**
 * @param {string} userInput
 * @returns {ShoppingListItem}
 */
 function evaluateUserInput( userInput ) {
  const reUserInput = /(?<quantity>[0-9]+)*\s*(?<name>[\w\u0080-\uFFFF\s0-9]+)/;
  const { name, quantity } = reUserInput.exec( userInput ).groups ;
  
  return new ShoppingListItem( name, parseInt( quantity ) ) ;
}


/**
 * @returns {array}
 */
function einkaufsListe() {
  const shoppingListPrompt = "Please enter the item you wish to add." +
    "\n(Enter 'done' to exit.)";
  
  let continuePrompting = true ;
  let shoppingList = [] ;
  
  while( continuePrompting ) {
    
    let userInput = prompt( shoppingListPrompt ) ;
    
    if( userInput == "done" )
    {
      continuePrompting = false ;
    } else {
      shoppingList.push( evaluateUserInput( userInput ) ) ;
    }
  }
  
  return shoppingList ;
}


/**
 * @param {array} values - the list of values to be enumerated
 * @param {HTMLListElement} target - the dom Element into which the listing is 
 * to be inserted
 */
function auflisten(values,domElement) {
  values.forEach(item => {
    domElement.innerHTML += '<li>' + item.toString() + '</li>' ;
  } ) ;
}


window.onload = function () {
  auflisten( einkaufsListe(), document.getElementById("shoppingList") );
}

/*******************************************************/
/* Gebe einem <ol> oder <ul> element id="shoppingList" */
/*******************************************************/