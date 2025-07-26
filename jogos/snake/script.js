const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start-button');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let gameInterval;
let isGameRunning = false;

// --- NOVAS VARIÁVEIS DE VELOCIDADE ---
let currentSpeed; // Armazena o intervalo atual em ms
const initialSpeed = 200; // Velocidade inicial (bem lenta)
const speedIncrement = 15; // Quanto a velocidade aumenta (diminui o intervalo)
const maxSpeed = 65; // Velocidade máxima (intervalo mínimo)
// ------------------------------------

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    // Garante que a comida não apareça em cima da cobra
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'lime' : 'green';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    if (!isGameRunning) return;

    const head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'right') head.x++;
    if (direction === 'left') head.x--;
    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;

    if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height || checkCollision(head)) {
        stopGame();
        alert('Fim de Jogo! Pontuação: ' + score);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        generateFood();

        // --- LÓGICA PARA AUMENTAR A VELOCIDADE ---
        if (score > 0 && score % 2 === 0) {
            increaseSpeed();
        }
        // -----------------------------------------

    } else {
        snake.pop();
    }
    draw();
}

function increaseSpeed() {
    // Diminui o intervalo, tornando o jogo mais rápido
    currentSpeed -= speedIncrement;
    if (currentSpeed < maxSpeed) {
        currentSpeed = maxSpeed; // Limita a velocidade máxima
    }
    
    // Limpa o intervalo antigo e cria um novo com a nova velocidade
    clearInterval(gameInterval);
    gameInterval = setInterval(update, currentSpeed);
}

function checkCollision(head) {
    // Começa do 1 para não verificar a colisão da cabeça com ela mesma
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    // Impede a cobra de inverter a direção sobre si mesma
    if (keyPressed === 37 && direction !== 'right') direction = 'left';
    if (keyPressed === 38 && direction !== 'down') direction = 'up';
    if (keyPressed === 39 && direction !== 'left') direction = 'right';
    if (keyPressed === 40 && direction !== 'up') direction = 'down';
}

function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreEl.textContent = score;
    currentSpeed = initialSpeed; // Reseta a velocidade
    
    generateFood();
    draw();
    
    document.addEventListener('keydown', changeDirection);
    
    // Inicia o jogo com a velocidade inicial
    clearInterval(gameInterval);
    gameInterval = setInterval(update, currentSpeed);
    
    startBtn.textContent = "Jogando...";
    startBtn.disabled = true;
}

function stopGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
    startBtn.textContent = "Iniciar";
    startBtn.disabled = false;
}

startBtn.addEventListener('click', startGame);
draw(); // Desenho inicial