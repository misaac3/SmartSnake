class NN {
    constructor(options) {
        if (options && options.parentNN && options.mutationRate) {
            this.model = this.mutate(options.parentNN, options.mutationRate)
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
            model.add(tf.layers.dense({ inputShape: [10], units: 30, activation: 'sigmoid' }));
            // model.add(tf.layers.dense({ units: 10, activation: 'sigmoid' }));

            model.add(tf.layers.dense({ units: 4, activation: 'softmax' }))
            return model
        })

    }

    predict(inputs) {
        return tf.tidy(() => {
            if (inputs.length != 10) {
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
        return tf.tidy(() => {
            let weightLayer = parentNN.model.getWeights()
            let newWeights = []
            for (let i = 0; i < weightLayer.length; i++) {
                let tensorWeights = weightLayer[i];
                let shapeLayer = weightLayer[i].shape;
                let weightsArr = tensorWeights.dataSync().slice();
                for (let j = 0; j < values.length; j++) {
                    if (random(1) < mutationRate) {
                        let w = weightsArr[j];
                        //value between 1 and -1
                        weightsArr[j] = w + (Math.random() * (0.5 - -0.5) + -0.5)
                    }
                }
                let newLayerWeights = tf.tensor(weightsArr, shapeLayer);
                newWeights[i] = newLayerWeights;
            }
            model.setWeights(newWeights);
            
            return model
        })
    }
}

