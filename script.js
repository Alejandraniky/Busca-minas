const rows = 10;
const cols = 10;
const minesCount = 15;
let board = [];
let gameOver = false;

// Función para crear el tablero
function createBoard() {
    const game = document.getElementById("game");
    game.innerHTML = "";
    game.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", revealCell);
            cell.addEventListener("contextmenu", markCell);
            game.appendChild(cell);
            board[i][j] = { element: cell, isMine: false, revealed: false, flagged: false, adjacentMines: 0 };
        }
    }

    placeMines();
}

// Función para colocar minas aleatoriamente
function placeMines() {
    let placedMines = 0;
    while (placedMines < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            placedMines++;
        }
    }
    calculateAdjacentMines();
}

// Función para calcular minas adyacentes
function calculateAdjacentMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!board[i][j].isMine) {
                let mines = countMinesAround(i, j);
                board[i][j].adjacentMines = mines;
            }
        }
    }
}

// Contar minas alrededor de una celda
function countMinesAround(r, c) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = r + i;
            let newCol = c + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (board[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Revelar una celda
function revealCell(event) {
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];

    if (cell.revealed || cell.flagged) return;

    cell.revealed = true;
    cell.element.classList.add("revealed");

    if (cell.isMine) {
        cell.element.textContent = "💣";
        endGame(false);
        return;
    }

    cell.element.textContent = cell.adjacentMines > 0 ? cell.adjacentMines : "";
    if (cell.adjacentMines === 0) {
        revealSurroundingCells(row, col);
    }

    checkWin();
}

// Revelar celdas vacías en cascada
function revealSurroundingCells(r, c) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = r + i;
            let newCol = c + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                let adjacentCell = board[newRow][newCol];
                if (!adjacentCell.revealed && !adjacentCell.isMine) {
                    revealCell({ target: adjacentCell.element });
                }
            }
        }
    }
}

// Marcar celda con bandera (clic derecho)
function markCell(event) {
    event.preventDefault();
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];

    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    cell.element.textContent = cell.flagged ? "🚩" : "";
}

// Verificar si el jugador gana
function checkWin() {
    let revealedCells = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j].revealed) {
                revealedCells++;
            }
        }
    }
    if (revealedCells === rows * cols - minesCount) {
        endGame(true);
    }
}

// Terminar el juego
function endGame(won) {
    gameOver = true;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = board[i][j];
            if (cell.isMine) {
                cell.element.textContent = "💣";
            }
            cell.element.removeEventListener("click", revealCell);
            cell.element.removeEventListener("contextmenu", markCell);
        }
    }
    setTimeout(() => {
        alert(won ? "¡Felicidades, ganaste! 🎉" : "¡Perdiste! 💥");
        createBoard();
    }, 500);
}

// Iniciar juego al cargar
document.addEventListener("DOMContentLoaded", createBoard);
