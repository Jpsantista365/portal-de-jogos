document.addEventListener('DOMContentLoaded', () => {
    // CONJUNTO DE CARTAS ATUALIZADO PARA 3x6 (9 pares)
    const cardIcons = [
        '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨'
    ];
    const cardArray = [...cardIcons, ...cardIcons].sort(() => 0.5 - Math.random());
    
    const grid = document.getElementById('grid');
    const scoreEl = document.getElementById('score');
    document.getElementById('reset-button').addEventListener('click', createBoard);

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let pairsFound = 0;

    function createBoard() {
        // Reseta o estado do jogo
        grid.innerHTML = '';
        scoreEl.textContent = '0';
        pairsFound = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        cardArray.sort(() => 0.5 - Math.random());

        cardArray.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', index);
            card.setAttribute('data-icon', icon);

            card.innerHTML = `
                <div class="front-face"></div>
                <div class="back-face">${icon}</div>
            `;
            
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        pairsFound++;
        scoreEl.textContent = pairsFound;

        if (pairsFound === cardIcons.length) {
            setTimeout(() => {
                alert('Parabéns! Você encontrou todos os pares!');
            }, 500);
        }

        resetBoardState();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoardState();
        }, 1200);
    }

    function resetBoardState() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    createBoard();
});