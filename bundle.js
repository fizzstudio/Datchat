(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
const fs = require('fs');
const brain = require('brain.js');

function predict(target) {
    let data = JSON.parse(fs.readFileSync('./trained-net.json', 'utf8'));

    const net = new brain.recurrent.LSTM();
    net.fromJSON(data);

    const prediction = net.run(target);
    console.log(prediction);
    return prediction;
}

const prediction = predict('what is the data of past ten years');
console.log(prediction);

},{"fs":1}]},{},[2]);