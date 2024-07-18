let x ,y;
let filled = 0;
let p1turn= true;

const main = () => {
    const slots = document.querySelectorAll(".slot");
    slots.forEach((slot) => {
        slot.addEventListener("click", (e) => {
            play(Number(slot.getAttribute("data-row")), Number(slot.getAttribute("data-col")), e);
        });
    });
}
const reset = () => {
    filled = 0;
    const slots = document.querySelectorAll(".slot");
    slots.forEach((slot) => {
        slot.textContent = '';
    }); 
    p1turn = true;
}
const checkWin = () => {
    if(document.querySelector(`[data-row="${y}"][data-col="0"]`).textContent == document.querySelector(`[data-row="${y}"][data-col="1"]`).textContent
    && document.querySelector(`[data-row="${y}"][data-col="1"]`).textContent == document.querySelector(`[data-row="${y}"][data-col="2"]`).textContent
    || document.querySelector(`[data-row="0"][data-col="${x}"]`).textContent == document.querySelector(`[data-row="1"][data-col="${x}"]`).textContent
    && document.querySelector(`[data-row="1"][data-col="${x}"]`).textContent == document.querySelector(`[data-row="2"][data-col="${x}"]`).textContent)
        return true;
    else if(x == y
    && document.querySelector(`[data-row="0"][data-col="0"]`).textContent == document.querySelector(`[data-row="1"][data-col="1"]`).textContent
    && document.querySelector(`[data-row="1"][data-col="1"]`).textContent == document.querySelector(`[data-row="2"][data-col="2"]`).textContent)
        return true;
    else if(x + y == 2
    && document.querySelector(`[data-row="2"][data-col="0"]`).textContent == document.querySelector(`[data-row="1"][data-col="1"]`).textContent
    && document.querySelector(`[data-row="1"][data-col="1"]`).textContent == document.querySelector(`[data-row="0"][data-col="2"]`).textContent)
        return true;
    else
        return false;
}
const play = (row, col, event) => {
    if(event.target.textContent != "")
        return;
    x = col;
    y = row;
    if(p1turn) {
        event.target.textContent = "X";
        filled ++;
    }
    else {
        event.target.textContent = "O";
        filled ++;
    }
    if(checkWin()) {
        if(p1turn) {
            document.getElementById("p1Score").textContent = parseInt(document.getElementById("p1Score").textContent) + 1;
            // win message 
        }
        else {
            document.getElementById("p2Score").textContent = parseInt(document.getElementById("p2Score").textContent) + 1;
            // win message 
        }
        reset();
    }
    else if(filled == 9) {
        // draw message
        reset();
    }
    else 
        p1turn = !p1turn;
}

main();