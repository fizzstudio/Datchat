'use strict';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let visual = undefined;
let chart = undefined;
let canvas = document.getElementById('myChart').getContext('2d');
let drawn = false;
let ignored = false;

const recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');


let options = [];

let negation_markers = ["n't", "not", "no", "never"];

startBot();

function startBot() {
    document.addEventListener('DOMContentLoaded', () => {
        options.push(new Option("You can request a chart first", ["chart", "table"], makeTable, Option.Types.COMPUTATIONAL));
        options.push(new Option("You can request the average", ['average', "avg", "mean"], makeAvg, Option.Types.COMPUTATIONAL));
        options.push(new Option("You can request the median", ["median"], makeMedian, Option.Types.COMPUTATIONAL));
        options.push(new Option("Options are done. You can start over", ['restart'], startover, Option.Types.OPERATIONAL));

        setupInterface();
        operate();
        // chart = createChart('test.csv', 'Global Average Temperature from 1880', canvas, "line");
        // drawn = true;
    });
}


function setupInterface() {
    let silence = 0;
    let speech_pool = [];
    for (let i = 0; i < options.length; i++) {
        const synth = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance();

        if (options[i].getState() === states.UNASKED) {
            speech_pool.push(options[i]);
            // speech.text = options[i].getContent();
            console.log("setUpInterface", options[i].getKeywords());
            console.log("setUpInterface option state", options[i].getState());
            console.log("setUpInterface speech_pool: ", speech_pool);
            // synth.speak(speech);
        } else if (options[i].getState() === states.ASKED) {
            silence += 1;
        }

    }
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    if (speech_pool.length != 0) {
        let text = speech_pool[0].getContent();
        for (let i = 1; i < speech_pool.length - 1; i++) {
            text = text + ", the " + speech_pool[i].getKeywords()[0];
        }
        if (speech_pool.length > 1) {
            text = text + " and the " + speech_pool[speech_pool.length - 1].getKeywords()[0];
        }
        speech.text = text;
        // synth.speak(speech);
    }



    console.log("setupInterface silence: ", silence);
    if (silence == options.length - 1 && ignored == false) {
        ignored = true;
        console.log("You come here ", options);
        const synth = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance();
        speech.text = options[3].getContent();

        synth.speak(speech);
    }
}

function findKeyword(text) {
    let response = 'Sorry';
    let negated = false;
    let selections = [];
    let speech_pool = [];
    negation_markers.forEach((negator) => {
        if (text.includes(negator)) {
            negated = true;
        }
    });

    options.forEach((option) => {
        option.keywords.forEach((keyword) => {
            if (text.includes(keyword)) {
                selections.push(option);
                if (keyword == "table" || keyword == "chart") {
                    if (selections.length > 1) {
                        let popped = selections.pop();
                        selections.unshift(popped);
                    }
                }
            }
        });
    });

    console.log("findKeyword selections:", selections);

    selections.forEach((selection) => {
        if (!negated) {
            response = resultAnswer(selection);
        } else {
            response = 'ok, no ' + keyword + '.';
        }
        if (response == "you need first to have a chart.") { // If answer = "you need...chart", reset option state to UNASKED
            selection.updateState(states.UNASKED);
        } else {
            selection.addAnswer(response); // Get rid of meaningless answer "you need...chart"
        }
        speech_pool.push(response);
        console.log("findKeyword counts: ", selection.getCount());
        console.log("findKeyword option state: ", selection.getState());
        console.log("findKeyword answers: ", selection.getAnswers());

    });
    response = speech_pool[0];
    for (let i = 1; i < speech_pool.length; i++) {
        response += ", " + speech_pool[i];
    }
    speakResponse(response);
}

function resultAnswer(option) {
    let response = option.callback();
    if (option.getState() !== states.UNIFORM) {
        option.updateState(states.ASKED);
        option.addCount();
        if (compareAnswers(response, option.getAnswers())) {
            response = "still, " + response;
        }
    }
    return response;
}

function compareAnswers(response, history) {
    if (history.length > 0) {
        if (history[history.length - 1].includes(response)) {
            return true; // current answer = last answer
        }
    }
    return false;
}

function speakResponse(text) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    synth.speak(speech);
    outputBot.textContent = speech.text.charAt(0).toUpperCase() + speech.text.slice(1);;

    setupInterface();

}

function operate() {
    onClick();
    onSpeechStart()
    onSpeechResult();
    onSpeechEnd();
    onSpeechError();
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