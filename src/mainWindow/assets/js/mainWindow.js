const elements = {
  score: document.querySelector('.score'),
  turns: {
    x: document.querySelector('.turn#x'),
    o: document.querySelector('.turn#o')
  },
  table: [
    [
      document.querySelector('.cell-1#cell-1'),
      document.querySelector('.cell-1#cell-2'),
      document.querySelector('.cell-1#cell-3'),
    ],
    [
      document.querySelector('.cell-2#cell-1'),
      document.querySelector('.cell-2#cell-2f'),
      document.querySelector('.cell-2#cell-3'),
    ],
    [
      document.querySelector('.cell-3#cell-1'),
      document.querySelector('.cell-3#cell-2'),
      document.querySelector('.cell-3#cell-3'),
    ]
  ],
  button: document.querySelector('button.button')
}
let winCombos = [
  // horizontal 
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6]
];


function turnMutate(action) {
  // change both turns according to action
  for(let turn in elements.turns) {
    elements.turns[turn].classList[action]('turn-up');
  }
}

function startGame() {
  // reset game array
  config.game = [
    [ '', '', '' ],
    [ '', '', '' ],
    [ '', '', '' ]
  ];
  // reset cells and add onclick
  let cells = document.querySelectorAll('.cell');
  for(let i = 0; i < cells.length; i++) {
    cells[i].textContent = '';
    cells[i].setAttribute('onclick', 'placeTurn(this)');
  }
  
  // start with the set turn
  elements.turns[config.turn].classList.add('turn-up');
}
startGame();

function placeTurn(e) {
  // make sure its empty
  if(e.textContent == '') {
    e.textContent = config.turn;

    // get the column and row, then append value to the correspoding game array
    let column = Number(e.classList[1].replace('cell-', '')) - 1;
    let row = Number(e.id.replace('cell-', '')) - 1;
    config.game[row][column] = config.turn;
    
    // check for winner
    checkWin();

    // switch to other turn
    config.turn = config.turn == 'o' ? 'x' : 'o';
    turnMutate('toggle');
  }
}

function checkWin() {
  // merge 2 dimensional array into 1
  let board = config.game[0].concat(config.game[1]).concat(config.game[2]);
  
  // iterate through each win combo
  for(let i = 0; i < winCombos.length; i++) {
    // check if the turn matches all 3 positions of each win combo
    if(board[winCombos[i][0]] == config.turn && board[winCombos[i][1]] == config.turn && board[winCombos[i][2]] == config.turn) {
      setEndGameScreen('Player "' + config.turn.toUpperCase() + '" is the winner! 🎉', 'win');
      config.score[config.turn]++;
      updateScore();
    }
  }
}

function setEndGameScreen(text, result) {
  let overlay = addElement('div', { class: 'overlay' }, '', document.body);
  let popup = addElement('div', { class: 'popup', id: result + '-popup' }, '', overlay);
  addElement('div', { class: 'popup-header', id: result + '-header' }, 'Results:',  popup);
  let popupBody = addElement('div', { class: 'popup-body', id: result + '-body' }, '',  popup);
  addElement('div', { class: 'popup-text', id: result + '-text' }, text,  popupBody);
  addElement('button', { class: 'popup-button', id: result + '-button', onclick: 'restart()' }, 'Restart', popupBody);
}

function restart() {
  document.body.removeChild(document.querySelector(".overlay"));
  startGame();
}

function updateScore(reset) {
  if(reset) {
    config.score.o = 0;
    config.score.x = 0;
  }
  elements.score.textContent = config.score.x + '-' + config.score.o;
}