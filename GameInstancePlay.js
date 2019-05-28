class GameInstancePlay {
    constructor(canvasID) {
        // this.playMode = playMode ? playMode : false;

        this.snake = new Snake();
        this.canvasNum = 0;
        this.canvCtx = new CanvasCtx(CANVAS_SIZE, CANVAS_SIZE, canvasID + String(this.canvasNum++));
        this.food = new Food(this.snake.body, CANVAS_SIZE, CANVAS_SIZE);
        // this.savedFitness = [];
        // this.savedSnakes = [];
        // this.bestSnake = null;
        // this.timeout = false;
        // this.startTime = new Date();
        // this.generationSize = generationSize;
        // this.generationNum = 0;
        // this.generation = this.newGeneration({ numSnakes: this.generationSize });
        // this.snakesRemaining = this.generation.length;
        // this.generationNum++;
        this.stop = false;
        // this.savedAvgScores = []
        // console.log('\n\nGENERATION', this.generationNum, '\n\n');
        // document.querySelector("#generation").innerHTML = "generation: " + this.generationNum;

        // if (this.playMode) {
        GAME_SPEED = 100
        // this.start()
        // }
        this.pastScores = []

    }
    resetGame() {

        isNaN(this.snake.score) ? this.pastScores.push(0)
            : this.pastScores.push(this.snake.score)

        // console.log(Math.max(...this.pastScores), this.pastScores);
        // arr.reduce(function (a, b) {
        //     return Math.max(a, b);
        // });
        document.getElementById('topScore').innerHTML = 'High Score: ' +
            `${this.pastScores.reduce((a, b) => Math.max(a, b))}`


        let newText = document.createTextNode(this.snake.score)
        let newNode = document.createElement('li')
        newNode.appendChild(newText)
        document.getElementById('pastScores').appendChild(newNode)

        document.getElementById('score').innerHTML = 'score: ' + 0;
        document.getElementById('score').style.backgroundColor = ''
        // console.log('');

        // console.log(`snake #${ (this.generationSize - this.snakesRemaining) } `);
        // document.querySelector("#snakeNum").innerHTML = `snake #${ (this.generationSize - this.snakesRemaining) } `

        // this.snake = this.generation[this.snakesRemaining]
        this.snake = new Snake()
        this.food = new Food(this.snake.body, CANVAS_SIZE, CANVAS_SIZE)

    }

    didGameEnd() {
        for (let i = 4; i < this.snake.body.length; i++) {
            if (this.snake.body[i].x === this.snake.body[0].x && this.snake.body[i].y === this.snake.body[0].y) return true
        }
        const hitLeftWall = this.snake.body[0].x < 0;
        const hitRightWall = this.snake.body[0].x > this.canvCtx.width - 10;
        const hitToptWall = this.snake.body[0].y < 0;
        const hitBottomWall = this.snake.body[0].y > this.canvCtx.height - 10;
        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }



    start() {
        if (this.stop) {
            return
        }
        // If the game ended return early to stop game
        if (this.didGameEnd() || this.timeout) {
            tf.tidy(() => {// console.log(this.generation[0]);

                this.timeout = false;
                this.snake.died();



                this.resetGame();
                this.canvCtx.clearCanvas();
                this.snake.drawSnake(this.canvCtx.ctx);
                this.food.createFood(this.snake.body, CANVAS_SIZE, CANVAS_SIZE);
                this.food.drawFood(this.canvCtx.ctx);
                this.snake.advanceSnake(this.food, CANVAS_SIZE, CANVAS_SIZE);
                // this.startTime = new Date()
            })
            this.start()
        }
        else if (!this.snake.snakeDied) {
            setTimeout(function onTick() {
                tf.tidy(() => {


                    this.snake.changingDirection = false;
                    this.canvCtx.clearCanvas();
                    this.food.drawFood(this.canvCtx.ctx);
                    this.snake.advanceSnake(this.food, CANVAS_SIZE, CANVAS_SIZE);
                    this.snake.drawSnake(this.canvCtx.ctx);


                })
                this.start();

            }.bind(this), GAME_SPEED)
        }

        else {
            console.log('reach here?');
            this.start()
        }
    }

    changeDirection(e) {
        // console.log(this, e);
        this.snake.changeDirection(e);
        this.snake.changingDirection = false;
    }
}