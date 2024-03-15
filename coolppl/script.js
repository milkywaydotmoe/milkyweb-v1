window.onload = function() {
  fetch('data.txt')
    .then(response => response.text())
    .then(data => {
      const profiles = data.trim().split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
      const container = document.getElementById('profiles-container');

      const profilesPerRow = 6; // Number of profiles per row
      let profileCount = 0; // Track the number of profiles in the current row
      let rowDiv; // Initialize row container variable

      profiles.forEach(profile => {
        if (profileCount === 0 || profileCount === profilesPerRow) {
          // Create a new row if it's the first profile or the current row is full
          rowDiv = document.createElement('div');
          rowDiv.classList.add('row');
          container.appendChild(rowDiv);
          profileCount = 0; // Reset profile count for the new row
        }

        const { name, image, site } = JSON.parse(profile);
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile');

        const img = document.createElement('img');
        img.src = image;
        img.alt = name;

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.textContent = name;

        profileDiv.appendChild(img);
        profileDiv.appendChild(overlay);

        rowDiv.appendChild(profileDiv); // Append profile to the current row
        rowDiv.appendChild(document.createElement('br')); // Add a line break after each profile
        profileCount++; // Increment profile count for the current row

        profileDiv.addEventListener('click', function() {
          window.location.href = site;
        });
      });
    })
    .catch(error => console.error('Error fetching data:', error));
};
