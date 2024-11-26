
const boardSize = 4;
let board = [];
let score = 0;

const gameBoard = document.getElementById('game-board');
const scoreContainer = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

function initBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    addTile();
    addTile();
    renderBoard();
}

function addTile() {
    const emptyTiles = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) emptyTiles.push([r, c]);
        }
    }
    if (emptyTiles.length > 0) {
        const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    board.forEach(row => {
        row.forEach(value => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (value !== 0) {
                tile.textContent = value;
                tile.setAttribute('data-value', value);
            }
            gameBoard.appendChild(tile);
        });
    });
    scoreContainer.textContent = score;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < boardSize; r++) {
        let row = board[r].filter(v => v !== 0);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row.splice(i + 1, 1);
            }
        }
        while (row.length < boardSize) row.push(0);
        if (board[r].toString() !== row.toString()) moved = true;
        board[r] = row;
    }
    return moved;
}

function rotateBoard() {
    const newBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            newBoard[c][boardSize - 1 - r] = board[r][c];
        }
    }
    board = newBoard;
}

function move(direction) {
    let moved = false;
    if (direction === 'left') moved = moveLeft();
    else {
        for (let i = 0; i < direction; i++) rotateBoard();
        moved = moveLeft();
        for (let i = 0; i < (4 - direction); i++) rotateBoard();
    }
    if (moved) {
        addTile();
        renderBoard();
        if (isGameOver()) alert('Game Over!');
    }
}

function isGameOver() {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) return false;
            if (r > 0 && board[r][c] === board[r - 1][c]) return false;
            if (c > 0 && board[r][c] === board[r][c - 1]) return false;
        }
    }
    return true;
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': move('left'); break;
        case 'ArrowDown': move(1); break;
        case 'ArrowRight': move(2); break;
        case 'ArrowUp': move(3); break;
    }
});

restartBtn.addEventListener('click', initBoard);

initBoard();
