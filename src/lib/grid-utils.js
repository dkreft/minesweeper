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

/* Generates a random integer between [min, max)
 *
 * @param {Object} args
 * @param {Number} [min=0]
 * @param {Number} max
 */
function makeRandomNumber({ min = 0, max }) {
  return Math.floor(Math.random() * max) + min
}
