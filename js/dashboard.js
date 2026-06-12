/* ==================================================
   MEGHA QUIZ APP - LEVEL 2 DASHBOARD ENGINE
================================================== */

/* ==================================================
   LOAD DATA
================================================== */

const data = {
  attempted: Number(localStorage.getItem("questionsAttempted")) || 0,
  correct: Number(localStorage.getItem("correctAnswers")) || 0,
  wrong: Number(localStorage.getItem("wrongAnswers")) || 0,
  accuracy: Number(localStorage.getItem("accuracy")) || 0,
  bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || []
};

/* ==================================================
   INIT
================================================== */

initDashboard();

function initDashboard() {
  renderStats();
  renderProgress();
  renderSubjectPerformance();
  renderRecentActivity();
  renderAchievements();
  renderMockHistory();
}

/* ==================================================
   BASIC STATS
================================================== */

function renderStats() {
  document.getElementById("questionsAttempted").textContent = data.attempted;
  document.getElementById("correctAnswers").textContent = data.correct;
  document.getElementById("accuracy").textContent = `${calculateAccuracy()}%`;
  document.getElementById("bookmarksCount").textContent = data.bookmarks.length;

  const userName = document.getElementById("userName");
  if (userName) userName.textContent = "Welcome Back";
}

function calculateAccuracy() {
  if (data.attempted === 0) return 0;
  return Math.round((data.correct / data.attempted) * 100);
}

/* ==================================================
   PROGRESS BAR
================================================== */

function renderProgress() {
  const percent = calculateAccuracy();

  const fill = document.querySelector(".progress-fill");
  const text = document.querySelector(".dashboard-card p");

  if (fill) fill.style.width = `${percent}%`;
  if (text) text.textContent = `${percent}% Completed`;
}

/* ==================================================
   SUBJECT PERFORMANCE (SIMULATED LEVEL 2 ENGINE)
================================================== */

function renderSubjectPerformance() {
  const subjects = {
    "General Knowledge": Math.min(100, data.accuracy + 10),
    "English": Math.max(40, data.accuracy - 5),
    "Mathematics": Math.max(30, data.accuracy - 15)
  };

  const container = document.getElementById("subjectPerformance");
  container.innerHTML = "";

  Object.entries(subjects).forEach(([name, score]) => {
    const row = document.createElement("div");
    row.className = "subject-row";

    row.innerHTML = `
      <span>${name}</span>
      <span>${score}%</span>
    `;

    container.appendChild(row);
  });
}

/* ==================================================
   RECENT ACTIVITY ENGINE
================================================== */

function renderRecentActivity() {
  const list = document.getElementById("recentActivity");

  const activities = [];

  if (data.attempted > 0) {
    activities.push(`Attempted ${data.attempted} questions`);
  }

  if (data.correct > 0) {
    activities.push(`Got ${data.correct} correct answers`);
  }

  if (data.bookmarks.length > 0) {
    activities.push(`Bookmarked ${data.bookmarks.length} questions`);
  }

  if (activities.length === 0) {
    list.innerHTML = "<li>No activity yet</li>";
    return;
  }

  list.innerHTML = activities
    .map(act => `<li>${act}</li>`)
    .join("");
}

/* ==================================================
   MOCK TEST HISTORY (LOCAL STORAGE BASED)
================================================== */

function renderMockHistory() {
  const tbody = document.querySelector("tbody");

  const history = JSON.parse(localStorage.getItem("mockHistory")) || [];

  if (history.length === 0) return;

  tbody.innerHTML = history
    .slice(-5)
    .reverse()
    .map(item => `
      <tr>
        <td>${item.date}</td>
        <td>${item.exam}</td>
        <td>${item.score}</td>
        <td>${item.accuracy}%</td>
      </tr>
    `)
    .join("");
}

/* ==================================================
   ACHIEVEMENTS ENGINE (LEVEL 2 LOGIC)
================================================== */

function renderAchievements() {
  const achievements = document.querySelectorAll(".achievement");

  const unlocked = {
    firstQuiz: data.attempted > 0,
    hundredQuestions: data.attempted >= 100,
    highAccuracy: calculateAccuracy() >= 90,
    streak: false // future feature
  };

  achievements.forEach((ach, index) => {
    const isUnlocked = Object.values(unlocked)[index];

    if (isUnlocked) {
      ach.style.opacity = "1";
      ach.style.filter = "none";
    } else {
      ach.style.opacity = "0.3";
    }
  });
}

/* ==================================================
   OPTIONAL: SAVE MOCK TEST RESULT (HOOK)
================================================== */

function saveMockTestResult(score, accuracy, examName = "Mock Test") {
  const history = JSON.parse(localStorage.getItem("mockHistory")) || [];

  history.push({
    date: new Date().toLocaleDateString(),
    exam: examName,
    score,
    accuracy
  });

  localStorage.setItem("mockHistory", JSON.stringify(history));
}