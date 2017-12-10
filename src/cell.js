const DIRECTIONS = new Set(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'])

export default class Cell {
  constructor({ hasMine = false, isOpen = false }) {
    this.isOpen = isOpen
    this.hasMine = hasMine

    this.minedNeighborCount = 0
  }

  open() {
    this.isOpen = true
  }
}
