import {
  _require,
  expect,
} from '../helper'

const Cell = _require('cell')

describe('Cell', () => {
  def('model', () => new Cell())

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
})
