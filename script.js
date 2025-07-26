document.addEventListener('DOMContentLoaded', () => {
    const gameSelection = document.getElementById('game-selection');
    const gameContainer = document.getElementById('game-container');
    const gameFrame = document.getElementById('game-frame');
    const gameCards = document.querySelectorAll('.game-card');
    const backButton = document.getElementById('back-to-menu');

    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const game = card.getAttribute('data-game');
            loadGame(game);
        });
    });

    function loadGame(game) {
        gameFrame.src = `jogos/${game}/index.html`;

        gameSelection.classList.remove('visible');
        gameSelection.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameContainer.classList.add('visible');
    }

    backButton.addEventListener('click', () => {
        gameFrame.src = '';

        gameContainer.classList.remove('visible');
        gameContainer.classList.add('hidden');
        gameSelection.classList.remove('hidden');
        gameSelection.classList.add('visible');
    });
});