// Define the initial message
let message = "this website is so awesome that it has demoscene effects in the text!!!";

// Function to wrap each letter of the message in <span> elements with animation delay
function wrapLettersInSpans(message) {
    let wrappedMessage = '';
    let delay = 0;
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        // If the character is a space, add a non-breaking space with no animation
        if (char === ' ') {
            wrappedMessage += '&nbsp;';
        } else {
            // Set a unique animation delay for each letter
            const animationDelay = delay * 0.1 + 's'; // Adjust the delay as needed
            wrappedMessage += `<span style="animation-delay: ${animationDelay};">${char}</span>`;
            delay++;
        }
    }
    return wrappedMessage;
}

// Update the marquee content with the message
function updateMarquee() {
    const marqueeContent = document.getElementById('marquee');
    marqueeContent.innerHTML = wrapLettersInSpans(message);
}

// Call updateMarquee to set the initial message
updateMarquee();
