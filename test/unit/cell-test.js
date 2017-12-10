import {
  _require,
  expect,
} from '../helper'

const Cell = _require('cell')

describe('Cell', () => {
  def('model', () => new Cell({
    hasMine: $hasMine,
    n: $n,
    ne: $ne,
    e: $e,
    se: $se,
    s: $s,
    sw: $sw,
    w: $w,
    nw: $nw,
  }))
  def('hasMine', () => void 0)
  def('n', () => void 0)
  def('ne', () => void 0)
  def('e', () => void 0)
  def('se', () => void 0)
  def('s', () => void 0)
  def('sw', () => void 0)
  def('w', () => void 0)
  def('nw', () => void 0)

  describe('.hasMine', () => {
    subject(() => $model.hasMine)

    it('defaults to false', () => {
      expect($subject).to.be.false
    })
  })

  describe('.isOpen', () => {
    subject(() => $model.isOpen)

    it('defaults to false', () => {
      expect($subject).to.be.false
    })
  })

  describe('.open()', () => {
    subject(() => $model.open())

    it('sets .isOpen to true', () => {
      $subject
      expect($model.isOpen).to.be.true
    })
  })

  describe('.countNeighboringMines()', () => {
    subject(() => $model.countNeighboringMines())

    context('when there are no neighbors', () => {
      it('returns 0', () => {
        expect($subject).to.equal(0)
      })
    })

    context('when one neighbor has a mine', () => {
      def('n', () => new Cell({ hasMine: true }))

      it('returns 1', () => {
        expect($subject).to.equal(1)
      })

      context('when a mined neighbor has a mined neighbor', () => {
        beforeEach(() => $n.n = new Cell({ hasMine: true }))

        it('still returns 1', () => {
          expect($subject).to.equal(1)
        })
      })
    })

    context('when all neighbors have mines', () => {
      def('n', () => new Cell({ hasMine: true }))
      def('ne', () => new Cell({ hasMine: true }))
      def('e', () => new Cell({ hasMine: true }))
      def('se', () => new Cell({ hasMine: true }))
      def('s', () => new Cell({ hasMine: true }))
      def('sw', () => new Cell({ hasMine: true }))
      def('w', () => new Cell({ hasMine: true }))
      def('nw', () => new Cell({ hasMine: true }))

      it('returns 8', () => {
        expect($subject).to.equal(8)
      })
    })
  })
})
