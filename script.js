'use strict';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let chartIt = undefined;
let chart = undefined;
let drawn = false;
let silence = 0;

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

let options = [];

startBot();

function startBot() {
    // console.log(makeTable);
    document.addEventListener('DOMContentLoaded', () => {
        options.push(new Option("Please request a chart first", ["chart", "table"], makeTable));
        // options.push(new Option("You can select the average", ['average', "avg", "mean"], makeAvg));
        // options.push(new Option("You can select the median", ["median"], makeMedian));

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
    if (silence % options.length == 0) {
        console.log("You come here ", options);
        const synth = window.speechSynthesis;
        const speech = new SpeechSynthesisUtterance();
        speech.text = "Options are done. You can start over";
        let restart_quest = new Option("Options are done. You can start over", ['start'], startover);
        restart_quest.updateState(states.UNIFORM);
        options.push(restart_quest);

        // synth.speak(speech);

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

                answer = option.callback();

                if (option.getState() !== states.UNIFORM) {
                    option.updateState(states.ASKED);
                    option.addCount();
                    
                    let hist_answers = option.getAnswers();
                    if (hist_answers.length > 0) {
                        if (hist_answers[hist_answers.length - 1].includes(answer)) {
                            answer = "still, " + answer;
                        }
                    }
                    option.addAnswer(answer);
                } else {
                    options.pop();
                }
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
    outputBot.textContent = speech.text.charAt(0).toUpperCase() + speech.text.slice(1);;

    setupInterface();

}