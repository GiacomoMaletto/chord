const fileInput = document.getElementById('input');
fileInput.onchange = async () => {
    const selectedFile = fileInput.files[0];
    const text = await selectedFile.text();
    document.getElementById('output').textContent = text;
}

const button = document.getElementById('button');
button.onclick = () => {
    new Audio('notes/0.mp3').play()
    new Audio('notes/4.mp3').play()
    new Audio('notes/7.mp3').play()
    new Audio('notes/12.mp3').play()
}