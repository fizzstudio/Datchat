'use strict';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let chartIt = undefined;
let chart = undefined;
let drawn = false;

const recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const options = [];
const Option = class {
    constructor(content) {
        this.content = content;
        this.answers = [];
    }
    getContent() {
        return this.content;
    }

    setAnswers(answer) {
        this.answers.push(answer);
    }

    getAnswers() {
        return this.answers;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();

    let option1 = new Option("You can select the average");
    options.push(option1);
    let option2 = new Option("You can select the median");
    options.push(option2);

    for (let i = 0; i < options.length; i++) {
        speech.text = options[i].getContent();
        synth.speak(speech);
    }

});


document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
    console.log('Result has been detected.');

    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    outputYou.textContent = text.charAt(0).toUpperCase() + text.slice(1);;

    synthVoice(text);
    console.log('Confidence: ' + e.results[0][0].confidence);

    //   socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
    console.log("Speech has ended");
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    outputBot.textContent = 'Error: ' + e.error;
});

let stars = {};
let media = {};

let states = {
    UNASKED: "unasked",
    ASKED: "asked",
    RECALLED: "recalled"
}


function synthVoice(text) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    let ctx = document.getElementById('myChart');
    let type = 'line';

    speech.text = "Sorry, I did not understand that.";

    if (/table|chart/.test(text)) {
        if (/pie/.test(text)) {
            type = 'pie'
        }
        if (/line/.test(text)) {
            type = 'line'
        }
        if (/bar/.test(text)) {
            type = 'bar'
        }
        chartIt = new ChartIt('test.csv', 'Global Average Temperature', ctx, type);
        chart = chartIt.createChart();
        drawn = true;
        speech.text = 'Below is the chart you want.'
    }

    if (/mean|average/.test(text)) {
        if (!drawn) {
            speech.text = 'You need first to have a chart.'
        } else {
            // const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;
            speech.text = 'The average of the data is ' + chartIt.mean.toFixed(2);
            chartIt.setMeanDataset(chartIt.mean);
            let chart_with_mean_line = chartIt.createChart();
        }
    }

    if (/median/.test(text)) {
        if (!drawn) {
            speech.text = 'You need first to have a chart.'
        } else {
            speech.text = 'The median of the data is ' + chartIt.median.toFixed(2);
            chartIt.setMedianDataset(chartIt.median);
            let chart_with_median_line = chartIt.createChart();
        }
    }

    synth.speak(speech);
    outputBot.textContent = speech.text;
}