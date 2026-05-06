const prompt = require('prompt-sync')({sigint: true});

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
        this._field = array.map(row => row.slice()); //copy array in order to convert elements to objects with xy references.
        for (let i = 0; i < this._field.length; i++) { //loop over each element in the two-dimensional array.
            for (let j = 0; j < this._field[i].length; j++) {
                let storedSymbol = this._field[i][j] //store the input symbol.
                this._field[i][j] = { //change array element to object with xy reference.
                    xypos: [j,i],
                    symbol: storedSymbol
                }
            }
        }
        this._fieldWidth = this._field[0].length;
        this._fieldHeight = this._field.length;
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

    static generateField(width, height, proportionHoles, checkImpossible) { //imported from old version, should work fine...
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

        for (let i = 0; i < field.length; i++) {
            if (field[i].every(x => x === hole)) {
                throw new Error('Impossible field generated. Try again or reduce proportion of holes.'); //throw error if entire bottom row is holes.
            }
        }

        let randomWidth = Math.floor(Math.random()*width); //finding a free tile on the bottom row for hat.
        while (field[height - 1][randomWidth] === hole) {
            randomWidth = Math.floor(Math.random()*width);
        }
        field[height-1][randomWidth] = hat; //replace free bottom row tile with hat.

        return field;
    }

    print() {
        let arrayToPrint = this._field.map((row) => {
            return row.map(object => {
                return object = object.symbol;
            })
        })
        arrayToPrint.forEach(x => x.push('\n')); //push line breaks to each row.
        let string = arrayToPrint.toString();
        string = string.replaceAll(',', '');
        process.stdout.write(string + '\n\n' + 'Which way to move? (WASD)');
    }

    makeMove(userInput) {
        let input = userInput.toString().trim().toLowerCase(); //convert input to string.

        if (input === 'a') { //left
            if (this.playerPosition[0] > 0) { //check not on left edge of field.
                this.playerPosition[0] -= 1; //update player position.
            }
        };
        if (input === 'd') { //right
            if (this.playerPosition[0] < this.fieldWidth - 1) { //check not on right edge of field.
                this.playerPosition[0] += 1; //update player position.
            }
        };
        if (input === 'w') { //up
            if (this.playerPosition[1] > 0) { //check not on top row.
                this.playerPosition[1]--; //update player position.
            }
        };
        if (input === 's') { //down
            if (this.playerPosition[1] < this.fieldHeight - 1) { //check not on bottom row.
                this.playerPosition[1]++; //update player position.
            }
        };

        const checkPosition = (() => { //function to check current position for hat or hole. Returns false if hat or hole or true if else.
            const objectAtPosition = this.field[this.playerPosition[1]][this.playerPosition[0]].symbol;
            if (objectAtPosition === hat) {
                process.stdout.write('Congratulations! You found your hat!');
                return process.exit();
            } else if (objectAtPosition === hole) {
                process.stdout.write('Whoops! You fell down a hole. Try again.');
                return process.exit();
            }
        })(); //should immediately execute.

        this.field[this.playerPosition[1]][this.playerPosition[0]].symbol = pathCharacter;
        this.print();
    }
}

const gameField = new Field(Field.generateField(inputWidth, inputHeight, inputProportionHoles, inputCheckImpossible));

process.stdin.on('data', (data) => gameField.makeMove(data));

gameField.print();