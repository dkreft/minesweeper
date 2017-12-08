import Grid from './js/Grid'

// Send to Kyle Kennaw <kyle.kennaw@faithlife.com>

MAIN: {
  const [rows = 10, cols = 10, numMines = 5] = process.argv.slice(2)

  const grid = new Grid({
    rows: Number(rows),
    cols: Number(cols),
    numMines: Number(numMines),
  })

  displayGrid(grid)
}

function displayGrid(grid) {
  grid.matrix.forEach((row) => {
    const display = row.map((c) => {
      return ( c.hasMine ) ? '[*]' : '[ ]'
    })
    console.log(display.join(''))
  })
}
