/**
 * A two-dimensional set of coordinates.
 * @property {Number} x - Horizontal coordinate.
 * @property {Number} y - Vertical coordinate.
 */
class Coordinate {

  /**
   * @constructor
   * @param {Number} posX - Horizontal coordinate.
   * @param {Number} posY - Vertical coordinate.
   */
  constructor(posX, posY) {
    this.x = posX ;
    this.y = posY ;
  }
}

/**
 * @property {HTMLElement} playArea
 * @property {Array.<MemoryCard>} cards
 * @property {Boolean} isSolved
 * 
 * @property {{minutes:Number,seconds:Number,raw:Number}} elapsedTime
 */
class MemoryGame {

  /**
   * @constructor
   * @param {HTMLElement} playArea 
   */
  constructor( playArea, pairs ) {
    /**
     * The HTML-Element designated as the play area.
     * @type {HTMLElement}
     */
    this.playArea = playArea ;

    /**
     * An array containing all MemoryCard objects currently in use by the
     * MemoryGame instance.
     * @type {Array.<MemoryCard>}
     */
    this.cards = [] ;

    /**
     * The previously selected MemoryCard.
     * @private
     * @type {MemoryCard}
     */
    this._previousCard = null ;

    /**
     * The timestamp of the first time the user clicked a valid MemoryCard.
     * @private
     * @type {Date}
     */
    this._firstInteraction = null ;

    /**
     * The number of card-pairs revealed by the user.
     * @type {Number}
     */
    this.attempts = 0 ;

    this.populate( pairs ) ;
  }

  /**
   * Returns true if the number of solved MemoryCards matches the total number
   * of MemoryCard instances in use by the game.
   * @see MemoryGame.cards
   * @readonly
   * @type {Boolean}
   */
  get isSolved () {
    let solvedCards = 0 ;
    this.cards.forEach( (card) => {
      if ( card._isSolved ) { solvedCards++ ; }
    } ) ;
    return ( solvedCards == this.cards.length ) ;
  }

  /**
   * Returns the time that has elapsed since the user first clicked on a valid
   * MemoryCard.
   * @type {{minutes:Number,seconds:Number,raw:Number}}
   */
  get elapsedTime () {
    if(this._firstInteraction == null) { return {
      "minutes":0,
      "seconds":0,
      "raw":0
    } ;}
    let rawms   = Date.now() - this._firstInteraction ;
    let seconds = Math.floor(rawms / 1000) ;
    return {
      "minutes":Math.floor(seconds/60),
      "seconds":seconds%60,
      "raw":rawms
    } ;
  }

  /**
   * Populates the cards property from the motifs in memoryLibrary.motive and
   * then fills the play area (assigned at construction) with img-Elements
   * matching the MemoryCard elements created from the motifs.
   * @see MemoryCard
   * @param {Number} pairs 
   */
  populate ( pairs ) {
    const temp = memoryLibrary.motive.slice(
      (pairs > 0) ? Math.max(memoryLibrary.motive.length-pairs,0) : 0
    ).map(
      ( item ) => { return new MemoryCard(item) ; }
    ) ;
    this.cards = memoryLibrary.shuffle(
      temp.concat(
        temp.map( ( item ) => { return new MemoryCard( item.motiv ) ; } )
      )
    ) ;

    for( let card of this.cards ) {
      card.domElement = this.playArea.appendChild(
        document.createElement("img")
      ) ;
      card.domElement.setAttribute("src", card.image ) ;
    }
  }

  /**
   * Resets the state of all cards, solved cards included and then shuffles
   * the cards on the board.
   */
  newBoard () {
    this.cards.forEach( (card) => { card.unSolve() } ) ;
    this.cards = memoryLibrary.shuffle( this.cards ) ;
  }

  /**
   * Resets the state of all cards. Solved cards remain face up.
   */
  resetBoard () {
    this.cards.forEach( (card) => { card.unReveal() } ) ;
  }

  /**
   * Attempts to retrieve the MemoryCard object whose corresponding img-Element
   * matches the xy-Coordinates of the PointerEvent.<br/>
   * Will return null if no match is found, or if card matched has already been
   * solved (and therefore virtually removed from the play area).
   * @param {PointerEvent} event
   * @returns {MemoryCard|null}
   */
  findCard( event ) {
     return this.cards.find( (card) => {
      return (
        !card._isSolved &&
        card.containsPointer( new Coordinate( event.x, event.y ) )
      ) ;
    } ) ?? null ;
  }

