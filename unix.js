// Function to get the current Unix time in hexadecimal
function getCurrentUnixTimeHex() {
    const currentUnixTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    return currentUnixTime.toString(16).toUpperCase(); // Convert to hexadecimal and uppercase
    }

// Function to update the displayed Unix time in hexadecimal
function updateUnixTime() {
    const unixTimePlaceholder = document.getElementById('unix-time-placeholder');
    const currentUnixTimeHex = getCurrentUnixTimeHex();
    unixTimePlaceholder.textContent = currentUnixTimeHex;
    }

// Update the displayed Unix time initially
updateUnixTime();

// Update the displayed Unix time every second
setInterval(updateUnixTime, 1000);