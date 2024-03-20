var audio = new Audio(); // Audio object
var soundFiles = []; // Array to store the sound files
var lastPlayedSounds = []; // Array to store the last played sound files

// Function to fetch sound files from the /silly directory
async function fetchSoundFiles() {
    try {
        const response = await fetch('silly/');
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, 'text/html');
        const links = htmlDocument.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.endsWith('.mp3')) {
                soundFiles.push(href);
            }
        });
    } catch (error) {
        console.error('Error fetching sound files:', error);
    }
}

// Function to get a random sound file from the array
function getRandomSoundFile() {
    return soundFiles[Math.floor(Math.random() * soundFiles.length)];
}

// Function to toggle visibility of pop-up image and play audio
async function togglePopupImage() {
    var popupImage = document.getElementById("popupImage");
    if (popupImage.style.display === "none") {
        popupImage.style.display = "block"; // Show the pop-up image
        if (soundFiles.length === 0) {
            await fetchSoundFiles(); // Fetch sound files if not fetched already
        }
        if (soundFiles.length > 0) {
            var randomSoundFile = getRandomSoundFile(); // Get a random sound file
            // Ensure the same sound isn't played for the next 5 clicks
            while (lastPlayedSounds.includes(randomSoundFile)) {
                randomSoundFile = getRandomSoundFile();
            }
            // Add the newly selected sound file to the last played list
            lastPlayedSounds.push(randomSoundFile);
            if (lastPlayedSounds.length > 10) {
                // If more than 10 sound files are stored, remove the oldest one
                lastPlayedSounds.shift();
            }
            audio.src = randomSoundFile; // Set the source of the audio
            audio.volume = 0.5; // Setting volume to achieve -10dB (Volume is logarithmic, 0.316 is approximately -10dB)
            audio.play(); // Play the audio
        }
    } else {
        popupImage.style.display = "none"; // Hide the pop-up image
        audio.pause(); // Pause the audio
        audio.currentTime = 0; // Rewind the audio to the beginning
    }
}

// Add event listener to the title image for toggling the pop-up image
document.querySelector('.title').addEventListener('click', togglePopupImage);
