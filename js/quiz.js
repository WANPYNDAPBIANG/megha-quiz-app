/* ==================================================
   MEGHA QUIZ APP - QUIZ ENGINE (REFRACTORED)
================================================== */

/* ==================================================
   GLOBAL STATE
================================================== */

let questions = [];
let userAnswers = [];
let bookmarks = [];

let currentQuestionIndex = 0;

let timerInterval;
let timeRemaining = 3600;

let leaderboard = [];

/* ==================================================
   MODE SYSTEM
================================================== */

const urlParams = new URLSearchParams(window.location.search);
const quizMode = urlParams.get("mode") || "practice";

const isMockMode = () => quizMode === "mock";
const isPracticeMode = () => quizMode === "practice";

/* ==================================================
   INIT
================================================== */

loadQuestions();

/* ==================================================
   LOAD QUESTIONS (FIXED JSON HANDLING)
================================================== */

async function loadQuestions() {
  try {
    const response = await fetch("data/questions.json");
    const data = await response.json();

    // FIX: supports both formats
    questions = Array.isArray(data) ? data : data.questions;

    if (!Array.isArray(questions)) {
      throw new Error("Invalid questions format in JSON");
    }

    initializeQuizMode();
    loadSavedData();

    createQuestionPalette();
    updatePaletteStatus();
    updateSummary();
    updateProgress();

    displayQuestion();
    startMockTimer();

  } catch (error) {
    console.error("Failed to load questions:", error);
  }
}

/* ==================================================
   MODE INITIALIZATION (UI ONLY)
================================================== */

function initializeQuizMode() {
  if (isMockMode()) {
    document.title = "Mock Test | Megha Quiz App";

    document.querySelector(".progress-section h3").textContent =
      "Mock Test Progress";

    const bookmarkBtn = document.getElementById("bookmarkBtn");
    if (bookmarkBtn) bookmarkBtn.style.display = "none";

    const reference = document.querySelector(".reference-section");
    if (reference) reference.style.display = "none";

    document.getElementById("submitPracticeBtn").textContent =
      "Submit Test";
  }
}

/* ==================================================
   TIMER (MOCK ONLY)
================================================== */

function startMockTimer() {
  if (!isMockMode()) return;

  timerInterval = setInterval(() => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    const timer = document.getElementById("timer");

    if (timer) {
      timer.textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
    }

    timeRemaining--;

    if (timeRemaining < 0) {
      clearInterval(timerInterval);
      alert("Time is up! Test submitted automatically.");
      showResults();
    }
  }, 1000);
}

/* ==================================================
   DISPLAY QUESTION
================================================== */

function displayQuestion() {
  const q = questions[currentQuestionIndex];

  document.getElementById("questionTitle").textContent =
    `Question ${currentQuestionIndex + 1}`;

  document.getElementById("questionText").textContent =
    q.question;

  document.getElementById("questionCounter").textContent =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  renderOptions(q);

  updatePaletteActive();
  updateQuestionStatus();
  updateBookmarkButton();

  document.getElementById("solutionContainer").style.display = "none";

  restoreAnswerState();

  const nextBtn = document.getElementById("nextBtn");

  nextBtn.textContent =
    currentQuestionIndex === questions.length - 1
      ? (isMockMode() ? "Submit Test" : "Submit Practice")
      : "Next";
}

/* ==================================================
   OPTIONS
================================================== */

function renderOptions(question) {
  const container = document.getElementById("optionsContainer");
  container.innerHTML = "";

  question.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt;

    btn.addEventListener("click", () => selectAnswer(index));

    container.appendChild(btn);
  });
}

/* ==================================================
   ANSWER HANDLING (CORE LOGIC FIXED)
================================================== */

function selectAnswer(selectedIndex) {
  userAnswers[currentQuestionIndex] = selectedIndex;

  saveQuizData();

  updatePaletteStatus();
  updateProgress();
  updateSummary();
  updateQuestionStatus();

  handleModeBehavior(selectedIndex);
}

function handleModeBehavior(selectedIndex) {
  if (isPracticeMode()) {
    revealAnswer(selectedIndex);
    showExplanation();
  }

  if (isMockMode()) {
    renderOptions(questions[currentQuestionIndex]);
    restoreMockSelection();
  }
}

/* ==================================================
   REVEAL ANSWER (PRACTICE MODE)
================================================== */

function revealAnswer(selectedIndex) {
  const q = questions[currentQuestionIndex];
  const correct = q.correctAnswer;

  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach(btn => (btn.disabled = true));

  if (selectedIndex === correct) {
    buttons[selectedIndex].classList.add("correct-answer");
  } else {
    buttons[selectedIndex].classList.add("wrong-answer");
    buttons[correct].classList.add("correct-answer");
  }
}

/* ==================================================
   RESTORE STATE
================================================== */

function restoreAnswerState() {
  const ans = userAnswers[currentQuestionIndex];

  if (ans === undefined) return;

  if (isPracticeMode()) {
    revealAnswer(ans);
    showExplanation();
  }

  if (isMockMode()) {
    restoreMockSelection();
  }
}

