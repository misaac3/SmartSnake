
// The user's score
let score = 0;
//Past scores stored to be displayed
let pastScores = [];


naiveSetup = true;

function isSamePosition(obj1, obj2) {
    return (obj1.x === obj2.x && obj1.y === obj2.y)
}



// When set to true the snake is changing direction
let changingDirection = false;
// Food x-coordinate
let foodX;
// Food y-coordinate
let foodY;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

const canvas = document.createElement('canvas')
canvas.id = "gameCanvas"
canvas.width = 600;
canvas.height = 600;
document.getElementById("ROOTDIV").appendChild(canvas)
console.log(canvas);

const canvas2 = document.createElement('canvas')
canvas2.id = "gameCanvas2"
canvas2.width = 600;
canvas2.height = 600;
document.getElementById("ROOTDIV").appendChild(canvas2)
console.log(canvas2);

// Get the canvas element
// const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");
// Start game
main();
// Create the first food location
createFood();
// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);
/**
 * Main function of the game
 * called repeatedly to advance the game
 */
// let s = new Snake(snake, ctx, foodX, foodY);

function main() {
    // console.log('Main');
    // If the game ended return early to stop game
    if (didGameEnd()) {
        resetGame();
        clearCanvas();

        // s.drawSnake()
        drawSnake();

        createFood();

        drawFood();

        // s.advanceSnake()
        advanceSnake();
        main()
    }
    else {
        setTimeout(function onTick() {
            changingDirection = false;
            clearCanvas();

            drawFood();

            naiveAI()
            // s.advanceSnake()
            advanceSnake();

            // s.drawSnake()
            drawSnake();
            // checkNearWall()
            // getNearbyObstacles()

            // console.log('------------------------------');
            main();

        }, GAME_SPEED)
    }
}

getNearbyObstacles = () => {

    let { x, y } = snake[0]


    up = { x: x, y: y - 10 }
    down = { x: x, y: y + 10 }
    left = { x: x - 10, y: y }
    right = { x: x + 10, y: y }

    tail = snake.map(x => x).splice(2, snake.length)

    upArray = tail.filter(t => isSamePosition(t, up))
    upObstacle = upArray.length > 0 ? upArray[0] : null;

    downArray = tail.filter(t => isSamePosition(t, down))
    downObstacle = downArray.length > 0 ? downArray[0] : null

    leftArray = tail.filter(t => isSamePosition(t, left))
    leftObstacle = leftArray.length > 0 ? leftArray[0] : null

    rightArray = tail.filter(t => isSamePosition(t, right))
    rightObstacle = rightArray.length > 0 ? rightArray[0] : null

    if (!upObstacle) {
        upWall = { x: up.x, y: -10 }
        upObstacle = isSamePosition(up, upWall) ? upWall : null
    }

    if (!downObstacle) {
        downWall = { x: down.x, y: gameCanvas.height, }
        downObstacle = isSamePosition(down, downWall) ? downWall : null
    }

    if (!leftObstacle) {
        leftWall = { x: -10, y: left.y }
        leftObstacle = isSamePosition(left, leftWall) ? leftWall : null
    }

    if (!rightObstacle) {
        rightWall = { x: gameCanvas.width, y: right.y }
        rightObstacle = isSamePosition(right, rightWall) ? rightWall : null
    }


    obstacles = { up: upObstacle, down: downObstacle, left: leftObstacle, right: rightObstacle }

    console.log('');
    console.log(obstacles);
    return obstacles
    // console.log(upObstacle);
    // console.log(downObstacle);
    // console.log(leftObstacle);
    // console.log(rightObstacle);

}

checkNearWall = () => {
    if (snake[0].x <= 0) {
        console.log('Near left wall');
    }
    if (snake[0].x >= gameCanvas.width - 10) {
        console.log('Near Right wall');
    }
    if (snake[0].y <= 0) {
        console.log('near top wall');
    }
    if (snake[0].y >= gameCanvas.height - 10) {
        console.log('Near Bottom wall');
    }
}

/**
 * Change the background colour of the canvas to CANVAS_BACKGROUND_COLOUR and
 * draw a border around it
 */
function clearCanvas() {
    //  Select the colour to fill the drawing
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
/**
 * Draw the food on the canvas
 */
function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokestyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}
/**
 * Advances the snake by changing the x-coordinates of its parts
 * according to the horizontal velocity and the y-coordinates of its parts
 * according to the vertical veolocity
 */
function advanceSnake() {
    // Create the new Snake's head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    // Add the new head to the beginning of snake body
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        // Increase score
        score += 10;
        // Display score on screen
        // document.getElementById('score').innerHTML = score;
        // Generate new food location
        createFood();
        console.log('FOOD FOUND');
    } else {
        // Remove the last part of snake body
        snake.pop();
    }
}
/**
 * Returns true if the head of the snake touched another part of the game
 * or any of the walls
 */
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}
/**
 * Generates a random number that is a multiple of 10 given a minumum
 * and a maximum number
 * @param { number } min - The minimum number the random number can be
 * @param { number } max - The maximum number the random number can be
 */
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

