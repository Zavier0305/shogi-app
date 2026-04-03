const { Shogi } = require('shogi.js');
const s = new Shogi();
s.initializeFromSFENString('lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1'); // SFEN without check usually
s.move(7, 7, 7, 6);
s.move(3, 3, 3, 4);
s.move(8, 8, 2, 2, true); // bishop capture bishop
console.log("Moves from 5,9 (King):", s.getMovesFrom(5,9));
// The opponent bishop can move to 9,9, which doesn't check the King.
// Let's create a check
s.initializeFromSFENString('lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPP1PPPPP/1B2K1R1/LNS1G1SNL b B 1'); 
// wait, easier way to create a check
s.initialize();
s.turn = 0; // Black
s.board[0][4] = null; // remove white King? No, piece[x][y] x is 1-9 inverted usually? board is 0-indexed.
