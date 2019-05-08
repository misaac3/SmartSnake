
class GameInstance {
    constructor(canvasID, generationSize) {
        this.snake = new Snake()
        this.canvCtx = new CanvasCtx(600, 600, canvasID)
        this.food = new Food(this.snake.body, 600, 600)
        this.savedFitness = []
        this.savedSnakes = []
        this.timeout = false;
        this.startTime = new Date();
        this.generationSize = generationSize;
        this.generationNum = 0
        this.generation = this.newGeneration({ numSnakes: this.generationSize })
        //  = this.newGeneration({ numSnakes: generationSize, mutationRate: 20, lastGen: g })
        this.snakesRemaining = this.generation.length
        this.generationNum++
        console.log('\n\nGENERATION', this.generationNum, '\n\n');
    }



    resetGame() {
        // console.log('\nGAME OVER\n');


        // this.snake = new Snake()
        // console.log(this.snake.body);
        // this.snake.changeDirection = false;

        // // naiveSetup = true;
        // bestFitness = 0;
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

        // this.snake = new Snake();
        console.log('');

        console.log(`snake #${(this.generationSize - this.snakesRemaining)}`);
        // console.log(this.generation);
        this.snake = this.generation[this.snakesRemaining]
        // console.log(this.snake)

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
        // console.log(this.generation[0]);

        // If the game ended return early to stop game
        if (this.didGameEnd() || this.timeout) {
            this.timeout = false;
            this.snake.died();
            this.snakesRemaining--;
            this.savedFitness.push(this.snake.fitness)
            this.savedSnakes.push(this.snake)
            // console.log(this.snake.moves);
            this.savedFitness = this.savedFitness.sort(function (a, b) { return a - b })
            console.log('Best Fitness: ', this.savedFitness[this.savedFitness.length - 1]);
            this.resetGame();
            this.canvCtx.clearCanvas();
            this.snake.drawSnake(this.canvCtx.ctx);
            this.food.createFood(this.snake.body, 600, 600);
            this.food.drawFood(this.canvCtx.ctx);
            this.snake.advanceSnake(this.food, 600, 600);
            this.startTime = new Date()
            this.start()
        }
        else if (this.snakesRemaining > 0) {
            setTimeout(function onTick() {
                if (new Date() - this.startTime > 30000 && this.snake.fitness < 0) {
                    this.timeout = true

                }

                this.snake.changingDirection = false;
                this.canvCtx.clearCanvas();
                this.food.drawFood(this.canvCtx.ctx);
                this.snake.advanceSnake(this.food, 600, 600);
                this.snake.drawSnake(this.canvCtx.ctx);
                let inputs = this.createInputs()
                this.snake.predict(inputs)
                this.start();

            }.bind(this), GAME_SPEED)
        }
        else {
            this.updateScoreTable()

            this.generation = this.newGeneration({
                numSnakes: this.generationSize,
                mutationRate: 0.1,
                lastGen: this.generation,
                percentageOfTop: 0.1
            })

            this.generationNum++
            console.log('\n\nGENERATION', this.generationNum, '\n\n');
            this.snake = this.generation[0]
            this.food = new Food(this.snake.body, 600, 600)
            this.savedFitness = []
            this.savedSnakes = []
            this.timeout = false;
            this.startTime = new Date();
            this.generation = this.newGeneration({ numSnakes: this.generationSize })
            this.snakesRemaining = this.generation.length
            this.start()

        }

    }

    changeDirection(e) {
        // console.log(this, e);
        this.snake.changeDirection(e);
        this.snake.changingDirection = false;
    }

