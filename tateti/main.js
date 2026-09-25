let moveX=Math.random() < 0.5;
let turnoDisplay = document.getElementById("turno");
turnoDisplay.textContent = "Turno de: " + (moveX ? "X" : "O");
let ganador= document.getElementById("ganador");
let board =[
    "","","",
    "","","",
    "","",""
]

function handleclick(e){
    let btn = e.target;
    let move = moveX ? "X" : "O";
    if(btn.textContent==""){
        btn.textContent= move;
        moveX= !moveX;
        turnoDisplay.textContent = "Turno de: " + (moveX ? "X" : "O");
        }
    let buttons = Array.from(document.querySelectorAll(".board button"));
    let index = buttons.indexOf(btn);
    board[index] = move;
        checkWinner();
    }


function checkWinner(){
    for(let i=0; i<3; i++){
        if(board[i*3]==board[i*3+1] && board[i*3+1]==board[i*3+2] && board[i*3]!=""){
            ganador.textContent = "Ganador: " + board[i*3];
            return;
        }
    }
    for(let i=0; i<3; i++){
        if(board[i]==board[i+3] && board[i+3]==board[i+6] && board[i]!=""){
            ganador.textContent = "Ganador: " + board[i];
            return;
        }
    }
    if(board[0]==board[4] && board[4]==board[8] && board[0]!=""){
        ganador.textContent = "Ganador: " + board[0];
        return;
    }
    if(board[2]==board[4] && board[4]==board[6] && board[2]!=""){
        ganador.textContent = "Ganador: " + board[2];
        return;
    }
}
const tablero=document.querySelector(".board");
tablero.addEventListener("click", function(e){
    if(e.target.tagName === "BUTTON"){
        handleclick(e);
    }
});