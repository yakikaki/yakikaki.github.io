const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');



const keysPressed = {};
const obstacles = [];
const pointsObstacles = [];
const obstacleRate = 100;
const pointsObstacleRate = 350
let backgroundX = 0;
let roadBackgroundX = 0; 
let backgroundSpeed = 2;
let roadSpeed = backgroundSpeed * 0.5;
const speedIncreaseRate = 0.001; 
const speedRecoveryRate = 0.05; 
const scorePerSecond = 100;
let score = 0;
let kids = 0;
let lastTick = Date.now();
let collisionDetected = false;
let canMove = true;
let MPH = 60; 

const playerSprite = new Image();
const obstacleSprite = new Image();
const pointsObstacleSprite = new Image();

playerSprite.src = '/assets/drunk-driver/Player.png';
obstacleSprite.src = '/assets/drunk-driver/Obstacle.png';
pointsObstacleSprite.src = '/assets/drunk-driver/Kid.png';

const player = {
    x: 100,
    y: 280,
    size: 60,
    speed: 2,
    originalSpeed: 2,
    color: 'purple',
    spin: 0, 
    spinDuration: 1000, 
    spinStartTime: 0,
    sprite: playerSprite
};

let raceEndLineX = -1; 
const raceEndLineWidth = 5; 
let raceEndLineReached = false;

backgroundMusic.play().catch(error => {
    console.error('Error playing the background music:', error);
});

const buttons = {
    up: { x: 700, y: 510, width: 80, height: 80, text: '↑' },
    down: { x: 830, y: 510, width: 80, height: 80, text: '↓' },
    left: { x: 50, y: 510, width: 80, height: 80, text: '←' },
    right: { x: 180, y: 510, width: 80, height: 80, text: '→' }
};


function drawButtons() {
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    for (const [key, button] of Object.entries(buttons)) {
        context.fillStyle = 'lightgray';
        context.fillRect(button.x, button.y, button.width, button.height);
        context.strokeStyle = 'black';
        context.strokeRect(button.x, button.y, button.width, button.height);
        context.fillStyle = 'black';
        context.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
    }
}


function drawPlayer() {
    if (player.sprite.complete) {
        context.save();
        context.translate(player.x + player.size / 2, player.y + player.size / 2);
        context.rotate((player.spin * Math.PI) / 180);
        context.drawImage(player.sprite, -player.size / 2, -player.size / 2, player.size, player.size);
        context.restore();
    } else {
        context.save();
        context.translate(player.x + player.size / 2, player.y + player.size / 2);
        context.rotate((player.spin * Math.PI) / 180);
        context.fillStyle = player.color;
        context.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
        context.restore();
    }
}

function createObstacle() {
    const obstacleSize = 60;
    const obstacleY = Math.random() * (canvas.height - obstacleSize);
    
    let obstacleX, speed;
    if (obstacleY < canvas.height / 2) {
        obstacleX = -obstacleSize; 
        speed = backgroundSpeed; 
    } else {
        obstacleX = canvas.width; 
        speed = -backgroundSpeed; 
    }

    const obstacle = {
        x: obstacleX,
        y: obstacleY,
        size: obstacleSize,
        color: 'pink',
        speed: speed,
        sprite: obstacleSprite
    };
    obstacles.push(obstacle);
}

function createPointsObstacle() {
    const obstacleSize = 40;
    const obstacleY = Math.random() * (canvas.height - obstacleSize);
    
    let obstacleX = canvas.width;
    const speed = -backgroundSpeed; 

    const pointsObstacle = {
        x: obstacleX,
        y: obstacleY,
        size: obstacleSize,
        color: 'gold', // Color to differentiate points obstacles
        speed: speed,
        points: 500, // Points awarded when touched
        sprite: pointsObstacleSprite
    };
    pointsObstacles.push(pointsObstacle);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacle.sprite.complete) {
            context.save(); // Save the current state
            if (obstacle.speed > 0) { // Obstacle is coming from the left
                context.scale(-1, 1); // Flip horizontally
                context.drawImage(obstacle.sprite, -obstacle.x - obstacle.size, obstacle.y, obstacle.size, obstacle.size);
            } else { // Obstacle is coming from the right
                context.drawImage(obstacle.sprite, obstacle.x, obstacle.y, obstacle.size, obstacle.size);
            }
            context.restore(); // Restore the state to avoid affecting other drawings
        } else {
            context.fillStyle = obstacle.color;
            context.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
        }
    });
}

