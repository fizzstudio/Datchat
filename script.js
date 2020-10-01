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

document.addEventListener('DOMContentLoaded', () => {
    const options = [];
    const synth = window.speechSynthesis;
    let speech = new SpeechSynthesisUtterance();
    let option = new Option("Please request a table first", ["chart"]);
    options.push(option);
    let option1 = new Option("you can select the average", ['average', "mean"]);
    options.push(option1);
    let option2 = new Option("You can select the median", ["median"]);
    options.push(option2);

    setupInterface();

    function setupInterface() {
        for (let i = 0; i < options.length; i++) {
            speech = new SpeechSynthesisUtterance();
            if (options[i].getState() !== states.ASKED) {
                speech.text = options[i].getContent();
                console.log(options[i].getHash());
                synth.speak(speech);
            }
        }
    }


    function updateState(text) {
        for (let i = 0; i < options.length; i++) {
            if (options[i].getHash().includes(text)) {
                switch (options[i].getState()) {
                    case states.UNASKED:
                        options[i].updateState(states.ASKED);
                        break;
                    case states.ASKED:
                        options[i].updateState(states.RECALLED);
                        break;
                }
            }
            console.log(options[i].getState());
        }
    }


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


    function synthVoice(text) {
        const synth = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance();
        let ctx = document.getElementById('myChart');
        let type = 'line';

        speech.text = "Sorry, I did not understand that.";

        if (/table|chart/.test(text)) {
            updateState("chart");
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
            updateState("average");
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
            updateState("median");
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

        setupInterface();
    }
});