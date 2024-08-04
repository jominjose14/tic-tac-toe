const dialog = document.querySelector("dialog");
const playGrid = document.getElementById("playGrid");

const grid = [
    [
        playGrid.querySelector('[data-row="0"][data-col="0"]'),
        playGrid.querySelector('[data-row="0"][data-col="1"]'),
        playGrid.querySelector('[data-row="0"][data-col="2"]')
    ],
    [
        playGrid.querySelector('[data-row="1"][data-col="0"]'),
        playGrid.querySelector('[data-row="1"][data-col="1"]'),
        playGrid.querySelector('[data-row="1"][data-col="2"]')
    ],
    [
        playGrid.querySelector('[data-row="2"][data-col="0"]'),
        playGrid.querySelector('[data-row="2"][data-col="1"]'),
        playGrid.querySelector('[data-row="2"][data-col="2"]')
    ]
];

let lastMoveCol, lastMoveRow, secondLastMoveCol, secondLastMoveRow;
let filledCount = 0;
let isXturn = true;
let isXbot = false, isObot = false;
let interval = undefined;

const xSound = new Audio("./audio/cross.mp3");
const oSound = new Audio("./audio/circle.mp3");
const lineSound = new Audio("./audio/line.mp3");
const toggleSound = new Audio("./audio/toggle.mp3");

const main = () => {
    const slots = playGrid.querySelectorAll(".slot");
    slots.forEach((slot) => {
        slot.addEventListener("click", () => {
            playGrid.style.pointerEvents = "none";
            play(slot);
            if(isXbot && isObot)
                interval = setInterval(bot, 1000);
            else if((isXturn && isXbot) || (!isXturn && isObot))
                setTimeout(() => {
                    bot();
                    playGrid.style.pointerEvents = "auto";
                }, 1000);
            else
                playGrid.style.pointerEvents = "auto";
        });
    });

    const leftToggle = document.querySelector(".left > .toggle");
    leftToggle.addEventListener("click", (e) => toggleLeft(e));
    const rightToggle = document.querySelector(".right > .toggle");
    rightToggle.addEventListener("click", (e) => toggleRight(e));
}

const play = (slot) => {
    if(slot.textContent != '')
        return;
    secondLastMoveCol = lastMoveCol;
    secondLastMoveRow = lastMoveRow;
    lastMoveCol = Number(slot.getAttribute("data-col"));
    lastMoveRow = Number(slot.getAttribute("data-row"));
    if(isXturn) {
        xSound.play();
        slot.textContent = "X";
        filledCount ++;
    }
    else {
        oSound.play();
        slot.textContent = "O";
        filledCount ++;
    }
    if(checkWin()) {
        clearInterval(interval);
        playGrid.style.pointerEvents = "auto";
        if(isXturn) {
            document.getElementById("p1Score").textContent = parseInt(document.getElementById("p1Score").textContent) + 1;
            dialog.setAttribute("open", '');
            dialog.innerText = "Player 1 scored!";
        }
        else {
            document.getElementById("p2Score").textContent = parseInt(document.getElementById("p2Score").textContent) + 1;
            dialog.setAttribute("open", '');
            dialog.innerText = "Player 2 scored!";
        }
        setTimeout(reset, 1500);
    }
    else if(filledCount == 9) {
        clearInterval(interval);
        playGrid.style.pointerEvents = "auto";
        dialog.setAttribute("open", '');
        dialog.innerText = "It's a draw!";
        setTimeout(reset, 1500);
    }
    else 
        isXturn = !isXturn;
}

const toggleLeft = (event) => {
    toggleSound.play();
    isXbot = !isXbot;
    if(isXbot) {
        event.target.closest(".toggle").firstElementChild.style.backgroundColor = "darkgrey";
        event.target.closest(".toggle").lastElementChild.style.backgroundColor = "white";
        if(isXturn) {
            playGrid.style.pointerEvents = "none";
            bot();
            playGrid.style.pointerEvents = "auto";
            if(isObot) {
                playGrid.style.pointerEvents = "none";
                interval = setInterval(bot, 1000);
            }
        }
    }

    else {
        playGrid.style.pointerEvents = "auto";
        event.target.closest(".toggle").firstElementChild.style.backgroundColor = "white";
        event.target.closest(".toggle").lastElementChild.style.backgroundColor = "darkgrey";
    }
}

