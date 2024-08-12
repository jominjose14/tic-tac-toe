import { me, you, empty, buildBoard, findEmptyCells } from "./bot.js";
import { randElement } from "./util.js";

const corners = [{row:0,col:0}, {row:0,col:2}, {row:2,col:0}, {row:2,col:2}];
const sides = [{row:0,col:1}, {row:1,col:0}, {row:1,col:2}, {row:2,col:1}];
const center = { row: 1, col: 1 };

const getOpeningMove = (board, emptyCells, difficultyIdx) => {
    if (emptyCells.length === 9) { // X's first move
        if(difficultyIdx === 1 || difficultyIdx === 2) { // easy and medium difficulty
            return randElement(emptyCells);
        } else { // impossible difficulty
            if(Math.random() <= 0.5) {
                return randElement(corners);
            } else {
                return { row:1, col:1 };
            }
        }
    } else if(emptyCells.length === 8) { // O's first move (response to X's opening)
        if(difficultyIdx === 1 || difficultyIdx === 2) { // easy and medium difficulty
            return randElement(emptyCells);
        } else { // impossible difficulty
            const isFirstMoveCenter = board[1][1] === you;
            if(isFirstMoveCenter) return randElement(corners);

            let isFirstMoveCorner = false;
            for(const cell of corners) {
                if(board[cell.row][cell.col] === you) isFirstMoveCorner = true;
            }
            if(isFirstMoveCorner) return center;

            // first move was on a side
            let viableMoves = null;
            for(let i=0; i<3 && viableMoves == null; i++) {
                for(let j=0; j<3; j++) {
                    if(board[i][j] === you) {
                        viableMoves = {
                            corners: [],
                            side: null
                        };
                        if(i === 0 || i === 2) {
                            viableMoves.corners.push({row: i, col: 0}, {row: i, col: 2}); // adjacent corners
                            viableMoves.side = {row: 2-i, col: 1}; // opposite side
                        } else if(i === 1) {
                            viableMoves.corners.push({row: 0, col: j}, {row: 2, col: j}); // adjacent corners
                            viableMoves.side = {row: 1, col: 2-j}; // opposite side
                        }
                        break;
                    }
                }
            }

            // 1/3 chance each of O opening with either center or adjacentCorner or oppositeSide
            const dice = Math.random();
            if(dice <= 0.33) {
                return center;
            } else if(dice <= 0.66) {
                return randElement(viableMoves.corners);
            } else {
                return viableMoves.side;
            }
        }
    }

    return null;
}

const didPlayerWin = (board, player, lastBoardMove) => {
    const { row, col } = lastBoardMove;
    return (board[row][0] === player && board[row][1] === player && board[row][2] === player) || (board[0][col] === player && board[1][col] === player && board[2][col] === player) || (board[0][0] === player && board[1][1] === player && board[2][2] === player) || (board[0][2] === player && board[1][1] === player && board[2][0] === player);
};

const findWinningMove = (board, player) => {
    const emptyCells = findEmptyCells(board);
    let winningMove = null;

    for (const cell of emptyCells) {
        board[cell.row][cell.col] = player;
        if (didPlayerWin(board, player, cell)) winningMove = cell;
        board[cell.row][cell.col] = empty;
        if(winningMove !== null) break;
    }

    return winningMove;
}

// fork = a board state in which player can win using 2 different moves
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

// fork = a board state in which player can win using one of 2 different moves
const findForkCausingMoves = (board, emptyCells, player) => {
    const forkCausingMoves = [];

    for (const cell of emptyCells) {
        board[cell.row][cell.col] = player;
        if (doesForkExist(board, player)) forkCausingMoves.push(cell);
        board[cell.row][cell.col] = empty;
    }

    return forkCausingMoves;
}

const doesBraceExist = (board, player, lastBoardMove) => {
    const row = lastBoardMove.row;
    const col = lastBoardMove.col;

    for(let j=0; j<3; j++) {
        if(board[row][j] === player && board[row][(j+1)%3] === player || board[row][(j+1)%3] === player && board[row][(j+2)%3] === player || board[row][(j+2)%3] === player && board[row][j] === player) return true;
    }

    for(let i=0; i<3; i++) {
        if(board[i][col] === player && board[(i+1)%3][col] === player || board[(i+1)%3][col] === player && board[(i+2)%3][col] === player || board[(i+2)%3][col] === player && board[i][col] === player) return true;
    }

    for(let k=0; k<3; k++) {
        if(board[k][k] === player && board[(k+1)%3][(k+1)%3] === player || board[(k+1)%3][(k+1)%3] === player && board[(k+2)%3][(k+2)%3] === player || board[(k+2)%3][(k+2)%3] === player && board[k][k] === player) return true;
    }

    for(let k=0; k<3; k++) {
        if(board[k][2-k] === player && board[(k+1)%3][2-(k+1)%3] === player || board[(k+1)%3][2-(k+1)%3] === player && board[(k+2)%3][2-(k+2)%3] === player || board[(k+2)%3][2-(k+2)%3] === player && board[k][2-k] === player) return true;
    }

    return false;
}

// brace = a board state in which a player can win using 1 move (player has 2 in a line)
const findBraceCausingMoves = (board, emptyCells, player) => {
    const braceCausingMoves = [];

    for (const cell of emptyCells) {
        board[cell.row][cell.col] = player;
        if(doesBraceExist(board, player, cell)) braceCausingMoves.push(cell);
        board[cell.row][cell.col] = empty;
    }

    return braceCausingMoves;
}

