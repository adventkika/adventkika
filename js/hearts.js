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

    if (y < game.clientHeight) {
      requestAnimationFrame(fall);
    } else {
      heart.remove();
    }
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
