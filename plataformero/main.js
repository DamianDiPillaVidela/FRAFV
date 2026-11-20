"use strict";

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");

if (!context) {
    throw new Error("Could not initialize the game canvas.");
}

const gravity = 1800;
const moveSpeed = 280;
const jumpSpeed = 650;
const keys = new Set();
const status = document.getElementById("level-status");

const levels = [
    { name: "Pradera", theme: "meadow", width: 1600,
      platforms: [{x:0,y:610,width:1600,height:65}],
      hazards: [], flag:{x:1510,y:610} },
    { name: "Bosque profundo", theme: "forest", width: 1750,
      platforms: [{x:0,y:610,width:1750,height:65},{x:480,y:510,width:200,height:18},{x:660,y:490,width:200,height:18},{x:900,y:420,width:200,height:18},{x:1140,y:330,width:200,height:18},{x:1380,y:420,width:200,height:18}],
      hazards: [{x:820,y:610,width:144,height:18},{x:1040,y:610,width:72,height:18},{x:1510,y:610,width:72,height:18}], flag:{x:1660,y:610} },
    { name: "Cuevas", theme: "cave", width: 1850,
      platforms: [{x:0,y:610,width:1850,height:65},{x:180,y:510,width:180,height:18},{x:400,y:420,width:180,height:18},{x:620,y:330,width:180,height:18},{x:840,y:420,width:180,height:18},{x:1060,y:330,width:180,height:18},{x:1280,y:420,width:180,height:18},{x:1500,y:510,width:180,height:18}],
      hazards: [{x:700,y:610,width:800,height:18}], flag:{x:1750,y:610} },
    { name: "Desierto", theme: "desert", width: 1900,
      platforms: [{x:0,y:610,width:1900,height:65},{x:220,y:510,width:200,height:18},{x:460,y:420,width:200,height:18},{x:700,y:330,width:200,height:18},{x:940,y:420,width:200,height:18},{x:1180,y:330,width:200,height:18},{x:1420,y:420,width:200,height:18}],
      hazards: [{x:860,y:610,width:72,height:18},{x:1340,y:610,width:72,height:18}], flag:{x:1810,y:610} },
    { name: "Glaciares", theme: "ice", width: 2000,
      platforms: [{x:0,y:610,width:2000,height:65},{x:200,y:510,width:180,height:18},{x:420,y:420,width:180,height:18},{x:640,y:330,width:180,height:18},{x:860,y:420,width:180,height:18},{x:1080,y:330,width:180,height:18},{x:1300,y:420,width:180,height:18},{x:1520,y:330,width:180,height:18}],
      hazards: [{x:820,y:610,width:72,height:18},{x:1240,y:610,width:72,height:18},{x:1680,y:610,width:72,height:18}], flag:{x:1900,y:610} },
    { name: "Volcan", theme: "lava", width: 2050,
      platforms: [{x:0,y:610,width:2050,height:65},{x:180,y:510,width:190,height:18},{x:410,y:420,width:190,height:18},{x:640,y:330,width:190,height:18},{x:870,y:420,width:190,height:18},{x:1100,y:330,width:190,height:18},{x:1330,y:420,width:190,height:18},{x:1560,y:330,width:190,height:18},{x:1790,y:420,width:190,height:18}],
      hazards: [{x:360,y:610,width:72,height:18},{x:820,y:610,width:72,height:18},{x:1260,y:610,width:72,height:18},{x:1710,y:610,width:72,height:18}], flag:{x:1950,y:610} },
    { name: "Ciudad neón", theme: "neon", width: 2100,
      platforms: [{x:0,y:610,width:2100,height:65},{x:200,y:510,width:210,height:18},{x:450,y:420,width:210,height:18},{x:700,y:330,width:210,height:18},{x:950,y:420,width:210,height:18},{x:1200,y:330,width:210,height:18},{x:1450,y:420,width:210,height:18},{x:1700,y:510,width:210,height:18}],
      hazards: [{x:620,y:610,width:72,height:18},{x:1120,y:610,width:72,height:18},{x:1620,y:610,width:72,height:18}], flag:{x:2000,y:610} },
    { name: "Ruinas", theme: "ruins", width: 2150,
      platforms: [{x:0,y:610,width:2150,height:65},{x:180,y:510,width:200,height:18},{x:420,y:420,width:200,height:18},{x:660,y:330,width:200,height:18},{x:900,y:420,width:200,height:18},{x:1140,y:330,width:200,height:18},{x:1380,y:420,width:200,height:18},{x:1620,y:510,width:200,height:18}],
      hazards: [{x:820,y:610,width:72,height:18},{x:1280,y:610,width:72,height:18},{x:1800,y:610,width:72,height:18}], flag:{x:2050,y:610} },
    { name: "Atardecer", theme: "sunset", width: 2200,
      platforms: [{x:0,y:610,width:2200,height:65},{x:220,y:510,width:210,height:18},{x:470,y:420,width:210,height:18},{x:720,y:330,width:210,height:18},{x:970,y:420,width:210,height:18},{x:1220,y:330,width:210,height:18},{x:1470,y:420,width:210,height:18},{x:1720,y:510,width:210,height:18}],
      hazards: [{x:650,y:610,width:72,height:18},{x:1120,y:610,width:72,height:18},{x:1680,y:610,width:72,height:18}], flag:{x:2100,y:610} },
    { name: "Montañas", theme: "snow", width: 2250,
      platforms: [{x:0,y:610,width:2250,height:65},{x:180,y:510,width:190,height:18},{x:410,y:420,width:190,height:18},{x:640,y:330,width:190,height:18},{x:870,y:420,width:190,height:18},{x:1100,y:330,width:190,height:18},{x:1330,y:420,width:190,height:18},{x:1560,y:330,width:190,height:18},{x:1790,y:420,width:190,height:18}],
      hazards: [{x:600,y:610,width:72,height:18},{x:1060,y:610,width:72,height:18},{x:1520,y:610,width:72,height:18},{x:1980,y:610,width:72,height:18}], flag:{x:2150,y:610} },
    { name: "Selva", theme: "jungle", width: 2300,
      platforms: [{x:0,y:610,width:2300,height:65},{x:180,y:510,width:200,height:18},{x:420,y:420,width:200,height:18},{x:660,y:330,width:200,height:18},{x:900,y:420,width:200,height:18},{x:1140,y:330,width:200,height:18},{x:1380,y:420,width:200,height:18},{x:1620,y:330,width:200,height:18},{x:1860,y:420,width:200,height:18}],
      hazards: [{x:760,y:610,width:72,height:18},{x:1260,y:610,width:72,height:18},{x:1760,y:610,width:72,height:18}], flag:{x:2200,y:610} },
    { name: "Cráter", theme: "volcanic", width: 2350,
      platforms: [{x:0,y:610,width:2350,height:65},{x:180,y:510,width:190,height:18},{x:410,y:420,width:190,height:18},{x:640,y:330,width:190,height:18},{x:870,y:420,width:190,height:18},{x:1100,y:330,width:190,height:18},{x:1330,y:420,width:190,height:18},{x:1560,y:330,width:190,height:18},{x:1790,y:420,width:190,height:18}],
      hazards: [{x:500,y:610,width:72,height:18},{x:980,y:610,width:72,height:18},{x:1460,y:610,width:72,height:18},{x:1930,y:610,width:72,height:18}], flag:{x:2250,y:610} },
    { name: "Océano", theme: "ocean", width: 2400,
      platforms: [{x:0,y:610,width:2400,height:65},{x:180,y:510,width:200,height:18},{x:420,y:420,width:200,height:18},{x:660,y:330,width:200,height:18},{x:900,y:420,width:200,height:18},{x:1140,y:330,width:200,height:18},{x:1380,y:420,width:200,height:18},{x:1620,y:330,width:200,height:18},{x:1860,y:420,width:200,height:18}],
      hazards: [{x:720,y:610,width:72,height:18},{x:1220,y:610,width:72,height:18},{x:1720,y:610,width:72,height:18},{x:2180,y:610,width:72,height:18}], flag:{x:2300,y:610} },
    { name: "Tormenta", theme: "storm", width: 2450,
      platforms: [{x:0,y:610,width:2450,height:65},{x:180,y:510,width:190,height:18},{x:410,y:420,width:190,height:18},{x:640,y:330,width:190,height:18},{x:870,y:420,width:190,height:18},{x:1100,y:330,width:190,height:18},{x:1330,y:420,width:190,height:18},{x:1560,y:330,width:190,height:18},{x:1790,y:420,width:190,height:18},{x:2020,y:510,width:190,height:18}],
      hazards: [{x:520,y:610,width:72,height:18},{x:1020,y:610,width:72,height:18},{x:1520,y:610,width:72,height:18},{x:2010,y:610,width:72,height:18}], flag:{x:2350,y:610} },
    { name: "Cumbre final", theme: "final", width: 2600,
      platforms: [{x:0,y:610,width:2600,height:65},{x:180,y:510,width:190,height:18},{x:410,y:420,width:190,height:18},{x:640,y:330,width:190,height:18},{x:870,y:420,width:190,height:18},{x:1100,y:330,width:190,height:18},{x:1330,y:420,width:190,height:18},{x:1560,y:330,width:190,height:18},{x:1790,y:420,width:190,height:18},{x:2020,y:330,width:190,height:18},{x:2250,y:240,width:95,height:18}],
      hazards: [{x:700,y:610,width:2000,height:18}], flag:{x:2500,y:610} }
];

