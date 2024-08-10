const $playGrid = document.getElementById("play-grid");

const grid = [
    [$playGrid.querySelector('[data-row="0"][data-col="0"]'), $playGrid.querySelector('[data-row="0"][data-col="1"]'), $playGrid.querySelector('[data-row="0"][data-col="2"]')],
    [$playGrid.querySelector('[data-row="1"][data-col="0"]'), $playGrid.querySelector('[data-row="1"][data-col="1"]'), $playGrid.querySelector('[data-row="1"][data-col="2"]')],
    [$playGrid.querySelector('[data-row="2"][data-col="0"]'), $playGrid.querySelector('[data-row="2"][data-col="1"]'), $playGrid.querySelector('[data-row="2"][data-col="2"]')],
];

const isEmpty = (row, col) => {
    return grid[row][col].textContent === "";
};

const at = (row, col) => {
    return grid[row][col].textContent;
};

const set = (row, col, value) => {
    grid[row][col].textContent = value;
};

export { $playGrid, grid, isEmpty, at, set };
