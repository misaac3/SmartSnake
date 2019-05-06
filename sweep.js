
let sweepingLeft = false;
let sweepingRight = false;
let moveHoriz = false;
let movingUp = false;
let movingDown = false;

function naiveAI() {
    /*
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;
    */

    // console.log('sweepingLeft', sweepingLeft, '\nsweepingRight', sweepingRight, '\nmoveHoriz', moveHoriz, '\nmovingUp', movingUp, '\nmovingDown', movingDown);
    // console.log(snake[0]);
    // console.log(snake[snake.length - 1]);

    //Start by moving to the right wall
    if (naiveSetup) {
        let { x, y } = snake[snake.length - 1]
        //direction does not change until right wall is reached
        if (snake[0].x >= gameCanvas.width - 10) {
            naiveSetup = false;
            //move down 
            dx = 0;
            dy = 10;
            movingDown = true;
            sweepingLeft = true;
        }
    }
    else {
        //start sweeping board

        //if first sweep, both sweepingLeft and sweepingRight will be false
        if (!(sweepingLeft || sweepingRight)) {
            //start sweeping left
            sweepingLeft = true;
        }

        //SWEEPING LEFT
        if (sweepingLeft) {
            //move veritically towards top and bottom wall, then move left once

            if (moveHoriz) {

                moveHoriz = false;
                if (movingDown) {
                    movingUp = true;
                    movingDown = false;
                }
                else if (movingUp) {
                    movingUp = false;
                    movingDown = true;
                }
            }
            //if snake is moving down 
            if (movingDown) {
                // console.log('moving down!');
                dx = 0;
                dy = 10;
                //if snake is at the bottom wall move horizontally
                if (snake[0].y >= gameCanvas.height - 10) {
                    if (snake[0].x <= 0) {
                        sweepingLeft = false;
                        sweepingRight = true;
                        dx = 10
                        dy = 0;
                    } else {
                        moveHoriz = true;
                        dx = -10
                        dy = 0;
                    }
                }
            }
            else if (movingUp) {
                dx = 0;
                dy = -10;
                //if snake is at the bottom wall move horizontally
                if (snake[0].y <= 0) {
                    if (snake[0].x <= 0) {
                        sweepingLeft = false;
                        sweepingRight = true;
                        dx = 10
                        dy = 0;
                    } else {
                        moveHoriz = true;
                        dx = -10
                        dy = 0;
                    }
                }
            }

        }
        else if (sweepingRight) {
            //move veritically towards top and bottom wall, then move left once

            if (moveHoriz) {

                moveHoriz = false;
                if (movingDown) {
                    movingUp = true;
                    movingDown = false;
                }
                else if (movingUp) {
                    movingUp = false;
                    movingDown = true;
                }
            }
            //if snake is moving down 
            if (movingDown) {
                dx = 0;
                dy = 10;
                //if snake is at the bottom wall move horizontally
                if ((snake[0].y >= gameCanvas.height - 10)) {
                    if (snake[0].x > gameCanvas.width - 10) {
                        sweepingLeft = true;
                        sweepingRight = false;
                        dx = -10
                        dy = 0;
                    } else {
                        moveHoriz = true;
                        dx = 10
                        dy = 0;
                    }
                }
            }
            else if (movingUp) {
                dx = 0;
                dy = 10;
                //if snake is at the bottom wall move horizontally
                if (snake[0].y >= gameCanvas.height - 10) {
                    console.log('here');
                    if (snake[0].x >= gameCanvas.width - 10) {
                        sweepingLeft = true;
                        sweepingRight = false;
                        dx = -10
                        dy = 0;
                    } else {
                        moveHoriz = true;
                        dx = 10
                        dy = 0;
                    }
                }
            }

        }
    }
    // console.log('sweepingLeft', sweepingLeft, '\nsweepingRight', sweepingRight, '\nmoveHoriz', moveHoriz, '\nmovingUp', movingUp, '\nmovingDown', movingDown);


}