    createInputs() {
        // let obs = this.snake.getNearbyObstacles(); //8
        let obs = this.snake.getNearbyObstaclesBool() // 4
        let dx = this.snake.dx//1
        let dy = this.snake.dy//1
        let x = this.snake.body[0].x//1
        let y = this.snake.body[0].y//1
        let foodPos = { x: this.food.x, y: this.food.y }//2

        let inputs = [
            // obs.up.x,
            // obs.up.y,
            // obs.down.x,
            // obs.down.y,
            // obs.left.x,
            // obs.left.y,
            // obs.right.x,
            // obs.right.y,
            obs.up,
            obs.down,
            obs.left,
            obs.right,
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


    newGeneration(options) {
        let generation = [];
        let { numSnakes, mutationRate, lastGen, percentageOfTop } = options
        if (mutationRate != null && lastGen != null) {
            // console.log('top snakes sorted?');
            let topSnakes = lastGen
                .sort((a, b) => b.fitness - a.fitness)
                .slice(0, Math.floor(lastGen.length * percentageOfTop))
                .filter((x) => x.fitness > 0)

            topSnakes.map((x) => console.log(x.fitness))

            for (let i = 0; i < topSnakes.length; i++) {
                for (let j = 0; j < Math.floor(1 / percentageOfTop); j++) {
                    let ind = (i + (j * (i + 1)));
                    if (j == 0) {
                        generation[ind] = new Snake({ oldNN: topSnakes[i].NN })
                    }
                    else {
                        generation[ind] = new Snake({ mutationRate, parentNN: topSnakes[i].NN })
                    }
                }
            }
            if (lastGen.length - generation.length > 0) {
                let mutatedSnakes = Math.floor((lastGen.length - generation.length) / 2)
                for (let i = 0; i < mutatedSnakes && topSnakes.length > 0; i++) {
                    let ind = Math.floor(Math.random() * topSnakes.length)
                    let s = generation[ind]
                    console.log(ind);
                    console.log(s);
                    generation[generation.length] =
                        new Snake({ mutationRate, parentNN: s.NN })
                }
                while (lastGen.length - generation.length > 0) {
                    generation[generation.length] = new Snake()
                }
            }
            else if (lastGen.length - generation.length > 0) {
                generation = generation.slice(0, lastGen.length)
            }
        }
        else {
            for (let i = 0; i < numSnakes; i++) {
                generation[i] = new Snake()
            }
        }
        return generation;

    }

    updateScoreTable() {
        let pastScoreUL = document.getElementById("pastScores")

        let row = document.createElement("TR");
        let bestFitnessNode = document.createElement("TD");
        let genNode = document.createElement("TD");
        let avgFitnessNode = document.createElement("TD");
        let bestScoreNode = document.createElement("TD");
        let avgScoreNode = document.createElement("TD");
        let savedSnakesNode = document.createElement("TD");

        let numSnakesSaved = this.generation
            .sort((a, b) => b.fitness - a.fitness)
            .slice(0, Math.floor(this.generation.length * 0.1))
            .filter((x) => x.fitness > 0)
            .length

        let bestFitness = this.generation
            .sort((a, b) => b.fitness - a.fitness)[0].fitness;

        let averageFitness = (arr) => (arr.map((x) => x.fitness).reduce((a, b) => a + b)) / arr.length

        let af = averageFitness(this.generation)
        af = Math.round(af * 100) / 100

        let bestScore = this.generation
            .sort((a, b) => b.score - a.score)[0].score;

        let averageScore = (arr) => (arr.map((x) => x.score).reduce((a, b) => a + b)) / arr.length

        let as = averageScore(this.generation)
        as = Math.round(as * 100) / 100

        let avgFitnessText = document.createTextNode(af)
        let bestFitnessText = document.createTextNode(bestFitness)
        let genText = document.createTextNode(this.generationNum)

        let bestScoreText = document.createTextNode(bestScore)
        let avgScoreText = document.createTextNode(as)

        let savedSnakesText = document.createTextNode(numSnakesSaved)


        avgFitnessNode.appendChild(avgFitnessText)
        bestFitnessNode.appendChild(bestFitnessText)
        genNode.appendChild(genText)
        avgScoreNode.appendChild(avgScoreText)
        bestScoreNode.appendChild(bestScoreText)
        savedSnakesNode.appendChild(savedSnakesText)

        row.appendChild(genNode)
        row.appendChild(bestFitnessNode)
        row.appendChild(avgFitnessNode)
        row.appendChild(bestScoreNode)
        row.appendChild(avgScoreNode)
        row.appendChild(savedSnakesNode)

        pastScoreUL.appendChild(row)

    }

}
