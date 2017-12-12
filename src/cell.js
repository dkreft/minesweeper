export default class Cell {
  /**
   * @param {Object} args
   * @param {Boolean} [hasMine=false]
   * @param {Boolean} [isOpen=false] - true if the cell has been uncovered
   */
  constructor({ hasMine = false, isOpen = false } = {}) {
    // By convention, since I want these members to be part of the
    // public API, I'm going to create documented accessors/mutators
    // for them.
    this._isOpen = isOpen
    this._hasMine = hasMine

    this._minedNeighborCount = 0
  }

  /**
   * @type {Boolean}
   */
  get isOpen() {
    return this._isOpen
  }

  /**
   * @type {Boolean}
   */
  get hasMine() {
    return this._hasMine
  }

  /**
   * @type {Number} the number of adjacent cells that have mines
   */
  get minedNeighborCount() {
    return this._minedNeighborCount
  }

  /**
   * @type {Number}
   */
  set minedNeighborCount(count) {
    this._minedNeighborCount = count
  }

  /**
   * Opens the cell, exposing its contents.
   */
  open() {
    this._isOpen = true
  }
}
