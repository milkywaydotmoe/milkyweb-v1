function playAudio(url) {
    new Audio(url).play();
}
const mouseoverClick = () => (playAudio("https://cdn.pixabay.com/download/audio/2022/12/29/audio_257d21d95b.mp3?filename=click-button-131479.mp3"));

function displayAlt(id) {
    if (document.getElementById(id).style.display != 'none') {document.getElementById(id).style.display = 'none';}
    else {document.getElementById(id).style.display = '';}
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}