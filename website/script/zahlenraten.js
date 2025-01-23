/**
 * Represents a guess.
 * @property {boolean} IsCorrect
 * @property {boolean} IsInBounds
 * @static @property {number} targetNumber
 * @static @property {number} lowerLimit
 * @static @property {number} upperLimit
 */
class UserGuess {

  static targetNumber ;
  static lowerLimit ;
  static upperLimit ;
  static {
    this.lowerLimit = 1 ;
    this.upperLimit = 100 ;
    this.targetNumber = numberBetween( this.lowerLimit, this.upperLimit ) ;
  }
  
  /**
   * @constructor 
   * @param {number} userNumber - The number the user guessed.
   */
  constructor( userNumber ) {
    
    this.number = parseInt( userNumber ) ;
    
    this._guessRelation = "invalid" ;
    
    if (isNaN(this.number)) {
      
      this._guessRelation = "not a number";
      
    } else if (!this.IsInBounds) {
      
      this._guessRelation = "out of bounds" ;
      
    } else if (this.number > UserGuess.targetNumber) {
      
      this._guessRelation = "too high" ;
      
    } else if (this.number < UserGuess.targetNumber) {
      
      this._guessRelation = "too low" ;
      
    } else if (this.number == UserGuess.targetNumber) {
      
      this._guessRelation = "correct" ;
    }
    
    this.offBy = Math.abs( this.number - UserGuess.targetNumber ) ;

    
    this.__proto__.toString = function () {
      return (
        `${this.number} <span class="sidenote">[` +
        ((!this.IsCorrect) ?
          `${(this.number > UserGuess.targetNumber) ?
            "🔺" :
            "🔻"
          }${this.offBy}` :
        "🏆") +
        "]</span>"
      ) ;
    }
  }
  
  /**
   * @returns {boolean}
   */
   get IsInBounds() {
     return (
      this.number >= UserGuess.lowerLimit &&
      this.number <= UserGuess.upperLimit
    ) ;
   }
  
  /**
   * @returns {boolean}
   */
   get IsCorrect() {
     return (this.number == UserGuess.targetNumber) ;
   }
}

/**
 * @param {number} sides 
 * @returns {number}
 */
function rollDie( sides ) {
  /*
    Rounding the random number down is equivalent to common randInt 
    methods which produce a value beginning with zero, not including the
    given multiplier.
    Therefore I am doing it this way, rather than rounding up.
  */
  return 1 + Math.floor( Math.random() * sides ) ;
}

/**
 * @param {number} lowerLimit
 * @param {number} upperLimit
 * @returns {number}
 */
function numberBetween( lowerLimit, upperLimit ) {
  return rollDie( 1 + upperLimit - lowerLimit ) + lowerLimit ;
}


/**
 * @param {number} lowerLimit
 * @param {number} upperLimit
 * @param {number} attempts 
 * @returns {array} 
 */
function zahlenraten( lowerLimit, upperLimit, attempts ) {
  const guessPrompt = `Guess a number between ${lowerLimit} and ${upperLimit}:`;
  const nanNotifier = "That wasn't a number!" ;
  const oobNotifier = "Your guess was out of bounds!" ;
  UserGuess.targetNumber = numberBetween( lowerLimit, upperLimit ) ;
  UserGuess.lowerLimit = lowerLimit ;
  UserGuess.upperLimit = upperLimit ;

  let listOfAllGuesses = [] ;
  
  console.log( `targetNumber: ${UserGuess.targetNumber}` ) ;
  
  // with this prompt the program begins
  let currentGuess  = new UserGuess( prompt(
    `You have ${attempts} attempts to guess the secret number ` +
    `between ${lowerLimit} and ${upperLimit}.\n Have fun!`
  ) );
  attempts-- ;

  while( !currentGuess.IsCorrect && attempts > 0 )
  {
    const attemptsNotifier = `You have ${attempts} attempts left.` ;
    if( isNaN(currentGuess.number) )
    {
      currentGuess = new UserGuess( prompt(
        nanNotifier +
        (( listOfAllGuesses.length > 0 ) ? 
          "\nYour last guess was " +
          listOfAllGuesses.slice(-1)[0].Output() + ".\n" :
          "\n") +
        `${attemptsNotifier}\n${guessPrompt}`
      ) ) ;
      
    } else if( !currentGuess.IsInBounds ) {
      currentGuess = new UserGuess( prompt(
        oobNotifier +
        (( listOfAllGuesses.length > 0 ) ? 
          "\nYour last guess was " +
          listOfAllGuesses.slice(-1)[0].Output() + ".\n" :
          "\n") +
        `${attemptsNotifier}\n${guessPrompt}`
      ) ) ;
    } else {
      listOfAllGuesses.push( currentGuess ) ;
      attempts-- ;
      currentGuess = new UserGuess( prompt(
        `Wrong!\nYour guess of ${currentGuess.number} ` +
        `was ${currentGuess._guessRelation}.\n${attemptsNotifier} Try again:`
      ) ) ;
    }
  }
  listOfAllGuesses.push( currentGuess ) ;
  if ( currentGuess.IsCorrect ) {
    alert( `Congratulations! The number was ${UserGuess.targetNumber}.\n` +
      `You got there with ${attempts} attempts to spare!` ) ;
  } else {
    alert( "Oh no! You didn't get there in time.\n" + 
      `The number was ${UserGuess.targetNumber}.\nPress F5 to try again!` ) ;
  }

  return listOfAllGuesses ;
}


/**
 * @param {array} values - the list of values to be enumerated
 * @param {HTMLListElement} target - the dom Element into which the listing is 
 * to be inserted
 */
function listValuesInHTML(values,domElement) {
  values.forEach(item => {
    console.log( item.toString() ) ;
    domElement.innerHTML += '<li>' + item.toString() + '</li>' ;
  } ) ;
}


window.onload = function () {
  listValuesInHTML(
    zahlenraten( 1, 67, 8 ),
    document.getElementById("guessList")
  ) ;
}