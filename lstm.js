const brain = require('brain.js');

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

const net = new brain.recurrent.LSTM();
const result = net.train(trainingData, {
    iterations: 100,
    // learningRate: 0.1,
    log: (details) => console.log(details),
    // errorThresh: 0.011,
});
console.log('Training result: ', result);

const run1 = net.run('show me the median of the past 20 years');
const run2 = net.run('what is the average between 1970 and 2010');
const run3 = net.run('the data from 1880 to 1890');
const run4 = net.run('how the data is deviating from the mean');
const run5 = net.run('tell me the max value of the dataset');
const run6 = net.run('tell me the largest point');

console.log('run 1 range:' + run1);
console.log('run 2 range:' + run2);
console.log('run 3 range:' + run3);
console.log('run 4 non-range:' + run4);
console.log('run 5 non-range:' + run5);
console.log('run 6 non-range:' + run6);

const fs = require('fs');
// const json = net.toJSON();
// console.log(json);
// fs.writeFileSync('trained-net.js', `export default ${ net.toFunction().toString() };`);
// net.fromJSON(json);

const json = net.toJSON()
// write to file system
fs.writeFileSync('trained-net.json', json);