for (const level of levels) {
    const clearance = 36;
    const flagLeft = level.flag.x - clearance;
    const flagRight = level.flag.x + clearance;
    const separatedPlatforms = [];

    for (const platform of level.platforms) {
        if (platform.y === level.flag.y) {
            separatedPlatforms.push(platform);
            continue;
        }

        const platformRight = platform.x + platform.width;
        if (platformRight <= flagLeft || platform.x >= flagRight) {
            separatedPlatforms.push(platform);
            continue;
        }

        if (platform.x < flagLeft) {
            separatedPlatforms.push({
                ...platform,
                width: flagLeft - platform.x
            });
        }
        if (platformRight > flagRight) {
            separatedPlatforms.push({
                ...platform,
                x: flagRight,
                width: platformRight - flagRight
            });
        }
    }

    level.platforms = separatedPlatforms;
}

let currentLevel = 0;
let gameComplete = false;
let message = "";
let messageTime = 0;

const player = {
    x: 48,
    y: 0,
    width: 34,
    height: 44,
    velocityX: 0,
    velocityY: 0,
    grounded: false,
    lives: 3,
    facing: 1,
    animationTime: 0,
    jumpBuffer: 0,
    coyoteTime: 0
};

const dustParticles = [];
let elapsedTime = 0;
let cameraX = 0;

