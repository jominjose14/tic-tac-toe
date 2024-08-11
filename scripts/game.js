import { state, resetDelay, botDelay, botVsBotDelay, xSound, oSound, lineSound, $xScore, $oScore } from "./global.js";
import { $playGrid, at } from "./grid.js";
import { showToast, enable, disable } from "./util.js";
import treeBot from "./treeBot.js";
import ruleBot from "./ruleBot.js";

const play = ($cell) => {
    if ($cell.textContent !== "") return;

    state.secondLastMove.row = state.lastMove.row;
    state.secondLastMove.col = state.lastMove.col;
    state.lastMove.row = parseInt($cell.getAttribute("data-row"));
    state.lastMove.col = parseInt($cell.getAttribute("data-col"));

    // make the move
    if (state.isXturn) {
        xSound.play();
        $cell.textContent = "X";
    } else {
        oSound.play();
        $cell.textContent = "O";
    }
    state.filledCount++;

    // handle effect of above move on game
    if (checkWin()) {
        state.isGameOver = true;
        state.botTimeout.stop();
        state.botVsBotInterval.stop();

        if (state.isXturn) {
            $xScore.textContent = parseInt($xScore.textContent) + 1;
            showToast("Player 1 scored!");
        } else {
            $oScore.textContent = parseInt($oScore.textContent) + 1;
            showToast("Player 2 scored!");
        }

        setTimeout(reset, resetDelay);
    } else if (state.filledCount == 9) {
        state.isGameOver = true;
        state.botTimeout.stop();
        state.botVsBotInterval.stop();

        showToast("It's a draw!");
        setTimeout(reset, resetDelay);
    } else {
        state.isXturn = !state.isXturn;
    }
};

const checkWin = () => {
    const row = state.lastMove.row;
    const col = state.lastMove.col;

    if (at(row, 0) == at(row, 1) && at(row, 1) == at(row, 2)) {
        drawLine(0, row);
        return true;
    } else if (at(0, col) == at(1, col) && at(1, col) == at(2, col)) {
        drawLine(1, col);
        return true;
    } else if (row == col && at(0, 0) == at(1, 1) && at(1, 1) == at(2, 2)) {
        drawLine(2, 0);
        return true;
    } else if (row + col == 2 && at(0, 2) == at(1, 1) && at(1, 1) == at(2, 0)) {
        drawLine(2, 1);
        return true;
    }

    return false;
};

/* drawLine function parameter meanings
 * ------------------------------------
 * -- axis --
 * 0 = horizontal | 1 = vertical | 2 = diagonal
 * -- pos --
 * 0/1/2 = top/middle/bottom horizontal line for axis = 0
 * 0/1/2 = left/center/right vertical line for axis = 1
 * 0 = topLeft-to-bottomRight diagonal, 1 = topRight-to-bottomLeft diagonal for axis = 2
 */

export const drawLine = (axis, pos) => {
    lineSound.play();
    const $line = document.querySelector("#line-overlay img");
    const $overlay = document.getElementById("line-overlay");

    switch (axis) {
        case 0:
            switch (pos) {
                case 0:
                    $overlay.style.display = "block";
                    $line.style.transform = "translateY(-33.33%)";
                    break;

                case 1:
                    $overlay.style.display = "block";
                    $line.style.transform = "none";
                    break;

                case 2:
                    $overlay.style.display = "block";
                    $line.style.transform = "translateY(33.33%)";
                    break;

                default:
                    break;
            }
            break;

        case 1:
            switch (pos) {
                case 0:
                    $overlay.style.display = "block";
                    $line.style.transform = "translateX(-33.33%) rotate(90deg)";
                    break;

                case 1:
                    $overlay.style.display = "block";
                    $line.style.transform = "rotate(90deg)";
                    break;

                case 2:
                    $overlay.style.display = "block";
                    $line.style.transform = "translateX(33.33%) rotate(90deg)";
                    break;

                default:
                    break;
            }
            break;

        case 2:
            switch (pos) {
                case 0:
                    $overlay.style.display = "block";
                    $line.style.transform = "rotate(45deg) scaleX(1.3)";
                    break;

                case 1:
                    $overlay.style.display = "block";
                    $line.style.transform = "rotate(-45deg) scaleX(1.3)";
                    break;

                default:
                    break;
            }
            break;

        default:
            break;
    }
};

const reset = () => {
    state.botTimeout.stop();
    state.botVsBotInterval.stop();
    state.filledCount = 0;
    state.isXturn = true;

    const $cells = $playGrid.querySelectorAll(".cell");
    $cells.forEach(($cell) => {
        $cell.textContent = "";
    });

    const $lineOverlay = document.getElementById("line-overlay");
    $lineOverlay.style.display = "none";

    state.isGameOver = false;

    if (state.isXbot) {
        disable($playGrid);
        if (state.isObot) {
            state.botVsBotInterval.start();
        } else {
            state.botTimeout.start();
        }
    } else {
        enable($playGrid);
    }
};

// difficultyIdx=difficulty: 1=easy, 2=medium, 3=impossible
const calcDynamicDifficultyIdx = () => {
    const isXbotTurn = state.isXbot && state.isXturn;
    const scoreDiff = isXbotTurn ? parseInt($xScore.textContent) - parseInt($oScore.textContent) : parseInt($oScore.textContent) - parseInt($xScore.textContent);
    if (scoreDiff <= -3) {
        return 3; // impossible
    } else if (-2 <= scoreDiff && scoreDiff <= 1) {
        return 2; // medium
    } else if (2 <= scoreDiff) {
        return 1; // easy
    }
};

// fail-safe to stop bot from playing if it is actually a human turn
const isInvalidBotTurn = () => {
    if (state.isGameOver || (state.isXturn && !state.isXbot) || (!state.isXturn && !state.isObot)) {
        state.botTimeout.stop();
        state.botVsBotInterval.stop();
        if (!state.isGameOver) enable($playGrid);
        return true;
    }

    return false;
};

const bot = () => {
    if (isInvalidBotTurn()) return;

    disable($playGrid);

    // --- make next bot move ---
    const isXbotTurn = state.isXbot && state.isXturn;
    let difficultyIdx = isXbotTurn ? state.xBotDifficultyIdx : state.oBotDifficultyIdx;
    if (difficultyIdx == 0) difficultyIdx = calcDynamicDifficultyIdx();

    // const chosenCell = treeBot();
    const chosenCell = ruleBot(difficultyIdx);
    play(state.grid[chosenCell.row][chosenCell.col]);

    // --- initiate next bot move if a bot must make it, else ensure turn transfers to human ---
    if (state.isXbot && state.isObot) {
        // next move is of a bot, in bot vs bot mode
        state.botVsBotInterval.start();
        return; // grid remains disabled
    } else {
        state.botVsBotInterval.stop(); // not bot vs bot

        if ((state.isXbot && state.isXturn) || (state.isObot && !state.isXturn)) {
            // next move is of a bot, in bot vs human mode
            state.botTimeout.start();
            return; // grid remains disabled
        }
    }

    enable($playGrid); // next player is a human, so enable grid
};

export { play, checkWin, reset, isInvalidBotTurn, bot };
