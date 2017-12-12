minesweeper
===

As basic (and as of right now, incomplete) implementation of the game Minesweeper.

## Running Locally

Before executing the command line script, be sure to `npm install`.

### Default game (8 x 8, 5 mines)

```
$ npm start
```

### Custom game

```
$ # 3 colums, 4 rows, 2 mines
$ npm start -- 3 4 2
```

## Tests

```
$ npm test
```

## TODO

* When selecting a cell that has neither a mine nor a neighbor with a mine, expose all adjacent cells that have no mines.
* Add support for flagging a cell to mark it as having a bomb
* Add jsdoc parser to produce public API documentation

## Author

Dan Kreft <dan@kreft.net>
