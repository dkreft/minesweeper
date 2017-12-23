/**
 * @param {Object} args
 * @param {Number} args.numCells
 * @param {Number} args.numMines
 *
 * @returns {Set} containing the indices of the cells that should
 *   be mined
 */
export function generateMinePositions({ numCells, numMines }) {
  const positions = new Set()

  if ( !numCells || !numMines ) {
    return positions
  }

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

export /*
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


/* Generates a random integer between [min, max)
 *
 * @param {Object} args
 * @param {Number} [min=0]
 * @param {Number} max
 */
function makeRandomNumber({ min = 0, max }) {
  return Math.floor(Math.random() * max) + min
}
