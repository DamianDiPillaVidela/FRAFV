const filas = 14;
const columnas = 18;
const totalMinas = 40;

let tablero = [];
let terminado = false;
let banderas = 0;
let reveladas = 0;
let minasColocadas = false;

const grid = document.getElementById("grid");
const estado = document.getElementById("status");
const minasElement = document.getElementById("mines");
const resetButton = document.getElementById("reset");

function crearTablero() {
    grid.innerHTML = "";
    tablero = [];
    terminado = false;
    banderas = 0;
    reveladas = 0;
    minasColocadas = false;
    estado.textContent = "";
    minasElement.textContent = totalMinas;

    for (let i = 0; i < filas; i++) {
        const fila = [];
        const rowElement = document.createElement("div");
        rowElement.classList.add("row");
        for (let j = 0; j < columnas; j++) {
            const element = document.createElement("div");
            element.classList.add("cell");
            element.addEventListener("click", () => clickCelda(i, j));
            element.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                ponerBandera(i, j);
            });
            rowElement.appendChild(element);
            fila.push({ mina: false, revelada: false, bandera: false, vecinas: 0, element });
        }
        grid.appendChild(rowElement);
        tablero.push(fila);
    }
}

function colocarMinas(iExcluida, jExcluida) {
    let colocadas = 0;
    while (colocadas < totalMinas) {
        const i = Math.floor(Math.random() * filas);
        const j = Math.floor(Math.random() * columnas);
        if (!tablero[i][j].mina && !(i === iExcluida && j === jExcluida)) {
            tablero[i][j].mina = true;
            colocadas++;
        }
    }

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            let cuenta = 0;
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= 0 && ni < filas && nj >= 0 && nj < columnas && tablero[ni][nj].mina) {
                        cuenta++;
                    }
                }
            }
            tablero[i][j].vecinas = cuenta;
        }
    }

    minasColocadas = true;
}

function revelar(i, j) {
    if (i < 0 || i >= filas || j < 0 || j >= columnas) return;
    const celda = tablero[i][j];
    if (celda.revelada || celda.bandera) return;

    celda.revelada = true;
    reveladas++;
    celda.element.classList.add("revealed");

    if (celda.vecinas > 0) {
        celda.element.textContent = celda.vecinas;
        celda.element.classList.add("n" + celda.vecinas);
    } else {
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                revelar(i + di, j + dj);
            }
        }
    }
}

function ponerBandera(i, j) {
    if (terminado) return;
    const celda = tablero[i][j];
    if (celda.revelada) return;

    celda.bandera = !celda.bandera;
    celda.element.textContent = celda.bandera ? "🚩" : "";
    banderas += celda.bandera ? 1 : -1;
    minasElement.textContent = totalMinas - banderas;
}

function perder(iClick, jClick) {
    terminado = true;
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = tablero[i][j];
            if (celda.mina) {
                celda.element.textContent = "";
                celda.element.classList.add("revealed", "bomb");
            }
        }
    }
    tablero[iClick][jClick].element.classList.add("exploded");
    estado.textContent = "¡Perdiste!";
}

function ganar() {
    terminado = true;
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = tablero[i][j];
            if (celda.mina) {
                celda.element.textContent = "🚩";
            }
        }
    }
    minasElement.textContent = 0;
    estado.textContent = "¡Ganaste!";
}

function clickCelda(i, j) {
    if (terminado) return;

    const celda = tablero[i][j];
    if (celda.bandera || celda.revelada) return;

    if (!minasColocadas) {
        colocarMinas(i, j);
    }

    if (celda.mina) {
        perder(i, j);
        return;
    }

    revelar(i, j);

    if (reveladas === filas * columnas - totalMinas) {
        ganar();
    }
}

resetButton.addEventListener("click", crearTablero);

crearTablero();