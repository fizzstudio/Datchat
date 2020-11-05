'use strict';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let text = '';
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
        options.push(new Option("You can request a chart first", ["table", "chart"], makeTable, Option.Types.COMPUTATIONAL));
        options.push(new Option("You can request the average", ['average', "avg", "mean"], reportAvg, Option.Types.COMPUTATIONAL));
        options.push(new Option("You can request the median", ["median"], reportMedian, Option.Types.OPERATIONAL));
        options.push(new Option("You can request the trend", ["trend", "tendency"], reportGlobalTrend, Option.Types.COMPUTATIONAL));
        options.push(new Option("Options are done. You can start over", ['restart'], startover, Option.Types.OPERATIONAL));
        options.push(new Option("You can request the standard deviation", ["std", "deviation"], reportStd, Option.Types.COMPUTATIONAL));

        setupInterface();
        operate();
    });
}


function setupInterface() {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    speech.text = 'Please request a chart first, and then you can ask for its statistic properties. You can start over at anytime you want';
    // synth.speak(speech);
}

async function findResponse(text) {
    let date = new Date();
    let timestamp = date.getTime();
    let response = 'Sorry';
    let selections = keywordDetect(options, text);
    // console.log('findResponse: ', selections);
    let negated = negationDetect(negation_markers, text);
    let speech_pool = [];

    for (let selection of selections) {
        if (!negated) {
            response = await resultAnswer(selection);
        } else {
            response = 'ok, no ' + selection.keywords[0] + '.';
        }

        if (response == "you need first to have a chart.") { // If answer = "you need...chart", reset option state to UNASKED
            selection.updateState(states.UNASKED);
        } else {
            selection.addAnswerRecord(response, timestamp); // Get rid of meaningless answer "you need...chart"
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
            // console.log('findResponse answer record: ', selection.getAnswerRecords());
            
        }
        speech_pool.push(response);
    };

    if (selections.length > 0) {
        response = speech_pool[0];
        // console.log('selections[0]: ', selections[0]);
        let x = selections[0];
        if (selections.length > 1) {
            if (x.getKeywords()[0] == 'table' && x.getAnswerRecords()[x.getAnswerRecords().length - 1].answer.includes('still')) {
                speech_pool.shift();
                response = speech_pool[0];
            }
        }
        for (let i = 1; i < speech_pool.length - 1; i++) {
            response += ", " + speech_pool[i];
        }
        if (speech_pool.length > 1){
            response = response + ", and " + speech_pool[speech_pool.length - 1];
        }
        
    }
    speakResponse(response);
    return response;
}

function speakResponse(text) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    // synth.speak(speech);
    outputBot.textContent = speech.text.charAt(0).toUpperCase() + speech.text.slice(1);

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
        // console.log('Speech has been detected.');
    });
}

async function onSpeechResult() {
    recognition.addEventListener('result', async (e) => {
        // console.log('Result has been detected.');

        let last = e.results.length - 1;
        text = e.results[last][0].transcript.toLowerCase();

        outputYou.textContent = text.charAt(0).toUpperCase() + text.slice(1);;

        await findResponse(text);
        // console.log('Confidence: ' + e.results[0][0].confidence);
    });
}

function onSpeechEnd() {
    recognition.addEventListener('speechend', () => {
        // console.log("Speech has ended");
        recognition.stop();
    });
}

function onSpeechError() {
    recognition.addEventListener('error', (e) => {
        outputBot.textContent = 'Error: ' + e.error;
    });
}