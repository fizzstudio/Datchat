(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
const config = {
    inputSize: 9,
    outputSize: 9,
    binaryThresh: 0.5,
    hiddenLayers: [9, 9], // array of ints for the sizes of the hidden layers in the network
    activation: 'relu', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};

const trainingData = [
    {input: 'show me the data betwween 1880 and 2019', output:'range'},
    {input: 'show me the data from 1885 to 2014', output:'range'},
    {input: 'show me the data betwween 1950 and 1960', output:'range'},
    {input: 'show me the data of the past ten years', output:'range'},
    {input: 'show me the range of the past 30 years', output:'range'},
    {input: 'average of the data', output:'non-range'},
    {input: 'tell me the median', output:'non-range'},
    {input: 'tell me the average', output:'non-range'},
    {input: 'what is the standard deviation', output:'non-range'},
];

const lstm = new brain.recurrent.LSTM();
const result = lstm.train(trainingData, {
    iterations: 10,
    // learningRate: 0.1,
    log: (details) => console.log(details),
    // errorThresh: 0.011,
});
console.log('Training result: ', result);

const run1 = lstm.run('show me the median of the past 20 years');
const run2 = lstm.run('what is the average between 1970 and 2010');
const run3 = lstm.run('the data from 1880 to 1890');
const run4 = lstm.run('how the data is deviating from the mean');
const run5 = lstm.run('tell me the max value of the dataset');
const run6 = lstm.run('tell me the largest point');

console.log('run 1 range:' + run1);
console.log('run 2 range:' + run2);
console.log('run 3 range:' + run3);
console.log('run 4 non-range:' + run4);
console.log('run 5 non-range:' + run5);
console.log('run 6 non-range:' + run6);

const fs = require('fs');
fs.writeFileSync('trained-net.js', `export default ${ lstm.toFunction().toString() };`);
},{"fs":1}]},{},[2]);
