export const $playGrid = document.getElementById("play-grid");

export const grid = [
    [$playGrid.querySelector('[data-row="0"][data-col="0"]'), $playGrid.querySelector('[data-row="0"][data-col="1"]'), $playGrid.querySelector('[data-row="0"][data-col="2"]')],
    [$playGrid.querySelector('[data-row="1"][data-col="0"]'), $playGrid.querySelector('[data-row="1"][data-col="1"]'), $playGrid.querySelector('[data-row="1"][data-col="2"]')],
    [$playGrid.querySelector('[data-row="2"][data-col="0"]'), $playGrid.querySelector('[data-row="2"][data-col="1"]'), $playGrid.querySelector('[data-row="2"][data-col="2"]')],
];

export const isEmpty = (row, col) => {
    return grid[row][col].querySelector(".mark").textContent === "";
};

export const clear = (row, col) => {
    grid[row][col].querySelector(".mark").textContent = "";
};

export const isCellEmpty = ($cell) => {
    return $cell.querySelector(".mark").textContent === "";
};

export const clearCell = ($cell) => {
    $cell.querySelector(".mark").textContent = "";
};

export const at = (row, col) => {
    return grid[row][col].querySelector(".mark").textContent;
};

export const atCell = ($cell) => {
    return $cell.querySelector(".mark").textContent;
}

export const set = (row, col, value) => {
    grid[row][col].querySelector(".mark").textContent = value;
};

export const setCell = ($cell, value) => {
    $cell.querySelector(".mark").textContent = value;
};
