// const config = {
//     inputSize: 9,
//     outputSize: 9,
//     binaryThresh: 0.5,
//     hiddenLayers: [9, 9], // array of ints for the sizes of the hidden layers in the network
//     activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
//     leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
// };

// const trainingData = [
//     { output: 'median', input: 'what is the median of this chart' },
//     { output: 'average', input: 'please tell me the mean of this chart' },
//     { output: 'average', input: 'what is the average level of this chart' },
//     { output: 'mean', input: 'tell me the average of the dataset' },
//     { output: 'mean', input: 'how is the average level looks like' },
//     { output: 'standard deviation', input: 'what is the standard deviation of the chart' },
//     { output: 'maximum', input: 'show the largest value of the chart' },
//     { output: 'minimum', input: 'what is the minimum of the dataset' },
//     { output: 'extremity', input: 'show me the extremities of the chart' },
// ];

// const lstm = new brain.recurrent.LSTM(config);
// const result = lstm.train(trainingData, {
//     iterations: 1000,
//     log: (details) => console.log(details),
//     errorThresh: 0.011,
// });
// console.log('Training result: ', result);

// const run1 = lstm.run('show me the median');
// const run2 = lstm.run('what is the average');
// const run3 = lstm.run('the standard deviation is what');
// const run4 = lstm.run('how the data is deviating from the mean');
// const run5 = lstm.run('tell me the mean value of the dataset');
// const run6 = lstm.run('tell me the largest point');

// console.log('run 1 median:' + run1);
// console.log('run 2 mean:' + run2);
// console.log('run 3 deviation:' + run3);
// console.log('run 4 standard:' + run4);
// console.log('run 5 average:' + run5);
// console.log('run 6 max:' + run6);