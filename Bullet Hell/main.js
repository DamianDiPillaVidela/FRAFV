const gameArea = document.querySelector("#game-area");
const player = document.querySelector("#player");
const playerSize = 32;
const movementSpeed = 250;
const slowMovementSpeed = 100;
const bulletSize = 20;
const bulletSpeed = 180;
const bullets = [];
const timer = document.querySelector("#timer");
const bestTimeDisplay = document.querySelector("#best-time");

let gameTime = 0;
let bestTime = 0;

let playerX = (gameArea.clientWidth - playerSize) / 2;
let playerY = (gameArea.clientHeight - playerSize) / 2;
let previousFrameTime = null;

const keys = {};

function drawPlayer() {
	player.style.left = `${playerX}px`;
	player.style.top = `${playerY}px`;
}

function keepPlayerInBounds() {
	playerX = Math.max(0, Math.min(playerX, gameArea.clientWidth - playerSize));
	playerY = Math.max(0, Math.min(playerY, gameArea.clientHeight - playerSize));
	drawPlayer();
}

document.addEventListener("keydown", (event) => {
	if (
		event.key === "ArrowUp" ||
		event.key === "ArrowDown" ||
		event.key === "ArrowLeft" ||
		event.key === "ArrowRight" ||
		event.key === "Shift"
	) {
		event.preventDefault();
	}

	keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
	keys[event.key] = false;
});

function movePlayer(deltaSeconds) {
	const speed = keys["Shift"] ? slowMovementSpeed : movementSpeed;

	if (keys["ArrowUp"]) {
		playerY -= speed * deltaSeconds;
	}

	if (keys["ArrowDown"]) {
		playerY += speed * deltaSeconds;
	}

	if (keys["ArrowLeft"]) {
		playerX -= speed * deltaSeconds;
	}

	if (keys["ArrowRight"]) {
		playerX += speed * deltaSeconds;
	}

	keepPlayerInBounds();
}

function spawnBullet() {
	const side = Math.floor(Math.random() * 4);
	const maxX = gameArea.clientWidth - bulletSize;
	const maxY = gameArea.clientHeight - bulletSize;
	let x;
	let y;
	let directionX = 0;
	let directionY = 0;

	switch (side) {
		case 0:
			x = 0;
			y = Math.random() * maxY;
			directionX = 1;
			break;
		case 1:
			x = maxX;
			y = Math.random() * maxY;
			directionX = -1;
			break;
		case 2:
			x = Math.random() * maxX;
			y = 0;
			directionY = 1;
			break;
		default:
			x = Math.random() * maxX;
			y = maxY;
			directionY = -1;
	}

	const element = document.createElement("div");
	element.className = "bullet";
	gameArea.appendChild(element);
	bullets.push({ element, x, y, directionX, directionY });
}

function resetGame() {
	for (const bullet of bullets) {
		bullet.element.remove();
	}

	bullets.length = 0;

	gameTime = 0;
	previousFrameTime = null;

	playerX = (gameArea.clientWidth - playerSize) / 2;
	playerY = (gameArea.clientHeight - playerSize) / 2;

	keys.ArrowUp = false;
	keys.ArrowDown = false;
	keys.ArrowLeft = false;
	keys.ArrowRight = false;
	keys.Shift = false;

	timer.textContent = `Tiempo: 0.00s`;

	drawPlayer();
}
function animateBullets(frameTime) {
	const deltaSeconds = previousFrameTime === null
		? 0
		: (frameTime - previousFrameTime) / 1000;
	previousFrameTime = frameTime;

    gameTime += deltaSeconds;
	timer.textContent = `Tiempo: ${gameTime.toFixed(2)}s`;

	movePlayer(deltaSeconds);

	for (let index = bullets.length - 1; index >= 0; index--) {
		const bullet = bullets[index];
		bullet.x += bullet.directionX * bulletSpeed * deltaSeconds;
		bullet.y += bullet.directionY * bulletSpeed * deltaSeconds;
		bullet.element.style.left = `${bullet.x}px`;
		bullet.element.style.top = `${bullet.y}px`;

		if (
			bullet.x < playerX + playerSize &&
			bullet.x + bulletSize > playerX &&
			bullet.y < playerY + playerSize &&
			bullet.y + bulletSize > playerY
		) {
			if (gameTime > bestTime) {
	            bestTime = gameTime;
	            bestTimeDisplay.textContent = `Mejor tiempo: ${bestTime.toFixed(2)}s`;
            }
            window.alert(`Perdiste.\nTiempo: ${gameTime.toFixed(2)}s`);
            resetGame();
            requestAnimationFrame(animateBullets);
            return;
		}

		if (
			bullet.x < -bulletSize ||
			bullet.x > gameArea.clientWidth ||
			bullet.y < -bulletSize ||
			bullet.y > gameArea.clientHeight
		) {
			bullet.element.remove();
			bullets.splice(index, 1);
		}
	}

	requestAnimationFrame(animateBullets);
}

window.addEventListener("resize", keepPlayerInBounds);
drawPlayer();
window.setInterval(spawnBullet, 150);
requestAnimationFrame(animateBullets);