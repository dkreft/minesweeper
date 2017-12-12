import {
  _require,
  expect,
  sinon,
} from '../helper'

const Grid = _require('grid')
const Cell = _require('cell')

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

  describe('.select()', () => {
    def('col', () => void 0)
    def('row', () => void 0)

    subject(() => $model.select({
      col: $col,
      row: $row,
    }))

    beforeEach(() => {
      $sandbox.stub(Cell.prototype, 'open')
    })

    context('when the row is out of bounds', () => {
      def('row', () => 100000)

      context('when the col is in bounds', () => {
        def('col', () => 1)

        selectIsANoOp()
      })

      context('when the col is out of bounds', () => {
        def('col', () => 9283473)

        selectIsANoOp()
      })
    })

    context('when the row is in bounds', () => {
      def('row', () => 1)

      context('when the col is in bounds', () => {
        def('col', () => 1)

        it('returns the Cell at the specified coordinates', () => {
          // We're cheating a bit here by reaching into the model to
          // get at the matrix array
          expect($subject).to.equal($model.matrix[$row][$col])
        })

        it('invokes #open() on the returned Cell', () => {
          expect($subject.open).to.have.been.called
        })
      })

      context('when the col is out of bounds', () => {
        def('col', () => 9283473)

        selectIsANoOp()
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
