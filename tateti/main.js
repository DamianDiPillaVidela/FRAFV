let moveX=true;
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
    }
}
const tablero=document.querySelector(".board");
tablero.addEventListener("click", function(e){
    if(e.target.tagName === "BUTTON"){
        handleclick(e);
    }
});