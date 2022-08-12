let audioCtx, gainNode;
export function setContext() {
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
}

let OscillatorType;
export function setOscillatorType(type) {
    OscillatorType = type;
}

function playNote(frequency, duration) {
    let oscillator = audioCtx.createOscillator();
  
    oscillator.type = OscillatorType;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

const qualityMap = new Map([
    ['',       [-24, 0, 4, 7]],
    ['m',      [-24, 0, 3, 7]],
    ['7',      [-24, 0, 4, 7, 10]],
    ['M7',     [-24, 0, 4, 7, 11]],
    ['m7',     [-24, 0, 3, 7, 10]],
    ['m7(b5)', [-24, 0, 3, 6, 10]],
    ['7(b9)',  [-24, 0, 4, 7, 10, 13]],
    ['7(#11)', [-24, 0, 4, 7, 10, 18]],
    ['7(b13)', [-24, 0, 4, 7, 10, 20]],
    ['6',      [-24, 0, 4, 7, 9]],
    ['m6',     [-24, 0, 3, 7, 9]]
]);

const rootMap = new Map([
    ['A#', 1],
    ['Bb', 1],
    ['C#', 4],
    ['Db', 4],
    ['D#', 6],
    ['Eb', 6],
    ['F#', 9],
    ['Gb', 9],
    ['G#', 11],
    ['Ab', 11],
    ['A',  0],
    ['B',  2],
    ['C',  3],
    ['D',  5],
    ['E',  7],
    ['F',  8],
    ['G',  10]
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
    gainNode.gain.value = 1 / chord.length;
    for (const n of chord) playNote(220 * Math.pow(2, n / 12), duration);
}