function getPlatforms() {
    return levels[currentLevel].platforms.map((platform) => {
        if (!platform.moving) {
            return platform;
        }
        const movement = Math.sin(elapsedTime * platform.speed) * platform.range;
        return {
            ...platform,
            x: platform.moving === "x" ? platform.x + movement : platform.x,
            y: platform.moving === "y" ? platform.y + movement : platform.y
        };
    });
}

function resetPlayer() {
    player.x = 48;
    player.y = getPlatforms()[0].y - player.height;
    player.velocityX = 0;
    player.velocityY = 0;
    player.grounded = true;
    cameraX = 0;
}

resetPlayer();

window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
        event.preventDefault();
    }

    keys.add(event.code);

    if (event.code === "ArrowUp" && !event.repeat) {
        player.jumpBuffer = 0.24;
    }
});

window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
});

window.addEventListener("blur", () => {
    keys.clear();
});

function update(deltaTime) {
    if (gameComplete) {
        return;
    }

    elapsedTime += deltaTime;
    player.animationTime += deltaTime;
    player.jumpBuffer = Math.max(0, player.jumpBuffer - deltaTime);
    player.coyoteTime = player.grounded ? 0.1 : Math.max(0, player.coyoteTime - deltaTime);

    messageTime = Math.max(0, messageTime - deltaTime);
    if (messageTime === 0) {
        message = "";
    }

    player.velocityX = 0;

    if (keys.has("ArrowLeft")) {
        player.velocityX -= moveSpeed;
    }
    if (keys.has("ArrowRight")) {
        player.velocityX += moveSpeed;
    }

    if (player.velocityX !== 0) {
        player.facing = Math.sign(player.velocityX);
    }

    if (player.jumpBuffer > 0 && player.coyoteTime > 0) {
        player.velocityY = -jumpSpeed;
        player.grounded = false;
        player.coyoteTime = 0;
        player.jumpBuffer = 0;
        spawnDust(player.x + player.width / 2, player.y + player.height, 8);
    }

    const previousBottom = player.y + player.height;
    player.x += player.velocityX * deltaTime;
    player.x = Math.max(0, Math.min(levels[currentLevel].width - player.width, player.x));

    player.velocityY += gravity * deltaTime;
    player.y += player.velocityY * deltaTime;
    player.grounded = false;

    for (const platform of getPlatforms()) {
        const overlapsHorizontally =
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width;
        const crossedPlatformTop =
            previousBottom <= platform.y &&
            player.y + player.height >= platform.y;

        if (player.velocityY >= 0 && overlapsHorizontally && crossedPlatformTop) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
        }
    }

    if (player.grounded && Math.abs(player.velocityX) > 20 && Math.random() < deltaTime * 12) {
        spawnDust(player.x + player.width / 2 - player.facing * 12, player.y + player.height, 1);
    }

    updateParticles(deltaTime);

    const targetCameraX = Math.max(0, Math.min(
        levels[currentLevel].width - canvas.width,
        player.x + player.width / 2 - canvas.width / 2
    ));
    cameraX += (targetCameraX - cameraX) * Math.min(1, deltaTime * 5);

    for (const hazard of levels[currentLevel].hazards) {
        const hazardTop = hazard.y - hazard.height;
        const touchesHazard =
            player.x + player.width > hazard.x &&
            player.x < hazard.x + hazard.width &&
            player.y + player.height > hazardTop &&
            player.y < hazard.y;
        if (touchesHazard) {
            player.lives -= 1;
            if (player.lives === 0) {
                gameComplete = true;
                status.textContent = "Game over! Refresh to play again.";
                message = "Game over!";
            } else {
                message = "¡Cuidado!";
                messageTime = 0.8;
            }
            resetPlayer();
            break;
        }
    }

    if (player.y > canvas.height) {
        player.lives -= 1;
        if (player.lives === 0) {
            gameComplete = true;
            status.textContent = "Game over! Refresh to play again.";
            message = "Game over!";
        }
        resetPlayer();
    }

    const flag = levels[currentLevel].flag;
    const touchesFlag =
        player.x + player.width > flag.x - 14 &&
        player.x < flag.x + 18 &&
        player.y + player.height > flag.y - 55 &&
        player.y < flag.y;

    if (touchesFlag) {
        if (currentLevel < levels.length - 1) {
            currentLevel += 1;
            resetPlayer();
            status.textContent = `Level ${currentLevel + 1} of ${levels.length} — Reach the flag!`;
            message = `Level ${currentLevel + 1}!`;
            messageTime = 1.5;
            spawnDust(player.x + player.width / 2, player.y + player.height, 18);
        } else {
            gameComplete = true;
            status.textContent = "You completed all 15 levels! Refresh to play again.";
            message = "You win!";
        }
    }
}

