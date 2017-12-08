import Square from './Square'

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

  select({ row, col }) {
    const selected = this.matrix[row][col]

    selected.open()

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
      const square  = new Square({ hasMine })
      row.push(square)

      ++mineNum
    }

    matrix.push(row)
  }

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
