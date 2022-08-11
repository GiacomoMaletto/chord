const sampleRate = 44100;
const sineWaveArray = new Float32Array(sampleRate);
const hz = 440;
for (let i = 0; i < sineWaveArray.length; i++) {
    sineWaveArray[i] = Math.sin(i * Math.PI * 2 * hz / sampleRate);
}

function playSound({ array, sampleRate }) {
    const audioContext = new AudioContext({sampleRate});
    const audioBuffer = audioContext.createBuffer(1, array.length, sampleRate);
    audioBuffer.copyToChannel(array, 0);

    const source = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.buffer = audioBuffer;
    source.start();
}

export function playSineWave440hz() {
    playSound({ array: sineWaveArray, sampleRate });
}