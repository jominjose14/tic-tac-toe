const grid = [
    [
        document.querySelector(`[data-row="0"][data-col="0"]`),
        document.querySelector(`[data-row="0"][data-col="1"]`),
        document.querySelector(`[data-row="0"][data-col="2"]`)
    ],
    [
        document.querySelector(`[data-row="1"][data-col="0"]`),
        document.querySelector(`[data-row="1"][data-col="1"]`),
        document.querySelector(`[data-row="1"][data-col="2"]`)
    ],
    [
        document.querySelector(`[data-row="2"][data-col="0"]`),
        document.querySelector(`[data-row="2"][data-col="1"]`),
        document.querySelector(`[data-row="2"][data-col="2"]`)
    ]
];

let x ,y;
let filled = 0;
let p1turn= true;

const xSound = new Audio("cross.mp3");
const oSound = new Audio("circle.mp3");
const lineSound = new Audio("line.mp3");
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
    const dialog = document.querySelector("dialog");
    dialog.removeAttribute("open");

    const slots = document.querySelectorAll(".slot");
    slots.forEach((slot) => {
        slot.textContent = '';
    }); 
    const overlay = document.querySelector("#overlay");
    overlay.style.display = "none";
    p1turn = true;
}
const checkWin = () => {
    if(grid[y][0].textContent == grid[y][1].textContent && grid[y][1].textContent == grid[y][2].textContent)
        {
            drawLine(y, 0);
            return true;
        }
    else if(grid[0][x].textContent == grid[1][x].textContent && grid[1][x].textContent == grid[2][x].textContent)
        {
            drawLine(x, 1);
            return true;
        }
    else if(x == y && grid[0][0].textContent == grid[1][1].textContent && grid[1][1].textContent == grid[2][2].textContent)
        {
            drawLine(0, 2);
            return true;
        }
    else if(x + y == 2 && grid[0][2].textContent == grid[1][1].textContent && grid[1][1].textContent == grid[2][0].textContent)
        {
            drawLine(1, 2);
            return true;
        }
    else
        return false;
}

const drawLine = (position, axis) => {
    lineSound.play();
    const line = document.querySelector("#overlay img");
    const overlay = document.querySelector("#overlay");
    switch (axis) {
        case 0:
            switch (position) {
                case 0:
                    overlay.style.display = "block";
                    line.style.transform = "translateY(-33.33%)";
                    break;

                case 1:
                    overlay.style.display = "block";
                    line.style.transform = "none";
                    break;
                
                case 2:
                    overlay.style.display = "block";
                    line.style.transform = "translateY(33.33%)";
                    break;
                
                default:
                    break;
            }
            break;
            
        case 1:
            switch (position) {
                case 0:
                    overlay.style.display = "block";
                    line.style.transform = "translateX(-33.33%) rotate(90deg)";
                    break;

                case 1:
                    overlay.style.display = "block";
                    line.style.transform = "rotate(90deg)";
                    break;
                
                case 2:
                    overlay.style.display = "block";
                    line.style.transform = "translateX(33.33%) rotate(90deg)";
                    break;
                
                default:
                    break;
            }
            break;
            
        case 2:
        switch (position) {
            case 0:
                overlay.style.display = "block";
                line.style.transform = "rotate(45deg) scaleX(1.3)";
                break;

            case 1:
                overlay.style.display = "block";
                line.style.transform = "rotate(-45deg) scaleX(1.3)";
                break;
            
            default:
                break;
        }
        break;

        default:
            break;
    }
}
const play = (row, col, event) => {
    if(event.target.textContent != "")
        return;
    x = col;
    y = row;
    if(p1turn) {
        xSound.play();
        event.target.textContent = "X";
        filled ++;
    }
    else {
        oSound.play();
        event.target.textContent = "O";
        filled ++;
    }
    const dialog = document.querySelector("dialog");
    if(checkWin()) {
        if(p1turn) {
            document.getElementById("p1Score").textContent = parseInt(document.getElementById("p1Score").textContent) + 1;
            dialog.setAttribute("open", '');
            dialog.innerText = "Player 1 scored!";
        }
        else {
            document.getElementById("p2Score").textContent = parseInt(document.getElementById("p2Score").textContent) + 1;
            dialog.setAttribute("open", '');
            dialog.innerText = "Player 2 scored!";
        }
        const timeout = setTimeout(reset, 1500);
    }
    else if(filled == 9) {
        dialog.setAttribute("open", '');
        dialog.innerText = "It's a draw!";
        const timeout = setTimeout(reset, 1500);
    }
    else 
        p1turn = !p1turn;
}

main();