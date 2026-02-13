const today = new Date();
const currentDay = 20;
let petalsInterval = null;
let flowersUnlocked = false;
let totalFlowers = 0;
let explodedFlowers = 0;
let finalShown = false;
let secretMode = false;

// Добавляем коэффициенты вероятности для каждого варианта цветка
const flowerVariants = [
  {
    svg: `
      <svg viewBox="0 0 100 100">
        <circle class="center" cx="50" cy="50" r="12" />
        <ellipse class="petal" cx="50" cy="20" rx="10" ry="20" />
        <ellipse class="petal" cx="50" cy="80" rx="10" ry="20" />
        <ellipse class="petal" cx="20" cy="50" rx="20" ry="10" />
        <ellipse class="petal" cx="80" cy="50" rx="20" ry="10" />
        <ellipse class="petal" cx="30" cy="30" rx="12" ry="18" transform="rotate(-45 30 30)" />
        <ellipse class="petal" cx="70" cy="30" rx="12" ry="18" transform="rotate(45 70 30)" />
        <ellipse class="petal" cx="30" cy="70" rx="12" ry="18" transform="rotate(45 30 70)" />
        <ellipse class="petal" cx="70" cy="70" rx="12" ry="18" transform="rotate(-45 70 70)" />
      </svg>
    `,
    probability: 0.53 // коэффициент вероятности появления
  },
  {
    svg: `
      <svg viewBox="0 0 100 100">
        <g>
          <ellipse cx="50" cy="30" rx="14" ry="18" fill="#b9a3e3" />
          <ellipse cx="70" cy="50" rx="14" ry="18" fill="#b9a3e3" transform="rotate(90 70 50)" />
          <ellipse cx="50" cy="70" rx="14" ry="18" fill="#b9a3e3" />
          <ellipse cx="30" cy="50" rx="14" ry="18" fill="#b9a3e3" transform="rotate(90 30 50)" />
          <circle cx="50" cy="50" r="7" fill="#f4728e" />
        </g>
      </svg>
    `,
    probability: 0.33
  },
  {
    svg: `
      <svg viewBox="0 0 100 100">
        <g>
          <ellipse cx="50" cy="20" rx="8" ry="22" fill="#b993f7" />
          <ellipse cx="50" cy="80" rx="8" ry="22" fill="#b993f7" />
          <ellipse cx="20" cy="50" rx="22" ry="8" fill="#b993f7" />
          <ellipse cx="80" cy="50" rx="22" ry="8" fill="#b993f7" />
          <ellipse cx="30" cy="30" rx="10" ry="18" transform="rotate(-45 30 30)" fill="#bca0e6" />
          <ellipse cx="70" cy="30" rx="10" ry="18" transform="rotate(45 70 30)" fill="#bca0e6" />
          <ellipse cx="30" cy="70" rx="10" ry="18" transform="rotate(45 30 70)" fill="#bca0e6" />
          <ellipse cx="70" cy="70" rx="10" ry="18" transform="rotate(-45 70 70)" fill="#bca0e6" />
          <circle  cx="50" cy="50" r="10" fill="#f472c9" />
        </g>
      </svg>
    `,
    probability: 0.14
  }
];


// ===== Advent buttons =====
document.querySelectorAll('.day').forEach(day => {
  const dayNum = parseInt(day.dataset.day);
  const link = day.dataset.link;
  const icon = day.querySelector('.icon');

  if (currentDay >= dayNum) {
    day.classList.remove('locked');
    day.classList.add('active');
    day.style.opacity = '1';
    icon.textContent = '✨';
    day.addEventListener('click', () => {
      window.location.href = link;
    });
  } else {
    day.classList.add('locked');
    icon.textContent = '🔒';
  }
});

// ===== Flowers logic =====

const flowersContainer = document.querySelector('.flowers');

// Управляемые переменные:
const MAX_FLOWERS = 270; // максимальное количество цветов (меняйте по желанию)
const FLOWER_DENSITY = 0.5; // плотность (0.1 - очень разреженно, 1 - максимально плотно)

