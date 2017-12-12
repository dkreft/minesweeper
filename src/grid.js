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
    if ( !this.matrix[row] || !this.matrix[row][col] ) {
      return
    }

    const selected = this.matrix[row][col]

    if ( selected ) {
      selected.open()
    }

    return selected
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

// TODO: this should be in a lib file so it can be unit tested.
function generateMinePositions({ numCells, numMines }) {
  const positions = new Set()

  if ( numMines > numCells ) {
    // TODO: Perhaps a bit obnoxious to throw an error instead of
    // catching this case way earlier.
    throw new Error('Number of mines must be less than or equal to the number of cells')
  }

  while ( positions.size < numMines ) {
    const num = makeRandomNumber({
      max: numCells,
    })

    positions.add(num)
  }

  return positions
}

// TODO: move to a lib file
function makeRandomNumber({ min = 1, max }) {
  return Math.floor(Math.random() * max) + min
}
