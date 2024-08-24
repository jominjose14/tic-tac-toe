import { toastDelay, $toast, state, toggleSound, footerButtonDelay, $difficultyDialog } from "./global.js";
import { reset } from "./game.js";

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

export const createMarkMask = ($cell) => {
    // create svg element using template
    const prefix = state.isXturn ? 'x' : 'o';
    const $svgTemplate = document.getElementById(`${prefix}-svg-template`);
    const $svgFragment = $svgTemplate.content.cloneNode(true);
    const $svg = $svgFragment.querySelector(`.${prefix}-svg`);

    // append svg into $cell
    $cell.appendChild($svg);

    // create unique reveal mask id
    const uniqueRevealMaskId = `${prefix}-reveal-mask-${state.svgMaskIdCounter}`;

    // set id on mask element
    const $revealMask = $svg.getElementById(`${prefix}-reveal-mask`);
    $revealMask.id = uniqueRevealMaskId;

    // set reference to id on rect
    $svg.innerHTML = $svg.innerHTML.replace(`url(#${prefix}-reveal-mask)`, `url(#${uniqueRevealMaskId})`);

    // increment counter
    state.svgMaskIdCounter = (state.svgMaskIdCounter + 1) % 9; // at a time, there can only be a max of 9 SVGs on web page

    // set animation
    if(state.isXturn) {
        const $xSvgLine1 = $svg.querySelector(".x-svg-line-1");
        $xSvgLine1.style.animation = "draw 0.3s ease-in-out forwards";
        const $xSvgLine2 = $svg.querySelector(".x-svg-line-2");
        $xSvgLine2.style.animation = "draw 0.3s ease-in-out 0.3s forwards";

        $xSvgLine2.onanimationend = () => $svg.remove();
    } else {
        const $oSvgPath = $svg.querySelector(".o-svg-path");
        $oSvgPath.style.animation = "draw 1s ease-in-out forwards";

        $oSvgPath.onanimationend = () => $svg.remove();
    }
}

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

export const changeDifficulty = () => {
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
