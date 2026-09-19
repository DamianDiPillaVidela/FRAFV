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
    }
}