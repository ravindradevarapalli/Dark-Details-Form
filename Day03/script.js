// script.js
function toggleBounce() {
  const ball = document.querySelector(".bounce-ball");
  ball.classList.toggle("active");
}

document.querySelectorAll(".accordion-title").forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    content.classList.toggle("active");
    document.querySelectorAll(".accordion-content").forEach((item) => {
      if (item !== content) {
        item.classList.remove("active");
      }
    });
  });
});

function openModal() {
  const modal = document.getElementById("myModal");
  modal.showModal();
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.close();
}
