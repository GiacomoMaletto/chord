import { playSineWave } from "./sine.js";

const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;
}

const button = document.getElementById('button');
button.onclick = () => {
    new Audio('notes/0.mp3').play()
    //new Audio('notes/4.mp3').play()
    //new Audio('notes/7.mp3').play()
    //new Audio('notes/12.mp3').play()
    //playSineWave(440, 3); //C
    //playSineWave(3/2 * 440, 3); //G
    //playSineWave(5/4 * 440, 3); //E
}