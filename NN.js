class NN {
    constructor() {
        this.model = this.createModel()
    }

    createModel() {
        //up,down,left,right x,y --> 8

        //food 2
        //dx, dy 2
        // head 2
        //TOTAL: 14
        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [14], units: 25, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 4, activation: 'softmax' }))
        return model
    }

    predict(inputs) {
        if (inputs.length != 14) {
            console.log('Invalid inputs');
            return
        }
        else {
            let output = this.model.predict(tf.tensor([inputs]))
            // output.print()
            return output
        }

    }
}




// const model = tf.sequential();
// model.add(tf.layers.dense({ inputDim: 5, units: 5, activation: 'relu' }));
// // model.add(tf.layers.dense({ inputShape: [32], units: 64, activation: 'relu' }))
// model.add(tf.layers.dense({ units: 3, activation: 'softmax' }))

// // model.compile({ loss: 'meanSquaredError', optimizer: tf.train.sgd(0.2) })

// // console.log(model);
// // model.compile(optimizer = 'adam',
// //     loss = 'meanSquaredError',
// //     metrics = ['accuracy'])
// // model.predict([[1, 2, 3, 4, 5]])
// randXs = [0, 0, 0, 0, 0]

// randYs = [0, 0, 0]
// randXs = randXs.map((x) => Math.random())

// // randXs = randXs.map((x) => randXs.map(() => Math.random()))
// randYs = randYs.map((x) => Math.floor(Math.random() * 2))
// console.log(randXs, randYs)

// // async function train() {
// //     await model.fit(tf.tensor([randXs]), tf.tensor([randYs]))

// // }

// // train()
// //     .then((e) => console.log('success'))
// //     .catch((e) => console.error(e))

// model.predict(tf.tensor([[1, 2, 3, 4, 5]])).print()
// // model.summary()


// // // for layer in model.layers: print()
// // // model.layer.forEach((layer) => console.log(layer.get_config(), layer.get_weights());
// // console.log(model.layers[0].weights);
// console.log(model.getWeights());

// w = model.getWeights()
// e1 = model.getWeights()[0]
// e2 = model.getWeights()[1]

// // model.setWeights(
// //     tf.tensor(
// //         [
// //             // model.getWeights()[0],
// //             // model.getWeights()[0],
// //             // model.getWeights()[0],
// //             // model.getWeights()[0]
// //             1, 2, 3, 4
// //         ]
// //     )
// // )

// // model.setWeight