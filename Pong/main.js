const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const estado = document.getElementById("status");
const jugadorElement = document.getElementById("player-score");
const computadoraElement = document.getElementById("computer-score");
const resetButton = document.getElementById("reset");

const ancho = canvas.width;
const alto = canvas.height;
const palaAncho = 12;
const palaAlto = 80;
const bolaTam = 12;
const puntosParaGanar = 5;

let jugadorY;
let computadoraY;
let bolaX;
let bolaY;
let velX;
let velY;
let puntosJugador;
let puntosComputadora;
let terminado;
let teclaArriba = false;
let teclaAbajo = false;

function reiniciarBola(direccion) {
    bolaX = ancho / 2 - bolaTam / 2;
    bolaY = alto / 2 - bolaTam / 2;
    velX = 5 * direccion;
    velY = Math.random() * 6 - 3;
}

function iniciar() {
    jugadorY = alto / 2 - palaAlto / 2;
    computadoraY = alto / 2 - palaAlto / 2;
    puntosJugador = 0;
    puntosComputadora = 0;
    terminado = false;
    estado.textContent = "";
    jugadorElement.textContent = 0;
    computadoraElement.textContent = 0;
    reiniciarBola(Math.random() < 0.5 ? 1 : -1);
}

function limitar(valor) {
    return Math.max(0, Math.min(alto - palaAlto, valor));
}

function actualizar() {
    if (terminado) return;

    if (teclaArriba) jugadorY -= 7;
    if (teclaAbajo) jugadorY += 7;
    jugadorY = limitar(jugadorY);

    const centro = computadoraY + palaAlto / 2;
    const centroBola = bolaY + bolaTam / 2;
    if (centroBola > centro + 10) computadoraY += 4;
    else if (centroBola < centro - 10) computadoraY -= 4;
    computadoraY = limitar(computadoraY);

    bolaX += velX;
    bolaY += velY;

    if (bolaY <= 0) {
        bolaY = 0;
        velY = -velY;
    }
    if (bolaY + bolaTam >= alto) {
        bolaY = alto - bolaTam;
        velY = -velY;
    }

    const jugadorX = 20;
    const computadoraX = ancho - 20 - palaAncho;

    if (
        velX < 0 &&
        bolaX <= jugadorX + palaAncho &&
        bolaX + bolaTam >= jugadorX &&
        bolaY + bolaTam >= jugadorY &&
        bolaY <= jugadorY + palaAlto
    ) {
        bolaX = jugadorX + palaAncho;
        velX = Math.min(-velX * 1.05, 10);
        const relativo = (bolaY + bolaTam / 2 - (jugadorY + palaAlto / 2)) / (palaAlto / 2);
        velY = relativo * 5;
    }

    if (
        velX > 0 &&
        bolaX + bolaTam >= computadoraX &&
        bolaX <= computadoraX + palaAncho &&
        bolaY + bolaTam >= computadoraY &&
        bolaY <= computadoraY + palaAlto
    ) {
        bolaX = computadoraX - bolaTam;
        velX = -Math.min(velX * 1.05, 10);
        const relativo = (bolaY + bolaTam / 2 - (computadoraY + palaAlto / 2)) / (palaAlto / 2);
        velY = relativo * 5;
    }

    if (bolaX + bolaTam < 0) {
        puntosComputadora++;
        computadoraElement.textContent = puntosComputadora;
        reiniciarBola(-1);
    } else if (bolaX > ancho) {
        puntosJugador++;
        jugadorElement.textContent = puntosJugador;
        reiniciarBola(1);
    }

    if (puntosJugador >= puntosParaGanar) {
        terminado = true;
        estado.textContent = "¡Ganaste!";
    } else if (puntosComputadora >= puntosParaGanar) {
        terminado = true;
        estado.textContent = "¡Perdiste!";
    }
}

function dibujar() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ancho, alto);

    ctx.strokeStyle = "#c8c8c8";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(ancho / 2, 0);
    ctx.lineTo(ancho / 2, alto);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "black";
    ctx.fillRect(20, jugadorY, palaAncho, palaAlto);
    ctx.fillRect(ancho - 20 - palaAncho, computadoraY, palaAncho, palaAlto);

    ctx.fillStyle = "rgb(72, 123, 73)";
    ctx.fillRect(bolaX, bolaY, bolaTam, bolaTam);
}

function bucle() {
    actualizar();
    dibujar();
    requestAnimationFrame(bucle);
}

function moverConPuntero(clientY) {
    const rect = canvas.getBoundingClientRect();
    const y = (clientY - rect.top) * (alto / rect.height);
    jugadorY = limitar(y - palaAlto / 2);
}

canvas.addEventListener("mousemove", (event) => moverConPuntero(event.clientY));

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    moverConPuntero(event.touches[0].clientY);
}, { passive: false });

document.addEventListener("keydown", (event) => {
    const tecla = event.key.toLowerCase();
    if (tecla === "arrowup" || tecla === "w") {
        teclaArriba = true;
        event.preventDefault();
    }
    if (tecla === "arrowdown" || tecla === "s") {
        teclaAbajo = true;
        event.preventDefault();
    }
});

document.addEventListener("keyup", (event) => {
    const tecla = event.key.toLowerCase();
    if (tecla === "arrowup" || tecla === "w") teclaArriba = false;
    if (tecla === "arrowdown" || tecla === "s") teclaAbajo = false;
});

resetButton.addEventListener("click", iniciar);

iniciar();
bucle();