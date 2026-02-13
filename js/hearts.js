const game = document.getElementById('game');
const counter = document.getElementById('counter');


let score = 240;

// Настраиваемые цели и сообщения
const goals = [
  { value: 5, text: 'Молодчинка!' },
  { value: 10, text: 'У тебя отлично получается!' },
  { value: 15, text: 'Как ты думаешь тут есть финал?' },
  { value: 20, text: 'Ты просто самая лучшая!' },
  { value: 30, text: '❤️ Они не закончатся точно так же как моя любовь к тебе ❤️' },
  { value: 50, text: 'Моя любовь к тебе вечна так же  как и эта игра 💖' },
  { value: 65, text: 'Я хочу ловить с тобой всё: дни, ночи и моменты ✨' },
  { value: 80, text: 'Каждый раз, когда ты ловишь сердце — я влюбляюсь снова 💘' },
  { value: 100, text: 'Ты просто богиня любви (и красоты)💘' },
  { value: 150, text: 'Финала правда нет. Как и у нас.' },
  { value: 170, text: 'Разработчик этой игры влюблён. Очень.' },
  { value: 200, text: 'Я люблю тебя бесконечно 💞 (но это последнее сообщение)' },
  { value: 250, text: 'Ты невероятная! Но дальше уже точно нет сообщений, так что можешь просто продолжать наслаждаться игрой и моей любовью 💝' },
  // Добавляйте или убирайте цели по желанию
];

const MESSAGE_TIMEOUT = 3500; // мс, сколько показывать сообщение
let messageTimeoutId = null;

// Создаём элемент для сообщений (один на игру)
const messageDiv = document.createElement('div');
messageDiv.id = 'goal-message';
messageDiv.style.position = 'absolute';
messageDiv.style.top = '40%';
messageDiv.style.left = '50%';
messageDiv.style.transform = 'translate(-50%, -50%)';
messageDiv.style.padding = '24px 36px';
messageDiv.style.background = 'rgba(255,255,255,0.92)';
messageDiv.style.borderRadius = '18px';
messageDiv.style.fontSize = '2rem';
messageDiv.style.color = '#c026d3';
messageDiv.style.boxShadow = '0 8px 32px rgba(236, 72, 153, 0.18)';
messageDiv.style.zIndex = '10';
messageDiv.style.display = 'none';
messageDiv.style.textAlign = 'center';
game.appendChild(messageDiv);

function showGoalMessage(text) {
  if (messageTimeoutId) {
    clearTimeout(messageTimeoutId);
    messageTimeoutId = null;
  }
  messageDiv.textContent = text;
  messageDiv.style.display = 'block';
  messageTimeoutId = setTimeout(() => {
    messageDiv.style.display = 'none';
  }, MESSAGE_TIMEOUT);
}

// Для отслеживания уже показанных целей
let shownGoals = new Set();

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
    // Проверяем, достигнута ли новая цель
    for (const goal of goals) {
      if (score === goal.value && !shownGoals.has(goal.value)) {
        showGoalMessage(goal.text);
        shownGoals.add(goal.value);
        break;
      }
    }
    heart.classList.add('pop');
    setTimeout(() => heart.remove(), 200);
  });

  game.appendChild(heart);
  requestAnimationFrame(fall);
}

setInterval(createHeart, 650);