  /**
   * Performs the following checks in sequence:<br/>
   * If card is null or the previous card:<br/>
   * ➡️ returns false.<br/>
   * Otherwise:<br/>
   * ➡️ Begins counting playtime if this is the first card selected.<br/>
   * ➡️ If the previous card is null:<br/>
   * ➡️ ➡️ Then this is a new match. Turn all cards face down.<br/>
   * ➡️ ➡️ Then reveal the currently selected card.<br/>
   * ➡️ ➡️ Then save the currently selected card as the previous card.<br/>
   * ➡️ Otherwise:<br/>
   * ➡️ ➡️ Reveal the currently selected card.<br/>
   * ➡️ ➡️ Then, if the current and previous card have the same motif:<br/>
   * ➡️ ➡️ ➡️ Mark both cards as solved.<br/>
   * ➡️ ➡️ Then clear the previous card and return the isSolved property of
   * the currently selected card.
   * @param {MemoryCard} card
   * @returns {Boolean} if a successful match has been made
   */
  tryMatch( card ) {
    if( card != null && card != this._previousCard ){
      if( this._firstInteraction == null ) {
        this._firstInteraction = Date.now() ;
      }
      if ( this._previousCard == null ) {
        // reset
        this.resetBoard() ;
        // reveal the card and update the image
        card.reveal() ;
        this._previousCard = card ;
      } else {
        // reveal the card and update the image
        this.attempts++ ;
        if ( this._previousCard.motiv == card.motiv ) {
          // set the cards' isSolved to true, but DON'T update the image
          // it will be set to imageEmpty with the NEXT validateBoard
          this._previousCard.solve() ;
          card.solve() ;
        } else {
          card.reveal() ;
        }
        this._previousCard = null ;
        return card._isSolved;
      }
      return false;
    }
    return false ;
  }

}

/**
 * 
 * @property {Node} domElement
 * @property {String} motiv
 * @property {String} image
 * @property {Boolean} isRevealed
 */
class MemoryCard {

  /**
   * The path of the image to use when a MemoryCard is face-down.
   * @see MemoryCard.image
   * @static
   * @readonly
   * @type {String}
   */
  static imageBackside = `./client/bilder/rueckseite.jpg` ;
  /**
   * The path of the image to use when a MemoryCard is solved (invisible).
   * @see MemoryCard.image
   * @static
   * @readonly
   * @type {String}
   */
  static imageEmpty    = "./client/bilder/leer.gif" ;

  /**
   * @constructor
   * @param {String} motiv 
   */
  constructor(motiv) {
    /**
     * Whether or not the card is revealed.<br/>
     * @private
     * @see MemoryCard.isRevealed
     * @type {Boolean}
     */
    this._isRevealed = false ;

    /**
     * The path of the image used when the card is face-up.
     * @private
     * @type {String}
     */
    this._image = `./client/bilder/${motiv}.jpg` ;

    /**
     * The value of the previous _image.
     * @private
     * @type {String}
     */
    this._previousImage = "" ;

    /**
     * The motif assigned to the card.
     * @type {String}
     */
    this.motiv = motiv ;
    /**
     * Whether or not the card is solved.
     * @private
     * @type {Boolean}
     */
    this._isSolved = false ;
    /**
     * Whether or not the card is hidden.
     * @private
     * @type {Boolean}
     */
    this._isHidden = false ;
    /**
     * The img-Element assigned to the card.
     * @type {HTMLImageElement}
     */
    this.domElement ;

    /**
     * Returns true, if the xy-Coordinates of the PointerEvent fall within the
     * bounding rectangle of the img-Element assigned to this card.
     * @method
     * @param {PointerEvent} event 
     * @returns {Boolean}
     */
    this.containsPointer = function ( event ) {
      const boundingBox = this.domElement.getBoundingClientRect() ;
      return (
        event.x >= boundingBox.left && event.x <= boundingBox.right &&
        event.y >= boundingBox.top  && event.y <= boundingBox.bottom
      ) ;
    }

    /**
     * Turns the card face-up.
     * @method
     */
    this.reveal = function () {
      this.isRevealed = true ;
      this.domElement.setAttribute("src", this.image) ;
    }

    /**
     * Turns the card face-down.
     * @method
     */
    this.unReveal = function () {
      this._isRevealed = false ;
      this.domElement.setAttribute("src", this.image) ;
    }

    /**
     * Marks the card as unsolved and then turns it face-down.
     * @method
     * @see MemoryCard.unReveal
     */
    this.unSolve = function () {
      this._isSolved    = false ;
      this.unReveal() ;
    }

    /**
     * Marks the cards solved and removes them from the board after one second.
     * @method
     */
    this.solve = function () {
      this._isSolved = true ;
      this.domElement.setAttribute("src", this.image) ;
      window.setTimeout( () => {
        this._isHidden = true ;
        this.domElement.setAttribute("src", this.image) ;
      }, 1000 ) ;
    }

    this.changeFace = function () {
      if( this._previousImage != this.image ) {
        this.domElement.setAttribute("src", this.image) ;
        let event = new Event(
          "c", 
          { bubbles: true, cancelable: false }
        ) ;
        event.target = this.domElement ;
        this.domElement.dispatchEvent(  ) ;
      }
    }
  }

  /**
   * If the card is solved, then its image will be a transparent rectangle.<br/>
   * If the card is revealed, then its image will be the motif assigned to it.<br/>
   * If neither of the above is true, then the card's image will be the cardback
   * shared by all MemoryCard instances.
   * @readonly
   * @type {String}
   */
  get image () {
    return (
      this._isHidden ?
      MemoryCard.imageEmpty : ( 
        this._isRevealed || this._isSolved ?
          this._image :
          MemoryCard.imageBackside
        )
    ) ;
  }

  /**
   * Returns true if the card is revealed, or if it is solved.
   * @type {Boolean}
   */
  get isRevealed () { return (this._isRevealed || this._isSolved) ; }

  /**
   * @ignore
   */
  set isRevealed(value) { this._isRevealed = value ; }

}