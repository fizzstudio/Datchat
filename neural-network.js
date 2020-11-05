const config = {
    binaryThresh: 0.5,
    hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};


const classifier = new brain.BrainJSClassifier();

classifier.addDocument('my unit-tests failed.', 'software');
classifier.addDocument('tried the program, but it was buggy.', 'software');
classifier.addDocument('tomorrow we will do standup.', 'meeting');
classifier.addDocument('can you play some new music?', 'music');

classifier.train();

console.log(classifier.classify('did the tests pass?')); // -> software
console.log(classifier.classify('Lets meet tomorrow?')); // -> meeting
console.log(classifier.classify('Can you play some stuff?')); // -> music

// const trainingData = [
//     'Jane saw Doug.',
//     'Doug saw Jane.',
//     'Spot saw Doug and Jane looking at each other.',
//     'It was love at first sight, and Spot had a frontrow seat. It was a very special moment for all.',
//   ];
  
//   const lstm = new brain.recurrent.LSTM();
//   const result = lstm.train(trainingData, {
//     iterations: 150,
//     log: (details) => console.log(details),
//     errorThresh: 0.011,
//   });
//   console.log('Training result: ', result);
  
//   const run1 = lstm.run('Jane');
//   const run2 = lstm.run('Doug');
//   const run3 = lstm.run('Spot');
//   const run4 = lstm.run('It');
  
//   console.log('run 1: Jane' + run1);
//   console.log('run 2: Doug' + run2);
//   console.log('run 3: Spot' + run3);
//   console.log('run 4: It' + run4);