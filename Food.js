class Food {
    constructor(snake, w, h) {
        this.x = 10;
        this.y = 10;
        this.createFood(snake, w, h);
    }

    randomTen(min, max) {
        let num = Math.round((Math.random() * (max - min) + min) / 10) * 10;
        return num;
    }

    /**
     * Creates random set of coordinates for the snake food.
     */
    createFood(snake, canvasWidth, canvasHeight) {

        // Generate a random number the food x-coordinate
        this.x = this.randomTen(10, canvasWidth - 20);
        // Generate a random number for the food y-coordinate
        this.y = this.randomTen(0, canvasHeight - 10);


        if (this.x == initialBody[0].x || this.y == initialBody[0].y) {
            this.createFood(snake, canvasWidth, canvasHeight);
        }
        // if the new food location is where the snake currently is, generate a new food location
        else { snake.forEach((snakePart) => this.isFoodOnSnake(snakePart, canvasWidth, canvasHeight)) }


    }
    isFoodOnSnake(snakePart, canvasWidth, canvasHeight) {
        const foodIsoNsnake = snakePart.x == this.x && snakePart.y == this.y;
        if (foodIsoNsnake) this.createFood(snakePart, canvasWidth, canvasHeight);
    }

    drawFood(ctx) {
        ctx.fillStyle = FOOD_COLOUR;
        ctx.strokestyle = FOOD_BORDER_COLOUR;
        ctx.fillRect(this.x, this.y, 10, 10);
        ctx.strokeRect(this.x, this.y, 10, 10);
    }

}