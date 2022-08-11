import { playSineWave440hz } from "./sine.js";

const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;
}

const button = document.getElementById('button');
button.onclick = playSineWave440hz