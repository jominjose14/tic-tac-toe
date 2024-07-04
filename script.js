const grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let x ,y;
let score = [0, 0];

let cross = () => grid[x][y] = 1;
let circle = () => grid[x][y] = 2;
let getInput = () => {
    do {
        x = prompt("Enter X index");
        y = prompt("Enter Y index");
    }while(grid[x][y]);
}
checkWin = (player) => {
    let win = false;
    if((grid[x][0] == grid[x][1] && grid[x][1] == grid[x][2]) || (grid[0][y] == grid[1][y] && grid[1][y] == grid[2][y]))
        win = true;
    if(x = y)
        if(grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2])
            win = true;
    if(x + y == 2)
        if(grid[2][0] == grid[1][1] && grid[1][1] == grid[0][2])
            win = true;
    if(win) 
        score[player] ++;
    return win;
}

match = () => {
    do {
        alert("First player's turn. Input will be have to be re-entered if invalid.")
        getInput();
        cross(x, y);
        if(checkWin(0))
            break;
        alert("Second player's turn. Input will be have to be re-entered if invalid.")
        getInput();
        circle(x, y);
        if(checkWin(1))
            break;
    }while(true);

}
