export default class Square {
  constructor({ hasMine = false }) {
    this.isOpen = false
    this.hasMine = hasMine
  }

  open() {
    this.isOpen = true
  }
}


