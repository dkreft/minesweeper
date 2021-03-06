import {
  _require,
  expect,
  sinon,
} from '../../helper'

const Grid = _require('model/grid')
const Cell = _require('model/cell')
const GridUtils = _require('lib/grid-utils')

describe('Grid', () => {
  def('sandbox', () => sinon.sandbox.create())
  def('model', () => new Grid({
    rows: $rows,
    cols: $cols,
    numMines: $numMines,
  }))
  def('rows', () => void 0)
  def('cols', () => void 0)
  def('numMines', () => void 0)

  afterEach(() => $sandbox.restore())

  describe('.constructor()', () => {
    const minePositions = new Set([5, 10, 12, 35])

    def('rows', () => 5)
    def('cols', () => 7)
    def('numMines', () => minePositions.size)

    const addMinedNeighborCountsResult = []

    beforeEach(() => {
      $sandbox.stub(GridUtils, 'generateMinePositions')
        .returns(minePositions)

      $sandbox.stub(GridUtils, 'addMinedNeighborCounts')
        .returns(addMinedNeighborCountsResult)

      $model
    })

    it('invokes GridUtils.generateMinePositions() with the right args', () => {
      expect(GridUtils.generateMinePositions).to.have.been.calledWith({
        numCells: $rows * $cols,
        numMines: $numMines,
      })
    })

    describe('the matrix passed to GridUtils.addMinedNeighborCounts()', () => {
      subject(() => GridUtils.addMinedNeighborCounts.firstCall.args[0])

      it('has right right number of rows', () => {
        expect($subject).to.have.length($rows)
      })

      it('has the right number of cells in each row', () => {
        // chai-things failed to do the right thing on $model.matrix...
        // it was counting the rows, too, not just the cells in each
        // row.
        $subject.forEach((r) => {
          expect(r).to.have.length($cols)
        })
      })

      it('is called with the correct cells already mined', () => {
        let cellIdx = 0
        $subject.forEach((row) => {
          row.forEach((cell) => {
            const expectedToBeMined = minePositions.has(cellIdx)

            const err = `cell ${ cellIdx } had unexpected value for .hasMine: `
              + expectedToBeMined

            expect(cell.hasMine).to.equal(expectedToBeMined, err)

            ++cellIdx
          })
        })
      })
    })

    it('stores the result of GridUtils#addMinedNeighborCounts in `.matrix`', () => {
      expect($model.matrix).to.equal(addMinedNeighborCountsResult)
    })
  })

  describe('.select()', () => {
    def('col', () => void 0)
    def('row', () => void 0)
    def('foundCell', () => void 0)

    subject(() => $model.select({
      col: $col,
      row: $row,
    }))

    beforeEach(() => {
      $sandbox.stub($model, 'getCell').returns($foundCell)
    })

    it('invokes #getCell() with the correct arguments', () => {
      $subject
      expect($model.getCell).to.have.been.calledWith({
        row: $row,
        col: $col,
      })
    })

    context('when #getCell() returns undefined', () => {
      def('foundCell', () => void 0)

      beforeEach(() => {
        $sandbox.stub(Cell.prototype, 'open')
      })

      it('returns undefined', () => {
        expect($subject).to.be.undefined
      })

      it('does not invoke Cell#open()', () => {
        $subject
        expect(Cell.prototype.open).to.not.have.been.called
      })

      it('does not decrement numSafeCellsRemaining', () => {
        const beforeValue = $model.numSafeCellsRemaining
        $subject
        expect($model.numSafeCellsRemaining).to.equal(beforeValue)
      })
    })

    context('when #getCells() returns a cell', () => {
      def('foundCell', () => new Cell())

      beforeEach(() => {
        $sandbox.stub($foundCell, 'open')
      })

      it('invokes #open() on the returned Cell', () => {
        $subject
        expect($foundCell.open).to.have.been.called
      })

      it('decrements .numSafeCellsRemaining', () => {
        const beforeValue = $model.numSafeCellsRemaining
        $subject
        expect($model.numSafeCellsRemaining).to.equal(beforeValue - 1)
      })

      // TODO: Figure out a way to test the opening of neighbors. I'm
      // thinking this would be a lot easier to move that code into a
      // library so that it can be tested independently.
      it('returns the found cell', () => {
        expect($subject).to.equal($foundCell)
      })
    })
  })

  describe('.getCell()', () => {
    def('row', () => 0)
    def('col', () => 0)

    subject(() => $model.getCell({
      row: $row,
      col: $col,
    }))

    context('when the row is undefined', () => {
      def('row', () => void 0)

      it('returns undefined', () => {
        expect($subject).to.be.undefined
      })
    })

    context('when the row is too big', () => {
      def('row', () => $model.numRows)

      it('returns undefined', () => {
        expect($subject).to.be.undefined
      })

    })

    context('when the col is undefined', () => {
      def('col', () => void 0)

      it('returns undefined', () => {
        expect($subject).to.be.undefined
      })
    })

    context('when the col is too big', () => {
      def('col', () => $model.numCols)

      it('returns undefined', () => {
        expect($subject).to.be.undefined
      })

    })


  })

  describe('.visitRows()', () => {
    def('visitor', () => $sandbox.stub())

    def('rows', () => 3)
    def('cols', () => 5)

    subject(() => $model.visitRows($visitor))

    it('invokes the visitor once per row', () => {
      $subject
      expect($visitor).to.have.callCount($rows)
    })

    it('invokes the visitor with the cells in each row', () => {
      $subject
      expect($visitor.getCall(0)).to.have.been.calledWith($model.matrix[0])
    })
  })
})

function selectIsANoOp() {
  it('returns undefined', () => {
    expect($subject).to.be.undefined
  })

  it('does not invoke Cell#open()', () => {
    $subject
    expect(Cell.prototype.open).not.to.have.been.called
  })
}
