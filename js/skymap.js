const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// === НАСТРОЙКИ ===
const ANALYSIS_SIZE = 1024*8; // фиксированное разрешение анализа
const BRIGHTNESS_THRESHOLD = 128; // порог яркости для определения звезды
const STAR_CLUSTER_MAX = 24;



// === ДАННЫЕ ===
let stars = [];
let lines = [];

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
    return (
      (data[i] + data[i + 1] + data[i + 2]) / 3 >
      BRIGHTNESS_THRESHOLD
    );
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

  // СБРОС
  stars = [];
  lines = [];

  for (let y = 0; y < ANALYSIS_SIZE; y++) {
    for (let x = 0; x < ANALYSIS_SIZE; x++) {
      const idx = y * ANALYSIS_SIZE + x;
      if (visited[idx]) continue;

      const i = idx * 4;
      if (!isBright(i)) continue;

      const cluster = floodFill(x, y);
      //if (cluster.length < 1) continue;

      // ЦЕНТР КЛАСТЕРА
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
  const dpr = window.devicePixelRatio || 1;

  // CSS размер
  canvas.style.width = cssSize + 'px';
  canvas.style.height = cssSize + 'px';

  // Реальный размер
  canvas.width = Math.round(cssSize * dpr);
  canvas.height = Math.round(cssSize * dpr);

  // Масштабируем систему координат
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ======================
// ОТРИСОВКА
// ======================
function draw() {
  const size = canvas.width;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  // КРУГ-КАРТА
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // СОЗВЕЗДИЯ
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;

  lines.forEach(line => {
    ctx.beginPath();
    line.forEach((p, i) => {
      const x = p.x * size;
      const y = p.y * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  // ЗВЁЗДЫ
  stars.forEach(star => {
    ctx.beginPath();
    const starRadius = Math.max(1, Math.min(2.2, cssSize * 0.003));
    const r = Math.max(0.8, Math.min(1.6, size * 0.002));
ctx.arc(star.x * size, star.y * size, r, 0, Math.PI * 2);

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();
  });
}
