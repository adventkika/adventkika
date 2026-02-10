const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// === НАСТРОЙКИ ===
const ANALYSIS_SIZE = 1024 * 8; // фиксированное разрешение анализа
const BRIGHTNESS_THRESHOLD = 128;
const STAR_CLUSTER_MAX = 24;

// === ДАННЫЕ ===
let stars = [];
let lines = [];
const SPECIAL_STAR = {
  x: 0.4724, 
  y: 0.4232,
  text: 'И среди всего этого неба ты была самой яркой'
};


const img = new Image();
img.src = 'img/photos/skymap.gif';

img.onload = () => {
  analyzeImage();
  resizeCanvas();
  draw();
};

window.addEventListener('resize', () => {
  resizeCanvas();
  draw();
});

// ======================
// АНАЛИЗ КАРТИНКИ (1 раз)
// ======================
function analyzeImage() {
  const temp = document.createElement('canvas');
  temp.width = ANALYSIS_SIZE;
  temp.height = ANALYSIS_SIZE;

  const tctx = temp.getContext('2d', {
    willReadFrequently: true
  });

  tctx.drawImage(img, 0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);

  const imageData = tctx.getImageData(0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);
  const data = imageData.data;
  const visited = new Uint8Array(ANALYSIS_SIZE * ANALYSIS_SIZE);

  function isBright(i) {
    return (data[i] + data[i + 1] + data[i + 2]) / 3 > BRIGHTNESS_THRESHOLD;
  }

  function floodFill(x0, y0) {
    const stack = [[x0, y0]];
    const cluster = [];

    while (stack.length) {
      const [x, y] = stack.pop();
      const idx = y * ANALYSIS_SIZE + x;
      if (visited[idx]) continue;
      visited[idx] = 1;

      const i = idx * 4;
      if (!isBright(i)) continue;

      cluster.push({ x, y });

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < ANALYSIS_SIZE &&
            ny < ANALYSIS_SIZE
          ) {
            stack.push([nx, ny]);
          }
        }
      }
    }
    return cluster;
  }

  stars = [];
  lines = [];

  for (let y = 0; y < ANALYSIS_SIZE; y++) {
    for (let x = 0; x < ANALYSIS_SIZE; x++) {
      const idx = y * ANALYSIS_SIZE + x;
      if (visited[idx]) continue;

      const i = idx * 4;
      if (!isBright(i)) continue;

      const cluster = floodFill(x, y);

      let sx = 0, sy = 0;
      cluster.forEach(p => {
        sx += p.x;
        sy += p.y;
      });

      const cx = sx / cluster.length / ANALYSIS_SIZE;
      const cy = sy / cluster.length / ANALYSIS_SIZE;

      if (cluster.length <= STAR_CLUSTER_MAX) {
        stars.push({ x: cx, y: cy });
      } else {
        lines.push(
          cluster.map(p => ({
            x: p.x / ANALYSIS_SIZE,
            y: p.y / ANALYSIS_SIZE
          }))
        );
      }
    }
  }

  console.log(`⭐ Звёзд найдено: ${stars.length}`);
  console.log(`✨ Линий созвездий: ${lines.length}`);
}

// ======================
// CANVAS
// ======================
function resizeCanvas() {
  const wrapper = canvas.parentElement;
  const cssSize = wrapper.clientWidth;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.style.width = cssSize + 'px';
  canvas.style.height = cssSize + 'px';

  canvas.width = Math.round(cssSize * dpr);
  canvas.height = Math.round(cssSize * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

// ======================
// ОТРИСОВКА
// ======================
function draw() {
  const wrapper = canvas.parentElement;
  const cssSize = wrapper.clientWidth;

  ctx.clearRect(0, 0, cssSize, cssSize);

  const cx = cssSize / 2;
  const cy = cssSize / 2;
  const radius = cssSize / 2 - 2;

  // === ГРАНИЦА КАРТЫ ===
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // === СМЕЩЕНИЕ КАРТЫ В ЦЕНТР ===
  ctx.save();
  ctx.translate(cx - cssSize / 2, cy - cssSize / 2);

  // === СОЗВЕЗДИЯ ===
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;

  lines.forEach(line => {
    ctx.beginPath();
    line.forEach((p, i) => {
      const x = p.x * cssSize;
      const y = p.y * cssSize;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  // === ЗВЁЗДЫ ===
  const starRadius = Math.max(1, Math.min(2.2, cssSize * 0.003));

  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(
      star.x * cssSize,
      star.y * cssSize,
      starRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();
  });

  // === ОСОБАЯ ЗВЕЗДА ===
const sx = SPECIAL_STAR.x * cssSize;
const sy = SPECIAL_STAR.y * cssSize;

// свечение
const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 20);
glow.addColorStop(0, 'rgba(255,255,255,0.9)');
glow.addColorStop(0.4, 'rgba(249,168,212,0.6)');
glow.addColorStop(1, 'rgba(249,168,212,0)');

ctx.beginPath();
ctx.arc(sx, sy, 20, 0, Math.PI * 2);
ctx.fillStyle = glow;
ctx.fill();

// сама звезда
ctx.beginPath();
ctx.arc(sx, sy, 3, 0, Math.PI * 2);
ctx.fillStyle = '#ffffff';
ctx.fill();


  ctx.restore();
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) / rect.width;
  const my = (e.clientY - rect.top) / rect.height;

  const dx = mx - SPECIAL_STAR.x;
  const dy = my - SPECIAL_STAR.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 0.03) {
    showStarModal();
  }
});

const modal = document.getElementById('starModal');

function showStarModal() {
  modal.classList.add('show');
}

modal.addEventListener('click', () => {
  modal.classList.remove('show');
});


