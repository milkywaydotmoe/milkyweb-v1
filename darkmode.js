var buttonState = 0; // Initial state of the button

function toggleStylesheet() {
        var stylesheet = document.getElementById('stylesheet');
            // Check if the current stylesheet is "index_lite.css"
            if (stylesheet.getAttribute('href') === 'index_lite.css') {
                // Switch to "index_dark.css"
                stylesheet.setAttribute('href', 'index_dark.css');
            } else {
                // Switch back to "index_lite.css" if any other stylesheet is applied
                stylesheet.setAttribute('href', 'index_lite.css');
            }

            // Toggle between button images
        var button = document.getElementById('toggleButton');
            if (buttonState === 0) {
                button.src = 'day.png'; // Change to the second image
                buttonState = 1; // Update button state
            } else {
                button.src = 'night.png'; // Change back to the first image
                buttonState = 0; // Update button state
            }
        }