const startDay = 10;
const endDay = 14;
const progress = Math.min(Math.max(currentDay - startDay + 1, 0), endDay - startDay + 1) / (endDay - startDay + 1);
const bloomedCount = Math.round(MAX_FLOWERS * progress);

// Генерация цветов с учетом плотности
const minDist = 10 * (1 - FLOWER_DENSITY); // минимальное расстояние между цветами (в процентах)
const positions = [];

function getRandomPosition() {
  let tries = 0;
  while (tries < 50) {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    let tooClose = false;
    for (const pos of positions) {
      const dist = Math.sqrt(Math.pow(top - pos.top, 2) + Math.pow(left - pos.left, 2));
      if (dist < minDist) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) {
      positions.push({ top, left });
      return { top, left };
    }
    tries++;
  }
  // Если не удалось найти подходящее место, возвращаем случайное
  return { top: Math.random() * 100, left: Math.random() * 100 };
}

// Функция для выбора варианта цветка с учетом коэффициентов вероятности
function pickFlowerVariant() {
  const total = flowerVariants.reduce((sum, v) => sum + v.probability, 0);
  let rand = Math.random() * total;
  for (const variant of flowerVariants) {
    if (rand < variant.probability) {
      return variant.svg;
    }
    rand -= variant.probability;
  }
  // fallback
  return flowerVariants[0].svg;
}

for (let i = 0; i < MAX_FLOWERS; i++) {
  const flower = document.createElement('div');
  flower.classList.add('flower');

  const pos = getRandomPosition();
  flower.style.top = pos.top + '%';
  flower.style.left = pos.left + '%';
  flower.style.transitionDelay = Math.random() * 1 + 's';

  // Сохраняем рандомный поворот в кастомное свойство
  const rotation = Math.random() * 360;
  flower.style.setProperty('--flower-rotation', `${rotation.toFixed(1)}deg`);

  flower.innerHTML = pickFlowerVariant();

  flowersContainer.appendChild(flower);

  if (i < bloomedCount) {
    requestAnimationFrame(() => {
      flower.classList.add('bloomed');
    });
  }
}

document.querySelectorAll('.flower').forEach(flower => {
  const scale = 0.7 + Math.random() * 0.45; // 0.7–1.15
  flower.style.setProperty('--flower-scale', scale.toFixed(2));

  const swaySpeed = 5 + Math.random() * 4; // разная скорость
  flower.style.animationDuration = `${swaySpeed}s`;
});

document.querySelectorAll('.flower').forEach(flower => {
  const delay = Math.random() * 4;
  flower.style.animationDelay = `-${delay}s`;
});


document.querySelectorAll('.day').forEach(day => {
  const dayNum = parseInt(day.dataset.day);
  const link = day.dataset.link;
  const icon = day.querySelector('.icon');

  if (currentDay >= dayNum) {
    day.classList.remove('locked');
    day.classList.add('active');
    day.style.opacity = '1';
    icon.textContent = '✨';
    day.addEventListener('click', () => {
      window.location.href = link;
    });
  } else {
    day.classList.add('locked');
    icon.textContent = '🔒';
  }
});

// ===== Falling petals on Feb 14 =====
if (currentDay >= 14) {
  const petalsContainer = document.querySelector('.petals');

  // Для равномерного распределения по ширине
  let petalIndex = 0;
  const PETALS_PER_CYCLE = 16; // можно менять для более/менее равномерности

  function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    // Равномерно по ширине + небольшой рандом
    const baseLeft = (petalIndex % PETALS_PER_CYCLE) * (100 / PETALS_PER_CYCLE);
    const randomOffset = (Math.random() - 0.5) * (100 / PETALS_PER_CYCLE * 0.7); // до ±35% ширины сектора
    let left = baseLeft + randomOffset;
    left = Math.max(0, Math.min(100, left));
    petal.style.left = left + '%';
    petalIndex++;

    // Лепесток появляется за пределами экрана сверху
    petal.style.top = '-12%';

    const size = 22 + Math.random() * 28; // увеличено: 22–50px
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';

    const duration = 12 + Math.random() * 10;
    petal.style.animationDuration = duration + 's';

    // Задержка появления, чтобы не было резких всплесков
    petal.style.animationDelay = Math.random() * 5 + 's';

    petal.innerHTML = `
      <svg viewBox="0 0 100 100">
        <path
          d="M50 10
             C65 25, 90 40, 50 90
             C10 40, 35 25, 50 10Z"
          fill="rgba(236, 72, 153, 0.65)"
        />
      </svg>
    `;

    petalsContainer.appendChild(petal);

    // Удаляем лепесток только после того, как он полностью скроется за нижней границей экрана
    setTimeout(() => {
      petal.remove();
    }, (duration + 1) * 1000); // +1 секунда для гарантии ухода за экран
  }

  // создаём лепестки чаще для большей плотности
  petalsInterval = setInterval(createPetal, 200);
}


