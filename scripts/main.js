import { state, botDelay, botVsBotDelay } from "./global.js";
import { $playGrid } from "./grid.js";
import { disable, enable, xToggle, oToggle, toggleDifficulty, doReset, toggleTheme } from "./util.js";
import { play, bot } from "./game.js";

const main = () => {
    // theme
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (systemSettingDark.matches) {
        document.body.classList.add("dark-mode");
    }

    // cell listeners
    const $cells = $playGrid.querySelectorAll(".cell");
    $cells.forEach(($cell) => {
        $cell.addEventListener("click", () => {
            disable($playGrid);
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
            if ($cell.textContent !== "") return;
            $cell.style.backgroundColor = "var(--cell-hover-bg-color)";
        });

        $cell.addEventListener("mouseleave", () => {
            $cell.style.backgroundColor = "var(--cell-bg-color)";
        });
    });

    // human/bot toggle listeners
    const $xToggle = document.querySelector(".left > .toggle");
    $xToggle.addEventListener("click", (e) => xToggle(e));
    const $oToggle = document.querySelector(".right > .toggle");
    $oToggle.addEventListener("click", (e) => oToggle(e));

    // footer button listeners
    const $difficultyBtn = document.getElementById("difficulty-btn");
    $difficultyBtn.onclick = toggleDifficulty;
    const $resetBtn = document.getElementById("reset-btn");
    $resetBtn.onclick = doReset;
    const $themeBtn = document.getElementById("theme-btn");
    $themeBtn.onclick = toggleTheme;
};

main();
