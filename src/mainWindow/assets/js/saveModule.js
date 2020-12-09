const path = require('path');
const fs = require('fs');
const savePath = path.join(__dirname, '/assets/save/');
const configPath = path.join(savePath, '/config.json');

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

function save() {
  if(!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }
  pack();
}


function pack() {
  fs.writeFileSync(configPath, JSON.stringify(config));
}

function unpack() {
  return JSON.parse(fs.readFileSync(configPath));
}

function autoSave() {
  let saved = fs.readFileSync(configPath);
  let current = JSON.stringify(config);
  if(saved != current) {
    save();
    console.log('Saved!');
  }
}
