import { me, you, empty, findEmptyCells, buildBoard } from "./bot.js";
import { randElement } from "./util.js";

let lastBoardMove = { row: -1, col: -1 };

const didPlayerWin = (board, player) => {
    if (lastBoardMove.row == -1) return false; // if lastBoardMove is invalid, no move out of the possible moves has been tried (start of recursion), so skip win check
    const { row, col } = lastBoardMove;
    return (board[row][0] == player && board[row][1] == player && board[row][2] == player) || (board[0][col] == player && board[1][col] == player && board[2][col] == player) || (board[0][0] == player && board[1][1] == player && board[2][2] == player) || (board[0][2] == player && board[1][1] == player && board[2][0] == player);
};

// returns an object of shape { cell: {row,col}, score } for non-leaf nodes and an object of shape { score } for leaf nodes (when next move leads to gameover) of the game tree
const treeSearch = (board, player) => {
    const cells = findEmptyCells(board);

    // early return if at a leaf node of the game tree (base case of recursion)
    if (didPlayerWin(board, me)) {
        return { score: +10 };
    } else if (didPlayerWin(board, you)) {
        return { score: -10 };
    } else if (cells.length === 0) {
        return { score: 0 };
    }

    for (let i = 0; i < cells.length; i++) {
        board[cells[i].row][cells[i].col] = player; // make a move on empty cell
        lastBoardMove.row = cells[i].row;
        lastBoardMove.col = cells[i].col;

        const result = treeSearch(board, player === me ? you : me); // find chosen cell (cell with max score for me, cell with min score for you)
        cells[i].score = result.score;

        board[cells[i].row][cells[i].col] = empty; // revert move
    }

    let chosenCell = cells[0];

    if (player === me) {
        let maxScore = cells[0].score;
        for (const cell of cells) maxScore = Math.max(maxScore, cell.score);
        const maxScoreCells = cells.filter((cell) => cell.score === maxScore);
        chosenCell = randElement(maxScoreCells);
    } else if (player === you) {
        let minScore = cells[0].score;
        for (const cell of cells) minScore = Math.min(minScore, cell.score);
        const minScoreCells = cells.filter((cell) => cell.score === minScore);
        chosenCell = randElement(minScoreCells);
    }

    return chosenCell;
};

const treeBot = () => {
    const board = buildBoard();
    const chosenCell = treeSearch(board, me);
    return chosenCell;
};

export default treeBot;
