// let GAME_SPEED = 00;
let GAME_SPEED = document.querySelector("#gameSpeedrangeInput").value;

const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';

const GRID_COLOR = 'grey';

const SQUARE_SIZE = 10;

const CANVAS_SIZE = 300;

let shouldDraw = true;
let noCrossover = false;
let initialized = false;
let gi = null;


// let snake = [
//     { x: 50, y: 50 },
//     { x: 40, y: 50 },
//     { x: 30, y: 50 },
//     { x: 20, y: 50 },
//     { x: 10, y: 50 }
// ]

let initialBody = [

    // { x: 100, y: 50 },
    // { x: 90, y: 50 },
    // { x: 80, y: 50 },
    // { x: 70, y: 50 },
    // { x: 60, y: 50 },
    // { x: 50, y: 50 },
    // { x: 40, y: 50 },
    { x: 30, y: 50 },
    { x: 20, y: 50 },
    { x: 10, y: 50 }
]

function isSamePosition(obj1, obj2) {
    return (obj1.x === obj2.x && obj1.y === obj2.y)
}

function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}


function shouldDrawBtn() {
    let btn = document.querySelector('#drawBtn')
    // console.log(this);

    if (btn.classList.contains("btn-success")) {
        btn.classList.remove(("btn-success"))
        btn.classList.add("btn-danger")
        btn.innerHTML = "Currently NOT drawing snake"
        shouldDraw = false;
    }
    else {
        btn.classList.remove("btn-danger")
        btn.classList.add("btn-success")
        btn.innerHTML = "Currently drawing snake"
        shouldDraw = true;

    }


}

function changeGameSpeed(value) {
    GAME_SPEED = value * 2
    document.querySelector("#gameSpeedrangeInput").value = value;
    document.querySelector("#gameSpeedTextInput").value = value
}


function onKeydownGameSpeed(e) {
    event.preventDefault();
    changeGameSpeed(e.value)
    if (event.key === 'Enter' || (event.keyCode == 13)) {
        return false
    }
    return false

}



