import { addChord, setContext, interruptSound } from "./player.js";

let progression = [];
let current;
let timeOuts = [];
let playing = false;
let measureCount = 0;

let bpm = 140;
const inputBpm = document.getElementById('bpm');
inputBpm.onchange = () => {
    const value = Number(inputBpm.value);
    if (Number.isInteger(value) && value > 1) bpm = value;
    else inputBpm.value = bpm;
}

let oscillatorType = 'sine';
const selectType = document.getElementById('type');
selectType.onchange = () => oscillatorType = selectType.value;

let startMeasure, endMeasure;
const inputStart = document.getElementById('start');
inputStart.onchange = () => {
    const value = Number(inputStart.value);
    if (Number.isInteger(value) && value > 0 && value <= measureCount) {
        startMeasure = value;
        updateText();
    } else inputStart.value = startMeasure;
}
const inputEnd = document.getElementById('end');
inputEnd.onchange = () => {
    const value = Number(inputEnd.value);
    if (Number.isInteger(value) && value > 0 && value <= measureCount) {
        endMeasure = value;
        updateText();
    } else inputEnd.value = endMeasure;
}

let loop = true;
const inputLoop = document.getElementById('loop');
inputLoop.onchange = () => loop = inputLoop.checked;

const buttonPlay = document.getElementById('play');
buttonPlay.onclick = () => {
    current = startMeasure;
    play();
}

const buttonPause = document.getElementById('pause');
buttonPause.onclick = () => {
    if (playing) pause();
    else play();
}

const buttonStop = document.getElementById('stop');
buttonStop.onclick = () => {
    current = startMeasure;
    pause();
}

const outputText = document.getElementById('output');
let defaultText = '';
function updateText() {
    let split = defaultText.split('|');
    let validMeasure = 0;
    for (let i = 0; i < split.length; i++){
        let bar = '|';
        if (!['', '\n', '\r', '\r\n'].includes(split[i])) {
            validMeasure++;
            if (playing && validMeasure === current) {
                split[i] = '<span class="current">' + split[i] + '</span>';
            }
            if (validMeasure === startMeasure) {
                split[i] = '<span class="start">' + split[i] + '</span>';
            }
            if (validMeasure === endMeasure) {
                split[i] = '<span class="end">' + split[i] + '</span>';
            }
        }
        if (i !== split.length - 1) split[i] = split[i] + '|';
    }
    outputText.innerHTML = split.join('');
}

const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    setContext();
    
    const selectedFile = fileInput.files[0];
    defaultText = await selectedFile.text();

    const divided = defaultText.split('|').filter(w => !['', '\n', '\r', '\r\n'].includes(w))
                               .map(w => w.trim().split(/ +/));

    measureCount = divided.length;
    current = 1;
    startMeasure = 1; inputStart.value = startMeasure;
    endMeasure = measureCount; inputEnd.value = endMeasure;
    updateText();
    progression = [];
    for (let i = 0; i < divided.length; i++){
        const v = divided[i];
        if (v.length === 1) progression.push({chord: v[0], beats: 4, measure: i+1});
        else progression.push({chord: v[0], beats: 2, measure: i+1},
                              {chord: v[1], beats: 2, measure: i+1});
    }
}

function increaseCurrent() {
    current = (current >= measureCount) ? 1 : (current + 1);
    updateText();
}

function play() {
    pause();
    let delay = 0;
    for (let i = 0; i < progression.length; i++) {
        const v = progression[i];
        if (current <= v.measure && v.measure <= endMeasure) {
            const chord = (v.chord === '%') ? progression[i - 1].chord : v.chord;
            const duration = 60 / bpm * v.beats;
            addChord(chord, duration, delay, oscillatorType);
            delay += duration;
        }
    }
    for(let i = current; i <= endMeasure; i++) {
        timeOuts.push(setTimeout(() => { increaseCurrent(); },
                                 1000 * 60 / bpm * 4 * (i - current + 1)));
    }
    timeOuts.push(setTimeout(() => { current = startMeasure; pause(); if (loop) play(); },
                             1000 * delay));
    
    playing = true;
    buttonPause.innerHTML = 'Pause';
    updateText();
}

function pause() {
    for (const v of timeOuts) clearTimeout(v);
    timeOuts = [];
    interruptSound();
    playing = false;
    buttonPause.innerHTML = 'Resume';
    updateText();
}