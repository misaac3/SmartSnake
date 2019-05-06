// requirejs(["helper/util"], function(util) {
//     //This function is called when scripts/helper/util.js is loaded.
//     //If util.js calls define(), then this function is not fired until
//     //util's dependencies have loaded, and the util argument will hold
//     //the module value for "helper/util".
// });


// import * as tf from '@tensorflow/tfjs';



// // const tf = require('@tensorflow/tfjs');

const model = tf.sequential();
model.add(tf.layers.dense({ inputDim: 5, units: 5, activation: 'relu' }));
// model.add(tf.layers.dense({ inputShape: [32], units: 64, activation: 'relu' }))
model.add(tf.layers.dense({ units: 3, activation: 'softmax' }))

// model.compile({ loss: 'meanSquaredError', optimizer: tf.train.sgd(0.2) })

// console.log(model);
// model.compile(optimizer = 'adam',
//     loss = 'meanSquaredError',
//     metrics = ['accuracy'])
// model.predict([[1, 2, 3, 4, 5]])
randXs = [0, 0, 0, 0, 0]

randYs = [0, 0, 0]
randXs = randXs.map((x) => Math.random())

// randXs = randXs.map((x) => randXs.map(() => Math.random()))
randYs = randYs.map((x) => Math.floor(Math.random() * 2))
console.log(randXs, randYs)

// async function train() {
//     await model.fit(tf.tensor([randXs]), tf.tensor([randYs]))

// }

// train()
//     .then((e) => console.log('success'))
//     .catch((e) => console.error(e))

model.predict(tf.tensor([[1, 2, 3, 4, 5]])).print()
// model.summary()


// // for layer in model.layers: print()
// // model.layer.forEach((layer) => console.log(layer.get_config(), layer.get_weights());
// console.log(model.layers[0].weights);
console.log(model.getWeights());

w = model.getWeights()
e1 = model.getWeights()[0]
e2 = model.getWeights()[1]

// model.setWeights(
//     tf.tensor(
//         [
//             // model.getWeights()[0],
//             // model.getWeights()[0],
//             // model.getWeights()[0],
//             // model.getWeights()[0]
//             1, 2, 3, 4
//         ]
//     )
// )

// model.setWeight