const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const estado = document.getElementById("status");
const resetButton = document.getElementById("reset");

const celda = 20;
const celdas = canvas.width / celda;

let serpiente;
let direccion;
let siguiente;
let comida;
let terminado;
let intervalo;
let toqueInicio = null;

function colocarComida() {
    const libres = [];
    for (let x = 0; x < celdas; x++) {
        for (let y = 0; y < celdas; y++) {
            if (!serpiente.some(parte => parte.x === x && parte.y === y)) {
                libres.push({ x, y });
            }
        }
    }

    if (libres.length === 0) return false;

    comida = libres[Math.floor(Math.random() * libres.length)];
    return true;
}

function iniciar() {
    clearInterval(intervalo);

    const medio = Math.floor(celdas / 2);

    serpiente = [
        { x: medio, y: medio },
        { x: medio - 1, y: medio },
        { x: medio - 2, y: medio }
    ];

    direccion = null;
    siguiente = null;
    terminado = false;

    estado.textContent = "";

    colocarComida();
    dibujar();

    intervalo = setInterval(paso, 110);
}

function paso() {
    if (terminado || !siguiente) return;

    direccion = siguiente;

    const cabeza = {
        x: serpiente[0].x + direccion.x,
        y: serpiente[0].y + direccion.y
    };

    const choqueParedes =
        cabeza.x < 0 ||
        cabeza.x >= celdas ||
        cabeza.y < 0 ||
        cabeza.y >= celdas;

    const choqueCuerpo = serpiente.some(
        parte => parte.x === cabeza.x && parte.y === cabeza.y
    );

    if (choqueParedes || choqueCuerpo) {
        terminado = true;
        estado.textContent = "¡Perdiste!";
        dibujar();
        return;
    }

    serpiente.unshift(cabeza);

    if (cabeza.x === comida.x && cabeza.y === comida.y) {
        if (!colocarComida()) {
            terminado = true;
            estado.textContent = "¡Ganaste!";
        }
    } else {
        serpiente.pop();
    }

    dibujar();
}

function dibujar() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (comida) {
        ctx.fillStyle = "red";
        ctx.fillRect(
            comida.x * celda + 2,
            comida.y * celda + 2,
            celda - 4,
            celda - 4
        );
    }

    serpiente.forEach((parte, indice) => {
        ctx.fillStyle = indice === 0 ? "rgb(72, 123, 73)" : "green";

        ctx.fillRect(
            parte.x * celda + 1,
            parte.y * celda + 1,
            celda - 2,
            celda - 2
        );

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        ctx.strokeRect(
            parte.x * celda + 1,
            parte.y * celda + 1,
            celda - 2,
            celda - 2
        );

        if (indice === 0) {
            dibujarCara(parte);
        }
    });
}

function dibujarCara(cabeza) {
    let ojo1 = {};
    let ojo2 = {};

    const x = cabeza.x * celda;
    const y = cabeza.y * celda;

    if (!direccion) {
        ojo1 = { x: x + 14, y: y + 6 };
        ojo2 = { x: x + 14, y: y + 14 };
    } else if (direccion.x === 1) {
        ojo1 = { x: x + 14, y: y + 6 };
        ojo2 = { x: x + 14, y: y + 14 };
    } else if (direccion.x === -1) {
        ojo1 = { x: x + 6, y: y + 6 };
        ojo2 = { x: x + 6, y: y + 14 };
    } else if (direccion.y === -1) {
        ojo1 = { x: x + 6, y: y + 6 };
        ojo2 = { x: x + 14, y: y + 6 };
    } else if (direccion.y === 1) {
        ojo1 = { x: x + 6, y: y + 14 };
        ojo2 = { x: x + 14, y: y + 14 };
    }

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(ojo1.x, ojo1.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ojo2.x, ojo2.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(ojo1.x, ojo1.y, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ojo2.x, ojo2.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
}

function cambiarDireccion(nueva) {
    if (terminado) return;

    const actual = siguiente || direccion || { x: 0, y: 0 };

    if (!direccion && nueva.x === -1) return;

    if (
        nueva.x === -actual.x &&
        nueva.y === -actual.y &&
        (actual.x !== 0 || actual.y !== 0)
    ) {
        return;
    }

    siguiente = nueva;
}

document.addEventListener("keydown", (event) => {
    const tecla = event.key.toLowerCase();

    if (tecla === "arrowup" || tecla === "w") {
        cambiarDireccion({ x: 0, y: -1 });
        event.preventDefault();
    } else if (tecla === "arrowdown" || tecla === "s") {
        cambiarDireccion({ x: 0, y: 1 });
        event.preventDefault();
    } else if (tecla === "arrowleft" || tecla === "a") {
        cambiarDireccion({ x: -1, y: 0 });
        event.preventDefault();
    } else if (tecla === "arrowright" || tecla === "d") {
        cambiarDireccion({ x: 1, y: 0 });
        event.preventDefault();
    }
});

canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();

    toqueInicio = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
}, { passive: false });

canvas.addEventListener("touchend", (event) => {
    event.preventDefault();

    if (!toqueInicio) return;

    const dx = event.changedTouches[0].clientX - toqueInicio.x;
    const dy = event.changedTouches[0].clientY - toqueInicio.y;

    toqueInicio = null;

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    if (Math.abs(dx) > Math.abs(dy)) {
        cambiarDireccion({
            x: dx > 0 ? 1 : -1,
            y: 0
        });
    } else {
        cambiarDireccion({
            x: 0,
            y: dy > 0 ? 1 : -1
        });
    }
}, { passive: false });

resetButton.addEventListener("click", iniciar);

iniciar();