function drawPointsObstacles() {
    pointsObstacles.forEach(pointsObstacle => {
        if (pointsObstacle.sprite.complete) {
            context.drawImage(pointsObstacle.sprite, pointsObstacle.x, pointsObstacle.y, pointsObstacle.size, pointsObstacle.size);
        } else {
            context.fillStyle = pointsObstacle.color;
            context.fillRect(pointsObstacle.x, pointsObstacle.y, pointsObstacle.size, pointsObstacle.size);
        }
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x += obstacle.speed; // Update X based on speed
    });

    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].x + obstacles[i].size < 0 || obstacles[i].x > canvas.width) {
            obstacles.splice(i, 1);
        }
    }
}

function updatePointsObstacles() {
    pointsObstacles.forEach(pointsObstacle => {
        pointsObstacle.x += pointsObstacle.speed; // Update X based on speed
    });

    for (let i = pointsObstacles.length - 1; i >= 0; i--) {
        if (pointsObstacles[i].x + pointsObstacles[i].size < 0 || pointsObstacles[i].x > canvas.width) {
            pointsObstacles.splice(i, 1);
        }
    }
}

function drawCenterLines() {
    context.strokeStyle = 'white';
    context.lineWidth = 5;

    const roadHeight = canvas.height / 2;
    const dashedLineY1 = roadHeight / 2; // Center of the top road
    const dashedLineY2 = roadHeight + (roadHeight / 2); // Center of the bottom road
    const dashLength = 20;
    const spaceLength = 20;

    context.beginPath();
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();

    function drawDashedLine(y) {
        context.setLineDash([dashLength, spaceLength]);
        let startX = roadBackgroundX % (dashLength + spaceLength) - (dashLength + spaceLength);
        while (startX < canvas.width) {
            context.beginPath();
            context.moveTo(startX, y);
            context.lineTo(startX + dashLength, y);
            context.stroke();
            startX += dashLength + spaceLength;
        }
        context.setLineDash([]);
    }

    drawDashedLine(dashedLineY1);
    drawDashedLine(dashedLineY2);
}

function drawScore() {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Score: ${Math.round(score)}`, 10, 20);
}

function drawMPH() {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`MPH: ${Math.round(MPH)}`, 10, 50); 
}

function drawKids() {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Kids ran over: ${Math.round(kids)}`, 10, 80); 
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.size &&
            player.x + player.size > obstacle.x &&
            player.y < obstacle.y + obstacle.size &&
            player.y + player.size > obstacle.y
        ) {
            if (!collisionDetected) {
                collisionDetected = true;
                player.spin = 1080; // Set spin to 3 full rotations (360 * 3)
                player.spinStartTime = Date.now(); // Record start time of the spin effect
                canMove = false; // Disable movement on collision
            }
        }
    });

    pointsObstacles.forEach(pointsObstacle => {
        if (
            player.x < pointsObstacle.x + pointsObstacle.size &&
            player.x + player.size > pointsObstacle.x &&
            player.y < pointsObstacle.y + pointsObstacle.size &&
            player.y + player.size > pointsObstacle.y
        ) {
            kids++; 
            playSound('pointSound');
            pointsObstacles.splice(pointsObstacles.indexOf(pointsObstacle), 1); // Remove the points obstacle
        }
    });
}

