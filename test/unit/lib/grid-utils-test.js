import {
  _require,
  expect,
  sinon,
} from '../../helper'

const Cell = _require('cell')
const GridUtils = _require('lib/grid-utils')

describe('GridUtils', () => {
  def('sandbox', () => sinon.sandbox.create())

  afterEach(() => $sandbox.restore())

  describe('.generateMinePositions()', () => {
    def('numCells', () => void 0)
    def('numMines', () => void 0)

    subject(() => GridUtils.generateMinePositions({
      numCells: $numCells,
      numMines: $numMines,
    }))

    context('when numCells is undefined', () => {
      def('numCells', () => void 0)

      it('returns an empty Set', () => {
        expect($subject).to.be.instanceOf(Set).and.have.property('size', 0)
      })
    })

    context('when numCells is 0', () => {
      def('numCells', () => 0)

      it('returns an empty Set', () => {
        expect($subject).to.be.instanceOf(Set).and.have.property('size', 0)
      })
    })

    context('when numMines is undefined', () => {
      def('numMines', () => void 0)

      it('returns an empty Set', () => {
        expect($subject).to.be.instanceOf(Set).and.have.property('size', 0)
      })
    })

    context('when numMines is 0', () => {
      def('numMines', () => 0)

      it('returns an empty Set', () => {
        expect($subject).to.be.instanceOf(Set).and.have.property('size', 0)
      })
    })

    context('when numMines > numCells', () => {
      def('numCells', () => 9)
      def('numMines', () => $numCells + 1)

      it('throws an error', () => {
        expect(() => $subject).to.throw(/less than or equal to the number of cells/)
      })
    })

    context('when numMines < numCells', () => {
      def('numCells', () => 10000)
      def('numMines', () => $numCells - 10)

      it('returns a Set whose size is the same as numMines', () => {
        expect($subject).to.be.instanceOf(Set).and.have.property('size', $numMines)
      })

      // Not a great test, but testing randomness is hard
      it('contains no number < 0', () => {
        const minValue = Math.min(...Array.from($subject))

        expect(minValue).to.be.at.least(0)
      })

      it('contains no number > (numCells - 1)', () => {
        const maxValue = Math.max(...Array.from($subject))

        expect(maxValue).to.be.at.most($numCells - 1)
      })
    })
  })

  describe('.addMinedNeighborCounts()', () => {
    def('matrix', () => buildMatrix({
      minesAt: new Set($minePositions),
    }))
    def('minePositions', () => [0])

    beforeEach(() => {
      GridUtils.addMinedNeighborCounts($matrix)
    })

    context('when there are no mines', () => {
      def('minePositions', () => [])

      it('all cells have a 0 mined neighbor count', () => {
        flattenMatrix($matrix).forEach((cell) => {
          expect(cell.minedNeighborCount).to.equal(0)
        })
      })
    })

    const tests = [
      {
        minesAt: [0],
        counts: [0, 1, 0,
                 1, 1, 0,
                 0, 0, 0],
      },
      {
        minesAt: [1],
        counts: [1, 0, 1,
                 1, 1, 1,
                 0, 0, 0],
      },
      {
        minesAt: [2],
        counts: [0, 1, 0,
                 0, 1, 1,
                 0, 0, 0],
      },
      {
        minesAt: [3],
        counts: [1, 1, 0,
                 0, 1, 0,
                 1, 1, 0],
      },
      {
        minesAt: [4],
        counts: [1, 1, 1,
                 1, 0, 1,
                 1, 1, 1],
      },
      {
        minesAt: [5],
        counts: [0, 1, 1,
                 0, 1, 0,
                 0, 1, 1],
      },
      {
        minesAt: [6],
        counts: [0, 0, 0,
                 1, 1, 0,
                 0, 1, 0],
      },
      {
        minesAt: [7],
        counts: [0, 0, 0,
                 1, 1, 1,
                 1, 0, 1],
      },
      {
        minesAt: [8],
        counts: [0, 0, 0,
                 0, 1, 1,
                 0, 1, 0],
      },
      {
        minesAt: [0, 2, 6, 8],
        counts: [0, 2, 0,
                 2, 4, 2,
                 0, 2, 0],
      },
      {
        minesAt: [1, 3, 5, 7],
        counts: [2, 2, 2,
                 2, 4, 2,
                 2, 2, 2],
      },
      {
        minesAt: [0, 1, 2, 3, 5, 6, 7, 8],
        counts: [2, 4, 2,
                 4, 8, 4,
                 2, 4, 2],
      },
    ]

    tests.forEach((test) => {
      const intro = ( test.minesAt.length == 1 )
        ? `when there is a mine`
        : `when there are mines`

      context(`${ intro } at ${ test.minesAt }`, () => {
        def('minePositions', () => test.minesAt)

        it('the surrounding cells show the correct counts', () => {
          expectCounts(test.counts)
        })
      })
    })
  })
})

function expectCounts(countMap) {
  flattenMatrix($matrix).forEach((cell, i) => {
    expect(cell.minedNeighborCount).to.equal(countMap[i])
  })
}

function flattenMatrix(matrix) {
  return matrix.reduce((collector, row) => {
    return collector.concat(...row)
  }, [])
}

function buildMatrix({ minesAt }) {
  return [
    [
      new Cell({ hasMine: minesAt.has(0) }),
      new Cell({ hasMine: minesAt.has(1) }),
      new Cell({ hasMine: minesAt.has(2) }),
    ],
    [
      new Cell({ hasMine: minesAt.has(3) }),
      new Cell({ hasMine: minesAt.has(4) }),
      new Cell({ hasMine: minesAt.has(5) }),
    ],
    [
      new Cell({ hasMine: minesAt.has(6) }),
      new Cell({ hasMine: minesAt.has(7) }),
      new Cell({ hasMine: minesAt.has(8) }),
    ],
  ]
}
