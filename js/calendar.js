const today = new Date();
const currentDay = today.getDate();


document.querySelectorAll('.day').forEach(day => {
  const dayNum = parseInt(day.dataset.day);
  const link = day.dataset.link;
  const icon = day.querySelector('.icon');

  if (currentDay >= dayNum) {
    day.classList.add('active');
    icon.textContent = '✨';
    day.addEventListener('click', () => {
      window.location.href = link;
    });
  } else {
    day.classList.add('locked');
    icon.textContent = '🔒';
  }
});