const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
const message = document.querySelector("#game-message");
const messageTitle = document.querySelector("#message-title");
const messageText = document.querySelector("#message-text");
const startButton = document.querySelector("#start-button");
const levelCount = document.querySelector("#level-count");
const crystalCount = document.querySelector("#crystal-count");
const lifeCount = document.querySelector("#life-count");
const timerDisplay = document.querySelector("#timer");

const width = canvas.width;
const height = canvas.height;
const totalLevels = 10;
const playerSize = 28;
const playerSpeed = 200;
const spawn = { x: 43, y: 58 };
const exit = { x: 850, y: 550, size: 30 };
const walls = [
    { x: 200, y: 0, width: 18, height: 360 },
    { x: 390, y: 240, width: 18, height: 360 },
    { x: 580, y: 0, width: 18, height: 360 },
    { x: 760, y: 240, width: 18, height: 360 },
    { x: 52, y: 181, width: 90, height: 18 },
    { x: 260, y: 419, width: 88, height: 18 },
    { x: 448, y: 131, width: 88, height: 18 },
    { x: 638, y: 419, width: 88, height: 18 }
];
const crystals = [
    { x: 112, y: 84, collected: false },
    { x: 300, y: 82, collected: false },
    { x: 300, y: 520, collected: false },
    { x: 490, y: 82, collected: false },
    { x: 680, y: 520, collected: false },
    { x: 850, y: 110, collected: false }
];
const enemyStarts = [
    { x: 105, y: 290, min: 50, max: 160, speed: 110, direction: 1, axis: "x" },
    { x: 300, y: 290, min: 255, max: 380, speed: 130, direction: -1, axis: "y" },
    { x: 490, y: 300, min: 250, max: 370, speed: 120, direction: 1, axis: "y" },
    { x: 680, y: 280, min: 610, max: 730, speed: 140, direction: -1, axis: "x" },
    { x: 850, y: 460, min: 390, max: 530, speed: 105, direction: 1, axis: "y" },
    { x: 105, y: 500, min: 50, max: 160, speed: 115, direction: -1, axis: "x" },
    { x: 300, y: 115, min: 235, max: 355, speed: 100, direction: 1, axis: "x" },
    { x: 490, y: 500, min: 420, max: 550, speed: 110, direction: -1, axis: "x" },
    { x: 680, y: 110, min: 610, max: 740, speed: 120, direction: 1, axis: "x" },
    { x: 850, y: 225, min: 60, max: 210, speed: 125, direction: -1, axis: "y" }
];
const enemies = [];
const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
};

let player = { x: spawn.x, y: spawn.y };
let pressedKeys = new Set();
let state = "ready";
let level = 1;
let lives = 3;
let elapsed = 0;
let lastFrame = 0;
let invulnerability = 0;

function setMessage(title, text, buttonText) {
    messageTitle.textContent = title;
    messageText.textContent = text;
    startButton.textContent = buttonText;
    message.hidden = false;
}

function updateHud() {
    const collected = crystals.filter((crystal) => crystal.collected).length;
    levelCount.textContent = `${level}/${totalLevels}`;
    crystalCount.textContent = `${collected}/${crystals.length}`;
    lifeCount.textContent = lives;
    timerDisplay.textContent = `${elapsed.toFixed(2)}s`;
}

function loadLevel() {
    player = { x: spawn.x, y: spawn.y };
    pressedKeys.clear();
    invulnerability = 0;
    crystals.forEach((crystal) => { crystal.collected = false; });
    const enemyCount = Math.min(level + 1, enemyStarts.length);
    const speedMultiplier = 0.8 + (level - 1) * 0.09;
    enemies.splice(
        0,
        enemies.length,
        ...enemyStarts.slice(0, enemyCount).map((enemy) => ({
            ...enemy,
            speed: enemy.speed * speedMultiplier
        }))
    );
    updateHud();
}

function resetGame() {
    level = 1;
    lives = 3;
    elapsed = 0;
    loadLevel();
    state = "ready";
    setMessage("El Laberinto", "Recoge los cristales y llega a la salida.", "Empezar");
    draw();
}

function startGame() {
    if (state === "levelComplete") {
        level += 1;
        loadLevel();
    } else if (state === "won" || state === "lost") {
        resetGame();
    }
    state = "playing";
    message.hidden = true;
    pressedKeys.clear();
}

