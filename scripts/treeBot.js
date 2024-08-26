import { me, you, empty, findEmptyCells, buildBoard } from "./bot.js";
import { randElement } from "./util.js";

const reward = 10;
let lastBoardMove = { row: -1, col: -1 };

const didPlayerWin = (board, player) => {
    if (lastBoardMove.row === -1) return false; // if lastBoardMove is invalid, no move out of the possible moves has been tried (start of recursion), so skip win check
    const { row, col } = lastBoardMove;
    return (board[row][0] === player && board[row][1] === player && board[row][2] === player) || (board[0][col] === player && board[1][col] === player && board[2][col] === player) || (board[0][0] === player && board[1][1] === player && board[2][2] === player) || (board[0][2] === player && board[1][1] === player && board[2][0] === player);
};

// returns max score value (score from move played on cell that leads to the best outcome for me) when player = me and min score value (score from move played on cell that leads to the best outcome for you) when player = you
const treeSearch = (board, player, depth) => {
    const cells = findEmptyCells(board);

    // early return if at a leaf node of the game tree (base case of recursion)
    if (didPlayerWin(board, me)) {
        return reward - depth;
    } else if (didPlayerWin(board, you)) {
        return depth - reward;
    } else if (cells.length === 0) {
        return 0;
    }

    let extremeScore = player === me ? -Infinity : Infinity;
    for (const cell of cells) {
        board[cell.row][cell.col] = player; // make a move on empty cell
        lastBoardMove.row = cell.row;
        lastBoardMove.col = cell.col;

        const score = treeSearch(board, player === me ? you : me, depth + 1);
        extremeScore = player === me ? Math.max(extremeScore, score) : Math.min(extremeScore, score);

        board[cell.row][cell.col] = empty; // revert move
    }

    return extremeScore;
};

const treeBot = () => {
    const board = buildBoard();
    const cells = findEmptyCells(board);
    let maxScore = -Infinity;
    let chosenCell = null;
    const depth = 0;

    // handle depth=0 treeSearch call
    for(const cell of cells) {
        board[cell.row][cell.col] = me; // make a move on empty cell
        lastBoardMove.row = cell.row;
        lastBoardMove.col = cell.col;

        cell.score = treeSearch(board, you, depth + 1);
        maxScore = Math.max(maxScore, cell.score);

        board[cell.row][cell.col] = empty; // revert move
    }

    const maxScoreCells = cells.filter((cell) => cell.score === maxScore);
    chosenCell = randElement(maxScoreCells);
    return chosenCell;
};

export default treeBot;
