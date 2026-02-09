const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let gameStarted = false;


const reward = document.getElementById('reward');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);


// ===== Paddle =====
const paddle = {
  w: 200,
  h: 22,
  x: canvas.width / 2 - 100,
  y: canvas.height - 60
};


// ===== Ball =====
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  r: 15,
  dx: 6,
  dy: -6
};



// ===== Heart blocks =====
const blocks = [];
const blockSize = 58;

// Простая форма сердца (матрица)
const heartShape = [
  "0011001100",
  "0111111110",
  "1111111111",
  "1111111111",
  "0111111110",
  "0011111100",
  "0001111000",
  "0000110000"
];

blocks.length = 0;

const heartWidth = heartShape[0].length * blockSize;
const heartHeight = heartShape.length * blockSize;

const startX = canvas.width / 2 - heartWidth / 2;
const startY = canvas.height / 2 - heartHeight / 2 - 60;

heartShape.forEach((row, y) => {
  [...row].forEach((cell, x) => {
    if (cell === "1") {
      blocks.push({
        x: startX + x * blockSize,
        y: startY + y * blockSize,
        alive: true
      });
    }
  });
});


// ===== Controls =====
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.w / 2;
});

// ===== Game loop =====
function update() {
  if (!gameStarted) return;
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Walls
  if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.dx *= -1;
  if (ball.y < ball.r) ball.dy *= -1;

  // Paddle
  if (
    ball.y + ball.r > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w
  ) {
    // Отклонение от центра платформы
    const hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2); // [-1, 1]
    // Максимальный угол отклонения
    const maxAngle = Math.PI / 3; // 60 градусов
    // Новый угол
    const angle = hitPos * maxAngle;
    // Скорость
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    // Новые компоненты скорости
    ball.dx = speed * Math.sin(angle);
    ball.dy = -Math.abs(speed * Math.cos(angle));
    ball.y = paddle.y - ball.r;
  }

  // Blocks
  blocks.forEach(b => {
    if (!b.alive) return;
    if (
      ball.x > b.x &&
      ball.x < b.x + blockSize &&
      ball.y > b.y &&
      ball.y < b.y + blockSize
    ) {
      b.alive = false;
      ball.dy *= -1;
    }
  });

  // Lose
  if (ball.y > canvas.height) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 60;
    ball.dy = -3;
  }

  // Win
  if (blocks.every(b => !b.alive)) {
    console.log('You win!');
    reward.classList.remove('hidden');
    return;
  }

  draw();
  requestAnimationFrame(update);
}

// ===== Draw =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Paddle
  ctx.fillStyle = '#a78bfa';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = '#f472b6';
  ctx.fill();

  // Blocks
    blocks.forEach(b => {
    if (!b.alive) return;

    ctx.fillStyle = 'rgba(192,132,252,1)';
    ctx.fillRect(
        Math.round(b.x),
        Math.round(b.y),
        blockSize + 1,
        blockSize + 1
    );
    });

}

draw();

canvas.addEventListener('click', () => {
  if (!gameStarted) {
    gameStarted = true;
    update();
  }
});

