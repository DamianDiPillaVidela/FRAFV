let words = [
    "cosas", "casas", "chori", "perro", "gatos", "coche", "carta", "silla", "plaza",
    "lugar", "amigo", "amiga", "libro", "lapiz", "papel", "arbol", "fruta", "cielo",
    "nubes", "soles", "lunas", "marco", "pared", "techo", "suelo", "raton", "reloj",
    "bolsa", "traje", "falda", "blusa", "gafas", "dedos", "colas", "bolso", "autos",
    "motos", "avion", "barco", "buses", "taxis", "remis", "gruas",
    "playa", "campo", "monte", "valle", "nieve", "fuego", "arena", "verde", "negro", "feliz",
    "joven", "viejo", "dulce", "noche", "tarde", "suena", "perla", "reina", "papas", "melon",
    "limon", "fresa", "mango", "danza", "baile", "ritmo", "canto", "piano", "juego", "rueda",
    "motor", "plato", "vasos", "tazas", "cajas", "bolas", "cinta", "hacha", "pasto", "hojas",
    "ramas", "trigo", "grano", "brote", "frase", "texto", "color", "forma", "medio", "datos"
];

let correctword= words[Math.floor(Math.random() * words.length)];

let grid = document.getElementById("grid");
for (let i = 0; i < 1; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 5; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        row.appendChild(cell);
    }
    grid.appendChild(row);
}


let letters=document.getElementById('letters');
const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

for (const character of alphabet) {
    const letterElement = document.createElement("span");
    letterElement.classList.add("letter");
    letterElement.textContent = character;
    letterElement.dataset.letter = character.toLowerCase();
    letters.appendChild(letterElement);
}
let guesses= [];
let times=0;
let fallos = 1;
const guy = document.getElementById("guy");
function handleSubmit(event) {
    event.preventDefault();

    const input = document.getElementById("guess");
    const guess = input.value.trim().toLowerCase();

    if (!guess || guess.length !== 1) return;

    const letterElement = [...letters.querySelectorAll(".letter")]
        .find(element => element.dataset.letter === guess);

    if (letterElement) {
        letterElement.classList.remove("correct", "incorrect");
        letterElement.classList.add(
            correctword.includes(guess) ? "correct" : "incorrect"
        );
    }
    const cells = document.querySelectorAll(".row .cell");
if (!correctword.includes(guess)) {
    fallos = Math.min(fallos + 1, 7);
    guy.style.backgroundImage = `url("./Vecino_${fallos}.png")`;

    if (fallos === 7) {
        document.getElementById("status").textContent =
            "¡Perdiste! La palabra era " + correctword;

        input.disabled = true;
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
}
for (let i = 0; i < correctword.length && i < cells.length; i++) {
    if (correctword[i] === guess) {
        cells[i].textContent = guess.toUpperCase();
        cells[i].style.backgroundColor = "green";
        cells[i].style.color = "white";
    }
}
const gano = [...correctword].every((letra, i) =>
    cells[i]?.textContent.toLowerCase() === letra
);
    if (gano) {
        document.getElementById("status").textContent =
            "¡Ganaste!";

        input.disabled = true;
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    input.value = "";
}