document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const minesCountSpan = document.getElementById('mines-count');
    const resultDiv = document.getElementById('result');
    const resetButton = document.getElementById('reset-button');

    const difficultySetup = document.getElementById('difficulty-setup');
    const gameContainer = document.getElementById('game-container');
    const difficultyChoices = document.querySelectorAll('.difficulty-choice');

    const width = 10;
    let bombAmount = 10; // Valor padrão
    let squares = [];
    let isGameOver = false;
    let flags = 0;

    // Inicia o jogo ao escolher a dificuldade
    difficultyChoices.forEach(button => {
        button.addEventListener('click', () => {
            bombAmount = parseInt(button.getAttribute('data-bombs'));
            difficultySetup.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            startGame();
        });
    });

    function startGame() {
        // Limpa o estado anterior
        grid.innerHTML = '';
        squares = [];
        isGameOver = false;
        flags = 0;
        resultDiv.innerHTML = '';

        minesCountSpan.innerHTML = bombAmount;
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add('cell');
            if (gameArray[i] === 'bomb') {
                square.classList.add('bomb');
            }
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function(e) { click(square); });
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        // Adiciona os números
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            if (!squares[i].classList.contains('bomb')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if (i > 9 && squares[i - width].classList.contains('bomb')) total++;
                if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if (i < 90 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }
        }
    }

    resetButton.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        difficultySetup.classList.remove('hidden');
    });

    function addFlag(square) {
        if (isGameOver || square.classList.contains('revealed')) return;
        if (!square.classList.contains('flag') && (flags < bombAmount)) {
            square.classList.add('flag');
            flags++;
            checkForWin();
        } else if (square.classList.contains('flag')) {
            square.classList.remove('flag');
            flags--;
        }
    }

    function click(square) {
        if (isGameOver || square.classList.contains('revealed') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            gameOver(false);
        } else {
            square.classList.add('revealed');
            let total = square.getAttribute('data');
            if (total != 0) {
                square.innerHTML = total;
            } else {
                checkSquare(square.id);
            }
            checkForWin();
        }
    }

    function checkSquare(squareId) {
        const currentId = parseInt(squareId);
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) click(squares[currentId - 1]);
            if (currentId > 9 && !isRightEdge) click(squares[currentId + 1 - width]);
            if (currentId > 9) click(squares[currentId - width]);
            if (currentId > 10 && !isLeftEdge) click(squares[currentId - 1 - width]);
            if (currentId < 99 && !isRightEdge) click(squares[currentId + 1]);
            if (currentId < 90 && !isLeftEdge) click(squares[currentId - 1 + width]);
            if (currentId < 89 && !isRightEdge) click(squares[currentId + 1 + width]);
            if (currentId < 90) click(squares[currentId + width]);
        }, 10);
    }

    function gameOver(isWin) {
        isGameOver = true;
        resultDiv.innerHTML = isWin ? 'VOCÊ VENCEU!' : 'FIM DE JOGO!';
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
                square.classList.add('revealed'); // Revela as bombas
            }
        });
    }

    function checkForWin() {
        let revealedCount = 0;
        squares.forEach(square => {
            if (square.classList.contains('revealed')) {
                revealedCount++;
            }
        });
        if (revealedCount === (width * width) - bombAmount) {
            gameOver(true);
        }
    }
});