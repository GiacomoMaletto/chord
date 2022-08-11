const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;
}

const button = document.getElementById('button');
button.onclick = () => {
    playChord('Db7(#11)');
}

const audio = Array.from({length: 36}, (x, i) => new Audio('notes/' + i + '.mp3'));

const qualityMap = new Map([
    ['7',      [0, 4, 7, 10]],
    ['M7',     [0, 4, 7, 11]],
    ['m7',     [0, 3, 7, 10]],
    ['m7(b5)', [0, 3, 6, 10]],
    ['7(b9)',  [0, 4, 7, 13]],
    ['7(#11)', [0, 4, 7, 18]],
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
    throw 'Undefined chord!';
}

function notationToChord(str) {
    const [root, quality] = getRootQuality(str);
    return qualityMap.get(quality).map((n) => n + rootMap.get(root));
}

function playChord(str) {
    const chord = notationToChord(str);
    for (const n of chord) audio[n].play();
}