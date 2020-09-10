'use strict';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
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
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    outputBot.textContent = 'Error: ' + e.error;
});

let stars = {};
let media = {};

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const speech = new SpeechSynthesisUtterance();
    let ctx = document.getElementById('myChart');
    let type = 'line';

    speech.text = "Sorry, I did not understand that.";

    if (!drawn) {
        stars = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
        media = ['Facebook', 'Twitter', 'Instagram', 'Wechat', 'Tik-Tok'];
    }

    if (/table|chart/.test(text)) {
        if (drawn) {
            stars = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
            media = ['Facebook', 'Twitter', 'Instagram', 'Wechat', 'Tip-Top'];
        }
        if (/pie/.test(text)) { type = 'pie' }
        if (/line/.test(text)) { type = 'line' }
        if (/bar/.test(text)) { type = 'bar' }
        let chart = createChart(stars, media, 'Social Media Stars', ctx, type);
        drawn = true;
        speech.text = 'Below is the chart you want.'
    }

    if (/mean|average/.test(text)) {
        if (!drawn) {
            speech.text = 'You need first to have a chart.'
        } else {
            const average = arr => arr.reduce((sume, el) => sume + el, 0) / arr.length;
            speech.text = 'The average of the data is ' + average(stars);
        }
    }

    if (/median/.test(text)) {
        if (!drawn) {
            speech.text = 'You need first to have a chart.'
        } else {
            speech.text = 'The median of the data is ' + getMedian(stars);
        }
    }

    synth.speak(speech);
    outputBot.textContent = speech.text;
}