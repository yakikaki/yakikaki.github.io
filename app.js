// app.js
document.addEventListener("DOMContentLoaded", function () {
    // Initial load
    loadContent("index");

    // Navigation event listeners
    const navLinks = document.querySelectorAll(".navbar a");
    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);
            loadContent(page);
        });
    });
});

function loadContent(page) {
    const contentContainer = document.querySelector(".content-container");
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            contentContainer.innerHTML = xhr.responseText;
        }
    };
    xhr.open("GET", page + ".html", true);
    xhr.send();
}