function rectanglesOverlap(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function movePlayer(dx, dy) {
    const nextX = { x: player.x + dx, y: player.y, width: playerSize, height: playerSize };
    if (nextX.x >= 0 && nextX.x + playerSize <= width &&
        !walls.some((wall) => rectanglesOverlap(nextX, wall))) {
        player.x = nextX.x;
    }

    const nextY = { x: player.x, y: player.y + dy, width: playerSize, height: playerSize };
    if (nextY.y >= 0 && nextY.y + playerSize <= height &&
        !walls.some((wall) => rectanglesOverlap(nextY, wall))) {
        player.y = nextY.y;
    }
}

function update(delta) {
    if (state !== "playing") return;
    elapsed += delta;
    invulnerability = Math.max(0, invulnerability - delta);

    let dx = 0;
    let dy = 0;
    pressedKeys.forEach((key) => {
        const direction = directions[key];
        if (direction) {
            dx += direction.x;
            dy += direction.y;
        }
    });
    if (dx && dy) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }
    movePlayer(dx * playerSpeed * delta, dy * playerSpeed * delta);

    enemies.forEach((enemy) => {
        enemy[enemy.axis] += enemy.speed * enemy.direction * delta;
        if (enemy[enemy.axis] <= enemy.min || enemy[enemy.axis] >= enemy.max) {
            enemy[enemy.axis] = Math.max(enemy.min, Math.min(enemy.max, enemy[enemy.axis]));
            enemy.direction *= -1;
        }
    });

    crystals.forEach((crystal) => {
        if (crystal.collected) return;
        const centerX = player.x + playerSize / 2;
        const centerY = player.y + playerSize / 2;
        if (Math.hypot(centerX - crystal.x, centerY - crystal.y) < 21) {
            crystal.collected = true;
        }
    });

    if (invulnerability === 0) {
        const hit = enemies.some((enemy) => {
            const nearestX = Math.max(player.x, Math.min(enemy.x, player.x + playerSize));
            const nearestY = Math.max(player.y, Math.min(enemy.y, player.y + playerSize));
            return Math.hypot(enemy.x - nearestX, enemy.y - nearestY) < 16;
        });
        if (hit) {
            lives -= 1;
            player = { x: spawn.x, y: spawn.y };
            invulnerability = 1.4;
            if (lives === 0) {
                state = "lost";
                setMessage("Perdiste", "Te quedaste sin vidas.", "Intentar de nuevo");
            }
        }
    }

    if (state === "playing" && crystals.every((crystal) => crystal.collected) &&
        rectanglesOverlap(
            { x: player.x, y: player.y, width: playerSize, height: playerSize },
            { x: exit.x - 12, y: exit.y - 12, width: exit.size + 24, height: exit.size + 24 }
        )) {
        if (level === totalLevels) {
            state = "won";
            setMessage("¡Completaste los 10 niveles!", `Tiempo total: ${elapsed.toFixed(2)}s`, "Jugar de nuevo");
        } else {
            state = "levelComplete";
            setMessage(`¡Nivel ${level} superado!`, "Cristales reunidos. ¿Listo para el siguiente?", "Siguiente nivel");
        }
    }

    updateHud();
}

function drawBackground() {
    context.fillStyle = "#555";
    context.fillRect(0, 0, width, height);
}

function drawWalls() {
    context.fillStyle = "#222";
    walls.forEach((wall) => context.fillRect(wall.x, wall.y, wall.width, wall.height));
}

function drawCrystals() {
    context.fillStyle = "#ffd700";
    crystals.forEach((crystal) => {
        if (!crystal.collected) {
            context.fillRect(crystal.x - 8, crystal.y - 8, 16, 16);
        }
    });
}

function drawExit() {
    const unlocked = crystals.every((crystal) => crystal.collected);
    context.fillStyle = unlocked ? "#00cc00" : "#268026";
    context.fillRect(exit.x - exit.size / 2, exit.y - exit.size / 2, exit.size, exit.size);
}

function drawEnemies() {
    context.fillStyle = "blue";
    enemies.forEach((enemy) => context.fillRect(enemy.x - 12, enemy.y - 12, 24, 24));
}

function drawPlayer() {
    if (invulnerability > 0 && Math.floor(performance.now() / 100) % 2 === 0) return;
    context.fillStyle = "red";
    context.fillRect(player.x, player.y, playerSize, playerSize);
}

function draw() {
    drawBackground();
    drawWalls();
    drawExit();
    drawCrystals();
    drawEnemies();
    drawPlayer();
}

function frame(timestamp) {
    const delta = Math.min((timestamp - (lastFrame || timestamp)) / 1000, 0.04);
    lastFrame = timestamp;
    update(delta);
    draw();
    requestAnimationFrame(frame);
}

document.addEventListener("keydown", (event) => {
    if (directions[event.key]) {
        event.preventDefault();
        if (state === "ready") startGame();
        pressedKeys.add(event.key);
    }
    if (event.key === "Enter" && state !== "playing") startGame();
});

document.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key);
});

window.addEventListener("blur", () => pressedKeys.clear());
startButton.addEventListener("click", startGame);
document.querySelector("#restart-button").addEventListener("click", resetGame);

loadLevel();
draw();
requestAnimationFrame(frame);
