class Snake {

    constructor() {
        this.body = [...initialBody];
        this.score = 0;
        this.time = 0;
        this.dx = 10;
        this.dy = 0;
        this.changingDirection = false;

    }

    drawSnake(ctx) {
        // loop through the snake parts drawing each part on the canvas
        this.body.forEach((snakePart) => this.drawSnakePart(snakePart, ctx))
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
            this.score += 10;
            // Display score on screen
            document.getElementById('score').innerHTML = this.score;
            // Generate new food location
            foodObj.createFood(this.body, w, h);
            console.log('FOOD FOUND');
        } else {
            // Remove the last part of snake body
            this.body.pop();
        }
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



}