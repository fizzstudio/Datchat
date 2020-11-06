const fs = require('fs');
const brain = require('brain.js')

let data = JSON.parse(fs.readFileSync('./trained-net.json', 'utf8'));

const net = new brain.recurrent.LSTM();
net.fromJSON(data);

const prediction = net.run('what is the data of past ten years');
console.log(prediction);