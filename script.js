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

let x = null ,y = null;
let filled = 0;
let p1turn = true;
let xBot = false, oBot = false;
let interval = undefined;

const xSound = new Audio("./audio/cross.mp3");
const oSound = new Audio("./audio/circle.mp3");
const lineSound = new Audio("./audio/line.mp3");
const toggleSound = new Audio("./audio/toggle.mp3");

const main = () => {
    const slots = playGrid.querySelectorAll(".slot");
    slots.forEach((slot) => {
        slot.addEventListener("click", () => {
            play(slot);
            playGrid.style.pointerEvents = "none";
            if(xBot && oBot)
                interval = setInterval(bot, 1000);
            else if((p1turn && xBot) || (!p1turn && oBot)) {
                setTimeout(bot, 1000);
                playGrid.style.pointerEvents = "auto";
            }
            else
                playGrid.style.pointerEvents = "auto";
        });
    });

    const leftToggle = document.querySelector(".left > .toggle");
    leftToggle.addEventListener("click", (e) => toggleLeft(e));
    const rightToggle = document.querySelector(".right > .toggle");
    rightToggle.addEventListener("click", (e) => toggleRight(e));
}

const toggleLeft = (event) => {
    toggleSound.play();
    xBot = !xBot;
    if(xBot) {
        event.target.closest(".toggle").firstElementChild.style.backgroundColor = "darkgrey";
        event.target.closest(".toggle").lastElementChild.style.backgroundColor = "white";
        if(p1turn) {
            playGrid.style.pointerEvents = "none";
            bot();
            playGrid.style.pointerEvents = "auto";
            if(oBot) {
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
    oBot = !oBot;
    if(oBot) {
        event.target.closest(".toggle").firstElementChild.style.backgroundColor = "darkgrey";
        event.target.closest(".toggle").lastElementChild.style.backgroundColor = "white";
        if(!p1turn) {
            playGrid.style.pointerEvents = "none";
            bot();
            playGrid.style.pointerEvents = "auto";
            if(xBot) {
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
    if((p1turn && !xBot) || (!p1turn && !oBot)) {
        playGrid.style.pointerEvents = "auto";
        clearInterval(interval);
        return;
    }
    do {
        const slot = playGrid.querySelector(`[data-row="${Math.floor(Math.random() * 3)}"][data-col="${Math.floor(Math.random() * 3)}"]`);
        if(slot.innerText == '') {
            play(slot);
            break;
        }
    }while(true);
}

const reset = () => {
    filled = 0;
    dialog.removeAttribute("open");
    const slots = playGrid.querySelectorAll(".slot");
    slots.forEach((slot) => {
        slot.textContent = '';
    }); 
    const overlay = document.querySelector("#overlay");
    overlay.style.display = "none";
    p1turn = true;
    if(xBot) {
        playGrid.style.pointerEvents = "none";
        if(oBot)
            interval = setInterval(bot, 1000);
        else {
            setTimeout(bot, 1000);
            playGrid.style.pointerEvents = "auto";
        }
    }
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

const play = (slot) => {
    if(slot.textContent != '')
        return;
    x = Number(slot.getAttribute("data-col"));
    y = Number(slot.getAttribute("data-row"));
    if(p1turn) {
        xSound.play();
        slot.textContent = "X";
        filled ++;
    }
    else {
        oSound.play();
        slot.textContent = "O";
        filled ++;
    }
    if(checkWin()) {
        clearInterval(interval);
        playGrid.style.pointerEvents = "auto";
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
        setTimeout(reset, 1500);
    }
    else if(filled == 9) {
        clearInterval(interval);
        playGrid.style.pointerEvents = "auto";
        dialog.setAttribute("open", '');
        dialog.innerText = "It's a draw!";
        setTimeout(reset, 1500);
    }
    else 
        p1turn = !p1turn;
}

main();