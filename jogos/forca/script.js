const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');
const figureParts = document.querySelectorAll('.figure-part');
const popup = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');
const playAgainBtn = document.getElementById('play-button');

// LISTA DE PALAVRAS ATUALIZADA COM 'Ç'
const words = [
    // Tecnologia
    'algoritmo', 'interface', 'javascript', 'programaçao', 'desenvolvimento',
    'computador', 'navegador', 'servidor', 'teclado', 'monitor', 'processador',
    'memoria', 'internet', 'roteador', 'software', 'hardware',

    // Frutas e Comidas
    'banana', 'morango', 'abacaxi', 'laranja', 'melancia', 'abacate', 'cereja',
    'framboesa', 'maracuja', 'goiaba', 'pessego', 'limao', 'coraçao', 'maça',

    // Animais
    'cachorro', 'elefante', 'girafa', 'macaco', 'crocodilo', 'hipopotamo',
    'rinoceronte', 'passarinho', 'borboleta', 'formiga', 'aranha', 'tartaruga',

    // Objetos e Conceitos
    'cadeira', 'janela', 'telefone', 'caderno', 'mochila', 'garrafa',
    'oculos', 'travesseiro', 'lampada', 'espelho', 'geladeira', 'palhaço'
];

let selectedWord = '';
const correctLetters = [];
const wrongLetters = [];

// FUNÇÃO ATUALIZADA PARA CRIAR TECLADO PT-BR
function createKeyboard() {
    keyboard.innerHTML = ''; // Limpa o teclado antigo
    const keyLayout = [
        'q w e r t y u i o p',
        'a s d f g h j k l ç',
        'z x c v b n m'
    ];

    keyLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        row.split(' ').forEach(key => {
            const btn = document.createElement('button');
            btn.innerText = key.toUpperCase();
            btn.classList.add('key');
            btn.setAttribute('data-key', key); // Atributo para identificar a tecla
            btn.addEventListener('click', () => handleKeyPress(key, btn));
            rowDiv.appendChild(btn);
        });
        keyboard.appendChild(rowDiv);
    });
}

function handleKeyPress(letter, btn) {
    if (btn && btn.disabled) return; // Se o botão já foi pressionado, não faz nada

    if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
            correctLetters.push(letter);
            displayWord();
        }
    } else {
        if (!wrongLetters.includes(letter)) {
            wrongLetters.push(letter);
            updateWrongLettersEl();
        }
    }
    
    if (btn) {
        btn.disabled = true; // Desabilita o botão clicado
    }
}

// NOVO: LISTENER PARA TECLADO FÍSICO
window.addEventListener('keydown', (e) => {
    // Ignora o evento se o popup estiver visível
    if (popup.classList.contains('show')) return;

    const key = e.key.toLowerCase();
    // Verifica se a tecla pressionada é uma letra válida (a-z ou ç)
    if ((key >= 'a' && key <= 'z') || key === 'ç') {
        const btn = document.querySelector(`.key[data-key='${key}']`);
        if (btn && !btn.disabled) {
            handleKeyPress(key, btn);
        }
    }
});


function displayWord() {
    wordDisplay.innerHTML = `
        ${selectedWord.split('').map(letter => `
            <span class="letter">
                ${correctLetters.includes(letter) ? letter.toUpperCase() : ''}
            </span>
        `).join('')}
    `;
    const innerWord = wordDisplay.innerText.replace(/\n/g, '').toLowerCase();
    if (innerWord === selectedWord) {
        finalMessage.innerText = 'Parabéns! Você venceu! 😃';
        popup.classList.add('show');
    }
}

function updateWrongLettersEl() {
    const wrongCount = wrongLetters.length;
    figureParts.forEach((part, index) => {
        if (index < wrongCount) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = `Você perdeu! 😕\nA palavra era: ${selectedWord.toUpperCase()}`;
        popup.classList.add('show');
    }
}

function resetGame() {
    correctLetters.splice(0);
    wrongLetters.splice(0);
    selectedWord = words[Math.floor(Math.random() * words.length)];
    
    displayWord();
    updateWrongLettersEl();
    createKeyboard(); // Recria o teclado para reativar as teclas
    
    popup.classList.remove('show');
}

playAgainBtn.addEventListener('click', resetGame);

// Inicia o jogo
resetGame();