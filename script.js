import { playChord, setContext } from './player.js';

let currentChord = -1
let progression = []
let bpm = 120

const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    setContext();

    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;

    const divided = text.split('|').filter(w => w !== '\n' && w !== '')
                        .map(w => w.trim().split(/ +/));
    
    for (const v of divided) {
        if (v.length === 1) progression.push({chord: v[0], duration: 4});
        else progression.push({chord: v[0], duration: 2}, {chord: v[1], duration: 2});
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
    if (progression[currentChord].chord === '%')
        playChord(progression[previous(currentChord)].chord, progression[previous(currentChord)].duration * 60 / bpm);
    else
        playChord(progression[currentChord].chord, progression[currentChord].duration * 60 / bpm);
    setTimeout(loop, 1000 * 60 / bpm * progression[currentChord].duration);
}