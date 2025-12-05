let playerScore = 0;
let computerScore = 0;

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "Tie";
  }

  if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    return "Player";
  }

  return "Computer";
}

function updateScore(winner) {
  if (winner === "Player") {
    playerScore++;
    document.getElementById("playerScore").textContent = playerScore;
    document
      .getElementById("playerScore")
      .parentElement.classList.add("winner");
  } else if (winner === "Computer") {
    computerScore++;
    document.getElementById("computerScore").textContent = computerScore;
    document
      .getElementById("computerScore")
      .parentElement.classList.add("winner");
  }

  // Remove winner animation class after animation completes
  setTimeout(() => {
    document.querySelectorAll(".score-box").forEach((box) => {
      box.classList.remove("winner");
    });
  }, 500);
}

function play(playerChoice) {
  const computerChoice = getComputerChoice();
  const winner = determineWinner(playerChoice, computerChoice);

  let resultMessage = `
        <div style="margin-bottom: 10px">
            You chose <i class="fas fa-hand-${playerChoice}"></i>
            Computer chose <i class="fas fa-hand-${computerChoice}"></i>
        </div>
    `;

  if (winner === "Tie") {
    resultMessage += `<div style="color: #FFD700">It's a tie!</div>`;
  } else {
    resultMessage += `<div style="color: ${
      winner === "Player" ? "#00FF00" : "#FF4444"
    }">${winner} wins!</div>`;
    updateScore(winner);
  }

  document.getElementById("result").innerHTML = resultMessage;
}
