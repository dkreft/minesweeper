import Cell from './cell'

const DEFAULT_NUM_MINES = 10
const DEFAULT_ROW_COUNT = 8
const DEFAULT_COL_COUNT = 8

export default class Grid {
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

  select({ col, row }) {
    if ( !this.matrix[row] || !this.matrix[row][col] ) {
      return
    }

    const selected = this.matrix[row][col]

    if ( selected ) {
      selected.open()
    }

    return selected
  }
}

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

function addMinedNeighborCounts(matrix) {
  matrix.forEach((row, rowIdx) => {
    const prevRow = matrix[rowIdx - 1]
    const nextRow = matrix[rowIdx + 1]

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

function generateMinePositions({ numCells, numMines }) {
  const positions = new Set()

  while ( positions.size < numMines ) {
    const num = makeRandomNumber({
      max: numCells - 1,
    })

    positions.add(num)
  }

  return positions
}

function makeRandomNumber({ min = 1, max }) {
  return Math.floor(Math.random() * max) + min
}
