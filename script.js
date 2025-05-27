// GSAP Animation for the Start Screen Logo
const tl = gsap.timeline({default: {duration: 1}});
tl.fromTo('.carLogo', {y: 100, opacity: 0}, {y: 0, opacity: 1}, '<50%');

// Game Play Logic

// Selectors
const carLogo = document.querySelector(".carLogo");
const score = document.querySelector(".Score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const startText = document.querySelector(".starttext");

// Player object to store game state
let player = {
    speed: 7,
    score: 0,
    level: 1
};

// Object to keep track of which keys are pressed
let buttons = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

// Background colors for different levels
const levelColors = [
    "#2b2d42",
    "#3c4043",
    "#4b5320",
    "#5d3a3a",
    "#2c3e50",
    "#483d3f"
];

// Event Listeners
startScreen.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

// Display initial score
score.innerHTML = "Score: " + player.score;

// Function to handle key press (key down)
function pressOn(e) {
    e.preventDefault();
    buttons[e.key] = true;
}

// Function to handle key release (key up)
function pressOff(e) {
    e.preventDefault();
    buttons[e.key] = false;
}

// Main game loop function
function playGame() {
    let car = document.querySelector(".car");

    moveLines();
    moveEnemies(car);

    // Update level and speed based on score
    if (player.score >= 50000) {
        player.level = 6;
        player.speed = 18;
    } else if (player.score >= 10000) {
        player.level = 5;
        player.speed = 16;
    } else if (player.score >= 5000) {
        player.level = 4;
        player.speed = 14;
    } else if (player.score >= 2500) {
        player.level = 3;
        player.speed = 12;
    } else if (player.score >= 1500) {
        player.level = 2;
        player.speed = 10;
    }

    // Change background based on level
    document.body.style.backgroundColor = levelColors[player.level - 1];

    // Update the level display in the UI
    document.querySelector(".level").innerText = "Level: " + player.level;

    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        if (buttons.ArrowUp && player.y > road.top) player.y -= player.speed;
        if (buttons.ArrowDown && player.y < (road.height - 50)) player.y += player.speed;
        if (buttons.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (buttons.ArrowRight && player.x < (road.width - 70)) player.x += player.speed;

        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';

        window.requestAnimationFrame(playGame);

        player.score++;
        score.innerText = "Score: " + player.score;
    }
}

// Function to move the lines on the road
function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function(item) {
        if (item.y >= 1500) {
            item.y -= 1500;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

// Collision detection function
function isCollide(a, b) {
    let rectA = a.getBoundingClientRect();
    let rectB = b.getBoundingClientRect();

    return !(
        (rectA.bottom < rectB.top) ||
        (rectA.top > rectB.bottom) ||
        (rectA.right < rectB.left) ||
        (rectA.left > rectB.right)
    );
}

// Function to move enemy cars
function moveEnemies(car) {
    let enemies = document.querySelectorAll(".enemy");
    enemies.forEach(function(item) {
        // Check if car collides with an enemy
        if (isCollide(car, item)) {
            endGame();
        }

        // Reset enemy position if it moves out of view
        if (item.y >= 1500) {
            item.y = -600;  // Move enemy back to top

            // Randomize enemy's horizontal position to any point within the game area, including corners
            let gameAreaWidth = gameArea.getBoundingClientRect().width;
            item.style.left = Math.floor(Math.random() * (gameAreaWidth - item.offsetWidth)) + "px";
        }

        item.y += player.speed;  // Move enemy downward
        item.style.top = item.y + "px";
    });
}

// Function to end the game
function endGame() {
    player.start = false;
    player.speed = 5;
    startScreen.classList.remove("Hide");
    startText.innerHTML = "Game Over <br> Click To Start Again";
    startScreen.style.backgroundColor = "#ff3131";
}

// Function to start the game
function start() {
    startScreen.classList.add("Hide");
    gameArea.classList.remove("Hide");
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;

    // Create the player's car
    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    let road = gameArea.getBoundingClientRect();

    player.x = road.width / 2 - car.offsetWidth / 2;
    player.y = road.height - car.offsetHeight - 20;

    car.style.left = player.x + 'px';
    car.style.top = player.y + 'px';

    // Create lines on the road
    for (let i = 0; i < 10; i++) {
        let div = document.createElement("div");
        div.classList.add("line");
        div.y = i * 150;
        div.style.top = (i * 150) + "px";
        gameArea.appendChild(div);
    }

    // Create enemy cars
    for (let i = 0; i < 5; i++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.y = ((i + 1) * 600) * -0.7;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * 150) + "px";
        enemy.style.backgroundImage = "url(pics/RedCar.svg)";
        enemy.style.rotate = "180deg";
        gameArea.appendChild(enemy);
    }

    window.requestAnimationFrame(playGame);
}
