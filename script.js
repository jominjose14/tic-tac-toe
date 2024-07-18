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
let clear = () => {
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++) 
            grid[i][j] = ' ';
    filled = 0;
    slots.forEach((slot) => {
        slot.textContent = '';
    }); 
}
let checkWin = () => {
    if((grid[y][0] == grid[y][1] && grid[y][1] == grid[y][2]) || (grid[0][x] == grid[1][x] && grid[1][x] == grid[2][x])) 
        return true;
    if(x == y && grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2])
        return true;
    if(x + y == 2 && grid[2][0] == grid[1][1] && grid[1][1] == grid[0][2])
        return true;
}

let play = (row, col, event) => {
    if(grid[row][col] != ' ')
        return;
    x = col;
    y = row;
    if(p1turn) {
        cross();
        event.target.textContent = "X";
        filled ++;
        if(checkWin()) {
            score1++;
            document.querySelector("#p1Score").textContent = score1;
            p1turn = true;          
            clear();
            // p1 win message
            return;
        }
    }
    else {
        circle();
        event.target.textContent = "O";
        filled ++;
        if(checkWin()) {
            score2++;
            document.querySelector("#p2Score").textContent = score2;
            p1turn = true;
            clear();
            // p2 win message
            return;
        }
    }
    if(filled == 9) {
        // draw message
        clear();
        p1turn = true;
        return;
    }
    p1turn = !p1turn;
}

const slots = document.querySelectorAll(".slot");
slots.forEach((slot) => {
    slot.addEventListener("click", (e) => {
        play(Number(slot.getAttribute("data-row")), Number(slot.getAttribute("data-col")), e);
    });
});

// while(true) {
//     play();
//     console.log(`Player 1's score is ${score[0]}.
//                \nPlayer 2's score is ${score[1]}.`);
    // for(let i = 0; i < 3; i++)
    //     for(let j = 0; j < 3; j++)
    //         grid[x][y] = ' ';
// }