function spawnDust(x, y, count) {
    for (let i = 0; i < count; i += 1) {
        dustParticles.push({
            x,
            y,
            velocityX: (Math.random() - 0.5) * 100,
            velocityY: -20 - Math.random() * 70,
            size: 3 + Math.random() * 5,
            life: 0.35 + Math.random() * 0.35
        });
    }
}

function updateParticles(deltaTime) {
    for (let i = dustParticles.length - 1; i >= 0; i -= 1) {
        const particle = dustParticles[i];
        particle.life -= deltaTime;
        particle.velocityY += 240 * deltaTime;
        particle.x += particle.velocityX * deltaTime;
        particle.y += particle.velocityY * deltaTime;
        if (particle.life <= 0) {
            dustParticles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (const particle of dustParticles) {
        context.globalAlpha = Math.max(0, particle.life * 2);
        context.fillStyle = "#f5dfaa";
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
    }
    context.globalAlpha = 1;
}

function drawCloud(x, y, scale) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.fillStyle = "rgba(255, 255, 255, 0.78)";
    context.beginPath();
    context.arc(0, 12, 18, Math.PI, 0);
    context.arc(22, 5, 24, Math.PI, 0);
    context.arc(48, 12, 18, Math.PI, 0);
    context.lineTo(48, 25);
    context.lineTo(-18, 25);
    context.closePath();
    context.fill();
    context.restore();
}

function drawPlayer() {
    const walking = player.grounded && Math.abs(player.velocityX) > 20;
    const walkPhase = walking ? Math.sin(player.animationTime * 12) : 0;
    const idleBob = player.grounded ? Math.sin(player.animationTime * 3) * 1.5 : 0;
    const squash = player.grounded ? 1 : 0.96;
    const stretch = player.grounded ? 1 : 1.04;
    const legOffset = walking ? walkPhase * 4 : 0;
    const centerX = player.x + player.width / 2;

    context.save();
    context.translate(centerX, player.y + player.height);
    context.scale(player.facing, 1);

    context.fillStyle = "#6a2d24";
    context.fillRect(-11 + legOffset, -4, 9, 6);
    context.fillRect(2 - legOffset, -4, 9, 6);

    context.translate(0, idleBob);
    context.scale(squash, stretch);
    context.fillStyle = "#d94b3d";
    context.fillRect(-17, -44, 34, 40);

    context.fillStyle = "#b72f24";
    context.fillRect(-17, -22, 34, 7);

    context.fillStyle = "#ffffff";
    context.beginPath();
    context.ellipse(7, -32, 5, 7, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#222222";
    const blink = Math.sin(player.animationTime * 1.7) > 0.985;
    if (blink) {
        context.fillRect(5, -29, 5, 1);
    } else {
        context.beginPath();
        context.arc(9, -32, 2.3, 0, Math.PI * 2);
        context.fill();
    }

    context.fillStyle = "#f4a261";
    context.beginPath();
    context.arc(-2, -44, 10, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#d94b3d";
    context.beginPath();
    context.moveTo(-12, -40);
    context.lineTo(-22, -48);
    context.lineTo(-8, -50);
    context.closePath();
    context.fill();

    context.restore();
}

function drawTheme(level) {
    const palettes = {
        meadow: ["#86d2ee", "#74b94f", "#458b42"],
        forest: ["#79a88a", "#2f6338", "#1d4026"],
        cave: ["#25243a", "#554c73", "#39344d"],
        desert: ["#efbd72", "#d89a43", "#ad7431"],
        ice: ["#bde8f4", "#d7eff4", "#81b4ca"],
        lava: ["#3d2024", "#772f25", "#a44a2c"],
        neon: ["#17152d", "#4a2e73", "#8d3dcc"],
        ruins: ["#d1ba91", "#9b8663", "#6f6047"],
        sunset: ["#ee9b64", "#ca6f58", "#7d4b63"],
        snow: ["#bcd7e8", "#edf5f7", "#7f9da9"],
        jungle: ["#70bd82", "#3e7d43", "#245230"],
        volcanic: ["#382a2c", "#65403a", "#2b2527"],
        ocean: ["#48b3d1", "#2387a8", "#17627e"],
        storm: ["#7a8399", "#4b556a", "#30384a"],
        final: ["#806fc1", "#5f4b9a", "#38295f"]
    };
    const palette = palettes[level.theme] || palettes.meadow;

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(1, level.theme === "cave" || level.theme === "lava" ? "#191820" : palette[0]);
    context.fillStyle = gradient;
    context.fillRect(-cameraX, 0, level.width + canvas.width, canvas.height);

    if (level.theme === "desert" || level.theme === "ruins" || level.theme === "sunset") {
        context.fillStyle = "rgba(255, 230, 170, 0.45)";
        context.beginPath();
        context.arc(level.width - 320 - cameraX * 0.08, 150, 70, 0, Math.PI * 2);
        context.fill();
    }

    if (level.theme === "snow" || level.theme === "ice") {
        context.fillStyle = "rgba(255,255,255,0.7)";
        for (let i = 0; i < 32; i += 1) {
            const x = (i * 137 + elapsedTime * 18) % level.width;
            const y = 40 + ((i * 71) % 430);
            context.fillRect(x - cameraX * 0.25, y, 3, 3);
        }
    }

    if (level.theme === "lava" || level.theme === "volcanic") {
        context.fillStyle = "#e95532";
        for (let i = 0; i < 20; i += 1) {
            const x = (i * 119 + elapsedTime * 28) % level.width;
            context.fillRect(x - cameraX * 0.12, 540 + Math.sin(elapsedTime * 2 + i) * 18, 3, 35);
        }
    }

}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const level = levels[currentLevel];

    drawTheme(level);

    context.save();
    context.translate(-cameraX, 0);

    const platformPalette = {
        meadow: "#458b42", forest: "#2f6338", cave: "#69617e", desert: "#ad7431",
        ice: "#9ecddd", lava: "#5d2c26", neon: "#9d54df", ruins: "#817152",
        sunset: "#73526a", snow: "#aabfc7", jungle: "#315e35", volcanic: "#4d3c3a",
        ocean: "#4f9aa8", storm: "#555d70", final: "#5b438a"
    };
    context.fillStyle = platformPalette[level.theme] || "#458b42";
    for (const platform of getPlatforms()) {
        context.fillRect(platform.x, platform.y, platform.width, platform.height);
        context.fillStyle = "rgba(255,255,255,0.16)";
        context.fillRect(platform.x, platform.y, platform.width, 4);
        context.fillStyle = platformPalette[level.theme] || "#458b42";
    }

    for (const hazard of level.hazards) {
        context.fillStyle = "#ffe066";
        for (let x = hazard.x; x < hazard.x + hazard.width; x += 18) {
            context.beginPath();
            context.moveTo(x, hazard.y);
            context.lineTo(x + 9, hazard.y - hazard.height);
            context.lineTo(x + 18, hazard.y);
            context.fill();
        }
    }

    const flag = level.flag;
    context.fillStyle = "#555555";
    context.fillRect(flag.x, flag.y - 55, 4, 55);
    context.fillStyle = "#f2c230";
    context.beginPath();
    context.moveTo(flag.x + 4, flag.y - 54);
    context.lineTo(flag.x + 34, flag.y - 43);
    context.lineTo(flag.x + 4, flag.y - 32);
    context.closePath();
    context.fill();

    drawPlayer();
    drawParticles();
    context.restore();

    context.fillStyle = "rgba(20,20,20,0.72)";
    context.fillRect(14, 12, 290, 38);
    context.fillStyle = "#ffffff";
    context.font = "bold 18px sans-serif";
    context.textAlign = "left";
    context.fillText(`${currentLevel + 1}. ${level.name}  Lives: ${player.lives}`, 28, 38);

    if (message) {
        context.fillStyle = "rgba(0, 0, 0, 0.65)";
        context.fillRect(canvas.width / 2 - 170, 175, 340, 76);
        context.fillStyle = "#ffffff";
        context.font = "bold 32px sans-serif";
        context.textAlign = "center";
        context.fillText(message, canvas.width / 2, 224);
    }
}

let previousTime = 0;

function gameLoop(time) {
    const deltaTime = Math.min((time - previousTime) / 1000, 1 / 30);
    previousTime = time;

    update(deltaTime);
    draw();
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);