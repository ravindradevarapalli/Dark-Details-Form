function updateClock() {
  let now = new Date();
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let seconds = String(now.getSeconds()).padStart(2, "0");

  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (hoursElement && minutesElement && secondsElement) {
    flipDigit(hoursElement, hours);
    flipDigit(minutesElement, minutes);
    flipDigit(secondsElement, seconds);
  }
}

function flipDigit(flipCard, newValue) {
  let topHalf = flipCard.querySelector(".top");
  let bottomHalf = flipCard.querySelector(".bottom");
  let flipTop = flipCard.querySelector(".flip-top");
  let flipBottom = flipCard.querySelector(".flip-bottom");

  let currentValue = topHalf.textContent;
  if (currentValue === newValue) return;

  flipTop.textContent = currentValue;
  flipBottom.textContent = newValue;

  flipTop.style.animation = "flip 0.6s ease-in-out";
  flipBottom.style.animation = "flip 0.6s ease-in-out reverse";

  setTimeout(() => {
    topHalf.textContent = newValue;
    bottomHalf.textContent = newValue;
    flipTop.style.animation = "none";
    flipBottom.style.animation = "none";
  }, 600);
}

// Call updateClock every second
setInterval(updateClock, 1000);
