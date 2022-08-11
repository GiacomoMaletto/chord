import { playSineWave } from "./sine.js";

const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;
}

const button = document.getElementById('button');
button.onclick = () => {
    playSineWave(440, 3); //C
    playSineWave(3/2 * 440, 3); //G
    playSineWave(5/4 * 440, 3); //E
}