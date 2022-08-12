let audioCtx;

export function setContext() {
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
}

function playNote(frequency, duration) {
    let oscillator = audioCtx.createOscillator();
  
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

const qualityMap = new Map([
    ['',       [0, 4, 7]],
    ['7',      [0, 4, 7, 10]],
    ['M7',     [0, 4, 7, 11]],
    ['m7',     [0, 3, 7, 10]],
    ['m7(b5)', [0, 3, 6, 10]],
    ['7(b9)',  [0, 4, 7, 10, 13]],
    ['7(#11)', [0, 4, 7, 10, 18]],
    ['6',      [0, 4, 7, 9]]
]);

const rootMap = new Map([
    ['C',  3],
    ['C#', 4],
    ['Db', 4],
    ['D',  5],
    ['D#', 6],
    ['Eb', 6],
    ['E',  7],
    ['F',  8],
    ['F#', 9],
    ['Gb', 9],
    ['G',  10],
    ['G#', 11],
    ['Ab', 11],
    ['A',  12],
    ['A#', 13],
    ['Bb', 13],
    ['B',  14]
]);

function getRootQuality(str) {
    for (const note of rootMap.keys()) {
        if (str.startsWith(note)) return [note, str.slice(note.length)];
    }
    throw str + 'Undefined chord!';
}

function notationToChord(str) {
    const [root, quality] = getRootQuality(str);
    return qualityMap.get(quality).map(n => n + rootMap.get(root));
}

export function playChord(str, duration) {
    const chord = notationToChord(str);
    for (const n of chord) playNote(220 * Math.pow(2, n / 12), duration);
}