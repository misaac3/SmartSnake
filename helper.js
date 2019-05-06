hitLeftWall = () => { snake[0].x < 0; }
hitRightWall = () => { snake[0].x > gameCanvas.width - 10; }
hitToptWall = () => { snake[0].y < 0; }
function hitBottomWall() {
    snake[0].y > gameCanvas.height - 10;
}
function beforeHitBottomWall() {
    snake[0].y >= gameCanvas.height - 10;
}