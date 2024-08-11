import { toastDelay, $toast, state, toggleSound, botVsBotDelay, footerButtonDelay, difficulties, $difficultyDialog } from "./global.js";
import { $playGrid } from "./grid.js";
import { reset, bot } from "./game.js";

// --- convenience ---
export const randElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

// returns a random integer between low (inclusive) and high (inclusive)
export const randInt = (low, high) => {
    const diff = high - low;
    return low + Math.floor(Math.random() * (diff + 1));
};

export const showToast = (message) => {
    $toast.textContent = message;
    $toast.showModal();
    $toast.blur();
    setTimeout(() => $toast.close(), toastDelay);
};

export const enable = ($element) => {
    $element.style.pointerEvents = "auto";
};

export const disable = ($element) => {
    $element.style.pointerEvents = "none";
};

// --- handlers ---
export const xToggle = (event) => {
    toggleSound.play();
    state.isXbot = !state.isXbot;

    if (state.isXbot) {
        const $humanOption = event.target.closest(".toggle").firstElementChild;
        $humanOption.style.backgroundColor = "var(--toggle-option-unselected)";
        const $botOption = event.target.closest(".toggle").lastElementChild;
        $botOption.style.backgroundColor = "var(--toggle-option-selected)";

        if (state.isObot) {
            state.botVsBotInterval.start();
        } else if (state.isXturn) {
            state.botTimeout.start();
        }
    } else {
        const $humanOption = event.target.closest(".toggle").firstElementChild;
        $humanOption.style.backgroundColor = "var(--toggle-option-selected)";
        const $botOption = event.target.closest(".toggle").lastElementChild;
        $botOption.style.backgroundColor = "var(--toggle-option-unselected)";
    }
};

export const oToggle = (event) => {
    toggleSound.play();
    state.isObot = !state.isObot;

    if (state.isObot) {
        const $humanOption = event.target.closest(".toggle").firstElementChild;
        $humanOption.style.backgroundColor = "var(--toggle-option-unselected)";
        const $botOption = event.target.closest(".toggle").lastElementChild;
        $botOption.style.backgroundColor = "var(--toggle-option-selected)";

        if (state.isXbot) {
            state.botVsBotInterval.start();
        } else if (!state.isXturn) {
            state.botTimeout.start();
        }
    } else {
        const $humanOption = event.target.closest(".toggle").firstElementChild;
        $humanOption.style.backgroundColor = "var(--toggle-option-selected)";
        const $botOption = event.target.closest(".toggle").lastElementChild;
        $botOption.style.backgroundColor = "var(--toggle-option-unselected)";
    }
};

export const changeDifficulty = (event) => {
    toggleSound.play();
    $difficultyDialog.showModal();
};

export const doReset = () => {
    toggleSound.play();
    if (state.isXbot && state.isObot) state.botVsBotInterval.stop();
    reset();
};

export const toggleTheme = (event) => {
    toggleSound.play();
    event.target.innerHTML = document.body.classList.contains("dark-mode") ? "&nbsp;Light" : "&nbsp;&nbsp;Dark"; // added &nbsp; as padding to ensure word width is consistent between (Theme, Light, Dark) no matter the button text at any given time
    document.body.classList.toggle("dark-mode");
    setTimeout(() => (event.target.textContent = "Theme"), footerButtonDelay);
};
