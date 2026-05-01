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
  static generateField(width, height, proportionHoles, checkImpossible) {

    let emptyRow = []; //generate row with correct width.
    for (let i = 0; i < width; i++) {
        emptyRow.push(fieldCharacter);
        //console.log(emptyRow);
    };
    let field = []; //fill array with rows until correct height.
    for (let i = 0; i < height; i++) {
        field.push(emptyRow.slice());
    };
    field[0][0] = pathCharacter;
    const numberOfHoles = Math.floor(width*height*proportionHoles); //calculate required number of holes.
    const getRandomPosition = () => { //get random position in field [y,x].
        return [Math.floor(Math.random()*height), Math.floor(Math.random()*width)];
    }
    for (let i = 0; i < numberOfHoles; i++) { //replace random tiles with holes, checking that spaces aren't being repeated or replacing the starting tile.
        let randomPosition = getRandomPosition();
        let targetPosition = field[randomPosition[0]][randomPosition[1]];
        while (targetPosition === hole || targetPosition === pathCharacter) {
            randomPosition = getRandomPosition();
            targetPosition = field[randomPosition[0]][randomPosition[1]];
        };
        field[randomPosition[0]][randomPosition[1]] = hole;
    };
    if (field[height - 1].every(x => x === hole)) {
        throw new Error('Impossible field generated. Try again or reduce proportion of holes.');
    }
    let randomWidth = Math.floor(Math.random()*width);
    while (field[height - 1][randomWidth] === hole) {
        randomWidth = Math.floor(Math.random()*width);
    }
    field[height-1][randomWidth] = hat;
    return field;
  }
  print() {
    let string = this.field.toString();
    string = string.replaceAll(',', '');
    process.stdout.write(string + '\n\n' + 'Which way to move? (WASD)');
  }
  checkPosition() { //function to check current position for hat or hole. Returns false if hat or hole or true if else.
    const objectAtPosition = this.field[playerPosition[0]][playerPosition[1]];
    if (objectAtPosition === hat) {
        process.stdout.write('Congratulations! You found your hat!');
        process.exit();
        return false;
    } else if (objectAtPosition === hole) {
        process.stdout.write('Whoops! You fell down a hole. Try again.');
        process.exit();
        return false;
    }
    else {
        return true;
    }
    }

  makeMove(userInput) {
    let input = userInput.toString().trim().toLowerCase(); //convert input to string.

    const changeToPath = () => { //function to change current position to *.
        this.field[playerPosition[0]][playerPosition[1]] = pathCharacter;
    }
    if (input === 'a') { //left
        if (playerPosition[1] > 0) { //check not on left edge of field.
            playerPosition[1] -= 1; //update player position.
        }
    };
    if (input === 'd') { //right
        if (playerPosition[1] < this.fieldWidth - 1) { //check not on right edge of field (excl '\n' char on end).
            playerPosition[1] += 1; //update player position.
        }
    };
    if (input === 'w') { //up
        if (playerPosition[0] > 0) { //check not on top row.
            playerPosition[0]--; //update player position.
        }
    };
    if (input === 's') { //down
        if (playerPosition[0] < this.fieldHeight - 1) { //check not on bottom row.
            playerPosition[0]++; //update player position.
        }
    };

    if(this.checkPosition()) { //check for hat/hole.
        changeToPath();
        this.print();
    }
  }
};

let playerPosition = [0,0]; //[y,x] or [row,column].

/* old testing field
const gameField = new Field([
  [fieldCharacter, fieldCharacter, fieldCharacter],
  [hole, fieldCharacter, fieldCharacter],
  [hole, fieldCharacter, hat]
]); */

const gameField = new Field(Field.generateField(7, 7, 0.2));

process.stdin.on('data', (data) => gameField.makeMove(data));

gameField.print();