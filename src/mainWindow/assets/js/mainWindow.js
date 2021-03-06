const elements = {
  score: document.querySelector('.score'),
  streak: document.querySelector('.streak'),
  turns: {
    x: document.querySelector('.turn#x'),
    o: document.querySelector('.turn#o')
  },
  table: [
      document.querySelector('.cell-1#cell-1'),
      document.querySelector('.cell-2#cell-1'),
      document.querySelector('.cell-3#cell-1'),
      document.querySelector('.cell-1#cell-2'),
      document.querySelector('.cell-2#cell-2'),
      document.querySelector('.cell-3#cell-2'),
      document.querySelector('.cell-1#cell-3'),
      document.querySelector('.cell-2#cell-3'),
      document.querySelector('.cell-3#cell-3')
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

function unload() {
  // create new file if it doesn't exist
  if(!fs.existsSync(configPath)) save();
  
  // load config
  config = unpack();
  let board = config.game[0].concat(config.game[1]).concat(config.game[2]);
  for(let i = 0; i < board.length; i++) {
    if(board[i] != '') addElement('div', { class: 'turn-e', id:'turn-' + board[i] }, board[i], elements.table[i]);
  }

  if(config.turn == 'x') {
    turnMutate('toggle');
    if(config.mode != 'pvp') {
      aiMove();
    }
  }

  if(config.gameOver) {
    setEndGameScreen('Game Over!', 'game-over');
  }

  setInterval(autoSave, 1000);
}
startGame();
unload();



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
    cells[i].setAttribute('onclick', 'playerPlaceTurn(this)');
  }
  elements.streak.style = '';
  elements.streak.classList.remove('streak-on');
  
  // reset avaible turns
  config.avTurns = 9;
  
  // start with the set turn
  elements.turns[config.turn].classList.add('turn-up');
  if(config.mode != 'pvp' && config.turn == 'x') aiMove();
  config.gameOver = false;
}
function playerPlaceTurn(e) {
  if(e.textContent == '') {
    if(config.mode == 'pvp' || config.mode != 'pvp' && config.turn == 'o') {
      placeTurn(e);
      
      // make turn if user selected ai
      if(config.mode != 'pvp' && !config.gameOver) aiMove();
    }
  }
}
function placeTurn(e) {
  // make sure its empty and game isn't over
  if(e.textContent == '' && !config.gameOver) {
    addElement('div', { class: 'turn-e', id: 'turn-' + config.turn }, config.turn, e);
    // get the column and row, then append value to the correspoding game array
    let column = Number(e.classList[1].replace('cell-', '')) - 1;
    let row = Number(e.id.replace('cell-', '')) - 1;
    config.game[row][column] = config.turn;
    config.avTurns--;
    
    // check for winner
    checkWin();
    
    // check for draw
    checkDraw();
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
      config.gameOver = true;
      config.score[config.turn]++;
      updateScore();
      
      // win animation
      // horizontal
      if(i < 3) {
        elements.streak.style = 'transform: rotate(-90deg) translateX(-' + (i * 100 + 60) +'px); transition: 0.2s';
        
      } else if(i < 6) {
        // vertical
        elements.streak.style = 'transform: translateX(' + ((i - 3) * 108 + 56) +'px);';
        
      } else {
        // diagonal line
        elements.streak.style = 'transform: translateX(' + Math.abs(i - 6) * 324 + 'px) rotate(' + (2 * i - 13) * 45 + 'deg) scaleY(1.4);';
      }
      elements.streak.classList.add('streak-on');


      break;
    }
  }
}

function setEndGameScreen(text, result) {
  config.gameOver = true;
  let popup = addPopup('win', 'Game Results', '').body;
  let section = addSection('Results', 'win', popup);
  addElement('div', { class: 'popup-text', id: result + '-text' }, text,  section.body);
  addElement('button', { class: 'popup-button', id: result + '-button', onclick: 'restart()' }, 'Restart', section.body);
}

function restart() {
  destroyPopup('win')
  startGame();
}

function updateScore(reset) {
  if(reset) {
    config.score.o = 0;
    config.score.x = 0;
  }
  elements.score.textContent = config.score.x + '-' + config.score.o;
}
function settings() {
  // add settings window
  let popup = addPopup('settings', 'Settings', { rotate: true, src: path.join(__dirname, '/assets/img/gear.png'), width: '22px'});

  // add play mode section
  let section = addSection('Play Mode', 'play-mode', popup.body);

  // add parameters
  addParameter(section.body, { radio: { text: 'PvP' }, name: 'play-mode', on: 'pvp'}, 'radio', 'pvp-mode', selectMode,  config.mode);
  for(let i = 0; i < config.difficulties.length; i++) {
    addParameter(section.body, { radio: { text: 'PvC - ' + stringify(config.difficulties[i]) }, name: 'play-mode', on: i}, 'radio', i + '-mode', selectMode,  config.mode);
  }
}

function selectMode(e) {
  // change to set mode
  let id = e.target.id;
  config.mode = id.replace('-mode-radio-input', '');
  
  // make a move if user is switching into pvc and x's turn is up
  if(config.mode != 'pvp' && config.turn == 'x') aiMove();
}

function capitalize(text) {
  return text.replace(text.substring(0, 1), text.substring(0, 1).toUpperCase());
}

function checkDraw() {
  if(config.avTurns < 1 && !config.gameOver) {
    setEndGameScreen('Tie!', 'tie');
  }
}

function stringify(text) {
  // convert dashed text to spaced text
  let final = '';
  let splitted = text.split('-');
  for(let i = 0; i < splitted.length; i++) {
    final += ' ' + capitalize(splitted[i]);
  }
  return final.replace(final.substring(0, 1), '');
}