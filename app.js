var LOG_KEY = "pomodoro_session_log_v1";
var RADIUS = 96;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

var workInput = document.getElementById("work-mins");
var breakInput = document.getElementById("break-mins");
var timeDisplay = document.getElementById("time-display");
var ringProgress = document.getElementById("ring-progress");
var startPauseBtn = document.getElementById("start-pause-btn");
var resetBtn = document.getElementById("reset-btn");
var notifyBtn = document.getElementById("notify-btn");
var modeWorkBtn = document.getElementById("mode-work");
var modeBreakBtn = document.getElementById("mode-break");
var sessionLogEl = document.getElementById("session-log");
var logEmptyEl = document.getElementById("log-empty");
var clearLogBtn = document.getElementById("clear-log-btn");

ringProgress.style.strokeDasharray = CIRCUMFERENCE;

var mode = "work"; // "work" or "break"
var totalSeconds = 25 * 60;
var remainingSeconds = totalSeconds;
var timerId = null;
var sessions = loadSessions();

function loadSessions() {
  try {
    var raw = localStorage.getItem(LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveSessions() {
  localStorage.setItem(LOG_KEY, JSON.stringify(sessions));
}

function formatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function updateUI() {
  timeDisplay.textContent = formatTime(remainingSeconds);
  document.title = formatTime(remainingSeconds) + " - Pomodoro";

  var fraction = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  var offset = CIRCUMFERENCE * (1 - fraction);
  ringProgress.style.strokeDashoffset = offset;
}

function setMode(newMode) {
  pauseTimer();
  mode = newMode;
  document.body.classList.toggle("break-mode", mode === "break");
  modeWorkBtn.classList.toggle("active", mode === "work");
  modeBreakBtn.classList.toggle("active", mode === "break");
  modeWorkBtn.setAttribute("aria-selected", mode === "work");
  modeBreakBtn.setAttribute("aria-selected", mode === "break");

  var mins = mode === "work" ? parseInt(workInput.value, 10) || 25 : parseInt(breakInput.value, 10) || 5;
  totalSeconds = mins * 60;
  remainingSeconds = totalSeconds;
  updateUI();
}

function startTimer() {
  if (timerId !== null) return;
  startPauseBtn.textContent = "Pause";
  timerId = setInterval(function () {
    remainingSeconds -= 1;
    updateUI();

    if (remainingSeconds <= 0) {
      pauseTimer();
      handleFinish();
    }
  }, 1000);
}

function pauseTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  startPauseBtn.textContent = "Start";
}