// function that handles Case 4 in ruleBot
const findMoveThatPreventsAllOpponentForks = (board, emptyCells, player) => {
    // player = candidate whose turn it is currently
    // opponent = candidate whose turn comes next
    const opponent = player === me ? you : me;

    // find all the ways opponent can create a fork
    const movesCausingForksFavouringOpponent = findForkCausingMoves(board, emptyCells, opponent);

    if(movesCausingForksFavouringOpponent.length === 0) {
        return null; // there are no opponent forks to prevent
    } else if (movesCausingForksFavouringOpponent.length === 1) {
        // Case-4.1: prevent opponent's only fork
        return movesCausingForksFavouringOpponent[0]; // player must play here to defend against only way that opponent can create a fork
    } else if (movesCausingForksFavouringOpponent.length > 1) {
        // find all the ways player can create a brace
        const movesCausingBraceFavouringPlayer = findBraceCausingMoves(board, emptyCells, player);

        // Case-4.2: prevent all opponent's forks while making a brace that favours the player
        let case_4_2_move = null;
        for(const cell of movesCausingBraceFavouringPlayer) {
            board[cell.row][cell.col] = player; // temporarily create a brace that favours player

            const updatedMovesCausingForksFavouringOpponent = findForkCausingMoves(board, emptyCells, opponent);
            if(updatedMovesCausingForksFavouringOpponent.length === 0) case_4_2_move = cell;

            board[cell.row][cell.col] = empty; // revert player's brace
            if(case_4_2_move !== null) break;
        }
        if(case_4_2_move !== null) return case_4_2_move;

        // Case-4.3: force opponent to defend but ensure that opponent's defending move does not create a fork that favours the opponent
        let case_4_3_move = null;
        for(const cell of movesCausingBraceFavouringPlayer) {
            board[cell.row][cell.col] = player; // temporarily create a brace that favours player

            const playerWinningMove = findWinningMove(board, player); // this winning move can complete the above created brace to win the game for player
            board[playerWinningMove.row][playerWinningMove.col] = opponent; // temporarily perform opponent's defending move
            if(!doesForkExist(board, opponent)) case_4_3_move = cell; // opponent's defending move does not create a fork favouring opponent, so player can play the move that leads to this eventuality
            board[playerWinningMove.row][playerWinningMove.col] = empty; // revert opponent's defending move

            board[cell.row][cell.col] = empty; // revert player's brace
            if(case_4_3_move !== null) break;
        }
        if(case_4_3_move !== null) return case_4_3_move;
    }

    return null; // there is no move that can prevent all of opponent's forks
}

// difficultyIdx=difficulty: 1=easy, 2=medium, 3=impossible
const ruleBot = (difficultyIdx) => {
    const board = buildBoard();
    const emptyCells = findEmptyCells(board);

    // Case-0: opening move
    const openingMove = getOpeningMove(board, emptyCells, difficultyIdx);
    if(openingMove !== null) return openingMove;

    // Case-1: play my winning move
    const myWinningMove = findWinningMove(board, me);
    if(myWinningMove !== null) return myWinningMove;

    if (difficultyIdx === 1 && Math.random() <= 0.5) return randElement(emptyCells); // limits easy ruleBot's intelligence to thinking about case 2 only 50% of the time

    // Case-2: prevent your winning move
    const yourWinningMove = findWinningMove(board, you);
    if(yourWinningMove !== null) return yourWinningMove;

    if (difficultyIdx === 1) return randElement(emptyCells); // Hard-limit: limits easy ruleBot's intelligence to cases 1 to 2
    if (difficultyIdx === 2 && Math.random() <= 0.5) return randElement(emptyCells); // Soft-limit: limits medium ruleBot's intelligence to thinking about case 3 only 50% of the time

    // Case-3: create my fork
    for (const cell of emptyCells) {
        board[cell.row][cell.col] = me;
        if (doesForkExist(board, me)) return cell;
        board[cell.row][cell.col] = empty;
    }

    if (difficultyIdx === 2) return randElement(emptyCells); // Hard-limit: limits medium ruleBot's intelligence to cases 1 to 3

    // Case-4: prevent all your forks
    const myMoveThatPreventsAllYourForks = findMoveThatPreventsAllOpponentForks(board, emptyCells, me);
    if(myMoveThatPreventsAllYourForks !== null) return myMoveThatPreventsAllYourForks;

    // Case-5: capture center
    if (board[1][1] === empty) return center;

    // Case-6: capture opposite corner
    if (board[0][0] === you && board[2][2] === empty) return { row: 2, col: 2 };
    if (board[2][2] === you && board[0][0] === empty) return { row: 0, col: 0 };
    if (board[0][2] === you && board[2][0] === empty) return { row: 2, col: 0 };
    if (board[2][0] === you && board[0][2] === empty) return { row: 0, col: 2 };

    // Case-7: play corner
    for(const cell of new Set(corners)) {
        if(board[cell.row][cell.col] === empty) return cell;
    }

    // Case-8: play side
    for(const cell of new Set(sides)) {
        if(board[cell.row][cell.col] === empty) return cell;
    }
};

export default ruleBot;
