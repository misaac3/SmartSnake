class Snake {

    constructor(options) {
        this.body = [...initialBody];
        this.score = 0;
        this.moves = 0;
        this.dx = 10;
        this.dy = 0;
        this.fitness = 0;
        this.changingDirection = false;
        this.lastPosition = null;
        this.lastDistance = null;
        this.startTime = new Date();
        this.timeOfLastFood = -1;
        // console.log(options);
        this.prevPositions = [];
        this.prevPositions.push(this.body[0]);
        if ((options && options.oldNN)) {
            this.NN = options.oldNN;
        }
        else if (options && options.mutationRate && options.parentNN) {
            // console.log('mutate in snake constructor');
            // console.log(options);
            // this.NN = new NN(options.parentNN, options.mutationRate)
            this.NN = new NN(options);
        }
        else if (options && options.crossover && options.NN1 && options.NN2 && options.snake1Fit != null && options.snake2Fit != null) {
            // console.log('crossover in Snake constructor');

            this.NN = new NN(options);

        }
        else {
            this.NN = new NN();
        }
    }

    died() {
        // this.fitness = (this.moves / 100) + (this.score * 20)
        if (!this.fitness || this.fitness < 0) this.fitness = 0
        // this.fitness += (this.score * 100)
        if (this.score > 0) {
            let mult = (this.score / Math.pow(this.moves, 0.5)) + 1

            this.fitness *= mult
            console.log(mult);
        }
        if (this.fitness >= 20) console.log(`fitness ${this.fitness}`)
        this.snakeDied = true

    }
    drawSnake(ctx) {
        // loop through the snake parts drawing each part on the canvas
        if (shouldDraw) {
            this.body.forEach((snakePart) => this.drawSnakePart(snakePart, ctx))
            let w = this.w

            for (let i = 0; i < w; i += 10) {
                for (let j = 0; j < w; j += 10)
                    this.ctx.strokeRect(i, j, gameCanvas.width, gameCanvas.height);

            }
        }
    }

    drawSnakePart(snakePart, ctx) {
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

    advanceSnake(foodObj, w, h) {
        let foodX = foodObj.x
        let foodY = foodObj.y
        // Create the new Snake's head
        const head = { x: this.body[0].x + this.dx, y: this.body[0].y + this.dy };
        // Add the new head to the beginning of snake body
        this.body.unshift(head);
        const didEatFood = this.body[0].x === foodX && this.body[0].y === foodY;
        if (didEatFood) {
            // Increase score
            this.score += 1;
            // Display score on screen
            document.getElementById('score').innerHTML = 'score: ' + this.score;
            if (this.score > 0) document.getElementById('score').style.backgroundColor = 'lightgreen'
            // Generate new food location
            foodObj.createFood(this.body, w, h);
            console.log('FOOD FOUND');
            this.lastPosition = null
            this.lastDistance = null
            this.fitness += 100
            this.timeOfLastFood = new Date()

        } else {
            // Remove the last part of snake body
            this.body.pop();
        }
        this.moves++
        if (this.lastPosition) {
            let newDistance = this.distance(foodObj, this.lastPosition);
            // let lastDis = this.distance(foodObj, this.lastPosition);
            // console.log(newDistance, this.lastDistance);
            let sameRecentPos = this.prevPositions.filter((pos) => isSamePosition(pos, head)).length > 0
            if (newDistance < this.lastDistance || !sameRecentPos) {
                this.fitness += 1
            }
            else {
                this.fitness -= 0.5
            }
            this.lastDistance = newDistance
            this.lastPosition = head
        }
        else {
            let newDistance = this.distance(foodObj, head);
            this.lastDistance = newDistance
            this.lastPosition = head
        }
        this.prevPositions.push(head)
        if (this.prevPositions.length > 5) this.prevPositions.shift()


    }


    changeDirection(event) {
        // console.log('CHANGING DIRECTION', event);
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
        if (this.changingDirection) return;
        this.changingDirection = true;

        const keyPressed = event.keyCode;
        const goingUp = this.dy === -10;
        const goingDown = this.dy === 10;
        const goingRight = this.dx === 10;
        const goingLeft = this.dx === -10;
        if (keyPressed === LEFT_KEY && !goingRight) {
            this.dx = -10;
            this.dy = 0;
        }

        if (keyPressed === UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -10;
        }

        if (keyPressed === RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;
        }

        if (keyPressed === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;
        }
    }


    getNearbyObstacles(w, h) {

        let { x, y } = this.body[0]
        let snake = this.body
        // console.log(this);

        let up = { x: x, y: y - 10 }
        let down = { x: x, y: y + 10 }
        let left = { x: x - 10, y: y }
        let right = { x: x + 10, y: y }

        let tail = snake.map(x => x).splice(2, snake.length)

        let upArray = tail.filter(t => isSamePosition(t, up))
        let upObstacle = upArray.length > 0 ? upArray[0] : null;

        let downArray = tail.filter(t => isSamePosition(t, down))
        let downObstacle = downArray.length > 0 ? downArray[0] : null

        let leftArray = tail.filter(t => isSamePosition(t, left))
        let leftObstacle = leftArray.length > 0 ? leftArray[0] : null

        let rightArray = tail.filter(t => isSamePosition(t, right))
        let rightObstacle = rightArray.length > 0 ? rightArray[0] : null

        if (!upObstacle) {
            let upWall = { x: up.x, y: -10 }
            upObstacle = isSamePosition(up, upWall) ? upWall : { x: -1, y: -1 }
        }

        if (!downObstacle) {
            let downWall = { x: down.x, y: h }
            downObstacle = isSamePosition(down, downWall) ? downWall : { x: -1, y: -1 }
        }

        if (!leftObstacle) {
            let leftWall = { x: -10, y: left.y }
            leftObstacle = isSamePosition(left, leftWall) ? leftWall : { x: -1, y: -1 }
        }

        if (!rightObstacle) {
            let rightWall = { x: gameCanvas.width, y: right.y }
            rightObstacle = isSamePosition(right, rightWall) ? rightWall : { x: -1, y: -1 }
        }


        let obstacles = { up: upObstacle, down: downObstacle, left: leftObstacle, right: rightObstacle }



        // obstacles = obstacles.forEach((s) => {
        //     if (!s) return { x: -1, y: -1 }
        //     return s
        // })

        // console.log('');
        // console.log(obstacles);
        return obstacles;
    }

    getNearbyObstaclesBool(w, h) {
        let obs = { up: 0, down: 0, left: 0, right: 0 }
        if (this.body[0].x <= 0) {
            // console.log('Near left wall');
            obs.left = 1;
        }
        else {
            obs.left = this.bodyNearItself('left');
        }
        if (this.body[0].x >= w - 10) {
            // console.log('Near Right wall');
            obs.right = 1;
        }
        else {
            obs.right = this.bodyNearItself('right');
        }
        if (this.body[0].y <= 0) {
            // console.log('near top wall');
            obs.up = 1
        }
        else {
            obs.up = this.bodyNearItself('up');
        }
        if (this.body[0].y >= h - 10) {
            // console.log('Near Bottom wall');
            obs.down = 1;
        }
        else {
            obs.down = this.bodyNearItself('down')
        }
        // console.log("obs:", obs);
        return obs;
    }

    bodyNearItself(dir) {
        let tail = this.body.slice(1, this.body.length)
        // console.log(tail.length);
        let head = this.body[0]

        if (dir == 'left') {
            let left = 0
            tail.forEach(({ x, y }) => {
                if ((y == head.y) && (head.x - x == 10)) {

                    left = 1
                    // return
                }
            })
            return left

        }
        else if (dir == 'right') {
            let right = 0
            tail.forEach(({ x, y }) => {
                if ((y == head.y) && (head.x - x == -10)) {
                    right = 1
                    // return
                }
            })
            return right

        }
        else if (dir == 'up') {
            let up = 0
            tail.forEach(({ x, y }) => {
                if ((x == head.x) && (head.y - y == 10)) {
                    up = 1
                    // return
                }
            })
            return up


        }
        else if (dir == 'down') {
            let down = 0
            tail.forEach(({ x, y }) => {
                if ((x == head.x) && (head.y - y == -10)) {
                    down = 1
                    // return
                }
            })
            return down

        }
        return 0
    }

    getLinearObstacles() {

        //the position of the head
        let { x, y } = this.body[0];

        let upWall = { x: x, y: -10 };
        let downWall = { x: x, y: gameCanvas.height, };
        let leftWall = { x: -10, y: y };
        let rightWall = { x: gameCanvas.width, y: y };


        //initializing obstacle object to be returned
        // let obstacles = { up: upWall, down: downWall, left: leftWall, right: rightWall };
        let obstacles = { up: null, down: null, left: null, right: null };

        let tail = [...this.body].slice(1, this.body.length);

        tail.forEach((snakePart) => {
            let currX = snakePart.x;
            let currY = snakePart.x;
            console.log("CurrX:", currX, "X:", x);
            console.log("CurrY:", currY, "Y:", y);


            // up --> same x, lesser y
            if (currX === x && currY < y) {
                obstacles.up == null ? obstacles.up = { x: currX, y: currY } :
                    (obstacles.up.y < currY ? obstacles.up : obstacles.up = { x: currX, y: currY })

            }

            // down --> same x, greater y
            else if (currX === x && currY > y) {
                obstacles.down == null ? obstacles.down = { x: currX, y: currY } :
                    (obstacles.down.y > currY ? obstacles.down : obstacles.down = { x: currX, y: currY })
            }


            // left --> lesser x, same y
            else if (currX < x && currY === y) {
                obstacles.left == null ? obstacles.left = { x: currX, y: currY } :
                    (obstacles.left.x < currX ? obstacles.left : obstacles.left = { x: currX, y: currY })
            }
            // right --> greater x, same y
            else if (currX >= x && currY == y) {
                console.log('IN IF');

                if (obstacles.right == null) {
                    obstacles.right = { x: currX, y: currY }
                    console.log('obs right CHANGED From Null:', obstacles.right);

                }
                else if (obstacles.right.x < currX) {
                    //if currX is to the right of the head AND to the left of the previous 
                    obstacles.right = { x: currX, y: currY }
                    console.log('obs right CHANGED:', obstacles.right);

                }
                // obstacles.right == null ?
                //     obstacles.right = { x: currX, y: currY } :
                //     (obstacles.right.x < currX ?
                //         obstacles.right :
                //         (obstacles.right = { x: currX, y: currY }))
                // console.log("IN IF", obstacles.right);
            }


        });


        if (obstacles.up == null) {
            obstacles.up = upWall
            // console.log('ob is wall');
        }
        if (obstacles.down == null) {
            obstacles.down = downWall
            // console.log('ob is wall');
        }
        if (obstacles.left == null) {
            obstacles.left = leftWall
            // console.log('ob is wall');
        }
        if (obstacles.right == null) {
            obstacles.right = rightWall
            // console.log('ob is wall');
        }

        console.log(obstacles.right);
        console.log(' ');
        return obstacles
    };


    predict(inputs) {
        let { dx, dy } = this
        let out = this.NN.predict(inputs).arraySync()[0];

        let i = out.indexOf(Math.max(...out));
        // console.log(out, i);

        switch (i) {
            case 0:
                //move up
                if (!(dx == 0 && dy == 10))
                    this.NNChangeDir(0, -10)
                // console.log('up');
                break
            case 1:
                //move down
                if (!(dx == 0 && dy == -10))
                    this.NNChangeDir(0, 10)
                // console.log('down');
                break
            case 2:
                //move left
                if (!(dx == 10 && dy == 0))
                    this.NNChangeDir(-10, 0)
                // console.log('left');
                break
            case 3:
                //move right
                if (!(dx == -10 && dy == 0))

                    this.NNChangeDir(10, 0)
                // console.log('right');
                break

        }

    }

    NNChangeDir(dx, dy) {

        this.dx = dx
        this.dy = dy
    }

    // mutate(parentNN, mutationRate) {
    //     console.log('mutated in SNAKE');
    //     return new NN(parentNN, mutationRate)
    // }
    distance(a, b) {
        return Math.hypot(b.x - a.x, b.y - a.y)
    }
}