// ===== Secret keyboard code: kika =====

let secretInput = '';
const secretCode = 'kika';

document.addEventListener('keydown', (e) => {
  secretInput += e.key.toLowerCase();

  // оставляем только последние 4 символа
  if (secretInput.length > secretCode.length) {
    secretInput = secretInput.slice(-secretCode.length);
  }

  if (secretInput === secretCode) {
    triggerSecretEffect();
  }
});

function triggerSecretEffect() {

  const title = document.querySelector('h1');
  if (title) {
    title.style.animation = 'none';
    void title.offsetWidth;
    title.classList.add('fade-out-title');
  }

  const cards = document.querySelectorAll('.day');

  cards.forEach((card, index) => {
    setTimeout(() => {

      card.style.animation = 'none';
      void card.offsetWidth;
      card.classList.add('fade-out');

      // Если это последняя карточка — ждём её исчезновения
      if (index === cards.length - 1) {
        card.addEventListener('animationend', () => {
          activateFlowerLayer();
        }, { once: true });
      }

    }, index * 100);
  });

  if (petalsInterval) {
    clearInterval(petalsInterval);
    petalsInterval = null;
  }

  flowersUnlocked = true;
}

function activateFlowerLayer() {

  secretMode = true;
  console.log('🔓 Секретный режим активирован');

  const flowersContainer = document.querySelector('.flowers');
  if (!flowersContainer) return;

  flowersContainer.style.pointerEvents = 'auto';
  flowersContainer.style.zIndex = '2';

   removePhysicallyHiddenFlowers();

  // 🔥 считаем РЕАЛЬНО доступные цветы
  totalFlowers = document.querySelectorAll('.flower.bloomed').length;
  explodedFlowers = 0;

  console.log('🎯 Реально цветов для взрыва:', totalFlowers);

  enableFlowerExplosions();
}

function removePhysicallyHiddenFlowers() {

  const flowers = document.querySelectorAll('.flower.bloomed:not(.boomed)');

  flowers.forEach(flower => {
    const rect = flower.getBoundingClientRect();

    if (
      rect.bottom > window.innerHeight ||
      rect.right > window.innerWidth
    ) {
      console.log('🧹 Удалён уехавший цветок');
      flower.remove();
    }
  });

}

function enableFlowerExplosions() {

  document.querySelectorAll('.flower.bloomed').forEach(flower => {

flower.addEventListener('click', (e) => {

  explodeFlower(flower);
});

  });
}

function explodeFlower(flower) {

  if (flower.classList.contains('boomed')) return;

  flower.classList.add('exploding');

  const rect = flower.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const PARTICLES = 12 + Math.floor(Math.random() * 6);

  for (let i = 0; i < PARTICLES; i++) {

    const petal = document.createElement('div');
    petal.className = 'flower-particle';

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 80;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 40;

    petal.style.left = centerX + 'px';
    petal.style.top = centerY + 'px';
    petal.style.setProperty('--x', `${x}px`);
    petal.style.setProperty('--y', `${y}px`);

    document.body.appendChild(petal);

    setTimeout(() => petal.remove(), 900);
  }

  // запускаем fade-out
  flower.classList.add('boomed');
  
flower.addEventListener('animationend', () => {

  flower.remove();
  explodedFlowers++;

  console.log('🌸 Лопнуто:', explodedFlowers);
  console.log('🎯 Всего нужно:', totalFlowers);

  checkAllFlowersExploded();

}, { once: true });
}
function checkAllFlowersExploded() {

  const remaining = document.querySelectorAll('.flower.bloomed').length;

  if (remaining === 0) {
    showFinalImage();
  }
}

