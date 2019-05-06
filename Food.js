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

        // if the new food location is where the snake currently is, generate a new food location
        snake.forEach(this.isFoodOnSnake.bind(this))

    }
    isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == this.x && part.y == this.y;
        if (foodIsoNsnake) createFood();
    }

    drawFood(ctx) {
        ctx.fillStyle = FOOD_COLOUR;
        ctx.strokestyle = FOOD_BORDER_COLOUR;
        ctx.fillRect(this.x, this.y, 10, 10);
        ctx.strokeRect(this.x, this.y, 10, 10);
    }

}