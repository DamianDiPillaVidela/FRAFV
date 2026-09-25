let show_billetes = document.querySelector('.billetes');
let billetes=0;
let printers=0;
let banks=0;
let coste_printers=20;
let coste_banks=100;
let show_coste_printers=document.querySelector('.coste_printer');
let cant_printers=document.querySelector('.cant_printer'); 
let cant_banks=document.querySelector('.cant_bank');
let show_coste_banks=document.querySelector('.coste_bank');
function handleClick(event) {
    billetes+=5;
    checkBilletesLimit();
}
function handlePrinterClick(event) {
    if(billetes >= coste_printers) {
        printers++;
        billetes-=coste_printers;
        coste_printers*=2;
    }
    screenupdate();
}
function handleBankClick(event) {
    if(billetes >= coste_banks) {
        banks++;
        billetes-=coste_banks;
        coste_banks*=3;
    }
    screenupdate();
}
setInterval(() => {
    billetes = billetes + printers*50 + banks*100;
    checkBilletesLimit();
}, 1000);

function checkBilletesLimit() {
    if (billetes >= 1000000) {
        alert("Has alcanzado un millon de billetes. El juego se reiniciará.");
        billetes = 0;
        screenupdate();
        window.location.reload();
        return;
    }
    screenupdate();
}

function screenupdate() {
    show_billetes.textContent = 'BILLETES: ' + Math.floor(billetes);
    show_coste_printers.textContent = 'coste: ' + Math.floor(coste_printers) + ' billetes';
    cant_printers.textContent = 'cantidad: ' + Math.floor(printers);
    show_coste_banks.textContent = 'coste: ' + Math.floor(coste_banks) + ' billetes';
    cant_banks.textContent = 'cantidad: ' + Math.floor(banks);
}

screenupdate();