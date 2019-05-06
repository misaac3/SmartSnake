let gi = new GameInstance('gameCanvas')
document.addEventListener("keydown", gi.changeDirection.bind(gi));
gi.start()

let gi2 = new GameInstance('gameCanvas2')
gi2.start()



let gi3 = new GameInstance('gameCanvas3')
gi3.start()
