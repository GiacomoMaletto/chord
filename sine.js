const sampleRate = 44100;

function playSound({ array, sampleRate }) {
    const audioContext = new AudioContext({sampleRate});
    const audioBuffer = audioContext.createBuffer(1, array.length, sampleRate);
    audioBuffer.copyToChannel(array, 0);

    const source = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.buffer = audioBuffer;
    source.start();
}

function smoothstep(x0, x1, x) {
    if (x < x0) return 0;
    if (x > x1) return 1;
    x = (x - x0)/(x1 - x0);
    return x * x * (3 - 2 * x);
}

function smooth(t, duration) {
    const t0 = .1
    if (t < t0) return smoothstep(0, t0, t);
    if (t > duration - t0) return (1 - smoothstep(duration - t0, duration, t));
    return 1;
}

export function playSineWave( frequency, duration, phase) {
    let sineWaveArray = new Float32Array(Math.round(sampleRate * duration));
    for (let i = 0; i < sineWaveArray.length; i++) {
        sineWaveArray[i] = smooth(i / sineWaveArray.length * duration, duration) *
                           Math.sin(i * Math.PI * 2 * frequency / sampleRate);
    }
    playSound({ array: sineWaveArray, sampleRate });
}