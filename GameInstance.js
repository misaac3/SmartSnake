class GameInstance {
    constructor(canvasID, generationSize) {
        this.chart = null;

        this.initialize()
        this.started = false

        // this.playMode = playMode ? playMode : false;

        this.snake = new Snake();
        this.canvasNum = 0;
        this.canvCtx = new CanvasCtx(CANVAS_SIZE, CANVAS_SIZE, canvasID + String(this.canvasNum++));
        this.food = new Food(this.snake.body, CANVAS_SIZE, CANVAS_SIZE);
        this.savedFitness = [];
        this.savedSnakes = [];
        this.bestSnake = null;
        this.timeout = false;
        // this.startTime = new Date();
        this.generationSize = generationSize;
        this.generationNum = 0;
        this.generation = this.newGeneration({ numSnakes: this.generationSize });
        this.snakesRemaining = this.generation.length;
        this.generationNum++;
        this.stop = false;
        this.savedAvgScores = []
        // console.log('\n\nGENERATION', this.generationNum, '\n\n');
        document.querySelector("#generation").innerHTML = "generation: " + this.generationNum;
        // this.initializeGraph()
        // if (this.playMode) {
        //     GAME_SPEED = 100
        //     this.start()
        // }
        this.manualKillSnake = false;
        document.addEventListener('keydown', () => {
            console.log(event);
            if (event.keyCode == 75) {
                this.manualKillSnake = true;
                console.log('KILL');

            }
        })
    }



    resetGame() {

        document.getElementById('score').innerHTML = 'score: ' + 0;
        document.getElementById('score').style.backgroundColor = ''
        // console.log('');

        // console.log(`snake #${(this.generationSize - this.snakesRemaining)}`);
        document.querySelector("#snakeNum").innerHTML =
            `snake #${(this.generationSize - this.snakesRemaining) - 1}`
        // this.snakesRemaining = this.generation.length;

        if (this.snakesRemaining > -1) {
            this.snake = this.generation[this.snakesRemaining]
        }

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

        // console.log(this.snake);
        if (this.stop) {
            return
        }
        // If the game ended return early to stop game
        if ((this.snakesRemaining > -1 && (this.didGameEnd() || this.timeout)) || this.manualKillSnake) {
            tf.tidy(() => {// console.log(this.generation[0]);
                this.manualKillSnake = false;

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
                this.snake.startTime = new Date()
            })
            this.start()
        }
        else if (this.snakesRemaining > 0) {
            setTimeout(function onTick() {

                tf.tidy(() => {
                    let newDate = new Date()
                    if ((newDate - this.snake.startTime > 15000 && this.snake.score < 2)
                        || newDate - this.snake.startTime > (300 * 1000)
                        || (this.snake.timeOfLastFood !== -1 && (newDate - this.snake.timeOfLastFood > (15 * 1000)))
                        || (newDate - this.snake.startTime > 5000 && this.snake.score < 1)) {
                        // if (this.shouldTimeout()) {
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
                    document.querySelector("#time").innerHTML = "time: " + ((new Date() - this.snake.startTime) / 1000) + " sec"
                })
                this.start();

            }.bind(this), GAME_SPEED)
        }

        else {
            tf.tidy(() => {
                this.updateScoreTable()

                this.generation = this.newGeneration({
                    numSnakes: this.generationSize,
                    mutationRate: 0.2,
                    lastGen: this.generation,
                    percentageOfTop: 0.1,
                    fitnessCutoff: 30
                })
                document.querySelector("#snakeNum").innerHTML =
                    `snake #${(this.generationSize - this.snakesRemaining) - 1}`
                this.generationNum++
                console.log('\n\nGENERATION', this.generationNum, '\n\n');
                document.querySelector("#generation").innerHTML = "generation: " + this.generationNum
                this.snake = this.generation[0]
                this.food = new Food(this.snake.body, CANVAS_SIZE, CANVAS_SIZE)
                this.savedFitness = []
                console.log(this.savedSnakes[0],
                    this.savedSnakes[this.savedSnakes.length - 1]);
                this.savedSnakes = []
                this.timeout = false;
                this.snake.startTime = new Date();
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
        let obs = this.snake.getNearbyObstaclesBool(this.canvCtx.width, this.canvCtx.height) // 4
        // let dx = this.snake.dx//1
        // let dy = this.snake.dy//1
        // let x = this.snake.body[0].x//1
        // let y = this.snake.body[0].y//1
        // let foodPos = { x: this.food.x, y: this.food.y }//2
        let foodAngle = this.getFoodAngle() // 1
        let foodLinObj = this.getFoodLinear() //4


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
        return tf.tidy(() => {
            let generation = [];
            let { numSnakes, mutationRate, lastGen, percentageOfTop, fitnessCutoff } = options
            if (mutationRate != null && lastGen != null) {
                let topSnakes = lastGen
                    .sort((a, b) => b.fitness - a.fitness)
                    .slice(0, Math.floor(lastGen.length * percentageOfTop))
                    .filter((x) => x.fitness > fitnessCutoff)

                topSnakes.map((x) => console.log(x.fitness))
                for (let i = 0; i < topSnakes.length; i++) {
                    for (let j = 0; j < Math.floor(1 / percentageOfTop * 0.75); j++) {
                        // let ind = (j + (j * (i + 1)));
                        let ind = ((i * Math.floor(1 / percentageOfTop * 0.75) - 1)) + j
                        if (j == 0) {
                            generation[ind] = new Snake({ oldNN: topSnakes[i].NN })
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
        })
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
            .filter((x) => x.fitness > 30)
            .length


        let bestSnakeinGen = this.generation.sort((a, b) => b.fitness - a.fitness)[0]
        let bestFitness = bestSnakeinGen.fitness;
        bestFitness = Math.round(bestFitness * 100) / 100

        if (this.bestSnake == null || bestSnakeinGen.fitness > this.bestSnake.fitness) this.bestSnake = bestSnakeinGen
        console.log(this.bestSnake);

        let averageFitness = (arr) => (arr.map((x) => x.fitness).reduce((a, b) => a + b)) / arr.length

        let af = averageFitness(this.generation)
        af = Math.round(af * 100) / 100

        let bestScore = this.generation
            .sort((a, b) => b.score - a.score)[0].score;

        let averageScore = (arr) => (arr.map((x) => x.score).reduce((a, b) => a + b)) / arr.length

        let as = averageScore(this.generation)
        as = Math.round(as * 100) / 100
        this.savedAvgScores.push(as)

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

        this.updateGraph(this.chart, this.generationNum, as)

    }

    updateGraph(chart, label, data) {
        // console.log(label , data);
        chart.data.labels.push(label);
        let len = chart.data.datasets[0].data.length

        chart.data.datasets[0].data.push(data)
        console.log(chart.data.datasets[0]);
        console.log(chart.data.labels);
        chart.update();
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
        // console.log('theta', theta);
        return theta / 360

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

    initialize() {
        this.initializeGraph()
        this.addStartStopListeners()
    }

    // addGenerationNumListener() {
    //     document.querySelector("#numGen").addEventListener('click', () => {
    //         this.generation = this.newGeneration({ numSnakes: this.generationSize });
    //         this.snakesRemaining = this.generation.length;
    //     })
    // }

    addStartStopListeners() {

        document.querySelector("#StartBtn").addEventListener('click', () => {
            if (gi) gi.stop = false;
            tf.tidy(() => {

                if (!this.started) {

                    let generationSize = Number(document.querySelector("#numGen").value)
                    this.generationSize = generationSize;
                    this.generation = this.newGeneration({ numSnakes: this.generationSize });
                    this.snakesRemaining = this.generation.length;
                    document.getElementById('numGen').setAttribute('disabled', '')
                    this.started = true;

                }


                document.addEventListener("keydown", gi.changeDirection.bind(gi));
                gi.start()

            })
        });
        document.querySelector("#StopBtn").addEventListener('click', async () => {
            gi.stop = true
            // let d = new Date()
            // let dateStr = String(d.getMonth() + 1) + "-" + String(d.getDate()) + "-" + String(d.getFullYear()) + "_" + String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds())
            // console.log(dateStr);
            // if (gi.bestSnake) await gi.bestSnake.NN.model.save('downloads://snake-model-' + dateStr);

        });
        document.querySelector("#DownloadBtn").addEventListener('click', async () => {
            // gi.stop = true
            let d = new Date()
            let dateStr = String(d.getMonth() + 1) + "-" + String(d.getDate()) + "-" + String(d.getFullYear()) + "_" + String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds())
            console.log(dateStr);
            if (gi.bestSnake) await gi.bestSnake.NN.model.save('downloads://best-snake-model-' + dateStr);

        });
    }

    initializeGraph() {
        let graphCtx = document.getElementById('myChart');
        this.chart = new Chart(graphCtx, {
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
    }

    shouldTimeout() {
        let newDate = new Date();
        if (
            (newDate - this.snake.startTime > 15000 && this.snake.score < 2)
            || newDate - this.snake.startTime > (300 * 1000)
            || newDate - this.snake.timeOfLastFood > (15 * 1000)
            || (newDate - this.snake.startTime > 5000 && this.snake.score < 1)
        ) { return true }
        return false;
    }

}