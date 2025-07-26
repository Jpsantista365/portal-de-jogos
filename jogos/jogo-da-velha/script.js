const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Elementos da UI
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const gameSetup = document.getElementById('game-setup');

// Botões de configuração
const chooseXButton = document.getElementById('chooseX');
const chooseOButton = document.getElementById('chooseO');
const oneVoneButton = document.getElementById('oneVone');
const oneVpcButton = document.getElementById('oneVpc');

// Variáveis de estado do jogo
let oTurn;
let gameMode; // '1v1' ou '1vpc'
let playerSymbol;
let computerSymbol;

// Adiciona listeners aos botões de configuração
chooseXButton.addEventListener('click', () => setPlayerSymbol('x'));
chooseOButton.addEventListener('click', () => setPlayerSymbol('o'));
oneVoneButton.addEventListener('click', () => setGameMode('1v1'));
oneVpcButton.addEventListener('click', () => setGameMode('1vpc'));
restartButton.addEventListener('click', resetGame);

function setPlayerSymbol(symbol) {
    playerSymbol = symbol === 'x' ? X_CLASS : O_CLASS;
    computerSymbol = symbol === 'x' ? O_CLASS : X_CLASS;
    chooseXButton.classList.toggle('selected', symbol === 'x');
    chooseOButton.classList.toggle('selected', symbol === 'o');
    checkAndStartGame();
}

function setGameMode(mode) {
    gameMode = mode;
    oneVoneButton.classList.toggle('selected', mode === '1v1');
    oneVpcButton.classList.toggle('selected', mode === '1vpc');
    checkAndStartGame();
}

function checkAndStartGame() {
    if (playerSymbol && gameMode) {
        startGame();
    }
}

function startGame() {
    gameSetup.classList.add('hidden');
    board.classList.remove('hidden');
    winningMessageElement.classList.remove('show');

    oTurn = false; // X (o primeiro a jogar) sempre começa
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeAttribute('data-content');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });

    // CORREÇÃO: Verifica se é a vez do computador começar
    // Se for modo vs PC e o computador é X, ele faz a primeira jogada.
    if (gameMode === '1vpc' && computerSymbol === X_CLASS) {
        // Adiciona um pequeno delay para o jogador perceber que o jogo começou
        setTimeout(computerMove, 500);
    }
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    
    // Impede o jogador de jogar quando não é sua vez
    if (gameMode === '1vpc' && currentClass !== playerSymbol) {
        return;
    }

    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (gameMode === '1vpc' && !oTurn === (computerSymbol === X_CLASS)) {
             setTimeout(computerMove, 500); // Dá um pequeno delay para a jogada do PC
        }
    }
}

function computerMove() {
    // Garante que o computador não jogue se o jogo acabou
    if (isDraw() || checkWin(X_CLASS) || checkWin(O_CLASS)) return;

    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });

    // Lógica de IA: 1. Tenta vencer, 2. Tenta bloquear, 3. Joga aleatoriamente
    let move = findBestMove(computerSymbol) ?? findBestMove(playerSymbol) ?? availableCells[Math.floor(Math.random() * availableCells.length)];
    
    if (move) {
        placeMark(move, computerSymbol);

        if (checkWin(computerSymbol)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
        }
    }
}

function findBestMove(symbol) {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const cells = [cellElements[a], cellElements[b], cellElements[c]];
        const symbolsInCombination = cells.map(cell => cell.classList.contains(symbol) ? 1 : 0);
        const emptyCells = cells.map(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS) ? 1 : 0);
        
        if (symbolsInCombination.reduce((a, b) => a + b, 0) === 2 && emptyCells.reduce((a, b) => a + b, 0) === 1) {
            const emptyCell = cells.find(cell => 
                !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
            );
            if (emptyCell) return emptyCell;
        }
    }
    return null;
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Empate!';
    } else {
        const winner = oTurn ? O_CLASS.toUpperCase() : X_CLASS.toUpperCase();
        winningMessageTextElement.innerText = `${winner} Venceu!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.dataset.content = currentClass.toUpperCase();
    // Remove o listener para não poder clicar novamente na mesma célula
    cell.removeEventListener('click', handleClick);
}

function swapTurns() {
    oTurn = !oTurn;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function resetGame() {
    // Reseta as seleções e volta para a tela de configuração
    playerSymbol = null;
    gameMode = null;
    chooseXButton.classList.remove('selected');
    chooseOButton.classList.remove('selected');
    oneVoneButton.classList.remove('selected');
    oneVpcButton.classList.remove('selected');

    board.classList.add('hidden');
    winningMessageElement.classList.remove('show');
    gameSetup.classList.remove('hidden');
}