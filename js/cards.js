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

  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    card.style.transition = "none";
  });

card.addEventListener("pointermove", e => {
  if (!startX) return;
  const deltaX = e.clientX - startX;

  card.style.transform = `
    translate(calc(-50% + ${deltaX}px), -50%)
    rotate(${deltaX / 15}deg)
  `;
});


  card.addEventListener("pointerup", e => {
    const deltaX = e.clientX - startX;
    card.style.transition = "0.3s";

    if (deltaX > 120) {
      swipe(card, "right");
    } else if (deltaX < -120) {
      swipe(card, "left");
    } else {
     card.style.transform = `
        translate(-50%, -50%)
    `;
    }

    startX = 0;
  });
}

function swipe(card, direction) {
  card.style.transform =
    direction === "right"
      ? "translateX(500px) rotate(20deg)"
      : "translateX(-500px) rotate(-20deg)";

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < cardsData.length) {
      renderStack();
    } else {
      container.innerHTML =
        "<div class='card'>Это только начало нашей истории 💜</div>";
    }
  }, 300);
}

renderStack();
