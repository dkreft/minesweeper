minesweeper
===

As basic (and as of right now, incomplete) implementation of the game Minesweeper.

## Running the CLI

Before executing the command line script, be sure to `npm install`.

### Default game (8 x 8, 5 mines)

```
$ npm run cli
```

### Custom game

```
$ # 3 colums, 4 rows, 2 mines
$ npm run cli -- 3 4 2
```

### Cheat mode

Exposes all bombs from the start (intended for debugging and
development)

```
$ export CHEAT=true
$ npm run cli
```

## Tests

```
$ npm test
```

## TODO

* Add support for flagging a cell to mark it as having a bomb
* Add jsdoc parser to produce public API documentation

## Author

Dan Kreft <dan@kreft.net>
