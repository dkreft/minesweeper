import {
  _require,
  expect,
} from '../../helper'

const GridUtils = _require('lib/grid-utils')

describe('GridUtils', () => {
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
})
