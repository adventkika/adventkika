const cardsData = [
  { type: "text", text: "Сегодня 14 день." },

{
  type: "question",
  question: "Ты выберешь меня?",
  options: [
    { text: "Да 💜", result: "Я знал, что ты скажешь да. Ты — моя судьба." },
    { text: "Конечно!", result: "И я выбираю тебя. Каждый день." },
    { text: "Всегда.", result: "Тогда это начало нашей бесконечной истории." }
  ]
},

  { 
    type: "reveal",
    preview: "Хочешь узнать секрет?",
    hidden: "Ты — самое лучшее, что случилось со мной."
  },

  {
    type: "promise",
    text: "Я обещаю выбирать тебя каждый день.",
    button: "Я верю тебе 💜"
  }
];


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
    if (!isDragging) return;
    isDragging = false;

    const deltaX = e.clientX - startX;
    const screenWidth = window.innerWidth;
    const SWIPE_THRESHOLD = screenWidth * 0.25;

    card.style.transition = "0.6s cubic-bezier(.22,1,.36,1)";

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      card.style.transform = "translate(-50%, -50%) rotate(0deg)";
      return;
    }

    swipe(card, deltaX > 0 ? "right" : "left");
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




renderStack();
