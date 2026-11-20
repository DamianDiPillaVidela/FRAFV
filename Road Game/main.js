const canvas = document.querySelector("#game-canvas");
const context = canvas.getContext("2d");
const message = document.querySelector("#game-message");
const messageTitle = document.querySelector("#message-title");
const messageText = document.querySelector("#message-text");
const startButton = document.querySelector("#start-button");
const scoreDisplay = document.querySelector("#score");
const bestScoreDisplay = document.querySelector("#best-score");
const timerStat = document.querySelector("#timer-stat");
const timerDisplay = document.querySelector("#timer");
const modeChoices = document.querySelector("#mode-choices");

const width = canvas.width;
const height = canvas.height;
const columns = 15;
const tileWidth = width / columns;
const tileHeight = 50;
const playerSize = 30;
const playerScreenY = height - tileHeight * 3;
const speedIncreasePerRow = 0.02;
const maximumSpeedMultiplier = 2.5;
const playerColors = ["#e32727", "#f0d437", "#3a67e8", "#f28a2e"];
const vehicleColors = ["#164fe0", "#cc3333", "#e7c928", "#eee", "#ed822f"];
const lanes = new Map();

let player = { column: Math.floor(columns / 2), row: 0 };
let score = 0;
let bestScore = 0;
let state = "selecting";
let lastFrame = 0;
let playerColorIndex = 0;
let mode = null;
let remainingTime = 60;

function setMessage(title, text, buttonText) {
    messageTitle.textContent = title;
    messageText.textContent = text;
    startButton.textContent = buttonText;
    message.hidden = false;
}

function updateHud() {
    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;
    timerStat.hidden = mode !== "speed";
    timerStat.classList.toggle("speed-mode", mode === "speed");
    timerDisplay.textContent = Math.ceil(remainingTime);
}

function createLane(row) {
    const isGrass = row === 0 || Math.random() < 0.27;
    if (isGrass) {
        const trees = new Set();
        for (let column = 0; column < columns; column += 1) {
            if (Math.random() < 0.09) trees.add(column);
        }
        return { row, type: "grass", trees, vehicles: [] };
    }

    const direction = Math.random() < 0.5 ? -1 : 1;
    const speed = 80 + Math.random() * 65;
    const vehicleCount = 2 + Math.floor(Math.random() * 2);
    const vehicles = Array.from({ length: vehicleCount }, (_, index) => {
        const vehicleWidth = 42 + Math.random() * 34;
        const spacing = width / vehicleCount;
        return {
            x: direction > 0
                ? index * spacing
                : width - vehicleWidth - index * spacing,
            width: vehicleWidth,
            color: vehicleColors[Math.floor(Math.random() * vehicleColors.length)]
        };
    });
    return { row, type: "road", direction, speed, vehicles };
}

function getLane(row) {
    if (!lanes.has(row)) {
        lanes.set(row, createLane(row));
    }
    return lanes.get(row);
}

function prepareLanes() {
    for (let row = Math.max(0, player.row - 14); row <= player.row + 15; row += 1) {
        getLane(row);
    }
    lanes.forEach((lane, row) => {
        if (row < player.row - 15 || row > player.row + 16) {
            lanes.delete(row);
        }
    });
}

function resetGame() {
    player = { column: Math.floor(columns / 2), row: 0 };
    score = 0;
    remainingTime = 60;
    lanes.clear();
    prepareLanes();
    mode = null;
    state = "selecting";
    modeChoices.hidden = false;
    startButton.hidden = true;
    document.querySelectorAll("[data-mode]").forEach((button) => {
        button.setAttribute("aria-pressed", "false");
    });
    updateHud();
    setMessage("Road Game", "Elige cómo quieres jugar.", "Empezar");
    draw();
}

