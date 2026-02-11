const cardsData = [
  { text: "Сегодня 14 день." },
  { text: "И он для меня особенный." },
  { text: "Потому что я хочу сказать тебе кое-что важное." },
  { text: "Ты — самый важный человек в моей жизни." },
  { text: "И я выбираю тебя. Каждый день." }
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
  card.innerText = data.text;

  const offset = position * 12;

  card.style.transform = `
    translate(-50%, calc(-50% - ${offset}px))
  `;

  card.style.top = "50%";
  card.style.left = "50%";

  card.style.zIndex = 100 - position;

  if (position === 0) {
    enableSwipe(card);
  }

  return card;
}



function enableSwipe(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const DRAG_START_THRESHOLD = 10;

  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    currentX = e.clientX;
    isDragging = true;
    card.style.transition = "none";
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!isDragging) return;

    currentX = e.clientX;
    const deltaX = currentX - startX;

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

    // 🔥 порог = половина ширины экрана
    const SWIPE_THRESHOLD = screenWidth * 0.3;

    card.style.transition = "1s cubic-bezier(.22,1,.36,1)";

    // если меньше половины экрана — возвращаем
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
  const cards = container.querySelectorAll(".card");

  cards.forEach((card, index) => {
    const offset = index * 12;

    card.style.transition = "0.5s cubic-bezier(.22,1,.36,1)";
    card.style.transform = `
      translate(-50%, calc(-50% - ${offset}px))
    `;
    card.style.zIndex = 100 - index;

    if (index === 0) {
      enableSwipe(card);
    }
  });

  // Добавляем новую карточку в низ стопки
  const newIndex = currentIndex + visibleCards - 1;

  if (newIndex < cardsData.length) {
    const newCard = createCard(cardsData[newIndex], visibleCards - 1);
    newCard.style.opacity = "0";
    container.appendChild(newCard);

    requestAnimationFrame(() => {
      newCard.style.transition = "0.3s ease";
      newCard.style.opacity = "1";
    });
  }
}



renderStack();
