document.addEventListener('DOMContentLoaded', function () {
    // Get the current page URL
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Get all navigation links
    var navLinks = document.querySelectorAll('nav a');

    // Loop through each link and add the "active" class if the link matches the current page
    navLinks.forEach(function (link) {
        if (link.getAttribute('href') === page) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Get all clickable elements
    var clickableElements = document.querySelectorAll('.clickable');

    // Add click event listener to each clickable element
    clickableElements.forEach(function (element) {
        element.addEventListener('click', function () {
            // Play the click sound
            playClickSound();
        });
    });

    // Function to play the click sound
    function playClickSound() {
        var clickSound = new Audio('snd_select.wav');
        clickSound.play();
    }
});
