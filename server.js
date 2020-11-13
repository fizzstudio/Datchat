const express = require('express');
const morgan = require('morgan');
// const cors = require('cors');
const path = require('path');
const brain = require('brain.js');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;

let fileContent = fs.readFileSync("trained-net.json", "utf8")
let fileContentJSON = JSON.parse(fileContent);
const net = new brain.recurrent.LSTM();
net.fromJSON(fileContentJSON);
// console.log(net);
net.run('search range');
console.log(net.run('can you tell me the range and standard deviation from the chart to it'));
// console.log(fileContent);

// app.get('/api', (req, res) => {
//     res.send(net.run('search range'));
// })

app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;
    response.json({
        status: 'success',
        latitude: data.lat,
        longitude: data.lon
    });
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('tiny'));


app.listen(PORT, console.log(`Server is starting at ${PORT}`));