function showFinalImage() {

  if (finalShown) return;
  finalShown = true;

  console.log('🎉 ФИНАЛЬНАЯ АНИМАЦИЯ ЗАПУЩЕНА');

  const wrapper = document.createElement('div');
  wrapper.className = 'final-image-wrapper';

  const img = document.createElement('img');
  img.src = 'img/photos/kinich.png';
  img.className = 'final-image';

  wrapper.appendChild(img);
  document.body.appendChild(wrapper);

  spawnMiniImages();
}

function spawnMiniImages() {

  const MINI_COUNT = 300;

  // 📂 список возможных файлов
  const miniImages = [
    'img/photos/mango1.png',
    'img/photos/mango2.png',
    'img/photos/mango3.png',
    'img/photos/mango4.png',
    'img/photos/mango5.png',
    'img/photos/mango6.png',
    'img/photos/mango7.png',
    'img/photos/mango8.png',
    'img/photos/mango9.png'
  ];

  for (let i = 0; i < MINI_COUNT; i++) {

    const mini = document.createElement('img');

    // 🎲 случайная картинка из списка
    const randomSrc =
      miniImages[Math.floor(Math.random() * miniImages.length)];

    mini.src = randomSrc;
    mini.className = 'mini-final-image';

    // 🎲 случайная позиция
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    mini.style.left = x + 'px';
    mini.style.top = y + 'px';

    // 🎲 случайный размер
    const randomSize = 60 + Math.random() * 80; 
    // от 60px до 140px
    mini.style.width = randomSize + 'px';

    // 🎲 случайная задержка появления
    mini.style.animationDelay = (Math.random() * 0.6) + 's';

    document.body.appendChild(mini);
  }
}

function removeOffscreenFlowers() {

  const flowers = document.querySelectorAll('.flower.bloomed');
  let removed = 0;

  flowers.forEach(flower => {

    const rect = flower.getBoundingClientRect();

    const isOutside =
      rect.bottom < 0 ||
      rect.top > window.innerHeight ||
      rect.right < 0 ||
      rect.left > window.innerWidth;

    if (isOutside) {
      flower.remove();
      removed++;
    }

  });

  console.log('🧹 Удалено внеэкранных цветов:', removed);
}

document.addEventListener('keydown', (e) => {

  if (e.key.toLowerCase() !== 'd') return;

  console.log('====== 🔍 DEBUG ОСТАВШИХСЯ ЦВЕТОВ ======');

  const remaining = document.querySelectorAll('.flower.bloomed:not(.boomed)');

  console.log('🌸 Осталось:', remaining.length);

  remaining.forEach((flower, index) => {

    const rect = flower.getBoundingClientRect();
    const style = getComputedStyle(flower);

    const isVisible =
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth &&
      style.opacity !== '0' &&
      style.display !== 'none' &&
      style.visibility !== 'hidden';

    console.log(`--- Цветок ${index + 1} ---`);
    console.log('📍 top:', rect.top);
    console.log('📍 left:', rect.left);
    console.log('📏 width:', rect.width);
    console.log('📏 height:', rect.height);
    console.log('👀 Видим в окне?', isVisible);

    // 🔥 временно подсветим его
    flower.style.outline = '3px solid red';
    flower.style.zIndex = '9999';

  });

});

document.addEventListener('keydown', (e) => {

  if (e.key.toLowerCase() !== 'x') return;

  if (!secretMode) {return;}

  const remaining = document.querySelectorAll('.flower.bloomed:not(.boomed)');

  remaining.forEach((flower, index) => {
    setTimeout(() => {
      explodeFlower(flower);
    }, index * 10); // каскадный взрыв
  });

});