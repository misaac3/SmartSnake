# Smart Snake
##### [Click Here to see it in action](misaac3.github.io/SmartSnake/index.html)
###### [or to just play snake](misaac3.github.io/SmartSnake/play.html)
A nueral network powered AI that plays the classic [Snake arcade game](https://en.wikipedia.org/wiki/Snake_(video_game_genre)) using a genetic algorithm.

<!-- 
![Smart Snake Example Gif](https://i.imgur.com/yTeFQP2.gif)
(direct link) https://i.imgur.com/yTeFQP2.gif
 -->
<img src="/gif/SmartSnake.gif?raw=true">

## Technology Used

- HTML/CSS
- [Bootstrap](https://getbootstrap.com/)
- Vanilla Javascript
- [Tensorflow.js](tensorflow.org)
 
## How does it work?
This project utilizes a **Genetic Algorithm** to train a nueral network to control the snake. A genetic algorithm uses ideas for evolutionary theory to train a machine learning model. A model contains "DNA" that represents it in some way and aslso a metric to tell how well it performs called **fitness**. There are generations that contains many models are used as basis for new generations. In the first generation, each model is randomly generated. While most of these random models will be useless and perform poorly, some will have some trait that causes them to have a high fitness. These high performing models are considered elite and used to create the next generation. The next generation is generated by taking the elite models and applying mutation and crossover. **Mutation** is when parts of an elite model's DNA is randomly changed. **Crossover** is when two (or more) elite models have there DNA combined to create a new model. Sometimes these processes improves the model, but sometimes it makes it worse. After these

The nueral netork is a  **Feed Foward** network with three dense layers and four outputs nodes. The dense layers means every node in a layer is connectted to every node in the next layer. Each of these connections contains a **weight** and a **bias** that are applied to the input of the node. These weights and biases are what makes the "DNA" of these Snakes. The output of these networks can be up, down, left, or right.