const toggleRight = (event) => {
    toggleSound.play();
    isObot = !isObot;
    if(isObot) {
        event.target.closest(".toggle").firstElementChild.style.backgroundColor = "darkgrey";
        event.target.closest(".toggle").lastElementChild.style.backgroundColor = "white";
        if(!isXturn) {
            playGrid.style.pointerEvents = "none";
            bot();
            playGrid.style.pointerEvents = "auto";
            if(isXbot) {
                playGrid.style.pointerEvents = "none";
                interval = setInterval(bot, 1000);
            }
        }
    }

    else {
        playGrid.style.pointerEvents = "auto";
        event.target.closest(".toggle").firstElementChild.style.backgroundColor = "white";
        event.target.closest(".toggle").lastElementChild.style.backgroundColor = "darkgrey";
    }
}

const bot = () => {
    if((isXturn && !isXbot) || (!isXturn && !isObot)) {
        playGrid.style.pointerEvents = "auto";
        clearInterval(interval);
        return;
    }
    if(botBasic(secondLastMoveRow, secondLastMoveCol))
        return;
    else if(botBasic(lastMoveRow, lastMoveCol))
        return;
    while(true) {
        const random = grid[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 3)];
        if(random.textContent == '') {
            play(random);
            break;
        }
    }
}

const botBasic = (row, col) => {
    if(filledCount < 3)
        return false;
    else if(grid[row][0].textContent == grid[row][1].textContent && grid[row][2].textContent == '')
        play(grid[row][2]);
    else if(grid[row][1].textContent == grid[row][2].textContent && grid[row][0].textContent == '')
        play(grid[row][0]);
    else if(grid[row][0].textContent == grid[row][2].textContent && grid[row][1].textContent == '')
        play(grid[row][1]);
    else if(grid[0][col].textContent == grid[1][col].textContent && grid[2][col].textContent == '')
        play(grid[2][col]);
    else if(grid[1][col].textContent == grid[2][col].textContent && grid[0][col].textContent == '')
        play(grid[0][col]);
    else if(grid[0][col].textContent == grid[2][col].textContent && grid[1][col].textContent == '')
        play(grid[1][col]);
    else if(row == col && grid[0][0].textContent == grid[1][1].textContent && grid[2][2].textContent == '')
        play(grid[2][2]);
    else if(row == col && grid[1][1].textContent == grid[2][2].textContent && grid[0][0].textContent == '')
        play(grid[0][0]);
    else if(row == col && grid[0][0].textContent == grid[2][2].textContent && grid[1][1].textContent == '')
        play(grid[1][1]);
    else if(row + col == 2 && grid[0][2].textContent == grid[1][1].textContent && grid[2][0].textContent == '')
        play(grid[2][0]);
    else if(row + col == 2 && grid[1][1].textContent == grid[2][0].textContent && grid[0][2].textContent == '')
        play(grid[0][2]);
    else if(row + col == 2 && grid[0][2].textContent == grid[2][0].textContent && grid[1][1].textContent == '')
        play(grid[1][1]);
    else
        return false;
    return true;
}

const checkWin = () => {
    if(grid[lastMoveRow][0].textContent == grid[lastMoveRow][1].textContent && grid[lastMoveRow][1].textContent == grid[lastMoveRow][2].textContent)
        {
            drawLine(lastMoveRow, 0);
            return true;
        }
    else if(grid[0][lastMoveCol].textContent == grid[1][lastMoveCol].textContent && grid[1][lastMoveCol].textContent == grid[2][lastMoveCol].textContent)
        {
            drawLine(lastMoveCol, 1);
            return true;
        }
    else if(lastMoveCol == lastMoveRow && grid[0][0].textContent == grid[1][1].textContent && grid[1][1].textContent == grid[2][2].textContent)
        {
            drawLine(0, 2);
            return true;
        }
    else if(lastMoveCol + lastMoveRow == 2 && grid[0][2].textContent == grid[1][1].textContent && grid[1][1].textContent == grid[2][0].textContent)
        {
            drawLine(1, 2);
            return true;
        }
    else
        return false;
}

const reset = () => {
    filledCount = 0;
    dialog.removeAttribute("open");
    const slots = playGrid.querySelectorAll(".slot");
    slots.forEach((slot) => {
        slot.textContent = '';
    }); 
    const overlay = document.querySelector("#overlay");
    overlay.style.display = "none";
    isXturn = true;
    if(isXbot) {
        playGrid.style.pointerEvents = "none";
        if(isObot)
            interval = setInterval(bot, 1000);
        else {
            setTimeout(() => {
                bot();
                playGrid.style.pointerEvents = "auto";
            }, 1000);
        }
    }
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

main();