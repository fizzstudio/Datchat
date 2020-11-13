const express = require('express');
const morgan = require('morgan');
// const cors = require('cors');
const path = require('path');
const brain = require('brain.js');
const fs = require('fs');

const { response } = require('express');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('client')); 
app.use(express.json({limit: '1mb'}));

let fileContent = fs.readFileSync("trained-net.json", "utf8")
let fileContentJSON = JSON.parse(fileContent);
const net = new brain.recurrent.LSTM();
net.fromJSON(fileContentJSON);

app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;
    response.json({
        status: 'success',
        prediction: net.run(data.sentence),
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('tiny'));