function selectMode(selectedMode) {
    mode = selectedMode;
    state = "ready";
    modeChoices.hidden = true;
    startButton.hidden = false;
    startButton.textContent = "Empezar";
    document.querySelectorAll("[data-mode]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
    const description = mode === "speed"
        ? "Tienes 60 segundos para llegar lo más lejos posible. Si te chocas, vuelves al inicio."
        : "Cruza los carriles, esquiva los vehículos y llega tan lejos como puedas.";
    setMessage(mode === "speed" ? "Prueba de Velocidad" : "Modo Casual", description, "Empezar");
    updateHud();
}

function startGame() {
    if (state === "selecting") return;
    if (state === "crashed" || state === "timeUp") {
        player = { column: Math.floor(columns / 2), row: 0 };
        score = 0;
        remainingTime = 60;
        lanes.clear();
        prepareLanes();
        updateHud();
    }
    state = "playing";
    message.hidden = true;
}

function movePlayer(columnChange, rowChange) {
    if (state !== "playing") return;
    const nextColumn = player.column + columnChange;
    const nextRow = Math.max(0, player.row + rowChange);
    if (nextColumn < 0 || nextColumn >= columns) return;

    const lane = getLane(nextRow);
    if (lane.type === "grass" && lane.trees.has(nextColumn)) return;

    player.column = nextColumn;
    player.row = nextRow;
    score = Math.max(score, player.row);
    bestScore = Math.max(bestScore, score);
    prepareLanes();
    updateHud();
    checkCollision();
}

function checkCollision() {
    const lane = getLane(player.row);
    if (lane.type !== "road") return;
    const playerLeft = player.column * tileWidth + (tileWidth - playerSize) / 2;
    const playerRight = playerLeft + playerSize;
    const hit = lane.vehicles.some((vehicle) =>
        playerLeft < vehicle.x + vehicle.width - 4 &&
        playerRight > vehicle.x + 4
    );
    if (hit) {
        if (mode === "speed") {
            player = { column: Math.floor(columns / 2), row: 0 };
            prepareLanes();
        } else {
            state = "crashed";
            setMessage("¡Te chocaste!", `Llegaste a ${score} ${score === 1 ? "carril" : "carriles"}. ¿Lo intentas otra vez?`, "Reintentar");
        }
    }
}

function update(delta) {
    if (state !== "playing") return;
    if (mode === "speed") {
        remainingTime = Math.max(0, remainingTime - delta);
        if (remainingTime === 0) {
            state = "timeUp";
            setMessage("¡Tiempo!", `Llegaste a ${score} ${score === 1 ? "carril" : "carriles"} en 60 segundos.`, "Jugar de nuevo");
            updateHud();
            return;
        }
        updateHud();
    }
    const speedMultiplier = Math.min(
        1 + score * speedIncreasePerRow,
        maximumSpeedMultiplier
    );
    lanes.forEach((lane) => {
        if (lane.type !== "road") return;
        lane.vehicles.forEach((vehicle) => {
            vehicle.x += lane.direction * lane.speed * speedMultiplier * delta;
            if (lane.direction > 0 && vehicle.x > width + vehicle.width) {
                vehicle.x = -vehicle.width;
            } else if (lane.direction < 0 && vehicle.x + vehicle.width < 0) {
                vehicle.x = width;
            }
        });
    });
    checkCollision();
}

function drawGrass(lane, y) {
    context.fillStyle = "#578347";
    context.fillRect(0, y, width, tileHeight);
    context.fillStyle = "#476f3d";
    lane.trees.forEach((column) => {
        const x = column * tileWidth + tileWidth / 2;
        context.fillRect(x - 5, y + 23, 10, 17);
        context.fillStyle = "#28592d";
        context.fillRect(x - 16, y + 5, 32, 27);
        context.fillStyle = "#476f3d";
    });
}

function drawRoad(lane, y) {
    context.fillStyle = "#555";
    context.fillRect(0, y, width, tileHeight);
    context.fillStyle = "#222";
    context.fillRect(0, y, width, 3);
    context.fillRect(0, y + tileHeight - 3, width, 3);
    context.fillStyle = "#bbb";
    for (let x = 10; x < width; x += 74) {
        context.fillRect(x, y + tileHeight / 2 - 1, 34, 2);
    }
    lane.vehicles.forEach((vehicle) => {
        context.fillStyle = vehicle.color;
        context.fillRect(vehicle.x, y + 9, vehicle.width, tileHeight - 18);
        context.fillStyle = "#222";
        context.fillRect(vehicle.x + 7, y + 5, 11, 5);
        context.fillRect(vehicle.x + vehicle.width - 18, y + 5, 11, 5);
        context.fillRect(vehicle.x + 7, y + tileHeight - 10, 11, 5);
        context.fillRect(vehicle.x + vehicle.width - 18, y + tileHeight - 10, 11, 5);
    });
}

function drawPlayer() {
    const x = player.column * tileWidth + (tileWidth - playerSize) / 2;
    const y = playerScreenY + (tileHeight - playerSize) / 2;
    context.fillStyle = playerColors[playerColorIndex];
    context.fillRect(x, y, playerSize, playerSize);
}

function draw() {
    context.fillStyle = "#578347";
    context.fillRect(0, 0, width, height);
    const firstVisibleRow = player.row - Math.floor((height - playerScreenY) / tileHeight);
    const lastVisibleRow = player.row + Math.ceil(playerScreenY / tileHeight);
    for (let row = firstVisibleRow; row <= lastVisibleRow; row += 1) {
        if (row < 0) continue;
        const lane = getLane(row);
        const y = playerScreenY - (row - player.row) * tileHeight;
        if (lane.type === "grass") {
            drawGrass(lane, y);
        } else {
            drawRoad(lane, y);
        }
    }
    drawPlayer();
}

function frame(timestamp) {
    const delta = Math.min((timestamp - (lastFrame || timestamp)) / 1000, 0.04);
    lastFrame = timestamp;
    update(delta);
    draw();
    requestAnimationFrame(frame);
}

const controls = {
    ArrowUp: [0, 1],
    w: [0, 1],
    W: [0, 1],
    ArrowDown: [0, -1],
    s: [0, -1],
    S: [0, -1],
    ArrowLeft: [-1, 0],
    a: [-1, 0],
    A: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0],
    D: [1, 0]
};

document.addEventListener("keydown", (event) => {
    const movement = controls[event.key];
    if (movement) {
        event.preventDefault();
        if (state === "ready") startGame();
        if (state === "playing" && !event.repeat) {
            movePlayer(movement[0], movement[1]);
        }
    } else if (event.key === "Enter" && state !== "playing") {
        startGame();
    }
});

startButton.addEventListener("click", startGame);
modeChoices.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (button) selectMode(button.dataset.mode);
});
document.querySelector("#restart-button").addEventListener("click", resetGame);

updateHud();
prepareLanes();
setMessage("Road Game", "Elige cómo quieres jugar.", "Empezar");
draw();
requestAnimationFrame(frame);