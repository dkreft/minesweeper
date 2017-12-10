import chalk from 'chalk'
import readline from 'readline'

import Grid from './src/grid'

// Send to Kyle Kennaw <kyle.kennaw@faithlife.com>

MAIN: {
  const [rows = 10, cols = 10, numMines = 5] = process.argv.slice(2)

  const grid = new Grid({
    rows: Number(rows),
    cols: Number(cols),
    numMines: Number(numMines),
  })

  playGame(grid)
}

function playGame(grid) {
  displayGrid({ grid })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.setPrompt('Enter coordinates of cell to uncover: (row col) ')
  rl.prompt()

  rl.on('line', (answer) => {
    const [row, col] = answer.split(/\s+/).map(Number)

    const cell = grid.select({
      row,
      col,
    })

    displayGrid({ grid })

    if ( cell && cell.hasMine ) {
      console.log('----- BOOOM ------')
      displayGrid({ grid, reveal: true })
      rl.close()

      return
    }

    rl.prompt()
  })
}

function displayGrid({ grid, reveal = false }) {
  const makeRowDisplay = (row) => {
    return row.map((c) => {
      if ( reveal && c.hasMine ) {
        return chalk.red.bold(' ! ')
      }

      if ( c.isOpen ) {
        return ( c.minedNeighborCount > 0 ) ? ` ${ c.minedNeighborCount } ` : '   '
      }

      return chalk.bgRgb(200, 200, 200)(' ? ')
    })
  }

  grid.matrix.forEach((row) => {
    const rowDisplay = makeRowDisplay(row)
    console.log(rowDisplay.join(''))
  })
}
