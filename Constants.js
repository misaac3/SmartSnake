const GAME_SPEED = 00;
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';

const GRID_COLOR = 'grey'

const SQUARE_SIZE = 10;

// let snake = [
//     { x: 50, y: 50 },
//     { x: 40, y: 50 },
//     { x: 30, y: 50 },
//     { x: 20, y: 50 },
//     { x: 10, y: 50 }
// ]

let initialBody = [

    { x: 100, y: 50 },
    { x: 90, y: 50 },
    { x: 80, y: 50 },
    { x: 70, y: 50 },
    { x: 60, y: 50 },
    { x: 50, y: 50 },
    { x: 40, y: 50 },
    { x: 30, y: 50 },
    { x: 20, y: 50 },
    { x: 10, y: 50 }
]

function isSamePosition(obj1, obj2) {
    return (obj1.x === obj2.x && obj1.y === obj2.y)
}