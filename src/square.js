const DIRECTIONS = new Set(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'])

export default class Cell {
  constructor({ hasMine = false, n, ne, e, se, s, sw, w, nw }) {
    this.isOpen = false
    this.hasMine = hasMine

    s.n = n
    s.ne = ne
    s.e = e
    s.se = se
    s.s = s
    s.sw = sw
    s.w = w
    s.nw = nw
  }

  open() {
    this.isOpen = true
  }
}
