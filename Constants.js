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
    // { x: 30, y: 50 },
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
let gi = null;
document.querySelector("#StartBtn").addEventListener('click', () => {
    if (gi) gi.stop = false;
    tf.tidy(() => {
        // gi.generationSize = document.getElementById('numGen').value

        // gi.snakesRemaining = gi.generationSize
        // gi.start()


        genSize = document.getElementById('numGen').value

        gi = new GameInstance('gameCanvas', genSize)
        document.addEventListener("keydown", gi.changeDirection.bind(gi));
        gi.start()

    })
});
document.querySelector("#StopBtn").addEventListener('click', async () => {
    gi.stop = true
    let d = new Date()//.toUTCString()
    let dateStr = String(d.getMonth()) + "-" + String(d.getDate()) + "-" + String(d.getFullYear()) + "_" + String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds())
    console.log(dateStr);
    if (gi.bestSnake) await gi.bestSnake.NN.model.save('downloads://snake-model-' + dateStr);

});


var graphCtx = document.getElementById('myChart');
var myChart = new Chart(graphCtx, {
    type: 'line',
    data: {
        labels: [],
        // labels: ['Average Score'],
        datasets: [{
            label: 'Average Score per Generation',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});