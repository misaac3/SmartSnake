
class GameInstance {
    constructor(canvasID, generationSize) {
        this.snake = new Snake()
        this.canvCtx = new CanvasCtx(CANVAS_SIZE, CANVAS_SIZE, canvasID)
        this.food = new Food(this.snake.body, CANVAS_SIZE, CANVAS_SIZE)
        this.savedFitness = []
        this.savedSnakes = []
        this.timeout = false;
        this.startTime = new Date();
        this.generationSize = generationSize;
        this.generationNum = 0
        this.generation = this.newGeneration({ numSnakes: this.generationSize })
        this.snakesRemaining = this.generation.length
        this.generationNum++
        // console.log('\n\nGENERATION', this.generationNum, '\n\n');
        document.querySelector("#generation").innerHTML = "generation: " + this.generationNum
    }



    resetGame() {

        document.getElementById('score').innerHTML = 'score: ' + 0;
        document.getElementById('score').style.backgroundColor = ''
        // console.log('');

        // console.log(`snake #${(this.generationSize - this.snakesRemaining)}`);
        document.querySelector("#snakeNum").innerHTML = `snake #${(this.generationSize - this.snakesRemaining)}`

        this.snake = this.generation[this.snakesRemaining]
        this.food = new Food(this.snake.body, CANVAS_SIZE, CANVAS_SIZE)

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

        // If the game ended return early to stop game
        if (this.didGameEnd() || this.timeout) {
            tf.tidy(() => {// console.log(this.generation[0]);

                this.timeout = false;
                this.snake.died();
                this.snakesRemaining--;
                this.savedFitness.push(this.snake.fitness)
                this.savedSnakes.push(this.snake)
                // console.log(this.snake.moves);
                this.savedFitness = this.savedFitness.sort(function (a, b) { return a - b })
                // console.log('Best Fitness: ', this.savedFitness[this.savedFitness.length - 1]);
                document.querySelector("#bestFitness").innerHTML = "best fitness: " + (Math.round(this.savedFitness[this.savedFitness.length - 1] * 100) / 100)


                this.resetGame();
                this.canvCtx.clearCanvas();
                this.snake.drawSnake(this.canvCtx.ctx);
                this.food.createFood(this.snake.body, CANVAS_SIZE, CANVAS_SIZE);
                this.food.drawFood(this.canvCtx.ctx);
                this.snake.advanceSnake(this.food, CANVAS_SIZE, CANVAS_SIZE);
                this.startTime = new Date()
            })
            this.start()
        }
        else if (this.snakesRemaining > 0) {
            setTimeout(function onTick() {

                tf.tidy(() => {
                    if ((new Date() - this.startTime > 15000 && this.snake.score < 2) || new Date() - this.startTime > (180 * 1000)
                        || (new Date() - this.startTime > 5000 && this.snake.score < 1)) {
                        this.timeout = true

                    }

                    this.snake.changingDirection = false;
                    this.canvCtx.clearCanvas();
                    this.food.drawFood(this.canvCtx.ctx);
                    this.snake.advanceSnake(this.food, CANVAS_SIZE, CANVAS_SIZE);
                    this.snake.drawSnake(this.canvCtx.ctx);
                    let inputs = this.createInputs()
                    this.snake.predict(inputs)
                    document.querySelector("#currFitness").innerHTML = "fitness: " + this.snake.fitness
                    document.querySelector("#time").innerHTML = "time: " + ((new Date() - this.startTime) / 1000) + " sec"
                })
                this.start();

            }.bind(this), GAME_SPEED)
        }
        else {
            tf.tidy(() => {
                this.updateScoreTable()

                this.generation = this.newGeneration({
                    numSnakes: this.generationSize,
                    mutationRate: 0.1,
                    lastGen: this.generation,
                    percentageOfTop: 0.1
                })

                this.generationNum++
                console.log('\n\nGENERATION', this.generationNum, '\n\n');
                document.querySelector("#generation").innerHTML = "generation: " + this.generationNum
                this.snake = this.generation[0]
                this.food = new Food(this.snake.body, CANVAS_SIZE, CANVAS_SIZE)
                this.savedFitness = []
                this.savedSnakes = []
                this.timeout = false;
                this.startTime = new Date();
                // this.generation = this.newGeneration({ numSnakes: this.generationSize })
                this.snakesRemaining = this.generation.length
                console.log(this.generation);
            })
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
        // let dx = this.snake.dx//1
        // let dy = this.snake.dy//1
        // let x = this.snake.body[0].x//1
        // let y = this.snake.body[0].y//1
        // let foodPos = { x: this.food.x, y: this.food.y }//2
        let foodAngle = this.getFoodAngle() // 1
        let foodLinObj = this.getFoodLinear() //4

        9

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
            // dx,
            // dy,
            // x,
            // y,
            // foodPos.x,
            // foodPos.y,
            foodLinObj.up,
            foodLinObj.down,
            foodLinObj.left,
            foodLinObj.right,
            // foodAngle

        ]

        // console.log(inputs);
        return inputs
    }


