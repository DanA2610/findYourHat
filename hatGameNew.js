const prompt = require('prompt-sync')({sigint: true});
const checkPath = require('./pathChecker.js'); 

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const inputWidth = process.argv[2];
const inputHeight = process.argv[3];
const inputProportionHoles = process.argv[4];
const inputCheckImpossible = process.argv[5];

class Field {
    constructor(array) {
        this._field = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                this._field.push({
                    xypos: [j,i],
                    symbol: array[i][j]
                });
            }
        }
        this._fieldWidth = array[0].length;
        this._fieldHeight = array.length;
        this._playerPosition = [0,0]; //xy position
    }
    get field() {
        return this._field;
    } get printField() {
        return this._printField;
    } get fieldWidth() {
        return this._fieldWidth;
    } get fieldHeight() {
        return this._fieldHeight;
    } get playerPosition() {
        return this._playerPosition;
    } set field(field) {
        this._field = field;
    } set fieldWidth(width) {
        this._fieldWidth = width;
    } set fieldHeight(height) {
        this._fieldHeight = height;
    } set playerPosition(pos) {
        this._playerPosition = pos;
    }

    static generateField(width, height, proportionHoles) { //imported from old version, should work fine...
        if (!width) { //dealing with missing arguments.
            width = 5;
        }
        if (!height) {
            height = 5;
        }
        if (!proportionHoles) {
            proportionHoles = 0.2;
        }

        let emptyRow = []; //generate row with correct width.
        for (let i = 0; i < width; i++) {
            emptyRow.push(fieldCharacter);
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

        /* for (let i = 0; i < field.length; i++) {
            if (field[i].every(x => x === hole)) {
                throw new Error('Impossible field generated. Try again or reduce proportion of holes.'); //throw error if entire bottom row is holes.
            }
        } */

        let randomWidth = Math.floor(Math.random()*width); //finding a free tile on the bottom row for hat.
        while (field[height - 1][randomWidth] === hole) {
            randomWidth = Math.floor(Math.random()*width);
        }
        field[height-1][randomWidth] = hat; //replace free bottom row tile with hat.

        return field;
    }

    print() {
        let arrayToPrint = [];
        for (let i = 0; i < this._fieldHeight; i++) {
            let row = [];
            for (let j = 0; j < this._field.length; j++) {
                if (this._field[j].xypos[1] === i) {
                    row.push(this._field[j].symbol);
                }
            };
            arrayToPrint.push(row);
        };
        arrayToPrint.forEach(x => x.push('\n')); //push line breaks to each row.
        let string = arrayToPrint.toString();
        string = string.replaceAll(',', '');
        process.stdout.write(string + '\n\n' + 'Which way to move? (WASD)');
    }

    makeMove(userInput) {
        let input = userInput.toString().trim().toLowerCase(); //convert input to string.

        if (input === 'a') { //left
            this.playerPosition[0] -= 1; //update player position.  
        }; if (input === 'd') { //right
            this.playerPosition[0] += 1; //update player position.
        }; if (input === 'w') { //up
            this.playerPosition[1]--; //update player position.
        }; if (input === 's') { //down
            this.playerPosition[1]++; //update player position. 
        }; if (this.playerPosition[0] < 0) { //next 8 lines are checking for out of bounds and moving back in bounds.  
            this.playerPosition[0] = 0;
        }; if (this.playerPosition[0] >= this.fieldWidth) {
            this.playerPosition[0] = this.fieldWidth - 1;
        }; if (this.playerPosition[1] < 0) {
            this.playerPosition[1] = 0;
        }; if (this.playerPosition[1] >= this.fieldHeight) {
            this.playerPosition[1] = this.fieldHeight - 1;
        };

        const fieldObjectAtPosition = this.field.find(x => x.xypos[0] === this.playerPosition[0] && x.xypos[1] === this.playerPosition[1]); //get field object at player's position.
        const checkPosition = (() => { //function to check current position for hat or hole. Fails game if hat or hole.
            const symbolAtPosition = fieldObjectAtPosition.symbol;
            if (symbolAtPosition === hat) {
                process.stdout.write('Congratulations! You found your hat!');
                return process.exit();
            } else if (symbolAtPosition === hole) {
                process.stdout.write('Whoops! You fell down a hole. Try again.');
                return process.exit();
            }
        })(); //should immediately execute.
        fieldObjectAtPosition.symbol = pathCharacter; //change symbol to path character.
        this.print();
    }

    checkImpossible() {
        let passableField = this.field.filter(x => x.symbol !== hole); //remove holes from field array.
        passableField = passableField.map(x => x.xypos) //maps the passableField array to just the xypos arrays, to be compatible with the pathCheck function.
        const hatPosition = this.field.find(x => x.symbol === hat).xypos; //find xypos of hat object.
        return checkPath(passableField, [0,0], hatPosition) //check for possible path.
    }
}

const gameField = new Field(Field.generateField(inputWidth, inputHeight, inputProportionHoles));

if (!gameField.checkImpossible()) { //run error check from pathChecker.js.
    console.error('Error: Impossible field generated. Try again or reduce proportion of holes.');
    process.exit();
}

process.stdin.on('data', (data) => gameField.makeMove(data));

gameField.print();