let tortas = document.querySelector('.tortas');
let i=0;
let mateos=0;
let horse=0;
let coste_mateo=10;
let coste_horse=50;
let show_coste_mateo=document.querySelector('.coste_mateo');
let cant_mateo=document.querySelector('.cant_mateo'); 
let cant_horse=document.querySelector('.cant_horse');
let show_coste_horse=document.querySelector('.coste_horse');
function handleClick(event) {
    i++;
    screenupdate();
}
function handleMakerClick(event) {
    if(i >= coste_mateo) {
        mateos++;
        i-=coste_mateo;
        coste_mateo*=1.2;
    }
    screenupdate();
}
function handlehorseClick(event) {
    if(i >= coste_horse) {
        horse++;
        i-=coste_horse;
        coste_horse*=1.2;
    }
    screenupdate();
}
setInterval(() => {
    if (true) {
        i = i + mateos - horse*2;
        screenupdate();
    }
}, 1000);

function screenupdate() {
    tortas.textContent = 'TORTAS: ' + Math.floor(i);
    show_coste_mateo.textContent = 'coste: ' + Math.floor(coste_mateo) + ' tortas';
    cant_mateo.textContent = 'cantidad: ' + Math.floor(mateos);
    show_coste_horse.textContent = 'coste: ' + Math.floor(coste_horse) + ' tortas';
    cant_horse.textContent = 'cantidad: ' + Math.floor(horse);
}