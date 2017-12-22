import Cell from './cell'

const DEFAULT_NUM_MINES = 10
const DEFAULT_ROW_COUNT = 8
const DEFAULT_COL_COUNT = 8

export default class Grid {
  /**
   * @param {Object} args
   * @param {Number} [args.rows=8]
   * @param {Number} [args.cols=8]
   * @param {Number} [args.numMines=10]
   */
  constructor({
    rows = DEFAULT_ROW_COUNT,
    cols = DEFAULT_COL_COUNT,
    numMines = DEFAULT_NUM_MINES,
  })
  {
    this.numRows = rows
    this.numCols = cols

    this.numSafeCellsRemaining = (rows * cols) - numMines

    this.matrix = buildMatrix({
      rows,
      cols,
      numMines,
    })
  }

  /**
   * Select a cell by its zero-based coordinates.
   *
   * @param {Object} args
   * @param {Number} args.row
   * @param {Number} args.col
   *
   * @returns {Cell|undefined} the selected cell, or `undefined` if
   *   there is no cell corresponding to the given coordinates
   */
  select({ row, col }) {
    const selected = this.getCell({ row, col })
    if ( !selected ) {
      return
    }

    selected.open()
    --this.numSafeCellsRemaining

    if ( !selected.hasMine && !selected.hasMinedNeighbor ) {
      openUnminedNeighbors.call(this, row, col)
    }

    return selected
  }

  /**
   * Retrieves a cell at the given coordinates, where (0, 0)
   * is at the bottom left.
   *
   * @param {Object} args
   * @param {Number} args.row - zero-based row
   * @param {Number} args.col - zero-based col
   *
   * @returns {Cell|undefined}
   */
  getCell({ row, col }) {
    if ( row == null || row == null || row >= this.numRows ) {
      return
    }

    // Naturally, the 0,0 cell is in the top-left corner, but I
    // want it to be in the bottom left
    const rowFromBottom = (this.numRows - 1) - row

    const cells = this.matrix[rowFromBottom] || []

    return cells[col]
  }

  /**
   * Iterates over each row of the grid, invoking `fn` once per row
   * with an array of Cell objects, one for each column in the row.
   *
   * @param {Function} visitor
   */
  visitRows(visitor) {
    this.matrix.forEach(visitor)
  }
}

/*
 * @param {Object} args
 * @param {Number} args.rows
 * @param {Number} args.cols
 * @param {Number} args.numMines
 *
 * @returns {Array<Cell[]>}
 */
function buildMatrix({ rows, cols, numMines }) {
  const minePositions = generateMinePositions({
    numCells: rows * cols,
    numMines,
  })

  const matrix = []

  let mineNum = 0
  for ( let rowIdx = 0; rowIdx < rows; ++rowIdx ) {
    const row = []

    for ( let colIdx = 0; colIdx < cols; ++colIdx ) {
      const hasMine = minePositions.has(mineNum)
      const cell  = new Cell({ hasMine })
      row.push(cell)

      ++mineNum
    }

    matrix.push(row)
  }

  return addMinedNeighborCounts(matrix)
}

/*
 * Populates each cell wth the count of mined cells immediately
 * adjacent to it.
 *
 * N.B.: Modifies records in place.
 *
 * @param {Array<Cell[]>}
 *
 * @returns {Array<Cell[]>}
 */
function addMinedNeighborCounts(matrix) {
  matrix.forEach((row, rowIdx) => {
    const prevRow = matrix[rowIdx - 1]
    const nextRow = matrix[rowIdx + 1]

    // TODO: I'm not thrilled with this implementation...seems like
    // there's some opportunity to DRY this up here.
    row.forEach((cell, colIdx) => {
      const leftIdx  = colIdx - 1
      const rightIdx = colIdx + 1

      let minedNeighbors = 0

      if ( prevRow ) {
        const nw = prevRow[leftIdx]
        if ( nw && nw.hasMine ) {
          ++minedNeighbors
        }
        const n = prevRow[colIdx]
        if ( n && n.hasMine ) {
          ++minedNeighbors
        }
        const ne = prevRow[rightIdx]
        if ( ne && ne.hasMine ) {
          ++minedNeighbors
        }
      }

      const w = row[leftIdx]
      if ( w && w.hasMine ) {
        ++minedNeighbors
      }
      const e = row[rightIdx]
      if ( e && e.hasMine ) {
        ++minedNeighbors
      }

      if ( nextRow ) {
        const sw = nextRow[leftIdx]
        if ( sw && sw.hasMine ) {
          ++minedNeighbors
        }
        const s = nextRow[colIdx]
        if ( s && s.hasMine ) {
          ++minedNeighbors
        }
        const se = nextRow[rightIdx]
        if ( se && se.hasMine ) {
          ++minedNeighbors
        }
      }

      cell.minedNeighborCount = minedNeighbors
    })
  })

  return matrix
}

/*
 * @param {Object} args
 * @param {Number} args.numCells
 * @param {Number} args.numMines
 *
 * @returns {Set} containing the indices of the cells that should
 *   be mined
 */
// TODO: this should be in a lib file so it can be unit tested.
function generateMinePositions({ numCells, numMines }) {
  const positions = new Set()

  if ( numMines > numCells ) {
    // TODO: Perhaps a bit obnoxious to throw an error instead of
    // catching this case way earlier.
    throw new Error('Number of mines must be less than or equal to the number of cells')
  }

  while ( positions.size !== numMines ) {
    const num = makeRandomNumber({ max: numCells })
    positions.add(num)
  }

  return positions
}

/* Generates a random integer between [min, max)
 *
 * @param {Object} args
 * @param {Number} [min=0]
 * @param {Number} max
 */
// TODO: move to a lib file
function makeRandomNumber({ min = 0, max }) {
  return Math.floor(Math.random() * max) + min
}

/*
 * @this {Grid}
 */
// TODO: Move this into a lib so we can test it?
function openUnminedNeighbors(row, col) {
  const startRow = Math.max(0, row - 1)
  const endRow = Math.min(row + 1, this.numRows - 1)

  const startCol = Math.max(0, col - 1)
  const endCol   = Math.min(col + 1, this.numCols - 1)

  for ( let r = startRow; r <= endRow; ++r ) {
    for ( let c = startCol; c <= endCol; ++c ) {
      const neighbor = this.getCell({
        row: r,
        col: c,
      })

      if ( neighbor.isOpen ) {
        continue
      }

      if ( neighbor.hasMine ) {
        break
      }

      neighbor.open()
      --this.numSafeCellsRemaining

      if ( neighbor.hasMinedNeighbor ) {
        continue
      }

      openUnminedNeighbors.call(this, r, c)
    }
  }
}
