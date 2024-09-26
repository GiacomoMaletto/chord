let audioContext, gainNodes = new Map(), oscillatorNodes = [];

export function setContext() {
    if (!audioContext) {
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
        for (let i = 1; i <= 6; i++) {
            gainNodes[i] = audioContext.createGain();
            gainNodes[i].connect(audioContext.destination);
            gainNodes[i].gain.value = .9 / i;
        }
    }
}

function addOscillator(frequency, duration, delay, gain, type) {
    let oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNodes[gain]);
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + duration);
    oscillatorNodes.push(oscillator);
}

export function addChord(str, duration, delay, type) {
    const chord = notationToChord(str);
    for (const n of chord) addOscillator(220 * Math.pow(2, n / 12),
                                         duration,
                                         delay,
                                         chord.length,
                                         type);
}

export function interruptSound() {
    for (const v of oscillatorNodes) v.stop();
    oscillatorNodes = [];
}

const qualityMap = new Map([
    ['',       [-24, 0, 4, 7]],         // major triad
    ['m',      [-24, 0, 3, 7]],         // minor triad
    ['+',      [-24, 0, 4, 8]],         // augmented triad
    ['o',      [-24, 0, 3, 6]],         // diminished triad
    ['M7',     [-24, 0, 4, 7, 11]],     // major seventh
    ['m7',     [-24, 0, 3, 7, 10]],     // minor seventh
    ['7',      [-24, 0, 4, 7, 10]],     // dominant seventh
    ['7(b5)',  [-24, 0, 4, 6, 10]],     // dominant seventh flat five
    ['o7',     [-24, 0, 3, 6, 9]],      // diminished seventh
    ['m7(b5)', [-24, 0, 3, 6, 10]],     // half-diminished seventh
    ['oM7',    [-24, 0, 3, 6, 11]],     // diminished major seventh
    ['m(#7)',  [-24, 0, 3, 7, 11]],     // minor major seventh chord
    ['m(M7)',  [-24, 0, 3, 7, 11]],
    ['7(#5)',  [-24, 0, 4, 8, 10]],     // augmented seventh
    ['+7',     [-24, 0, 4, 8, 10]],
    ['7(b9)',  [-24, 0, 4, 7, 10, 13]], // dominant minor ninth
    ['7(#11)', [-24, 0, 4, 7, 10, 18]], // lydian
    ['7(b13)', [-24, 0, 4, 7, 10, 20]], // dominant seventh flat thirteen
    ['6',      [-24, 0, 4, 7, 9]],      // major sixth
    ['m6',     [-24, 0, 3, 7, 9]],      // minor sixth
    ['9',      [-24, 0, 4, 7, 10, 14]]] // dominant ninth
    ['M9',     [-24, 0, 4, 7, 11, 14]]] // major ninth
    ['m9',     [-24, 0, 3, 7, 10, 14]]] // minor ninth
    ['note',   [0]],                    // note
    ['-',      []]                      // pause
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
    if (str === '-') return ['', '-'];
    throw str + 'Undefined chord!';
}

function notationToChord(str) {
    const [root, quality] = getRootQuality(str);
    return qualityMap.get(quality).map(n => n + rootMap.get(root));
}