/**
 * Creates random set of coordinates for the snake food.
 */
function createFood() {

    // Generate a random number the food x-coordinate
    foodX = randomTen(10, gameCanvas.width - 20);
    // Generate a random number for the food y-coordinate
    foodY = randomTen(0, gameCanvas.height - 10);
    // if the new food location is where the snake currently is, generate a new food location
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == foodX && part.y == foodY;
        if (foodIsoNsnake) createFood();
    });

}
/**
 * Draws the snake on the canvas
 */
function drawSnake() {
    // loop through the snake parts drawing each part on the canvas
    snake.forEach(drawSnakePart)
}
/**
 * Draws a part of the snake on the canvas
 * @param { object } snakePart - The coordinates where the part should be drawn
 */
function drawSnakePart(snakePart) {
    // Set the colour of the snake part
    ctx.fillStyle = SNAKE_COLOUR;
    // Set the border colour of the snake part
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
/**
 * Changes the vertical and horizontal velocity of the snake according to the
 * key that was pressed.
 * The direction cannot be switched to the opposite direction, to prevent the snake
 * from reversing
 * For example if the the direction is 'right' it cannot become 'left'
 * @param { object } event - The keydown event
 */
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    /**
     * Prevent the snake from reversing
     * Example scenario:
     * Snake is moving to the right. User presses down and immediately left
     * and the snake immediately changes direction without taking a step down first
     */
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function resetGame() {
    console.log('\nGAME OVER\n');
    sweepingLeft = false;
    sweepingRight = false;

    moveHoriz = false;

    movingUp = false;
    movingDown = false;

    snake = [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 }
    ]
    naiveSetup = true;
    // naiveMove = {
    //     'moveLeft': false,
    //     'moveRight': false,
    //     'moveUp': false,
    //     'moveDown': false,
    //     'sweepLeft': false,
    //     'sweepRight': false,
    //     'movingUp': false,
    //     'movingDown': false
    // }
    let currentdate = new Date()
    let time = currentdate.getHours() % 12 + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds()
        + (currentdate.getHours() > 11 ? " PM" : " AM");

    pastScores.push({ 'score': score, 'time': time })
    updatePastScores();
    console.log(pastScores)
    score = 0;
    document.getElementById('score').innerHTML = score;
    // When set to true the snake is changing direction
    changingDirection = false;
    // Food x-coordinate
    foodX;
    // Food y-coordinate
    foodY;
    // Horizontal velocity
    dx = 10;
    // Vertical velocity
    dy = 0;
}

function updatePastScores() {
    let pastScoreUL = document.getElementById("pastScores")

    let row = document.createElement("TR");
    let scoreNode = document.createElement("TD");
    let timeNode = document.createElement("TD");

    let { score, time } = pastScores[pastScores.length - 1]
    let scoreText = document.createTextNode(score)
    let timeText = document.createTextNode(time)
    scoreNode.appendChild(scoreText)
    timeNode.appendChild(timeText)
    row.appendChild(scoreNode)
    row.appendChild(timeNode)
    pastScoreUL.appendChild(row)
}

function printDangers() {
    console.log('-------------------------');
    console.log('food: ', foodX, foodY);
    if (dx === 10) {
        let { x, y } = snake[snake.length - 1]
        console.log('moving right');
        console.log('there is a wall', (550 - x) / 10, 'moves aways');
        if (foodY === y && foodX >= x) {
            // console.log('food is', (foodX - skake[0].x) / 10, 'moves away');
        }
        console.log('curr loc: ', x, y, dx, dy);
        console.log(snake);

    }
    else if (dx === -10) {
        let { x, y } = snake[0]
        console.log('moving left');
        console.log('there is a wall', (0 + x) / 10, 'moves aways');
        if (foodY === y && foodX <= x) {
            console.log('food is', (foodX + x) / 10, 'moves away');
        }
        console.log('curr loc: ', x, y, dx, dy);
        console.log(snake);
    }
    else if (dy === 10) {
        let { x, y } = snake[snake.length - 1]
        console.log('moving down');
        console.log('there is a wall', (550 - y) / 10, 'moves aways');
        console.log('curr loc: ', x, y, dx, dy);
        console.log(snake);
    }
    else if (dy === -10) {
        let { x, y } = snake[0]
        console.log('moving up');
        console.log('there is a wall', (0 + y) / 10, 'moves aways');
        console.log('curr loc: ', x, y, dx, dy);
        console.log(snake);
    }
}


