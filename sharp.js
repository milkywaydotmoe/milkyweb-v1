// Get all images on the page
const images = document.querySelectorAll('img');

// Loop through each image
images.forEach(img => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set the canvas size to the same as the image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image on the canvas with linear interpolation
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

    // Create a new image element with the scaled image
    const newImg = new Image();
    newImg.src = canvas.toDataURL();

    // Replace the original image with the scaled image
    img.parentNode.replaceChild(newImg, img);
});
