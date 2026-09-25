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
for (let i = 0; i < 6; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 5; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        row.appendChild(cell);
    }
    grid.appendChild(row);
}

let guesses= [];
let times=0;

function handleSubmit(event) {
    event.preventDefault();
    let guess = event.target.guess.value;
    if(guess.length !== 5 || !words.includes(guess)) {
        event.target.reset();
        return;
    }
    guesses.push(guess);
    times++;
    updateGrid();
    if (guess === correctword) {
        alert("You win!");
        location.reload();
        return;
    }
    if (times >= 6) {
        alert("Game Over! la palabra era: " + correctword);
        location.reload();
    }
    event.target.reset();
}

function updateGrid() {
    let row = document.querySelectorAll(".row")[times - 1];
    let guess = guesses[times - 1].split("");

    let remaining = {};
    for (let i = 0; i < correctword.length; i++) {
        let letter = correctword[i];
        remaining[letter] = (remaining[letter] || 0) + 1;
    }

    for (let j = 0; j < 5; j++) {
        row.children[j].textContent = guess[j];
        row.children[j].style.backgroundColor = "gray";
        row.children[j].style.color = "white";

        if (guess[j] === correctword[j]) {
            row.children[j].style.backgroundColor = "green";
            remaining[guess[j]] -= 1;
        }
    }

    for (let j = 0; j < 5; j++) {
        if (guess[j] !== correctword[j] && remaining[guess[j]] > 0) {
            row.children[j].style.backgroundColor = "yellow";
            remaining[guess[j]] -= 1;
        }
    }
}