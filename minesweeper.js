import readline from 'readline'

import Grid from './js/Grid'

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
  });

  rl.setPrompt('Enter coordinates of cell to uncover: (row col) ')
  rl.prompt()

  rl.on('line', (answer) => {
    const [row, col] = answer.split(/\s+/)

    const cell = grid.select({
      row: Number(row),
      col: Number(col),
    })

    displayGrid({ grid })

    if ( cell.hasMine ) {
      console.log('----- BOOOM ------')
      displayGrid({ grid, reveal: true })
      rl.close()

      return
    }

    rl.prompt()
  })
}

function displayGrid({ grid, reveal = false }) {
  grid.matrix.forEach((row) => {
    const display = row.map((c) => {
      if ( c.isOpen || reveal ) {
        return ( c.hasMine ) ? ' ! ' : ' _ '
      }

      return ' ? '
    })
    console.log(display.join(''))
  })
}
