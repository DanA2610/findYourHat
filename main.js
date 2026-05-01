const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(array) {
    array.forEach(x => {
      x.push('\n');
    })
    this._field = array;
    this._fieldHeight = array.length;
    this._fieldWidth = array[0].length - 1;
  }
  //getters
  get field() {
    return this._field;
  }
  get fieldHeight() {
    return this._fieldHeight;
  }
  get fieldWidth() {
    return this._fieldWidth;
  }
  //setters
  set field(array) {
    this._field = array;
  }
  //methods
  static generateField(width, height, proportionHoles) {

  }
  print() {
    let string = this.field.toString();
    string = string.replaceAll(',', '');
    process.stdout.write(string + '\n\n' + 'Which way to move? (WASD)');
  }
  makeMove(userInput) {
    let input = userInput.toString().trim().toLowerCase(); //convert input to string.
    const changeToPath = () => {
        this.field[playerPosition[0]][playerPosition[1]] = pathCharacter; //change current position to *.
    }
    if (input === 'a') { //left
        if (!(playerPosition[1] <= 0)) { //check not on left edge of field.
            playerPosition[1] -= 1; //update player position.
            changeToPath();
        }
    };
    if (input === 'd') { //right
        if (!(playerPosition[1] >= this.fieldWidth - 1)) { //check not on right edge of field (excl '\n' char on end).
            playerPosition[1] += 1; //update player position.
            changeToPath();
        }
    };
    if (input === 'w') { //up
        if (!(playerPosition[0] <= 0)) { //check not on top row.
            playerPosition[0]--; //update player position.
            changeToPath();
        }
    };
    if (input === 's') { //down
        if (!(playerPosition[0] >= this.fieldHeight)) { //check not on bottom row.
            playerPosition[0]++; //update player position.
            changeToPath();
        }
    };
    this.print();
  }
};

let playerPosition = [0,0]; //[y,x] or [row,column].

const gameField = new Field([
  [hat, hole, fieldCharacter],
  [hole, fieldCharacter, fieldCharacter],
  [hole, fieldCharacter, hole]
]);

process.stdin.on('data', (data) => gameField.makeMove(data));

gameField.print();