function restoreMockSelection() {
  if (!isMockMode()) return;

  const ans = userAnswers[currentQuestionIndex];
  if (ans === undefined) return;

  const buttons = document.querySelectorAll(".option-btn");

  if (buttons[ans]) {
    buttons[ans].classList.add("selected-option");
  }
}

/* ==================================================
   EXPLANATION
================================================== */

function showExplanation() {
  const q = questions[currentQuestionIndex];

  const box = document.getElementById("solutionContainer");

  box.innerHTML = `
    <h3>Solution & Explanation</h3>
    <p>${q.explanation}</p>
  `;

  box.style.display = "block";
}

/* ==================================================
   PALETTE
================================================== */

function createQuestionPalette() {
  const palette = document.getElementById("questionPalette");
  palette.innerHTML = "";

  questions.forEach((_, i) => {
    const btn = document.createElement("button");

    btn.classList.add("question-number");
    btn.textContent = i + 1;

    btn.addEventListener("click", () => {
      currentQuestionIndex = i;
      displayQuestion();
    });

    palette.appendChild(btn);
  });
}

function updatePaletteActive() {
  document.querySelectorAll(".question-number")
    .forEach(b => b.classList.remove("current"));

  const btn = document.querySelectorAll(".question-number")[currentQuestionIndex];
  if (btn) btn.classList.add("current");
}

function updatePaletteStatus() {
  document.querySelectorAll(".question-number")
    .forEach((btn, i) => {
      btn.classList.remove("attempted");

      if (userAnswers[i] !== undefined) {
        btn.classList.add("attempted");
      }
    });
}

/* ==================================================
   STATUS + SUMMARY
================================================== */

function updateQuestionStatus() {
  const el = document.getElementById("questionStatus");

  el.textContent =
    userAnswers[currentQuestionIndex] !== undefined
      ? "Answered"
      : "Not Attempted";
}

function updateSummary() {
  const answered = getAttemptedCount();
  const unanswered = questions.length - answered;

  document.getElementById("answeredCount").textContent = answered;
  document.getElementById("unansweredCount").textContent = unanswered;
  document.getElementById("bookmarkCount").textContent = bookmarks.length;
}

function getAttemptedCount() {
  return userAnswers.filter(a => a !== undefined).length;
}

function updateProgress() {
  const attempted = getAttemptedCount();

  const percent = questions.length
    ? (attempted / questions.length) * 100
    : 0;

  document.querySelector(".progress-fill").style.width = `${percent}%`;

  document.querySelector(".progress-section p").textContent =
    `${attempted} of ${questions.length} Questions Completed`;
}

/* ==================================================
   BOOKMARKS
================================================== */

function toggleBookmark() {
  const id = questions[currentQuestionIndex].id;

  const index = bookmarks.indexOf(id);

  if (index === -1) bookmarks.push(id);
  else bookmarks.splice(index, 1);

  saveQuizData();
  updateBookmarkButton();
  updateSummary();
}

function updateBookmarkButton() {
  const btn = document.getElementById("bookmarkBtn");
  if (!btn) return;

  const id = questions[currentQuestionIndex].id;

  if (bookmarks.includes(id)) {
    btn.textContent = "★ Bookmarked";
    btn.classList.add("bookmarked");
  } else {
    btn.textContent = "☆ Bookmark";
    btn.classList.remove("bookmarked");
  }
}

/* ==================================================
   STORAGE
================================================== */

function saveQuizData() {
  localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function loadSavedData() {
  const ans = localStorage.getItem("userAnswers");
  const bm = localStorage.getItem("bookmarks");

  if (ans) userAnswers = JSON.parse(ans);
  if (bm) bookmarks = JSON.parse(bm);
}

/* ==================================================
   RESULTS
================================================== */

function showResults() {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  questions.forEach((q, i) => {
    const a = userAnswers[i];

    if (a === undefined) unanswered++;
    else if (a === q.correctAnswer) correct++;
    else wrong++;
  });

  const attempted = correct + wrong;
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;

  document.getElementById("resultTotal").textContent = questions.length;
  document.getElementById("resultCorrect").textContent = correct;
  document.getElementById("resultWrong").textContent = wrong;
  document.getElementById("resultAccuracy").textContent = `${accuracy}%`;

  document.querySelector(".practice-layout").style.display = "none";
  document.getElementById("resultsSection").hidden = false;

  localStorage.setItem("correctAnswers", correct);
  localStorage.setItem("wrongAnswers", wrong);
  localStorage.setItem("accuracy", accuracy);
  localStorage.setItem("unansweredQuestions", unanswered);

  setTimeout(() => {

  window.location.href =
    "leaderboard.html";

}, 1500);
}

/* ==================================================
   SUBMIT / RESET
================================================== */

function submitPractice() {
  const msg = isMockMode()
    ? "Submit Mock Test?"
    : "Submit Practice?";

  if (!confirm(msg)) return;

  showResults();
}

function resetQuizData() {
  localStorage.removeItem("userAnswers");
  localStorage.removeItem("bookmarks");
  location.reload();
}

/* ==================================================
   EVENTS
================================================== */

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    submitPractice();
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
});

document.getElementById("bookmarkBtn")?.addEventListener("click", toggleBookmark);
document.getElementById("submitPracticeBtn").addEventListener("click", submitPractice);
document.getElementById("restartBtn").addEventListener("click", resetQuizData);