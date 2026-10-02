const gameArea = document.querySelector("#game-area");
const player = document.querySelector("#player");
const playerSize = 32;
const movementStep = 16;
const bulletSize = 20;
const bulletSpeed = 180;
const bullets = [];

let playerX = (gameArea.clientWidth - playerSize) / 2;
let playerY = (gameArea.clientHeight - playerSize) / 2;
let previousFrameTime = null;

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
	const moves = {
		ArrowUp: [0, -movementStep],
		ArrowDown: [0, movementStep],
		ArrowLeft: [-movementStep, 0],
		ArrowRight: [movementStep, 0],
	};
	const move = moves[event.key];

	if (!move) return;

	event.preventDefault();
	playerX += move[0];
	playerY += move[1];
	keepPlayerInBounds();
});

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

function animateBullets(frameTime) {
	const deltaSeconds = previousFrameTime === null
		? 0
		: (frameTime - previousFrameTime) / 1000;
	previousFrameTime = frameTime;

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
			window.alert("You lost the game");
			window.location.reload();
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
