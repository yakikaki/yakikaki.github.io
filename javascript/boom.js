document.getElementById('explosionButton').addEventListener('click', function(event) {
    const button = event.target;
    const buttonRect = button.getBoundingClientRect();

    const explosionGif = document.getElementById('explosionGif');

    const offsetX = explosionGif.offsetWidth / 2;
    const offsetY = explosionGif.offsetHeight / 2;

    const buttonCenterX = buttonRect.left + buttonRect.width / 6;
    const buttonCenterY = buttonRect.top + buttonRect.height / 6;

    explosionGif.style.transformOrigin = 'center center';
    explosionGif.style.display = 'block';
    explosionGif.style.left = `${buttonCenterX - offsetX}px`;
    explosionGif.style.top = `${buttonCenterY - offsetY}px`;

    const explosionSound = document.getElementById('explosionSound');
    explosionSound.play();

    setTimeout(function() {
        explosionGif.style.display = 'none';
    }, 700);

    document.getElementById('explosionButton').remove();
});
