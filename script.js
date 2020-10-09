'use strict';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let visual = undefined;
let chart = undefined;
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

const types = {
    COMPUTATIONAL: 0,
    OPERATIONAL: 1
}

const Option = class {
    constructor(content, keywords, callback, type) {
        this.content = content;
        this.keywords = keywords;
        this.callback = callback;
        this.type = type;
        this.occurrence = 0;
        this.answers = [];
        if (this.type == types.COMPUTATIONAL) {
            this.state = states.UNASKED;
        } else if (this.type == types.OPERATIONAL) {
            this.state = states.UNIFORM;
        }
        console.log("Option: ", this.state);

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
    document.addEventListener('DOMContentLoaded', () => {
        options.push(new Option("Please request a chart first", ["chart", "table"], makeTable, types.COMPUTATIONAL));
        options.push(new Option("You can select the average", ['average', "avg", "mean"], makeAvg, types.COMPUTATIONAL));
        options.push(new Option("You can select the median", ["median"], makeMedian, types.COMPUTATIONAL));
        options.push(new Option("Options are done. You can start over", ['start'], startover, types.OPERATIONAL));

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
            console.log("setUpInterface", options[i].getKeywords());
            console.log("setUpInterface option state", options[i].getState());
            // synth.speak(speech);
        } else if (options[i].getState() === states.ASKED) {
            silence += 1;

        }
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

function findKeyword(text) {
    let answer = 'Sorry';
    options.forEach((option) => {
        option.keywords.forEach((keyword) => {
            if (text.includes(keyword)) {
                answer = finalAnswer(option);

                if (answer == "you need first to have a chart.") { // If answer = "you need...chart", reset option state to UNASKED
                    option.updateState(states.UNASKED);
                } else {
                    option.addAnswer(answer); // Get rid of meaningless answer "you need...chart"
                }
                console.log("findKeyword counts: ", option.getCount());
                console.log("findKeyword option state: ", option.getState());
                console.log("findKeyword answers: ", option.getAnswers());
            }
        });
    });
    speakResponse(answer);
}

function finalAnswer(option) {
    let answer = option.callback();
    if (option.getState() !== states.UNIFORM) {
        option.updateState(states.ASKED);
        option.addCount();
        if (compareAnswers(answer, option.getAnswers())) {
            answer = "still, " + answer;
        }
    }
    return answer;

}

function compareAnswers(answer, history) {
    if (history.length > 0) {
        if (history[history.length - 1].includes(answer)) {
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