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

const states = {
    UNASKED: 0,
    ASKED: 1,
    RECALLED: 2

}
const Option = class {
    constructor(content, hashtag) {
        this.content = content;
        this.hashtag = hashtag;
        this.answers = [];
        this.state = states.UNASKED;
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

    getState() {
        return this.state;
    }

    updateState(state) {
        this.state = state;
    }

    getHash() {
        return this.hashtag;
    }
}

const options = [];

function startBot() {
    document.addEventListener('DOMContentLoaded', () => {
        options.push(new Option("Please request a table first", ["chart"]));
        options.push(new Option("You can select the average", ['average', "mean"]));
        options.push(new Option("You can select the median", ["median"]));

        setupInterface();
        operate();
    });

}

startBot();

function operate() {
    onClick();
    onSpeechStart()
    onSpeechResult();
    onSpeechEnd();
    onSpeechError();
}

function setupInterface() {
    let silence = 0;
    for (let i = 0; i < options.length; i++) {
        const synth = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance();
        if (options[i].getState() === states.UNASKED) {
            speech.text = options[i].getContent();
            console.log(options[i].getHash());
            // synth.speak(speech);
        } else {
            silence += 1;
        }
    }
    if (silence == options.length) {
        const synth = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance();
        speech.text = "Options are done. Do you want to start over?"
        synth.speak(speech);

    }
}


function updateState(text) {
    let option;
    for (let i = 0; i < options.length; i++) {
        option = options[i];
        if (option.getHash().includes(text)) {
            switch (option.getState()) {
                case states.UNASKED:
                    option.updateState(states.ASKED);
                    return option;
                case states.ASKED:
                    option.updateState(states.RECALLED);
                    return option;
            }
        }
    }
}

function onClick() {
    document.querySelector('button').addEventListener('click', () => {
        recognition.start();
    });
}

function onSpeechStart() {
    recognition.addEventListener('speechstart', () => {
        console.log('Speech has been detected.');
    });
}

function onSpeechResult() {
    recognition.addEventListener('result', (e) => {
        console.log('Result has been detected.');

        let last = e.results.length - 1;
        let text = e.results[last][0].transcript.toLowerCase();

        outputYou.textContent = text.charAt(0).toUpperCase() + text.slice(1);;

        synthVoice(text);
        console.log('Confidence: ' + e.results[0][0].confidence);
    });
}

function onSpeechEnd() {
    recognition.addEventListener('speechend', () => {
        console.log("Speech has ended");
        recognition.stop();
    });
}

function onSpeechError() {
    recognition.addEventListener('error', (e) => {
        outputBot.textContent = 'Error: ' + e.error;
    });
}


function synthVoice(text) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    let ctx = document.getElementById('myChart');
    let type = 'line';
    let option = null;

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
        speech.text = 'Below is the chart you want.';
        option = updateState("chart");
        console.log(option);
        option.setAnswers(speech.text);

    }

    if (/mean|average|avg/.test(text)) {
        if (!drawn) {
            speech.text = 'You need first to have a chart.'
        } else {
            // const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;
            speech.text = 'The average of the data is ' + chartIt.mean.toFixed(2);
            chartIt.setMeanDataset(chartIt.mean);
            let chart_with_mean_line = chartIt.createChart();
        }
        option = updateState("average");
        console.log(option);
        option.setAnswers(speech.text);
    }

    if (/median/.test(text)) {
        if (!drawn) {
            speech.text = 'You need first to have a chart.'
        } else {
            speech.text = 'The median of the data is ' + chartIt.median.toFixed(2);
            chartIt.setMedianDataset(chartIt.median);
            let chart_with_median_line = chartIt.createChart();
        }
        option = updateState("median");
        console.log(option);
        option.setAnswers(speech.text);
        // console.log(option.getAnswers());
    }

    if (/start/.test(text)) {
        setupInterface();
        speech.text = 'Ok, I just restarted myself';
    }

    synth.speak(speech);
    outputBot.textContent = speech.text;

    setupInterface();
}