const today = new Date();
const currentDay = 14;

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
const MAX_FLOWERS = 300; // максимальное количество цветов (меняйте по желанию)
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
