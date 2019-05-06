class GameInstance {
    constructor(canvasID) {
        this.snake = new Snake()
        this.canvCtx = new CanvasCtx(600, 600, canvasID)
        this.food = new Food(this.snake.body, 600, 600)

    }



    resetGame() {
        console.log('\nGAME OVER\n');


        // this.snake = new Snake()
        // console.log(this.snake.body);
        // this.snake.changeDirection = false;

        // // naiveSetup = true;
        // score = 0;
        document.getElementById('score').innerHTML = 0;
        // // When set to true the snake is changing direction
        // // changingDirection = false;

        // // Food x-coordinate
        // this.food.x;
        // // Food y-coordinate
        // this.food.y;
        // // Horizontal velocity
        // this.snake.dx = 10;
        // // Vertical velocity
        // this.snake.dy = 0;

        this.snake = new Snake();
        // this.canvCtx = new CanvasCtx(600, 600, 'gameCanvas')
        this.food = new Food(this.snake.body, 600, 600)

    }

    didGameEnd() {
        for (let i = 4; i < this.snake.body.length; i++) {
            if (this.snake.body[i].x === this.snake.body[0].x && this.snake.body[i].y === this.snake.body[0].y) return true
        }
        const hitLeftWall = this.snake.body[0].x < 0;
        const hitRightWall = this.snake.body[0].x > gameCanvas.width - 10;
        const hitToptWall = this.snake.body[0].y < 0;
        const hitBottomWall = this.snake.body[0].y > gameCanvas.height - 10;
        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }
    start() {

        // console.log('Main');
        // If the game ended return early to stop game
        if (this.didGameEnd()) {
            this.resetGame();
            this.canvCtx.clearCanvas();
            this.snake.drawSnake(this.canvCtx.ctx);
            this.food.createFood(this.snake.body, 600, 600);
            this.food.drawFood(this.canvCtx.ctx);
            this.snake.advanceSnake(this.food, 600, 600);
            this.start()
        }
        else {
            setTimeout(function onTick() {
                this.snake.changingDirection = false;
                this.canvCtx.clearCanvas();
                // this.canvCtx.makeGrid();
                this.food.drawFood(this.canvCtx.ctx);

                // naiveAI()
                this.snake.advanceSnake(this.food, 600, 600);

                this.snake.drawSnake(this.canvCtx.ctx);
                // this.snake.checkNearWall()


                let inputs = this.createInputs()
                this.snake.predict(inputs)
                // this.snake.getLinearObstacles();

                this.start();

            }.bind(this), GAME_SPEED)
        }

    }

    changeDirection(e) {
        // console.log(this, e);
        this.snake.changeDirection(e);
        this.snake.changingDirection = false;
    }

    createInputs() {
        let obs = this.snake.getNearbyObstacles(); //8
        let dx = this.snake.dx//1
        let dy = this.snake.dy//1
        let x = this.snake.body[0].x//1
        let y = this.snake.body[0].y//1
        let foodPos = { x: this.food.x, y: this.food.y }//2

        let inputs = [
            obs.up.x,
            obs.up.y,
            obs.down.x,
            obs.down.y,
            obs.left.x,
            obs.left.y,
            obs.right.x,
            obs.right.y,
            dx,
            dy,
            x,
            y,
            foodPos.x,
            foodPos.y

        ]

        // console.log(inputs);
        return inputs
    }

}
