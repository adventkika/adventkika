const game = document.getElementById('game');
const counter = document.getElementById('counter');

let score = 0;

// Контролируемые значения размера сердечек (в px)
const HEART_MIN_SIZE = 20;
const HEART_MAX_SIZE = 55;


function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = '💗';

  // Рандомный размер сердечка
  const size = HEART_MIN_SIZE + Math.random() * (HEART_MAX_SIZE - HEART_MIN_SIZE);
  heart.style.fontSize = size + 'px';

  let x = Math.random() * (game.clientWidth - size - 10); // Учитываем размер
  let y = -size;
  let speed = 0.4 + Math.random() * 0.6;

  heart.style.left = x + 'px';
  heart.style.top = y + 'px';


  function fall() {
    y += speed;
    heart.style.top = y + 'px';

    // Проверяем, полностью ли сердечко вышло за пределы игрового поля
    const rect = heart.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    const outOfBottom = rect.top > gameRect.bottom;
    const outOfRight = rect.left > gameRect.right;
    const outOfLeft = rect.right < gameRect.left;
    const outOfTop = rect.bottom < gameRect.top;

    if (outOfBottom || outOfRight || outOfLeft || outOfTop) {
      heart.remove();
      return;
    }

    requestAnimationFrame(fall);
  }

  heart.addEventListener('click', () => {
    score++;
    counter.textContent = `💖 ${score}`;
    heart.classList.add('pop');
    setTimeout(() => heart.remove(), 200);
  });

  game.appendChild(heart);
  requestAnimationFrame(fall);
}

setInterval(createHeart, 650);
