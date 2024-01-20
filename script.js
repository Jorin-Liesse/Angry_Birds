// Add your JavaScript code here

// Function to set the viewport based on device orientation
function setViewport() {
    const viewport = document.querySelector("meta[name=viewport]");
    if (window.orientation === 90 || window.orientation === -90) {
        // Landscape mode
        viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
    } else {
        // Portrait mode
        viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
}

// Initial setup
setViewport();

// Event listener for orientation change
window.addEventListener("orientationchange", setViewport);

// Your JavaScript code goes here

// Function to make the page go full screen
function goFullScreen() {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

// Call the function to go full screen
document.addEventListener("click", () => {
    goFullScreen();
  }, { once: true });

