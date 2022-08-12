import { playChord, setContext, setOscillatorType } from './player.js';

let currentChord = -1
let progression = []
let bpm = 140

const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    setContext();

    clearTimeout(loopTimeout);
    progression = [];
    currentChord = -1;

    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;

    const divided = text.split('|').filter(w => !['', '\n', '\r', '\r\n'].includes(w))
                        .map(w => w.trim().split(/ +/));
    
    for (const v of divided) {
        if (v.length === 1) progression.push({chord: v[0], duration: 4});
        else progression.push({chord: v[0], duration: 2}, {chord: v[1], duration: 2});
    }
    
    loop();
}

const selectType = document.getElementById('type');
selectType.onchange = () => setOscillatorType(selectType.value);

const inputBpm = document.getElementById('bpm');
inputBpm.onchange = () => bpm = inputBpm.value;

function next(n) {
    n++;
    if (n >= progression.length) n = 0;
    return n;
}

function previous(n) {
    n--;
    if (n < 0) n = progression.length - 1;
    return n;
}

let loopTimeout;
function loop() {
    currentChord = next(currentChord);
    if (progression[currentChord].chord === '%')
        playChord(progression[previous(currentChord)].chord, progression[previous(currentChord)].duration * 60 / bpm);
    else
        playChord(progression[currentChord].chord, progression[currentChord].duration * 60 / bpm);
    loopTimeout = setTimeout(loop, 1000 * 60 / bpm * progression[currentChord].duration);
}