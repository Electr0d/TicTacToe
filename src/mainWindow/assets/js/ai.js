function aiMove() {
  setTimeout(() => {
    if (config.turn == 'x' && config.avTurns > 0) {
      console.log('ai called');
      let mode = Number(config.mode);
      // if on easy difficulty (random moves only)
      if (mode == 0) {
        // select random empty element
        placeTurn(eRandom());

        // intermediate (offensive, places the 3rd x when it has 2 in x's in a win combo, otherwise makes random)
      } else if (mode == 1) {

        let placed = makeMove('x');
        // play random if haven't placed
        if (!placed) placeTurn(eRandom());



        // hard difficulty (defensive, makes random moves unless player is about to win)
      } else if (mode == 2) {
        // go through each combo
        let placed = makeMove('o');


        // play random if haven't placed
        if (!placed) placeTurn(eRandom());


        // very hard difficulty (offensive, then defensive, puts x at center when starting in a corner and vice versa.)
      } else if (mode == 3) {
        let placed = false;
        placed = makeMove('x');
        if(!placed) placed = makeMove('o');

        if(!placed) {
          if(config.avTurns == 9) {
            placeTurn(elements.table[4]);


          } else if(config.avTurns == 8) {
            let strat = [4, 0, 2, 6, 8];
            
            // place a turn in the designated spot if it is available
            for(let i = 0; i < strat.length; i++) {
              let e = elements.table[strat[i]];
              if(e.textContent == '') {
                placeTurn(e);
                break;
              }
            }
          } else {
            placeTurn(eRandom());
          }
        }

      }



    }
    // wait a random amount of time
  }, clamp(Math.round(Math.random() * 1000), 400, 1000));
}


function makeMove(target) {
  // merge game 2 dimensional array into 1 dimensional array
  let board = config.game[0].concat(config.game[1]).concat(config.game[2]);

  // go through each combo
  let placed = false;
  for (let i = 0; i < winCombos.length; i++) {
    let common = 0;
    // check if player made more than 2 plays
    for (let v = 0; v < winCombos[i].length; v++) {
      console.log(board[winCombos[i][v]]);
      console.log(target, board[winCombos[i][v]] == target);
      if (board[winCombos[i][v]] == target) common++;
    }
    if (common > 1) {
      // place a turn in 3rd spot
      for (let v = 0; v < winCombos[i].length; v++) {
        let e = elements.table[winCombos[i][v]];
        console.log(e);

        // add if element's empty
        if (e.textContent == '' && !placed) {
          console.log('1 spot remaining in:', i, v, winCombos[i][v]);
          placeTurn(elements.table[winCombos[i][v]]);
          placed = true;
          break;
        }
      }
    }
  }
  return placed;
}





function eRandom() {
  let e = elements.table[Math.floor(Math.random() * elements.table.length)];

  // return if cell is empty
  if (e.textContent == '') {
    return e;
  } else {
    // regenerate
    e = eRandom();
    return e;
  }
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}