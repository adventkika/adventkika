const cardsData = [
  { type: "text", text: "Сегодня 14 февраля." },

  { type: "text", text: "И я хочу кое-что тебе сказать..." },

  {
    type: "question",
    question: "Помнишь день, когда мы познакомились?",
    options: [
      { text: "Конечно 💜", result: "Тогда всё и началось. Самая важная глава моей жизни." },
      { text: "Смутно 🤭", result: "Не ври я знаю что ты помнишь!" },
      { text: "А что?", result: "А то, что именно тогда моя жизнь стала ярче." }
    ]
  },
  {
  type: "text",
  text: "Я тогда даже не представлял, насколько ты изменишь мою жизнь."
},
{
  type: "text",
  text: "Но сейчас понимаю — это был самый важный день."
},

  {
    type: "reveal",
    preview: "Хочешь маленькое признание?",
    hidden: "С того дня я стал самым счастливым человеком."
  },

  {
    type: "question",
    question: "Ты знаешь, что ты для меня?",
    options: [
      { text: "Любовь?", result: "Больше, чем любовь. Ты — мое все." },
      { text: "Счастье?", result: "Да. И не только. Ведь ты ты что то куда большее" },
      { text: "Всё?", result: "Абсолютно всё." }
    ]
  },
  {
  type: "text",
  text: "Иногда мне кажется, что я не всегда говорю это вслух..."
},
{
  type: "reveal",
  preview: "Но на самом деле...",
  hidden: "Ты — лучшее, что случилось со мной за всю жизнь."
},
  { type: "text", text: "И если бы мне дали еще сколько угодно шансов..." },

  { type: "text", text: "Я бы снова выбрал тебя." },

  {
    type: "question",
    question: "Знаешь, почему?",
    options: [
      { text: "Почему?", result: "Потому что с тобой я чувствую себя на своем месте." },
      { text: "Интересно", result: "Потому что ты нет места в мире лучше чем рядом с тобой." },
      { text: "Скажи...", result: "Потому что я еще не разу не пожалел о своем выборе." }
    ]
  },

  {
    type: "reveal",
    preview: "Знаешь что я чувствую рядом с тобой?",
    hidden: "С тобой я чувствую спокойствие, тепло и уверенность."
  },
  {
  type: "text",
  text: "Иногда я думаю о будущем..."
},
{
  type: "text",
  text: "О моментах, которые нас ждут."
},
  {
    type: "question",
    question: "И порой я думаю о том что было бы если бы я мог остановить время",
    options: [
      { text: "Остановил бы?", result: "Только в моменты, когда ты смеёшься." },
      { text: "Не нужно", result: "Согласен. Потому что с тобой хочется прожить каждую секунду." },
      { text: "Зачем?", result: "Чтобы подольше смотреть в твои глаза." }
    ]
  },

  {
    type: "text",
    text: "Но все же..."
  },

  {
    type: "text",
    text: "Мне не нужно останавливать время."
  },

  {
    type: "reveal",
    preview: "Почему?",
    hidden: "Потому что я хочу прожить его с тобой. Всё. До последней секунды."
  },

  {
  type: "text",
  text: "И чем больше проходит времени..."
},
{
  type: "text",
  text: "Тем сильнее я понимаю одну вещь."
},

  {
    type: "question",
    question: "Можно я буду любить тебя чуть сильнее с каждым днём?",
    options: [
      { text: "Можно 💜", result: "Тогда готовься… я только начинаю." },
      { text: "Попробуй", result: "С удовольствием. Это мой любимый вызов." },
      { text: "Я тоже буду", result: "Это все о чем я мог только мечтать." }
    ]
  },

  {
  type: "text",
  text: "Тогда осталось лишь одно..."
},

  {
    type: "reveal",
    preview: "Последнее признание",
    hidden: "Я люблю тебя. Сегодня. Завтра. И каждый следующий день."
  }

];


let isBackgroundTransitioning = false;
let pendingBackgroundProgress = null;
const START_DATE = new Date("2024-08-29T23:00:00");
let isDarkLayerActive = false;
const container = document.getElementById("card-container");

let currentIndex = 0;
const visibleCards = 3; // сколько видно в стопке

function renderStack() {
  container.innerHTML = "";

  for (let i = visibleCards - 1; i >= 0; i--) {
    const dataIndex = currentIndex + i;
    if (dataIndex >= cardsData.length) continue;

    const card = createCard(cardsData[dataIndex], i);
    container.appendChild(card);
  }
}

function createCard(data, position) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.style.top = "50%";
  card.style.left = "50%";
  card.style.zIndex = 100 - position;

  const offset = position * 12;

  card.style.transform = `
    translate(-50%, calc(-50% - ${offset}px))
  `;

  // 🔥 Рендер по типу карточки
  if (data.type === "text") {
    card.innerHTML = `<p>${data.text}</p>`;
  }

