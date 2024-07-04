const grid = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];

let x ,y;
let score = [0, 0];
let slots = 0;

let cross = () => grid[y][x] = 'X';
let circle = () => grid[y][x] = 'O';
let getInput = () => {
    do {
        x = prompt("Enter X index");
        y = prompt("Enter Y index");
    }while(grid[y][x] != ' ');
}
let print = () => {
    console.log('\n')
    for(let i = 0; i < 3; i++) {
        console.log(`${grid[i][0]} | ${grid[i][1]} | ${grid[i][2]}`);
    }
}
let checkWin = () => {
    slots ++;
    if((grid[y][0] == grid[y][1] && grid[y][1] == grid[y][2]) || (grid[0][x] == grid[1][x] && grid[1][x] == grid[2][x])) 
        return true;
    if(x == y && grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2])
        return true;
    if(x + y == 2 && grid[2][0] == grid[1][1] && grid[1][1] == grid[0][2])
        return true;
}

let play = () => {
    while(true) {
        alert("First player's turn. Input will be have to be re-entered if invalid.")
        getInput();
        cross();
        print();
        if(checkWin()) {
            score[0] ++;
            alert("First player wins!");
            break;
        }
        if(slots == 9) {
            alert("Draw!");
            break;
        }
        alert("Second player's turn. Input will be have to be re-entered if invalid.")
        getInput();
        circle();
        print();
        if(checkWin()) {
            score[1] ++;
            alert("Second player wins!");
            break;
        }
    }

}

while(true) {
    play();
    console.log(`Player 1's score is ${score[0]}.
               \nPlayer 2's score is ${score[1]}.`);
    for(x = 0; x < 3; x++)
        for(y = 0; y < 3; y++)
            grid[x][y] = ' ';
}
