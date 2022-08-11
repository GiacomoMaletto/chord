import { playChord } from './player.js';

let currentChord = -1
let progression = []
let bpm = 120

const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;

    const divided = text.split('|').filter(w => w !== '\n' && w !== '')
                        .map(w => w.trim().split(/ +/));
    
    for (const v of divided) {
        if (v.length === 1) progression.push({chord: v[0], duration: 2});
        else progression.push({chord: v[0], duration: 1}, {chord: v[1], duration: 1});
    }

    loop();
}

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

function loop() {
    currentChord = next(currentChord);
    if (progression[currentChord].chord === '%') playChord(progression[previous(currentChord)].chord);
    else playChord(progression[currentChord].chord);
    setTimeout(loop, 1000 * 60 / bpm * progression[currentChord].duration);
    setTimeout(resetPaused, 100);
}

const button = document.getElementById('button');
button.onclick = () => {
    playChord('E6');
}