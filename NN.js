class NN {
    constructor(options) {
        if (options && options.parentNN && options.mutationRate) {
            this.model = this.mutate(options.parentNN, options.mutationRate)
        }
        else if (options && options.crossover && options.NN1 && options.NN2 && options.snake1Fit != null && options.snake2Fit != null) {
            // console.log('crossover in NN constructor');

            let { NN1, NN2, snake1Fit, snake2Fit } = options
            this.model = this.crossover(NN1, NN2, snake1Fit, snake2Fit)
        }
        else {
            this.model = this.createModel()
        }
    }

    createModel() {
        return tf.tidy(() => {        //up,down,left,right x,y --> 8

            //food 2
            //dx, dy 2
            // head 2
            //TOTAL: 14
            const model = tf.sequential();
            model.add(tf.layers.dense({ inputShape: [8], units: 100, activation: 'sigmoid' }));
            // model.add(tf.layers.dense({ units: 32, activation: 'sigmoid' }));
            model.add(tf.layers.dense({ units: 16, activation: 'sigmoid' }));
            model.add(tf.layers.dense({ units: 4, activation: 'softmax' }))
            return model
        })

    }

    predict(inputs) {
        return tf.tidy(() => {
            if (inputs.length != 8) {
                console.log('Invalid inputs');
                return
            }
            else {
                let output = this.model.predict(tf.tensor([inputs]))
                // output.print()
                return output
            }
        })

    }

    mutate(parentNN, mutationRate) {
        let model = this.createModel()
        console.log('mutate!!');
        // console.log('parentNN', parentNN);
        // console.log('mutationRate', mutationRate);
        return tf.tidy(() => {
            let weightLayer = parentNN.model.getWeights()
            let newWeights = []

            for (let i = 0; i < weightLayer.length; i++) {
                let tensorWeights = weightLayer[i];
                let shapeLayer = weightLayer[i].shape;
                let weightsArr = tensorWeights.dataSync().slice();
                for (let j = 0; j < weightsArr.length; j++) {
                    if (Math.random() < mutationRate) {
                        let w = weightsArr[j];
                        //value between 1 and -1
                        weightsArr[j] = w + (Math.random() * (0.5 - -0.5) + -0.5)
                    }
                }

                let newLayerWeights = tf.tensor(weightsArr, shapeLayer)

                for (let i = 0; i < tensorWeights.length; i++) {
                    const element = tensorWeights[i];
                    tf.dispose(element);
                }
                newWeights[i] = newLayerWeights;
            }
            model.setWeights(newWeights);

            // console.log(weightLayer[0].dataSync().slice().reduce((tot, n) => tot + n));
            // console.log(newWeights[0].dataSync().slice().reduce((tot, n) => tot + n));

            return model
        })
    }

    crossover(NN1, NN2, fit1, fit2) {
        console.log('crossover!!');

        let model = this.createModel()
        if (fit1 < fit2) {
            let temp = fit1
            fit1 = fit2
            fit2 = temp
        }
        let rate = fit2 / fit1
        return tf.tidy(() => {
            let NN1WeightsLayersArr = NN1.model.getWeights()
            let NN2WeightsLayersArr = NN2.model.getWeights()
            let newWeights = []

            for (let i = 0; i < NN1WeightsLayersArr.length; i++) {
                let tensorWeights1 = NN1WeightsLayersArr[i];
                let shapeLayer1 = NN1WeightsLayersArr[i].shape;
                let weightsArr1 = tensorWeights1.dataSync().slice();

                let tensorWeights2 = NN2WeightsLayersArr[i];
                // let shapeLayer2 = NN2WeightsLayersArr[i].shape;
                let weightsArr2 = tensorWeights2.dataSync().slice();

                let newWeightArr = []

                for (let j = 0; j < weightsArr1.length; j++) {
                    if (Math.random() < rate) {
                        newWeightArr[j] = weightsArr2[j]
                    }
                    else {
                        newWeightArr[j] = weightsArr1[j]
                    }

                }
                let newLayerWeights = tf.tensor(newWeightArr, shapeLayer1)
                newWeights[i] = newLayerWeights;
                for (let i = 0; i < tensorWeights1.length; i++) {
                    tf.dispose(tensorWeights1[i])
                    tf.dispose(tensorWeights2[i])

                    //    (element);
                }
            }
            model.setWeights(newWeights);

            return model
        })





    }

}


