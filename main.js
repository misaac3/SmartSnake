tf.setBackend('cpu');


let gi = new GameInstance('gameCanvas', 1000)
document.addEventListener("keydown", gi.changeDirection.bind(gi));
gi.start()



// let gi2 = new GameInstance('gameCanvas2')
// document.addEventListener("keydown", gi2.changeDirection.bind(gi2));
// gi2.start()

// let gi3 = new GameInstance('gameCanvas3')
// document.addEventListener("keydown", gi3.changeDirection.bind(gi3));
// gi3.start()


/*

TODO//

Implement NN & GA:
    create NN arch
    use (random) NN to control snake
    mutate weights
    crossoverweights


*/