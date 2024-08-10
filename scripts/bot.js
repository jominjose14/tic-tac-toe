import { state } from "./global.js";
import { at } from "./grid.js";

export const me = +1; // board placeholder for mark of player from first perspective (self)
export const you = -1; // board placeholder for mark of player from second perspective (opponent)
export const empty = 0; // board placeholder for empty cell

// meaning of 'board':
// A relative representation of current state of the playgrid. It is a 2D Number array where +1 = self's mark, -1 = opponent's mark, 0 = empty cell
export const buildBoard = () => {
    const myMark = state.isXturn ? "X" : "O"; // self's mark
    const yourMark = state.isXturn ? "O" : "X"; // opponent's mark

    const board = [
        [empty, empty, empty],
        [empty, empty, empty],
        [empty, empty, empty],
    ];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (at(i, j) === myMark) board[i][j] = me;
            if (at(i, j) === yourMark) board[i][j] = you;
        }
    }

    return board;
};

export const findEmptyCells = (board) => {
    const emptyCells = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === empty) emptyCells.push({ row: i, col: j });
        }
    }

    return emptyCells;
};
