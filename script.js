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


const Option = class {
    constructor(content, keywords, callback) {
        this.content = content;
        this.keywords = keywords;
        this.callback = callback;
        this.occurrence = 0;
        this.answers = [];
        this.state = states.UNASKED;
    }
    getContent() {
        return this.content;
    }

    addAnswer(answer) {
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

    resetState() {
        this.state = states.UNASKED;
    }

    getKeywords() {
        return this.keywords;
    }

    addCount() {
        this.occurrence += 1;
    }
    getCount() {
        return this.occurrence;
    }
}

const options = [];

startBot();

function startBot() {
    // console.log(makeTable);
    document.addEventListener('DOMContentLoaded', () => {
        options.push(new Option("Please request a chart first", ["chart", "table"], makeTable));
        options.push(new Option("You can select the average", ['average', "avg", "mean"], makeAvg));
        options.push(new Option("You can select the median", ["median"], makeMedian));

        setupInterface();
        operate();
    });

}

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
            console.log(options[i].getKeywords());
            // synth.speak(speech);
        } else {
            silence += 1;
        }
    }
    if (silence == options.length) {
        const synth = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance();
        speech.text = "Options are done. You can start over";
        synth.speak(speech);

    }
}


function updateState(text) {
    let option;
    for (let i = 0; i < options.length; i++) {
        option = options[i];
        if (option.getKeywords().includes(text)) {
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

        // synthVoice(text);
        findKeyword(text);
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

function findKeyword(text) {
    let answer = 'Sorry';
    options.forEach((option) => {
        option.keywords.forEach((keyword) => {
            if (text.includes(keyword)) {
                option.updateState(states.ASKED);
                option.addCount();
                answer = option.callback();
                option.addAnswer(answer);

                console.log("findKeyword counts: ", option.getCount());
                console.log("findKeyword option state: ", option.getState());
                console.log("findKeyword answers: ", option.getAnswers());
            }
        });
    });
    speakResponse(answer);
}


function speakResponse(text) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    synth.speak(speech);
    outputBot.textContent = speech.text;

    setupInterface();

}

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    let wrapper = document.getElementById('wrapper');
    let canvas = document.getElementById('myChart');
    let type = 'line';
    let option;
    let answers;

    speech.text = "Sorry, I did not understand that.";

    if (/table|chart/.test(text)) {
        canvas.style.visibility = 'visible';

        if (/pie/.test(text)) {
            type = 'pie'
        }
        if (/line/.test(text)) {
            type = 'line'
        }
        if (/bar/.test(text)) {
            type = 'bar'
        }
        chartIt = new ChartIt('test.csv', 'Global Average Temperature', canvas, type);
        chart = chartIt.createChart();
        drawn = true;
        speech.text = 'Below is the chart you want.';
        option = updateState("chart");
        // console.log(option);
        option.addAnswer(speech.text);
    }

    if (/mean|average|avg/.test(text)) {
        option = updateState("average");
        if (!drawn) {
            speech.text = 'You need first to have a chart.';
            option.resetState(states.UNASKED);
        } else {
            // const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;
            answers = option.getAnswers();
            if (answers.length > 0) {
                if (answers[answers.length - 1].includes(chartIt.mean.toFixed(2))) {
                    speech.text = 'The average of the data is still ' + chartIt.mean.toFixed(2);
                };
            } else {
                speech.text = 'The average of the data is ' + chartIt.mean.toFixed(2);
            }
            chartIt.setMeanDataset(chartIt.mean);
            let chart_mean = chartIt.createChart();
        }
        // console.log(option);
        option.addAnswer(speech.text);
    }

    if (/median/.test(text)) {
        option = updateState("median");
        if (!drawn) {
            speech.text = 'You need first to have a chart.';
            option.resetState(states.UNASKED);
        } else {
            answers = option.getAnswers();
            if (answers.length > 0) {
                if (answers[answers.length - 1].includes(chartIt.median.toFixed(2).toString())) {
                    speech.text = 'The median of the data is still ' + chartIt.median.toFixed(2);
                }
            } else {
                speech.text = 'The median of the data is ' + chartIt.median.toFixed(2);
            }
            chartIt.setMedianDataset(chartIt.median);
            let chart_median = chartIt.createChart();
        }
        // console.log(option);
        option.addAnswer(speech.text);
    }

    if (/start/.test(text)) {

        canvas.style.visibility = "hidden";
        // let context = canvas.getContext("2d");
        // context.clearRect(0, 0, canvas.width, canvas.height);
        options.forEach(option => option.resetState());
        speech.text = 'Ok, I just restarted myself';
        drawn = false;
    }

    synth.speak(speech);
    outputBot.textContent = speech.text;
    // console.log(canvas);


    setupInterface();
}