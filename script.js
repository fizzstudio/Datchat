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
            // console.log("setUpInterface", options[i].getKeywords());
            // console.log("setUpInterface option state", options[i].getState());
            // console.log("setUpInterface speech_pool: ", speech_pool);
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

    // console.log("setupInterface silence: ", silence);
    if (silence == options.length - 1 && ignored == false) {
        ignored = true;
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

    let split_text = text.split(" ");
    console.log("findKeyword split_text: ", split_text);
    // split_text.

    options.forEach((option) => {
        option.keywords.forEach((keyword) => {
            if (text.includes(keyword) || LevenshteinDistance(text, keyword) < 2) {
                selections.push(option);
                if (keyword == "table" || keyword == "chart") {
                    if (selections.length > 1) {
                        let popped = selections.pop();
                        selections.unshift(popped);             // make sure making table always happens first
                    }
                }
            }
        });
    });

    // console.log("findKeyword selections:", selections);

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
    if (selections.length > 0) {
        response = speech_pool[0];
        for (let i = 1; i < speech_pool.length; i++) {
            response += ", " + speech_pool[i];
        }
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

function LevenshteinDistance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};