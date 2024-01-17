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
