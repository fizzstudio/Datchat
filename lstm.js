const brain = require('brain.js');
const fs = require('fs');

const trainingData = [
    // between ... and ... 
    { input: 'the data betwween 170 and 26759', output: 1 },
    { input: 'give me the data betwween 900 and 205', output: 1 },
    { input: 'the data betwween 1726 and 2041', output: 1 },
    { input: 'tell me the data betwween 13440 and 83', output: 1 },
    { input: 'please tell me the data betwween 1939 and 1979', output: 1 },
    { input: 'what is the data betwween 1944 and 8452', output: 1 },
    { input: 'can you give me the data betwween 195 and 7356', output: 1 },
    // from ... to ...
    { input: 'show me the data from 1885 to 2014', output: 1 },
    { input: 'the data from 1900 and 577', output: 1 },
    { input: 'please give me the data from 197 to 2045', output: 1 },
    { input: 'tell me the data betwween 192 to 19', output: 1 },
    { input: 'data from 14535 to 197', output: 1 },
    { input: 'what is the data from 944 to 4', output: 1 },
    { input: 'hey, can you give me the data betwween 1935 and 0', output: 1 },
    // past, past
    { input: 'show me the statistics of the past ten years', output: 1 },
    { input: 'please give me the range of the past 302 years', output: 1 },
    { input: 'tell me the data of the past ten years', output: 1 },
    { input: 'are you able to give me the average of the last 79 years', output: 1 },
    { input: 'what is the median of the last 80 years', output: 1 },
    { input: 'are you able to give me the range of the last 2 years', output: 1 },
    { input: 'what is the maximum of the last 80 years', output: 1 },
    // non-range cases
    { input: 'give me the greatest value of the data', output: 0 },
    { input: 'tell me the median', output: 0 },
    { input: 'tell me the average', output: 0 },
    { input: 'what is the standard deviation', output: 0 },
    { input: 'please tell me the average of the data', output: 0 },
    { input: 'show tell me the median', output: 0 },
    { input: 'tell me the trend of the data', output: 0 },
    // with "range" keyword but not range operation
    { input: 'what is the range of the data', output: 0 },
    { input: 'tell me the range', output: 0 },
    { input: 'show me the range and the greatest value', output: 0 },
    { input: 'give me the average and range', output: 0 },
    { input: 'can you tell me the range of the data', output: 0 },
    { input: 'tell me the the range of the median', output: 0 },
    { input: 'tell me the trend of the data range', output: 0 },
    // with "from" keyword but not range operation
    { input: 'show me the mean of the table', output: 0 },
    { input: 'give me the median from the chart', output: 0 },
    { input: 'please give me the trend from this', output: 0 },
    { input: 'from this chart, what is the average', output: 0 },
    { input: 'data from here', output: 0 },
    { input: "the max from the dataset", output: 0 },
    { input: "where are you from", output: 0 }
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
const run2 = net.run('what is the average between 4240 and 210');
const run3 = net.run('the data from 10 to 18590');
const run4 = net.run('how the data is deviating from the mean');
const run5 = net.run('tell me the max value of the dataset');
const run6 = net.run('tell me the largest point');

console.log('run 1 range:' + run1);
console.log('run 2 range:' + run2);
console.log('run 3 range:' + run3);
console.log('run 4 non-range:' + run4);
console.log('run 5 non-range:' + run5);
console.log('run 6 non-range:' + run6);

const json = net.toJSON();
const jsonStr = JSON.stringify(json);

fs.writeFileSync('./trained-net.json', jsonStr, 'utf8');
