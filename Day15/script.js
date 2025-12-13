document.addEventListener("DOMContentLoaded", () => {
  // --- Mode Selection Elements ---
  const modeCountdownBtn = document.getElementById("modeCountdown");
  const modeStopwatchBtn = document.getElementById("modeStopwatch");
  const countdownSection = document.getElementById("countdownSection");
  const stopwatchSection = document.getElementById("stopwatchSection");
  let currentMode = "countdown"; // 'countdown' or 'stopwatch'

  // --- Common Elements ---
  const originalTitleBase = "Timer & Stopwatch"; // Base for tab title

  // --- Countdown Timer Elements ---
  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const display = document.getElementById("display");
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const resetButton = document.getElementById("resetButton");
  const alarmSound = document.getElementById("alarmSound");
  const progressBar = document.getElementById("progress-bar");
  const presetButtons = document.querySelectorAll(".preset-btn");

  let countdownTimerInterval = null;
  let totalSeconds = 0;
  let initialTotalSeconds = 0;
  const cdLocalStorageKeys = {
    hours: "countdownTimerHours",
    minutes: "countdownTimerMinutes",
    seconds: "countdownTimerSeconds",
  };

  // --- Stopwatch Elements ---
  const stopwatchDisplay = document.getElementById("stopwatchDisplay");
  const swStartButton = document.getElementById("swStartButton");
  const swStopButton = document.getElementById("swStopButton");
  const swLapButton = document.getElementById("swLapButton");
  const swResetButton = document.getElementById("swResetButton");
  const lapsList = document.getElementById("lapsList");

  let stopwatchInterval = null;
  let stopwatchStartTime = 0;
  let stopwatchElapsedTime = 0; // Time elapsed when paused
  let stopwatchRunning = false;
  let laps = [];
  let lapCounter = 0;

  // --- MODE SWITCHING ---
  function switchToCountdownMode() {
    if (currentMode === "countdown") return;
    currentMode = "countdown";

    stopwatchSection.style.display = "none";
    countdownSection.style.display = "block";
    countdownSection.classList.add("fade-in");
    setTimeout(() => countdownSection.classList.remove("fade-in"), 500);

    modeStopwatchBtn.classList.remove("active-mode");
    modeCountdownBtn.classList.add("active-mode");

    // Reset or stop stopwatch if it was running
    if (stopwatchRunning) stopStopwatch(); // Or full resetStopwatch()
    // resetStopwatch(); // Good practice to reset the other mode fully

    loadTimeFromLocalStorage(); // Reload countdown state
    updateCountdownDisplay();
    document.title = originalTitleBase + " - Countdown";
  }

  function switchToStopwatchMode() {
    if (currentMode === "stopwatch") return;
    currentMode = "stopwatch";

    countdownSection.style.display = "none";
    stopwatchSection.style.display = "block";
    stopwatchSection.classList.add("fade-in");
    setTimeout(() => stopwatchSection.classList.remove("fade-in"), 500);

    modeCountdownBtn.classList.remove("active-mode");
    modeStopwatchBtn.classList.add("active-mode");

    // Stop countdown if it was running
    if (countdownTimerInterval) stopCountdownTimer();
    // Reset countdown inputs to avoid confusion if user switches back
    // resetCountdownTimer(true); // soft reset to avoid clearing localstorage

    updateStopwatchDisplay(); // Update display with current stopwatch state (likely 0)
    document.title = originalTitleBase + " - Stopwatch";
  }

  modeCountdownBtn.addEventListener("click", switchToCountdownMode);
  modeStopwatchBtn.addEventListener("click", switchToStopwatchMode);

  // --- COUNTDOWN TIMER LOGIC (Mostly same as before, renamed some vars) ---
  function loadTimeFromLocalStorage() {
    const h = localStorage.getItem(cdLocalStorageKeys.hours);
    const m = localStorage.getItem(cdLocalStorageKeys.minutes);
    const s = localStorage.getItem(cdLocalStorageKeys.seconds);

    if (h !== null) hoursInput.value = h;
    else hoursInput.value = "0";
    if (m !== null) minutesInput.value = m;
    else minutesInput.value = "0";
    if (s !== null) secondsInput.value = s;
    else secondsInput.value = "10"; // Default

    totalSeconds =
      (parseInt(hoursInput.value) || 0) * 3600 +
      (parseInt(minutesInput.value) || 0) * 60 +
      (parseInt(secondsInput.value) || 0);
    initialTotalSeconds = totalSeconds;
  }

  function saveTimeToLocalStorage(h, m, s) {
    localStorage.setItem(cdLocalStorageKeys.hours, h);
    localStorage.setItem(cdLocalStorageKeys.minutes, m);
    localStorage.setItem(cdLocalStorageKeys.seconds, s);
  }

  function clearSavedTimeFromLocalStorage() {
    localStorage.removeItem(cdLocalStorageKeys.hours);
    localStorage.removeItem(cdLocalStorageKeys.minutes);
    localStorage.removeItem(cdLocalStorageKeys.seconds);
  }

  function updateCountdownDisplay() {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const timeString = `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;

    if (!display.classList.contains("times-up-flash")) {
      display.textContent = timeString;
    }

    if (initialTotalSeconds > 0) {
      const progressPercentage = Math.max(
        0,
        (totalSeconds / initialTotalSeconds) * 100
      );
      progressBar.style.width = `${progressPercentage}%`;
    } else {
      progressBar.style.width = "100%";
    }

    if (countdownTimerInterval) {
      document.title = `${timeString} - Countdown`;
    } else if (display.classList.contains("times-up-flash")) {
      document.title = `Time's Up! - Countdown`;
    } else {
      if (currentMode === "countdown")
        document.title = originalTitleBase + " - Countdown";
    }
  }

  function setCountdownInputFieldsEnabled(enabled) {
    hoursInput.disabled = !enabled;
    minutesInput.disabled = !enabled;
    secondsInput.disabled = !enabled;
  }

  function startCountdownTimer() {
    if (countdownTimerInterval) return;

    display.classList.remove("times-up-flash");
    if (display.textContent === "Time's Up!") {
      const h_val = parseInt(hoursInput.value) || 0;
      const m_val = parseInt(minutesInput.value) || 0;
      const s_val = parseInt(secondsInput.value) || 0;
      display.textContent = `${String(h_val).padStart(2, "0")}:${String(
        m_val
      ).padStart(2, "0")}:${String(s_val).padStart(2, "0")}`;
    }

    let h = parseInt(hoursInput.value) || 0;
    let m = parseInt(minutesInput.value) || 0;
    let s = parseInt(secondsInput.value) || 0;

    if (totalSeconds <= 0 || startButton.textContent === "Start") {
      totalSeconds = h * 3600 + m * 60 + s;
      initialTotalSeconds = totalSeconds;
      saveTimeToLocalStorage(h, m, s);
    }

    if (totalSeconds <= 0) {
      alert("Please set a time greater than 0 seconds.");
      return;
    }

    setCountdownInputFieldsEnabled(false);
    startButton.disabled = true;
    startButton.textContent = "Start";
    stopButton.disabled = false;
    resetButton.disabled = true;
    alarmSound.pause();
    alarmSound.currentTime = 0;
    updateCountdownDisplay();

    countdownTimerInterval = setInterval(() => {
      totalSeconds--;
      updateCountdownDisplay();
      if (totalSeconds < 0) {
        clearInterval(countdownTimerInterval);
        countdownTimerInterval = null;
        totalSeconds = 0;
        display.textContent = "Time's Up!";
        display.classList.add("times-up-flash");
        document.title = `Time's Up! - Countdown`;
        alarmSound
          .play()
          .catch((e) => console.error("Error playing sound:", e));
        startButton.disabled = false;
        stopButton.disabled = true;
        resetButton.disabled = false;
        setCountdownInputFieldsEnabled(true);
        progressBar.style.width = "0%";
      }
    }, 1000);
  }

  function stopCountdownTimer() {
    if (countdownTimerInterval) {
      clearInterval(countdownTimerInterval);
      countdownTimerInterval = null;
      startButton.disabled = false;
      startButton.textContent = "Resume";
      stopButton.disabled = true;
      resetButton.disabled = false;
      if (currentMode === "countdown") document.title = `Paused - Countdown`;
      display.classList.remove("times-up-flash");
    }
  }

  function resetCountdownTimer(isSoftReset = false) {
    // isSoftReset for mode switch
    clearInterval(countdownTimerInterval);
    countdownTimerInterval = null;
    totalSeconds = 0;
    initialTotalSeconds = 0;
    display.classList.remove("times-up-flash");

    if (!isSoftReset) {
      hoursInput.value = "0";
      minutesInput.value = "0";
      secondsInput.value = "10";
      clearSavedTimeFromLocalStorage();
    }
    const h = parseInt(hoursInput.value) || 0;
    const m = parseInt(minutesInput.value) || 0;
    const s = parseInt(secondsInput.value) || 0;
    display.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;

    updateCountdownDisplay();
    alarmSound.pause();
    alarmSound.currentTime = 0;
    setCountdownInputFieldsEnabled(true);
    startButton.disabled = false;
    startButton.textContent = "Start";
    stopButton.disabled = true;
    resetButton.disabled = false;
    progressBar.style.width = "100%";
    if (currentMode === "countdown" && !isSoftReset)
      document.title = originalTitleBase + " - Countdown";
  }

  function handleCountdownPresetClick(event) {
    if (countdownTimerInterval) clearInterval(countdownTimerInterval);
    countdownTimerInterval = null;
    display.classList.remove("times-up-flash");
    const minutes = parseInt(event.target.dataset.minutes);
    if (isNaN(minutes)) return;
    hoursInput.value = "0";
    minutesInput.value = String(minutes);
    secondsInput.value = "0";
    totalSeconds = minutes * 60;
    initialTotalSeconds = totalSeconds;
    display.textContent = `00:${String(minutes).padStart(2, "0")}:00`;
    updateCountdownDisplay();
    saveTimeToLocalStorage(0, minutes, 0);
    setCountdownInputFieldsEnabled(true);
    startButton.disabled = false;
    startButton.textContent = "Start";
    stopButton.disabled = true;
    resetButton.disabled = false;
    progressBar.style.width = "100%";
  }

  startButton.addEventListener("click", startCountdownTimer);
  stopButton.addEventListener("click", stopCountdownTimer);
  resetButton.addEventListener("click", () => resetCountdownTimer(false));
  presetButtons.forEach((button) =>
    button.addEventListener("click", handleCountdownPresetClick)
  );

  // --- STOPWATCH LOGIC ---
  function formatTime(ms) {
    let totalMs = ms;
    let milliseconds = String(totalMs % 1000).padStart(3, "0");
    let seconds = String(Math.floor(totalMs / 1000) % 60).padStart(2, "0");
    let minutes = String(Math.floor(totalMs / (1000 * 60)) % 60).padStart(
      2,
      "0"
    );
    let hours = String(Math.floor(totalMs / (1000 * 60 * 60))).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  function updateStopwatchDisplay() {
    let currentTime = stopwatchRunning
      ? Date.now() - stopwatchStartTime + stopwatchElapsedTime
      : stopwatchElapsedTime;
    const formattedTime = formatTime(currentTime);
    stopwatchDisplay.textContent = formattedTime;
    if (stopwatchRunning && currentMode === "stopwatch") {
      document.title = `${formattedTime.substring(
        0,
        formattedTime.lastIndexOf(":")
      )} - Stopwatch`; // Exclude ms from title for brevity
    } else if (
      !stopwatchRunning &&
      stopwatchElapsedTime > 0 &&
      currentMode === "stopwatch"
    ) {
      document.title = `Paused - Stopwatch`;
    } else if (currentMode === "stopwatch") {
      document.title = originalTitleBase + " - Stopwatch";
    }
  }

  function startStopwatch() {
    if (stopwatchRunning) return;
    stopwatchRunning = true;
    stopwatchStartTime = Date.now(); // Or Date.now() - stopwatchElapsedTime if resuming carefully.
    // For simplicity, Date.now() here means stopwatchElapsedTime accumulates paused duration.

    swStartButton.disabled = true;
    swStopButton.disabled = false;
    swLapButton.disabled = false;
    swResetButton.disabled = true; // Can't reset while running

    stopwatchInterval = setInterval(updateStopwatchDisplay, 47); // Update display frequently for ms
  }

  function stopStopwatch() {
    if (!stopwatchRunning) return;
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchElapsedTime += Date.now() - stopwatchStartTime; // Accumulate elapsed time

    swStartButton.disabled = false;
    swStartButton.textContent = "Resume";
    swStopButton.disabled = true;
    swLapButton.disabled = true; // Can't lap when stopped
    swResetButton.disabled = false; // Can reset when stopped
    updateStopwatchDisplay(); // Final update
  }

  function lapStopwatch() {
    if (!stopwatchRunning) return;
    lapCounter++;
    const currentLapTime =
      Date.now() - stopwatchStartTime + stopwatchElapsedTime;
    laps.push({ id: lapCounter, time: currentLapTime });
    renderLaps();
  }

  function resetStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchStartTime = 0;
    stopwatchElapsedTime = 0;
    laps = [];
    lapCounter = 0;

    updateStopwatchDisplay(); // Will show 00:00:00:000
    renderLaps(); // Clear lap list UI

    swStartButton.disabled = false;
    swStartButton.textContent = "Start";
    swStopButton.disabled = true;
    swLapButton.disabled = true;
    swResetButton.disabled = true; // Disabled until started or after a stop
    if (currentMode === "stopwatch")
      document.title = originalTitleBase + " - Stopwatch";
  }

  function renderLaps() {
    lapsList.innerHTML = "";
    if (laps.length === 0) {
      lapsList.innerHTML = "<li>No laps yet.</li>";
      return;
    }
    // Display newest lap first
    for (let i = laps.length - 1; i >= 0; i--) {
      const li = document.createElement("li");
      const lapNumberSpan = document.createElement("span");
      lapNumberSpan.className = "lap-number";
      lapNumberSpan.textContent = `Lap ${laps[i].id}`;

      const lapTimeSpan = document.createElement("span");
      lapTimeSpan.className = "lap-time";
      lapTimeSpan.textContent = formatTime(laps[i].time);

      li.appendChild(lapNumberSpan);
      li.appendChild(lapTimeSpan);
      lapsList.appendChild(li);
    }
  }

  swStartButton.addEventListener("click", startStopwatch);
  swStopButton.addEventListener("click", stopStopwatch);
  swLapButton.addEventListener("click", lapStopwatch);
  swResetButton.addEventListener("click", resetStopwatch);

  // --- INITIALIZATION ---
  function initializeApp() {
    if (currentMode === "countdown") {
      stopwatchSection.style.display = "none";
      countdownSection.style.display = "block";
      modeCountdownBtn.classList.add("active-mode");
      loadTimeFromLocalStorage();
      updateCountdownDisplay(); // Initial display update for countdown
      resetCountdownTimer(true); // Soft reset to set initial state correctly
      document.title = originalTitleBase + " - Countdown";
    } else {
      // Should not happen on first load, but for completeness
      countdownSection.style.display = "none";
      stopwatchSection.style.display = "block";
      modeStopwatchBtn.classList.add("active-mode");
      resetStopwatch(); // Initial state for stopwatch
      document.title = originalTitleBase + " - Stopwatch";
    }
    renderLaps(); // Initialize laps list (empty)
  }

  initializeApp();
});
