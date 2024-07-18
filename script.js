const grid = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];

let x ,y;
let score1 = 0, score2 = 0;
let filled = 0;
let p1turn= true;

let cross = () => grid[y][x] = 'X';
let circle = () => grid[y][x] = 'O';
let print = () => {
    console.log('\n    0   1   2');
    for(let i = 0; i < 3; i++) {
        let output = '';
        output += i;
        for(let j = 0; j < 3; j++)
            output += (' | ' + grid[i][j]);
        console.log(output);
    }
}
let checkWin = () => {
    filled ++;
    if((grid[y][0] == grid[y][1] && grid[y][1] == grid[y][2]) || (grid[0][x] == grid[1][x] && grid[1][x] == grid[2][x])) 
        return true;
    if(x == y && grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2])
        return true;
    if(x + y == 2 && grid[2][0] == grid[1][1] && grid[1][1] == grid[0][2])
        return true;
}

let play = (row, col) => {
    if(grid[row][col] != ' ')
        return;
    x = col;
    y = row;
    if(p1turn) {
        cross();
        if(checkWin()) {
            score1++;
            p1turn = true;
            // p1 win message
        }
    }
    else {
        circle();
        if(checkWin()) {
            score2++;
            p1turn = true;
            // p2 win message
        }
    }
    p1turn = !p1turn;
    if(filled == 9) {
        // draw message
    }
}

const slots = document.querySelectorAll(".slot");
slots.forEach((slot) => {
    slot.addEventListener("click", () => {
        play(Number(slot.getAttribute("data-row")), Number(slot.getAttribute("data-col")));
    });
});

// while(true) {
//     play();
//     console.log(`Player 1's score is ${score[0]}.
//                \nPlayer 2's score is ${score[1]}.`);
//     for(let i = 0; i < 3; i++)
//         for(let j = 0; j < 3; j++)
//             grid[x][y] = ' ';
// }
