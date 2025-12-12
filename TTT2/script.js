let board = Array(9).fill(null);
let current = 'X';
let active = true;


const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]            
];


function init() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board = Array(9).fill(null);
    active = true;
    current = 'X';
    document.getElementById('status').innerText = 'Player (X) first';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
      
        cell.dataset.index = i;
        cell.onclick = () => playerMove(i);
        boardEl.appendChild(cell);
    }
}

function playerMove(i) {
   
    if (!active || board[i]) return;

    board[i] = 'X';
    updateBoard();

    if (checkWin('X')) {
        endGame('Player (X) Wins!');
        return;
    } else if (isFull()) {
        endGame('Draw!');
        return;
    }

    current = 'O';
    document.getElementById('status').innerText = 'Computer thinking...';

    setTimeout(computerMove, 700);
}


function computerMove() {
    let move = findWinningMove('O');
    
    if (move === null) move = findWinningMove('X');

    if (move === null) move = getRandomMove();

    if (move === null) {
        if (isFull()) endGame('Draw!');
        return;
    }

    board[move] = 'O';
    updateBoard();

    if (checkWin('O')) {
        endGame('Computer (O) Wins!');
        return;
    } else if (isFull()) {
        endGame('Draw!');
        return;
    }

    current = 'X';
    document.getElementById('status').innerText = 'Player turn (X)';
}


function findWinningMove(player) {
    for (let [a, b, c] of wins) {
        
        let count = 0;
        let emptyIndex = -1;

        if (board[a] === player) count++; else if (board[a] === null) emptyIndex = a;
        if (board[b] === player) count++; else if (board[b] === null) emptyIndex = b;
        if (board[c] === player) count++; else if (board[c] === null) emptyIndex = c;

        
        if (count === 2 && emptyIndex !== -1) {
            return emptyIndex;
        }
    }
    return null;
}


function getRandomMove() {
    const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length === 0) return null; 
    return empty[Math.floor(Math.random() * empty.length)];
}


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
    return wins.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}


function isFull() {
    return board.every(cell => cell !== null);
}


function endGame(message) {
    document.getElementById('status').innerText = message;
    active = false;
}


function resetGame() {
    init();
}


init();