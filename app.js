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
