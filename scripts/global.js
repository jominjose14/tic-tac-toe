import { grid } from "./grid.js";
import ManagedTimeout from "./timeout.js";
import ManagedInterval from "./interval.js";
import { bot } from "./game.js";

// delays
export const toastDelay = 1500;
export const resetDelay = 1500;
export const botDelay = 1000;
export const botVsBotDelay = 1000;
export const footerButtonDelay = 500;

// audio
export const xSound = new Audio("./audio/cross.mp3");
export const oSound = new Audio("./audio/circle.mp3");
export const lineSound = new Audio("./audio/line.mp3");
export const toggleSound = new Audio("./audio/toggle.mp3");

// DOM elements
export const $xScore = document.getElementById("x-score");
export const $oScore = document.getElementById("o-score");
export const $toast = document.getElementById("toast");
export const $difficultyDialog = document.getElementById("difficulty-dialog");

// miscellaneous
export const difficulties = ["dynamic", "easy", "medium", "impossible"];

// state
export const state = {
    grid: grid,
    xBotDifficultyIdx: 0,
    oBotDifficultyIdx: 0,
    filledCount: 0,
    isGameOver: false,
    isXturn: true,
    isXbot: false,
    isObot: true,
    botTimeout: new ManagedTimeout(bot, botDelay),
    botVsBotInterval: new ManagedInterval(bot, botVsBotDelay),
    lastMove: { row: -1, col: -1 },
    secondLastMove: { row: -1, col: -1 },
};