if (data.type === "question") {

  card.dataset.locked = "true"; // 🔒 блокируем свайп

  card.innerHTML = `
    <div class="card-content question-card">
      <p class="question-text">${data.question}</p>
      <div class="options">
        ${data.options
          .map(
            (opt, index) =>
              `<button class="option-btn" data-index="${index}">
                ${opt.text}
              </button>`
          )
          .join("")}
      </div>
      <div class="answer"></div>
    </div>
  `;

  const buttons = card.querySelectorAll(".option-btn");
  const answerBlock = card.querySelector(".answer");
  const optionsBlock = card.querySelector(".options");

  buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();

      const index = btn.dataset.index;
      const resultText = data.options[index].result;

      optionsBlock.classList.add("fade-out");

      setTimeout(() => {
        optionsBlock.style.display = "none";

        answerBlock.innerText = resultText;
        answerBlock.classList.add("show-answer");

        // 🔓 разблокируем свайп
        card.dataset.locked = "false";

        // 💜 лёгкий импульс, чтобы показать что можно свайпнуть
        card.classList.add("unlocked");
        setTimeout(() => card.classList.remove("unlocked"), 600);

      }, 300);
    });
  });
}


if (data.type === "choice") {
  card.innerHTML = `
    <div class="card-content">
      <p class="question">${data.question}</p>
      <div class="options">
        ${data.options.map(opt => 
          `<button class="option-btn">${opt}</button>`
        ).join("")}
      </div>
    </div>
  `;

  card.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      card.querySelectorAll(".option-btn").forEach(b => 
        b.classList.remove("selected")
      );
      btn.classList.add("selected");
    });
  });
}


  if (data.type === "promise") {
    card.innerHTML = `
      <p>${data.text}</p>
      <button class="main-btn">${data.button}</button>
    `;

    card.querySelector(".main-btn").addEventListener("click", () => {
      card.classList.add("accepted");
    });
  }

if (data.type === "reveal") {

  card.dataset.locked = "true";

  card.innerHTML = `
    <div class="card-content">
      <p class="preview">${data.preview}</p>
      <p class="hidden-text blurred">${data.hidden}</p>
    </div>
  `;

  const hidden = card.querySelector(".hidden-text");

  const revealHandler = (e) => {
    e.stopPropagation();

    // запускаем анимацию
    hidden.classList.remove("blurred");
    hidden.classList.add("revealed");

    // разблокируем свайп
    card.dataset.locked = "false";

    card.classList.add("unlocked");
    setTimeout(() => card.classList.remove("unlocked"), 600);

    // 🔥 ждём завершения transition
    hidden.addEventListener("transitionend", () => {
      hidden.style.pointerEvents = "none";
      hidden.removeEventListener("click", revealHandler);
    }, { once: true });
  };

  hidden.addEventListener("click", revealHandler);
}



  if (position === 0) {
    enableSwipe(card);
  }

  return card;
}




function enableSwipe(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const DRAG_START_THRESHOLD = 15;

  function endDrag(e, isPointerUp = false) {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = (e && e.clientX !== undefined) ? e.clientX - startX : 0;
    const screenWidth = window.innerWidth;
    const SWIPE_THRESHOLD = screenWidth * 0.25;

    card.style.transition = "0.6s cubic-bezier(.22,1,.36,1)";

    if (isPointerUp && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      swipe(card, deltaX > 0 ? "right" : "left");
    } else {
      card.style.transform = "translate(-50%, -50%) rotate(0deg)";
    }
  }

  card.addEventListener("pointerdown", e => {
    const isOption = e.target.closest(".option-btn");
    const isHidden = e.target.closest(".hidden-text");

    // ❗ если нажали на кнопку ответа — не свайпаем
    if (isOption) return;

    // ❗ если нажали на скрытый текст И карточка ещё заблокирована — не свайпаем
    if (isHidden && card.dataset.locked === "true") return;

    startX = e.clientX;
    currentX = e.clientX;
    isDragging = true;

    card.setPointerCapture(e.pointerId);
    card.style.transition = "none";
  });

  card.addEventListener("pointermove", e => {
    if (!isDragging) return;

    currentX = e.clientX;
    const deltaX = currentX - startX;

    // 🔒 если карточка заблокирована
    if (card.dataset.locked === "true") {
      // только если реально тянут
      if (Math.abs(deltaX) > DRAG_START_THRESHOLD) {
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
        isDragging = false;
      }
      return;
    }

    if (Math.abs(deltaX) < DRAG_START_THRESHOLD) return;

    const rotate = deltaX / 18;

    card.style.transform = `
      translate(calc(-50% + ${deltaX}px), -50%)
      rotate(${rotate}deg)
    `;
  });

  card.addEventListener("pointerup", e => {
    endDrag(e, true);
    card.releasePointerCapture(e.pointerId);
  });

  card.addEventListener("pointerleave", e => {
    endDrag(e, false);
  });

  card.addEventListener("pointercancel", e => {
    endDrag(e, false);
  });
}


function swipe(card, direction) {
  const offX = direction === "right" ? window.innerWidth : -window.innerWidth;
  const offY = -window.innerHeight * 0.15;
  const rotate = direction === "right" ? 25 : -25;

  card.style.transition = "0.6s cubic-bezier(.22,1,.36,1)";
  card.style.transform = `
    translate(calc(-50% + ${offX}px), calc(-50% + ${offY}px))
    rotate(${rotate}deg)
  `;
  card.style.opacity = "0";

  setTimeout(() => {
    card.remove(); // удаляем только верхнюю

  currentIndex++;
  updateBackground();

if (currentIndex >= cardsData.length) {
  launchFinalScene();
}

    updateStack(); // плавно обновляем позиции

  }, 200);
}

