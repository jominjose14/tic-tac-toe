import { state, toggleSound, $difficultyDialog, difficulties } from "./global.js";
import {$playGrid, isCellEmpty} from "./grid.js";
import { disable, enable, xToggle, oToggle, changeDifficulty, doReset, toggleTheme } from "./util.js";
import { play } from "./game.js";

const main = () => {
    initTheme();
    initDifficultyDialog();
    attachCellListeners();
    attachHumanBotToggleListeners();
    attachFooterButtonListeners();
};

const initTheme = () => {
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (systemSettingDark.matches) {
        document.body.classList.add("dark-mode");
    }
};

const initDifficultyDialog = () => {
    // attach close button listener
    const $closeButton = $difficultyDialog.querySelector(".close");
    $closeButton.onclick = () => $difficultyDialog.close();

    // populate difficulty options
    const $difficultyOptionsLists = $difficultyDialog.querySelectorAll(".difficulty-options");
    $difficultyOptionsLists.forEach(($difficultyOptionsList) => {
        for (let i = 0; i < difficulties.length; i++) {
            const difficulty = difficulties[i];
            const $difficultyOption = document.createElement("div");
            $difficultyOption.classList.add("difficulty-option");
            $difficultyOption.setAttribute("data-difficulty-idx", i);
            $difficultyOption.textContent = difficulty;

            $difficultyOption.onclick = () => {
                toggleSound.play();

                if ($difficultyOptionsList.classList.contains("x-bot")) {
                    // update UI
                    const $oldSelectedOption = $difficultyOptionsList.querySelector(`.difficulty-option:nth-of-type(${1 + state.xBotDifficultyIdx})`);
                    $oldSelectedOption.classList.remove("selected");
                    $difficultyOption.classList.add("selected");

                    // update state
                    state.xBotDifficultyIdx = parseInt($difficultyOption.getAttribute("data-difficulty-idx"));
                } else {
                    // update UI
                    const $oldSelectedOption = $difficultyOptionsList.querySelector(`.difficulty-option:nth-of-type(${1 + state.oBotDifficultyIdx})`);
                    $oldSelectedOption.classList.remove("selected");
                    $difficultyOption.classList.add("selected");

                    // update state
                    state.oBotDifficultyIdx = parseInt($difficultyOption.getAttribute("data-difficulty-idx"));
                }
            };

            // highlight option on dialog open if it is the currently selected option
            if ($difficultyOptionsList.classList.contains("x-bot") && state.xBotDifficultyIdx === i) {
                $difficultyOption.classList.add("selected");
            }
            if ($difficultyOptionsList.classList.contains("o-bot") && state.oBotDifficultyIdx === i) {
                $difficultyOption.classList.add("selected");
            }

            $difficultyOptionsList.appendChild($difficultyOption);
        }
    });
};

const attachCellListeners = () => {
    const $cells = $playGrid.querySelectorAll(".cell");
    $cells.forEach(($cell) => {
        $cell.addEventListener("click", () => {
            disable($playGrid);
            $cell.style.backgroundColor = "var(--cell-bg-color)";
            play($cell);

            if ((state.isXturn && state.isXbot) || (!state.isXturn && state.isObot)) {
                // next player is a bot
                state.botTimeout.start();
            } else {
                // next player is a human
                enable($playGrid);
            }
        });

        $cell.addEventListener("mouseenter", () => {
            if (!isCellEmpty($cell)) return;
            $cell.style.backgroundColor = "var(--cell-hover-bg-color)";
        });

        $cell.addEventListener("mouseleave", () => {
            $cell.style.backgroundColor = "var(--cell-bg-color)";
        });

        $cell.addEventListener("touchend", () => {
            $cell.style.backgroundColor = "var(--cell-bg-color)";
        });
    });
};

const attachHumanBotToggleListeners = () => {
    const $xToggle = document.querySelector(".left > .toggle");
    $xToggle.addEventListener("click", (e) => xToggle(e));
    const $oToggle = document.querySelector(".right > .toggle");
    $oToggle.addEventListener("click", (e) => oToggle(e));
};

const attachFooterButtonListeners = () => {
    const $difficultyBtn = document.getElementById("difficulty-btn");
    $difficultyBtn.onclick = changeDifficulty;
    const $resetBtn = document.getElementById("reset-btn");
    $resetBtn.onclick = doReset;
    const $themeBtn = document.getElementById("theme-btn");
    $themeBtn.onclick = toggleTheme;
};

main();
