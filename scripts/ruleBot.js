import { me, you, empty, buildBoard, findEmptyCells } from "./bot.js";
import { randInt, randElement } from "./util.js";

const didPlayerWin = (board, player, lastBoardMove) => {
    const { row, col } = lastBoardMove;
    return (board[row][0] == player && board[row][1] == player && board[row][2] == player) || (board[0][col] == player && board[1][col] == player && board[2][col] == player) || (board[0][0] == player && board[1][1] == player && board[2][2] == player) || (board[0][2] == player && board[1][1] == player && board[2][0] == player);
};

const doesForkExist = (board, player) => {
    const emptyCells = findEmptyCells(board);
    let winCount = 0;

    for (const cell of emptyCells) {
        board[cell.row][cell.col] = player;
        if (didPlayerWin(board, player, cell)) winCount++;
        board[cell.row][cell.col] = empty;
    }

    return winCount > 1;
};

// difficultyIdx=difficulty: 1=easy, 2=medium, 3=impossible
const ruleBot = (difficultyIdx) => {
    const board = buildBoard();
    const emptyCells = findEmptyCells(board);

    // Case-0) random start
    if (emptyCells.length == 9) return { row: randInt(0, 2), col: randInt(0, 2) };

    // Case-1) play my winning move
    for (const cell of emptyCells) {
        board[cell.row][cell.col] = me;
        if (didPlayerWin(board, me, cell)) return cell;
        board[cell.row][cell.col] = empty;
    }

    if (difficultyIdx == 1 && Math.random() <= 0.5) return randElement(emptyCells); // limits easy ruleBot's intelligence to thinking about case 2 only 50% of the time

    // Case-2) prevent your winning move
    for (const cell of emptyCells) {
        board[cell.row][cell.col] = you;
        if (didPlayerWin(board, you, cell)) return cell;
        board[cell.row][cell.col] = empty;
    }

    if (difficultyIdx == 1) return randElement(emptyCells); // Hard-limit: limits easy ruleBot's intelligence to cases 1 to 2
    if (difficultyIdx == 2 && Math.random() <= 0.5) return randElement(emptyCells); // Soft-limit: limits medium ruleBot's intelligence to thinking about case 3 only 50% of the time

    // Case-3) create my fork
    for (const cell of emptyCells) {
        board[cell.row][cell.col] = me;
        if (doesForkExist(board, me)) return cell;
        board[cell.row][cell.col] = empty;
    }

    if (difficultyIdx == 2) return randElement(emptyCells); // Hard-limit: limits medium ruleBot's intelligence to cases 1 to 3

    // Case-4) prevent all your forks
    const yourForks = [];

    for (const cell of emptyCells) {
        board[cell.row][cell.col] = you;
        if (doesForkExist(board, you)) yourForks.push(cell);
        board[cell.row][cell.col] = empty;
    }

    if (yourForks.length == 1) {
        return yourForks[0];
    } else if (yourForks.length > 1 && board[1][1] == empty) {
        return { row: 1, col: 1 };
    } // else, one of the below cases will lead to a move that prevents 2 of your forks

    // Case-5) capture center
    if (board[1][1] == empty) return { row: 1, col: 1 };

    // Case-6) capture opposite corner
    if (board[0][0] == you && board[2][2] == empty) return { row: 2, col: 2 };
    if (board[2][2] == you && board[0][0] == empty) return { row: 0, col: 0 };
    if (board[0][2] == you && board[2][0] == empty) return { row: 2, col: 0 };
    if (board[2][0] == you && board[0][2] == empty) return { row: 0, col: 2 };

    // Case-7) play corner
    if (board[0][0] == empty) return { row: 0, col: 0 };
    if (board[0][2] == empty) return { row: 0, col: 2 };
    if (board[2][0] == empty) return { row: 2, col: 0 };
    if (board[2][2] == empty) return { row: 2, col: 2 };

    // Case-8) play side
    if (board[0][1] == empty) return { row: 0, col: 1 };
    if (board[1][0] == empty) return { row: 1, col: 0 };
    if (board[1][2] == empty) return { row: 1, col: 2 };
    if (board[2][1] == empty) return { row: 2, col: 1 };
};

export default ruleBot;
