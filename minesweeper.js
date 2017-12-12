import chalk from 'chalk'
import readline from 'readline'

import Grid from './src/grid'

const DEFAULT_NUM_ROWS = 8
const DEFAULT_NUM_COLS = 8
const DEFAULT_NUM_MINES = 5

MAIN: {
  const [
    rows = DEFAULT_NUM_ROWS,
    cols = DEFAULT_NUM_COLS,
    numMines = DEFAULT_NUM_MINES,
  ] = process.argv.slice(2)

  const grid = new Grid({
    rows: Number(rows),
    cols: Number(cols),
    numMines: Number(numMines),
  })

  playGame(grid)
}

/*
 * @param {Grid}
 */
function playGame(grid) {
  displayGrid({ grid })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.setPrompt('Enter coordinates [top left is `0 0` (row col)]: ')
  rl.prompt()

  rl.on('line', (answer) => {
    const [col, row] = answer.split(/\s+/).map(Number)

    const cell = grid.select({ row, col })

    displayGrid({ grid })

    if ( cell && cell.hasMine ) {
      console.log(chalk.bold('\n----- BOOOM ------\n'))
      displayGrid({ grid, reveal: true })
      rl.close()

      return
    }

    rl.prompt()
  })
}

/*
 * Renders a colored ASCII grid to stdout that reflects the state
 * of the supplied Grid instance.
 *
 * @param {Object} args
 * @param {Grid} grid
 * @param {Boolean} [reveal=false] - reveals all mines when true
 */
function displayGrid({ grid, reveal = false }) {
  grid.visitRows((row) => {
    console.log(renderRow({ row, reveal })
  })
}

/*
 * @param {Object} args
 * @param {Cell[]} row
 * @param {Boolean} reveal - expose mines if true
 *
 * @returns {String}
 */
function renderRow({ row, reveal }) {
  const rows = row.map((c) => {
    if ( reveal && c.hasMine ) {
      return chalk.red.bold(' ! ')
    }

    if ( c.isOpen ) {
      return ( c.minedNeighborCount > 0 ) ? ` ${ c.minedNeighborCount } ` : '   '
    }

    return chalk.bgRgb(200, 200, 200)(' ? ')
  })

  return rows.join('')
}
