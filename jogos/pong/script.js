const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');

const paddleHeight = 100, paddleWidth = 10;
const ballRadius = 10;

let player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, score: 0 };
let computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, score: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: ballRadius, speedX: 5, speedY: 5 };

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, 'white');
    }
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, 'white');
    drawRect(computer.x, computer.y, computer.width, computer.height, 'white');
    drawCircle(ball.x, ball.y, ball.radius, 'red');
}

function move() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Movimento do Computador
    computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    let p = (ball.x < canvas.width / 2) ? player : computer;
    if (collision(ball, p)) {
        let collidePoint = (ball.y - (p.y + p.height / 2));
        collidePoint = collidePoint / (p.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.speedX = direction * 5 * Math.cos(angleRad);
        ball.speedY = 5 * Math.sin(angleRad);
    }

    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }

    playerScoreEl.textContent = player.score;
    computerScoreEl.textContent = computer.score;
}

function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
    ball.speedY = 5;
}

canvas.addEventListener('mousemove', (evt) => {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
});

function gameLoop() {
    move();
    render();
}

setInterval(gameLoop, 1000 / 60);