const quizData = [
  {
    question: "What does 'DOM' stand for?",
    answers: [
      "Document Object Model",
      "Display Object Management",
      "Digital Ordinance Model",
      "Desktop Oriented Mode",
    ],
    correct: 0,
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    answers: ["var", "let", "const", "All of the above"],
    correct: 3,
  },
  {
    question: "Which company developed JavaScript?",
    answers: ["Microsoft", "Netscape", "Google", "Oracle"],
    correct: 1,
  },
  {
    question: "What is the default value of 'this' in strict mode?",
    answers: ["window", "undefined", "null", "object"],
    correct: 1,
  },
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const timerDisplay = document.getElementById("timer");
const finalScoreText = document.getElementById("final-score");
const resultsList = document.getElementById("results-list");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;
let resultsSummary = [];

// Cache answer buttons for reuse
let cachedButtons = [];

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach((el) =>
    el.classList.add("hidden")
  );
  screen.classList.remove("hidden");
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultsSummary = [];
  showScreen(quizScreen);
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = quizData[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  // Reuse or create buttons
  while (cachedButtons.length < currentQuestion.answers.length) {
    const button = document.createElement("button");
    button.tabIndex = 0;
    button.addEventListener("click", (e) => {
      if (!button.disabled) {
        selectAnswer(Number(button.getAttribute("data-index")));
      }
    });
    cachedButtons.push(button);
  }

  // Attach only needed buttons
  answerButtons.innerHTML = "";
  currentQuestion.answers.forEach((answer, index) => {
    const button = cachedButtons[index];
    button.textContent = answer;
    button.setAttribute("data-index", index);
    button.disabled = false;
    button.className = ""; // Reset classes
    answerButtons.appendChild(button);
  });

  startTimer();
}

function resetState() {
  clearInterval(timer);
  timeLeft = 60;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  // No need to clear answerButtons here, handled in showQuestion
}

function startTimer() {
  let lastTime = timeLeft;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft !== lastTime) {
      timerDisplay.textContent = `Time: ${timeLeft}`;
      lastTime = timeLeft;
    }
    if (timeLeft <= 0) {
      clearInterval(timer);
      score--;
      recordAnswer(null);
      nextQuestion();
    }
  }, 1000);
}

// Event delegation for answer buttons
answerButtons.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && !e.target.disabled) {
    selectAnswer(Number(e.target.getAttribute("data-index")));
  }
});

function selectAnswer(selectedIndex) {
  clearInterval(timer);
  const currentQuestion = quizData[currentQuestionIndex];
  const correctIndex = currentQuestion.correct;
  const buttons = answerButtons.querySelectorAll("button");

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === correctIndex) btn.classList.add("correct");
    else if (index === selectedIndex) btn.classList.add("wrong");
  });

  if (selectedIndex === correctIndex) score++;
  recordAnswer(selectedIndex);

  setTimeout(nextQuestion, 1000);
}

function recordAnswer(selectedIndex) {
  const question = quizData[currentQuestionIndex];
  resultsSummary.push({
    question: question.question,
    correctAnswer: question.answers[question.correct],
    userAnswer:
      selectedIndex !== null ? question.answers[selectedIndex] : "No Answer",
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  showScreen(resultScreen);
  finalScoreText.textContent = `Your final score is ${score}/${quizData.length}`;
  resultsList.innerHTML = resultsSummary
    .map(
      (res) => `
        <li>
            <strong>${res.question}</strong><br>
            Your Answer: ${res.userAnswer} <br>
            Correct Answer: ${res.correctAnswer}
        </li>
    `
    )
    .join("");
}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