function updateStack() {
  const cards = Array.from(container.querySelectorAll(".card"));

  cards.forEach((card, i) => {
    const position = cards.length - 1 - i; 
    // 🔥 переворачиваем индекс — теперь нижняя карта = 2, средняя = 1, верхняя = 0

    const offset = position * 12;

    card.style.transition = "0.5s cubic-bezier(.22,1,.36,1)";
    card.style.transform = `
      translate(-50%, calc(-50% - ${offset}px))
    `;

    card.style.zIndex = 100 - position;

    if (position === 0) {
      enableSwipe(card);
    }
  });

  // Добавляем новую карточку в самый низ
  const newIndex = currentIndex + visibleCards - 1;

  if (newIndex < cardsData.length) {
    const newCard = createCard(cardsData[newIndex], visibleCards - 1);
    newCard.style.opacity = "0";

    // 👇 вставляем В НАЧАЛО, а не в конец
    container.insertBefore(newCard, container.firstChild);

    requestAnimationFrame(() => {
      newCard.style.transition = "0.4s ease";
      newCard.style.opacity = "1";
    });
  }
}

function updateBackground() {

  const total = cardsData.length;
  const progress = currentIndex / total;

  // если уже идёт анимация — просто запоминаем
  if (isBackgroundTransitioning) {
    pendingBackgroundProgress = progress;
    return;
  }

  const body = document.body;
  isBackgroundTransitioning = true;

  const topLightness = 85 - progress * 55;
  const bottomLightness = 75 - progress * 60;

  const newGradient = `
    linear-gradient(
      to bottom,
      hsl(270, 60%, ${topLightness}%),
      hsl(260, 70%, ${bottomLightness}%)
    )
  `;

  // применяем новый фон во второй слой
  body.style.setProperty('--next-bg', newGradient);
  body.classList.add('bg-transitioning');
}
function createStars() {
  const starsContainer = document.createElement("div");
  starsContainer.classList.add("stars");
  document.body.appendChild(starsContainer);

  const totalStars = 200;
  const appearDuration = 8000;
  const fadeDuration = 3000; // должно совпадать с transition в CSS

  for (let i = 0; i < totalStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";

    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    starsContainer.appendChild(star);

    const delay = Math.random() * appearDuration;

    setTimeout(() => {
      // 1️⃣ Плавное появление
      star.classList.add("visible");

      // 2️⃣ Включаем мерцание только после завершения fade-in
      setTimeout(() => {
        star.classList.add("twinkle");
      }, fadeDuration);

    }, delay);
  }
}

function startTimer() {
  const timer = document.createElement("div");
  timer.classList.add("timer");
  document.body.appendChild(timer);

  function update() {
    const now = new Date();
    const diff = now - START_DATE;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

timer.innerHTML = `
  <div class="timer-title">С той самой ночи прошло</div>

  <div class="timer-count">
    ${days} дней<br>
    ${hours} часов ${minutes} минут ${seconds} секунд
  </div>

  <div class="timer-sub">
    и это только начало
  </div>
`;
  }

  update();
  setInterval(update, 1000);

  // 🔥 ключевой момент — двойной requestAnimationFrame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      timer.classList.add("visible");
    });
  });
}
function launchFinalScene() {

  // 1️⃣ Появляются звёзды
  createStars();

  // 2️⃣ Через 3 секунды появляется таймер
  setTimeout(() => {
    startTimer();
    startShootingStars();
  }, 9000);
}

function createShootingStar() {
  const star = document.createElement("div");
  star.classList.add("shooting-star");

  const head = document.createElement("div");
  head.classList.add("head");

  const tail = document.createElement("div");
  tail.classList.add("tail");

  star.appendChild(tail);
  star.appendChild(head);

  star.style.top = Math.random() * 40 + "%";
  star.style.left = Math.random() * 60 + "%";

  document.body.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, 2000);
}

function startShootingStars() {
  function randomInterval() {
    const delay = 6000 + Math.random() * 6000; // 6–12 секунд

    setTimeout(() => {
      createShootingStar();
      randomInterval();
    }, delay);
  }

  randomInterval();
}

document.body.addEventListener('transitionend', (e) => {

  if (!document.body.classList.contains('bg-transitioning')) return;
  if (e.propertyName !== 'opacity') return;

  const body = document.body;

  // переносим новый фон в основной
  const nextBg = getComputedStyle(body).getPropertyValue('--next-bg');
  body.style.setProperty('--current-bg', nextBg);

  body.classList.remove('bg-transitioning');

  isBackgroundTransitioning = false;

  // если во время анимации был ещё свайп
  if (pendingBackgroundProgress !== null) {
    const saved = pendingBackgroundProgress;
    pendingBackgroundProgress = null;

    // запускаем новую смену
    updateBackground(saved);
  }
});

renderStack();

