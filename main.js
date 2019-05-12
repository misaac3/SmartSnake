tf.setBackend('cpu');


let gi = new GameInstance('gameCanvas', 200)
document.addEventListener("keydown", gi.changeDirection.bind(gi));
tf.tidy(() => {
    // gi.start()
})

/*

TODO//




*/