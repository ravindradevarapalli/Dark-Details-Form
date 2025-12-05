class PomodoroTimer {
  constructor() {
    this.workDuration = 25 * 60;
    this.shortBreak = 5 * 60;
    this.longBreak = 15 * 60;
    this.sessionCount = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.timeLeft = this.workDuration;
    this.currentSession = "Work";
    this.timer = null;

    // DOM elements
    this.timerDisplay = document.getElementById("timer-display");
    this.sessionTypeDisplay = document.getElementById("session-type");
    this.sessionCountDisplay = document.getElementById("session-count");
    this.startBtn = document.getElementById("start-btn");
    this.stopBtn = document.getElementById("stop-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.workInput = document.getElementById("work-duration");
    this.shortBreakInput = document.getElementById("short-break");
    this.longBreakInput = document.getElementById("long-break");
    this.sound = document.getElementById("session-end-sound");

    this.bindEvents();
    this.updateDisplay();
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());
    this.resetBtn.addEventListener("click", () => this.reset());
    this.workInput.addEventListener("change", () => this.updateDurations());
    this.shortBreakInput.addEventListener("change", () =>
      this.updateDurations()
    );
    this.longBreakInput.addEventListener("change", () =>
      this.updateDurations()
    );
  }

  updateDurations() {
    this.workDuration = parseInt(this.workInput.value) * 60;
    this.shortBreak = parseInt(this.shortBreakInput.value) * 60;
    this.longBreak = parseInt(this.longBreakInput.value) * 60;
    if (!this.isRunning && !this.isPaused) {
      this.timeLeft = this.workDuration;
      this.currentSession = "Work";
      this.updateDisplay();
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.isPaused = false;
      this.startBtn.textContent = "Resume";
      this.timer = setInterval(() => this.tick(), 1000);
    }
  }

  stop() {
    if (this.isRunning) {
      clearInterval(this.timer);
      this.isRunning = false;
      this.isPaused = true;
    }
  }

  reset() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.isPaused = false;
    this.timeLeft = this.workDuration;
    this.currentSession = "Work";
    this.sessionCount = 0;
    this.startBtn.textContent = "Start";
    this.updateDisplay();
  }

  tick() {
    if (this.timeLeft <= 0) {
      this.sound
        .play()
        .catch((err) => console.log("Audio playback failed:", err));
      this.switchSession();
    } else {
      this.timeLeft--;
      this.updateDisplay();
    }
  }

  switchSession() {
    if (this.currentSession === "Work") {
      this.sessionCount++;
      if (this.sessionCount % 4 === 0) {
        this.currentSession = "Long Break";
        this.timeLeft = this.longBreak;
      } else {
        this.currentSession = "Short Break";
        this.timeLeft = this.shortBreak;
      }
    } else {
      this.currentSession = "Work";
      this.timeLeft = this.workDuration;
    }
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
    this.sessionTypeDisplay.textContent = this.currentSession;
    this.sessionCountDisplay.textContent = `Work Sessions: ${this.sessionCount}`;
  }
}

// Initialize the timer
const pomodoro = new PomodoroTimer();

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (document.activeElement === pomodoro.startBtn) pomodoro.start();
    if (document.activeElement === pomodoro.stopBtn) pomodoro.stop();
    if (document.activeElement === pomodoro.resetBtn) pomodoro.reset();
  }
});
