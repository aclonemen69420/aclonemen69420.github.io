let board = Array(9).fill(null);
let current = 'X';
let active = true;

// Winning combinations (triplets of indices)
const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
];

// --- Game Initialization and Reset ---

function init() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board = Array(9).fill(null);
    active = true;
    current = 'X';
    document.getElementById('status').innerText = 'Player (X) starts';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.onclick = () => playerMove(i);
        boardEl.appendChild(cell);
    }
    updateBoard(); 
}

// --- Player Move ---

function playerMove(i) {
    if (!active || board[i]) return;

    board[i] = 'X';
    updateBoard();

    if (checkWin('X')) {
        endGame('Player (X) Wins! ??');
        return;
    } else if (isFull()) {
        endGame('Tie Game! ??');
        return;
    }

    // Switch to computer turn
    current = 'O';
    document.getElementById('status').innerText = 'Computer thinking...';
    // Delay computer move
    setTimeout(computerMove, 500);
}

// --- Computer Move (Minimax Strategy) ---

function computerMove() {
    // Find the best move using Minimax
    let bestMove = findBestMove(board, 'O');
    
    if (bestMove === null) {
        if (isFull()) endGame('Tie Game! ??');
        return;
    }

    board[bestMove] = 'O';
    updateBoard();

    if (checkWin('O')) {
        endGame('Computer (O) Wins! ??');
        return;
    } else if (isFull()) {
        endGame('Tie Game! ??');
        return;
    }

    // Switch back to player turn
    current = 'X';
    document.getElementById('status').innerText = 'Player (X) turn';
}

// --- Minimax Core Logic ---

function evaluate(currentBoard) {
    if (checkWinHelper(currentBoard, 'O')) {
        return 10; // Computer wins
    } else if (checkWinHelper(currentBoard, 'X')) {
        return -10; // Player wins
    } else if (isFullHelper(currentBoard)) {
        return 0; // Tie
    }
    return null; 
}

function minimax(currentBoard, player) {
    const score = evaluate(currentBoard);
    if (score !== null) {
        return score;
    }

    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === null) {
                currentBoard[i] = 'O';
                bestScore = Math.max(bestScore, minimax(currentBoard, 'X'));
                currentBoard[i] = null; // Undo move (Backtrack)
            }
        }
        return bestScore;
    } 
    else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === null) {
                currentBoard[i] = 'X';
                bestScore = Math.min(bestScore, minimax(currentBoard, 'O'));
                currentBoard[i] = null; // Undo move (Backtrack)
            }
        }
        return bestScore;
    }
}

function findBestMove(currentBoard, player) {
    let bestScore = -Infinity;
    let move = null;
    
    for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
            currentBoard[i] = player;
            
            // Assume the opponent ('X') plays optimally next
            let score = minimax(currentBoard, 'X'); 
            
            currentBoard[i] = null; // Undo move

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}


// --- Helper Functions (Independent of global board) ---

function checkWinHelper(currentBoard, player) {
    return wins.some(([a, b, c]) => 
        currentBoard[a] === player && 
        currentBoard[b] === player && 
        currentBoard[c] === player
    );
}

function isFullHelper(currentBoard) {
    return currentBoard.every(cell => cell !== null);
}


// --- Global Board and Display Functions ---

function updateBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
        cells[i].innerText = board[i] || '';
        cells[i].classList.remove('x-cell', 'o-cell');
        if (board[i] === 'X') {
            cells[i].classList.add('x-cell');
        } else if (board[i] === 'O') {
            cells[i].classList.add('o-cell');
        }
    }
}

function checkWin(player) {
    return checkWinHelper(board, player);
}

function isFull() {
    return isFullHelper(board);
}

function endGame(message) {
    document.getElementById('status').innerText = message;
    active = false;
}

function resetGame() {
    init();
}

// Start the game
init();