function createRaceEndLine() {
    raceEndLineX = canvas.width + Math.random() * (canvas.width / 2); // Create line within the visible area
    raceEndLineReached = false; 
}

function drawRaceEndLine() {
    if (raceEndLineX > 0) {
        context.fillStyle = 'yellow';
        context.fillRect(raceEndLineX, 0, raceEndLineWidth, canvas.height); // Draw the end line
    }
}

function checkRaceEndLine() {
    if (
        raceEndLineX > 0 &&
        player.x < raceEndLineX + raceEndLineWidth &&
        player.x + player.size > raceEndLineX
    ) {
        raceEndLineReached = true;
        raceEndLineX = -1; 

        score += 2000;

        player.x = 100;
        player.y = 280;
    }
}

function update() {
    const now = Date.now();
    const deltaTime = (now - lastTick) / 1000;
    lastTick = now;

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    backgroundX -= backgroundSpeed;
    roadSpeed = backgroundSpeed * 0.5;
    roadBackgroundX -= roadSpeed;

    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }

    if (roadBackgroundX <= -canvas.width) {
        roadBackgroundX = 0;
    }

    if (canMove) {
        if (keysPressed['ArrowUp'] && player.y > 0) {
            player.y -= player.speed;
        }
        if (keysPressed['ArrowDown'] && player.y + player.size < canvas.height) {
            player.y += player.speed;
        }
        if (keysPressed['ArrowLeft'] && player.x > 0) {
            player.x -= player.speed;
        }
        if (keysPressed['ArrowRight'] && player.x + player.size < canvas.width) {
            player.x += player.speed;
        }
    }

    drawCenterLines();
    drawObstacles();
    drawPointsObstacles();
    drawPlayer();
    drawRaceEndLine();
    drawScore();
    drawMPH();
    drawKids();
    drawButtons();

    if (Math.floor(Math.random() * obstacleRate) === 0) {
        createObstacle();
    }

    if (Math.floor(Math.random() * pointsObstacleRate) === 0) {
        createPointsObstacle();
    }

    if (raceEndLineX === -1 && Math.random() < 0.01) {
        createRaceEndLine();
    }

    updateObstacles();
    updatePointsObstacles();
    checkCollision();
    checkRaceEndLine();

    if (collisionDetected) {
        const elapsedTime = Date.now() - player.spinStartTime;
        playSound('collisionSound');
        if (elapsedTime < player.spinDuration) {
            player.spin = 1080 - (1080 * (elapsedTime / player.spinDuration));
        } else {
            player.spin = 0;
            collisionDetected = false;
            canMove = true;
        }

        backgroundSpeed -= speedRecoveryRate;
        if (backgroundSpeed < player.originalSpeed) {
            backgroundSpeed = player.originalSpeed;
        }
    } else {
        backgroundSpeed += speedIncreaseRate;
    }

    MPH = backgroundSpeed * 30;

    score++;
    requestAnimationFrame(update);
}

const fullscreenButton = document.getElementById('fullscreenButton');

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error(`Failed to enter fullscreen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen().catch(err => {
            console.error(`Failed to exit fullscreen mode: ${err.message}`);
        });
    }
}

fullscreenButton.addEventListener('click', toggleFullscreen);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
document.addEventListener('fullscreenchange', resizeCanvas);

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const [key, button] of Object.entries(buttons)) {
        if (x >= button.x && x <= button.x + button.width &&
            y >= button.y && y <= button.y + button.height) {
            keysPressed[`Arrow${key.charAt(0).toUpperCase() + key.slice(1)}`] = true;
        }
    }
});

canvas.addEventListener('mouseup', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (const [key, button] of Object.entries(buttons)) {
        if (x >= button.x && x <= button.x + button.width &&
            y >= button.y && y <= button.y + button.height) {
            keysPressed[`Arrow${key.charAt(0).toUpperCase() + key.slice(1)}`] = false;
        }
    }
});

update();

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }
}