    newGeneration(options) {
        // return tf.tidy(() => {
        let generation = [];
        let { numSnakes, mutationRate, lastGen, percentageOfTop } = options
        if (mutationRate != null && lastGen != null) {
            // console.log('top snakes sorted?');
            let topSnakes = lastGen
                .sort((a, b) => b.fitness - a.fitness)
                .slice(0, Math.floor(lastGen.length * percentageOfTop))
                .filter((x) => x.fitness > 20)

            topSnakes.map((x) => console.log(x.fitness))
            // console.log(Math.floor(1 / percentageOfTop));
            for (let i = 0; i < topSnakes.length; i++) {
                for (let j = 0; j < Math.floor(1 / percentageOfTop * 0.75); j++) {
                    // let ind = (j + (j * (i + 1)));
                    let ind = ((i * Math.floor(1 / percentageOfTop * 0.75) - 1)) + j
                    // console.log('ind', ind);
                    if (j == 0) {
                        generation[ind] = new Snake({ oldNN: topSnakes[i].NN })
                        // console.log(ind);
                    }
                    else {
                        if (j % 2 == 0 || noCrossover) {
                            generation[ind] = new Snake({ mutationRate, parentNN: topSnakes[i].NN })
                        }
                        else {
                            // console.log('crossover in newGen');

                            let randSnakeInd = Math.floor(Math.random() * topSnakes.length);
                            generation[ind] = new Snake({
                                crossover: true,
                                NN1: topSnakes[i].NN,
                                NN2: topSnakes[randSnakeInd].NN,
                                snake1Fit: topSnakes[i].fitness,
                                snake2Fit: topSnakes[randSnakeInd].fitness

                            })
                        }


                    }
                }
            }


            if (lastGen.length - generation.length > 0) {
                let mutatedSnakes = Math.floor((lastGen.length - generation.length) * 0.5)
                for (let i = 0; i < mutatedSnakes && topSnakes.length > 0; i++) {
                    let ind = Math.floor(Math.random() * topSnakes.length)
                    let s = generation[ind]
                    // console.log(ind);
                    // console.log(s);
                    generation[generation.length] =
                        new Snake({ mutationRate, parentNN: s.NN })
                    // console.log(generation.length);

                }
                while (lastGen.length - generation.length > 0) {
                    generation[generation.length] = new Snake()
                    // console.log(generation.length);

                }
            }
            else if (lastGen.length - generation.length > 0) {
                generation = generation.slice(0, lastGen.length)
            }
        }
        else {
            for (let i = 0; i < numSnakes; i++) {
                generation[i] = new Snake()
                // console.log(i);

            }
        }
        return generation;
        // }        )
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
        let memNode = document.createElement("TD");


        let numSnakesSaved = this.generation
            .sort((a, b) => b.fitness - a.fitness)
            .slice(0, Math.floor(this.generation.length * 0.1))
            .filter((x) => x.fitness > 20)
            .length

        let bestFitness = this.generation
            .sort((a, b) => b.fitness - a.fitness)[0].fitness;
        bestFitness = Math.round(bestFitness * 100) / 100


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
        let memText = document.createTextNode(tf.memory().numTensors)


        avgFitnessNode.appendChild(avgFitnessText)
        bestFitnessNode.appendChild(bestFitnessText)
        genNode.appendChild(genText)
        avgScoreNode.appendChild(avgScoreText)
        bestScoreNode.appendChild(bestScoreText)
        savedSnakesNode.appendChild(savedSnakesText)
        memNode.appendChild(memText)

        row.appendChild(genNode)
        row.appendChild(bestFitnessNode)
        row.appendChild(avgFitnessNode)
        row.appendChild(bestScoreNode)
        row.appendChild(avgScoreNode)
        row.appendChild(savedSnakesNode)
        row.appendChild(memNode)

        pastScoreUL.appendChild(row)

    }

    getFoodAngle() {
        let x = this.snake.body[0].x//1
        let y = this.snake.body[0].y//1
        let foodx = this.food.x
        let foody = this.food.y
        //2
        let diffX = foodx - x;
        let diffY = foody - y;

        let theta = (Math.atan2(diffY, diffX) * 180 / Math.PI) + 180
        return theta / 180

    }

    getFoodLinear() {
        let obj = {
            up: 0,
            down: 0,
            left: 0,
            right: 0
        }

        let fx = this.food.x
        let fy = this.food.y

        let x = this.snake.body[0].x
        let y = this.snake.body[0].y

        if (x === fx && fy <= y) obj.up = 1
        if (x === fx && fy >= y) obj.down = 1
        if (y === fy && fx >= x) obj.left = 1
        if (y === fy && fx >= x) obj.right = 1
        // console.log("foodObj: ",obj);
        return obj

    }




}


