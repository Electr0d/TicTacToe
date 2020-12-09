const path = require('path');
const fs = require('fs');


let config = {
  mode: 3, // a maximum of 3
  turn: 'o',
  game: [
    [ '', '', '' ],
    [ '', '', '' ],
    [ '', '', '' ]
  ],
  score: {
    o: 0,
    x: 0
  },
  gameOver: false,
  avTurns: 9,
  difficulties: [ 'easy', 'intermediate', 'hard', 'very-hard' ]
}