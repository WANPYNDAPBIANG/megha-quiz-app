/* ==================================================
   MEGHA QUIZ APP - QUIZ ENGINE V2
================================================== */

/* ==================================================
   GLOBAL VARIABLES
================================================== */

let questions = [];
let userAnswers = [];
let bookmarks = [];
let reviewQuestions = [];
let timerInterval;
let timeRemaining = 3600;

let currentQuestionIndex = 0;

/* ==================================================
   QUIZ MODE
================================================== */

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const quizMode =
  urlParams.get("mode") ||
  "practice";

/* ==================================================
   INITIALIZE MODE
================================================== */

function startMockTimer() {

  if (quizMode !== "mock") {
    return;
  }

  timerInterval = setInterval(() => {

    const hours =
      Math.floor(timeRemaining / 3600);

    const minutes =
      Math.floor(
        (timeRemaining % 3600) / 60
      );

    const seconds =
      timeRemaining % 60;

    document.getElementById(
      "timer"
    ).textContent =
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timeRemaining--;

    if (timeRemaining < 0) {

      clearInterval(
        timerInterval
      );

      alert(
        "Time is up! Test submitted automatically."
      );

      showResults();

    }

  }, 1000);

}

function initializeQuizMode() {

  if (quizMode === "mock") {

    document.title =
      "Mock Test | Megha Quiz App";

    document.querySelector(
      ".progress-section h3"
    ).textContent =
      "Mock Test Progress";

    document.getElementById(
      "bookmarkBtn"
    ).style.display =
      "none";

    document.querySelector(
      ".reference-section"
    ).style.display =
      "none";

    document.getElementById(
      "submitPracticeBtn"
    ).textContent =
      "Submit Test";

  }

}

/* ==================================================
   LOAD QUESTIONS
================================================== */

async function loadQuestions() {

  try {

    const response =
      await fetch(
        "data/questions.json"
      );

    questions =
      await response.json();

    initializeQuizMode();

    loadSavedData();

    createQuestionPalette();

    updatePaletteStatus();

    updateSummary();

    updateProgress();

    displayQuestion();

    startMockTimer();

  } catch (error) {

    console.error(
      "Failed to load questions:",
      error
    );

  }

}

/* ==================================================
   DISPLAY QUESTION
================================================== */

function displayQuestion() {

  const question =
    questions[currentQuestionIndex];

  document.getElementById(
    "questionTitle"
  ).textContent =
    `Question ${currentQuestionIndex + 1}`;

  document.getElementById(
    "questionText"
  ).textContent =
    question.question;

  document.getElementById(
    "questionCounter"
  ).textContent =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  renderOptions(question);

  updatePaletteActive();

  updateQuestionStatus();

  updateBookmarkButton();

  document.getElementById(
    "solutionContainer"
  ).style.display =
    "none";

  restoreAnswerState();

  const nextButton =
    document.getElementById(
      "nextBtn"
    );

  if (
    currentQuestionIndex ===
    questions.length - 1
  ) {

    nextButton.textContent =
      quizMode === "mock"
        ? "Submit Test"
        : "Submit Practice";

  } else {

    nextButton.textContent =
      "Next";

  }

}

/* ==================================================
   RENDER OPTIONS
================================================== */

function renderOptions(question) {

  const container = document.getElementById("optionsContainer");

  container.innerHTML = "";

  question.options.forEach((optionText, index) => {

    const button = document.createElement("button");

    button.classList.add("option-btn");

    button.textContent = optionText;

    button.addEventListener("click", () =>
      selectAnswer(index)
    );

    container.appendChild(button);

  }
  );

}

/* ==================================================
   SELECT ANSWER
================================================== */

function selectAnswer(selectedIndex) {

  userAnswers[currentQuestionIndex] =
    selectedIndex;

  saveQuizData();

  updatePaletteStatus();
  updateProgress();
  updateSummary();
  updateQuestionStatus();

  if (quizMode === "practice") {

    revealAnswer(selectedIndex);

    showExplanation();

  } else {

    renderOptions(
      questions[currentQuestionIndex]
    );

    restoreMockSelection();

  }

}
/* ==================================================
   REVEAL ANSWER
================================================== */

function revealAnswer(
  selectedIndex
) {

  const question =
    questions[currentQuestionIndex];

  const correctIndex =
    question.correctAnswer;

  const buttons =
    document.querySelectorAll(
      ".option-btn"
    );

  buttons.forEach(
    button =>
      button.disabled = true
  );

  if (
    selectedIndex ===
    correctIndex
  ) {

    buttons[selectedIndex]
      .classList.add(
        "correct-answer"
      );

  } else {

    buttons[selectedIndex]
      .classList.add(
        "wrong-answer"
      );

    buttons[correctIndex]
      .classList.add(
        "correct-answer"
      );

  }

}

/* ==================================================
   RESTORE ANSWER
================================================== */

function restoreAnswerState() {

  const savedAnswer =
    userAnswers[currentQuestionIndex];

  if (
    savedAnswer === undefined
  ) {
    return;
  }

  if (
    quizMode === "practice"
  ) {

    revealAnswer(savedAnswer);

    showExplanation();

  }

  if (
    quizMode === "mock"
  ) {

    restoreMockSelection();

  }

}

function restoreMockSelection() {

  if (quizMode !== "mock") {
    return;
  }

  const answer =
    userAnswers[currentQuestionIndex];

  if (answer === undefined) {
    return;
  }

  const buttons =
    document.querySelectorAll(
      ".option-btn"
    );

  buttons[answer].classList.add(
    "selected-option"
  );

}
/* ==================================================
   SHOW EXPLANATION
================================================== */

function showExplanation() {

  const question =
    questions[currentQuestionIndex];

  const box =
    document.getElementById(
      "solutionContainer"
    );

  box.innerHTML = `
    <h3>
      Solution & Explanation
    </h3>

    <p>
      ${question.explanation}
    </p>
  `;

  box.style.display =
    "block";

}

/* ==================================================
   QUESTION PALETTE
================================================== */

function createQuestionPalette() {

  const palette =
    document.getElementById(
      "questionPalette"
    );

  palette.innerHTML = "";

  questions.forEach(
    (_, index) => {

      const button =
        document.createElement(
          "button"
        );

      button.classList.add(
        "question-number"
      );

      button.textContent =
        index + 1;

      button.addEventListener(
        "click",
        () => {

          currentQuestionIndex =
            index;

          displayQuestion();

        }
      );

      palette.appendChild(
        button
      );

    }
  );

}

function updatePaletteActive() {

  const buttons =
    document.querySelectorAll(
      ".question-number"
    );

  buttons.forEach(
    button =>
      button.classList.remove(
        "current"
      )
  );

  buttons[
    currentQuestionIndex
  ].classList.add(
    "current"
  );

}

function updatePaletteStatus() {

  const buttons =
    document.querySelectorAll(
      ".question-number"
    );

  buttons.forEach(
    (button, index) => {

      button.classList.remove(
        "attempted"
      );

      if (
        userAnswers[index] !==
        undefined
      ) {

        button.classList.add(
          "attempted"
        );

      }

    }
  );

}

/* ==================================================
   STATUS
================================================== */

function updateQuestionStatus() {

  const status =
    document.getElementById(
      "questionStatus"
    );

  status.textContent =
    userAnswers[
      currentQuestionIndex
    ] !== undefined
      ? "Answered"
      : "Not Attempted";

}

/* ==================================================
   SUMMARY
================================================== */

function updateSummary() {

  const answered =
    getAttemptedCount();

  const unanswered =
    questions.length -
    answered;

  document.getElementById(
    "answeredCount"
  ).textContent =
    answered;

  document.getElementById(
    "unansweredCount"
  ).textContent =
    unanswered;

  document.getElementById(
    "bookmarkCount"
  ).textContent =
    bookmarks.length;

}

/* ==================================================
   PROGRESS
================================================== */

function getAttemptedCount() {

  return userAnswers.filter(
    answer =>
      answer !== undefined
  ).length;

}

function updateProgress() {

  const attempted =
    getAttemptedCount();

  const percentage =
    questions.length
      ? (
        attempted /
        questions.length
      ) * 100
      : 0;

  document.querySelector(
    ".progress-fill"
  ).style.width =
    `${percentage}%`;

  document.querySelector(
    ".progress-section p"
  ).textContent =
    `${attempted} of ${questions.length} Questions Completed`;

}

/* ==================================================
   BOOKMARKS
================================================== */

function toggleBookmark() {

  const questionId =
    questions[
      currentQuestionIndex
    ].id;

  const index =
    bookmarks.indexOf(
      questionId
    );

  if (index === -1) {

    bookmarks.push(
      questionId
    );

  } else {

    bookmarks.splice(
      index,
      1
    );

  }

  saveQuizData();

  updateBookmarkButton();

  updateSummary();

}

function updateBookmarkButton() {

  const button =
    document.getElementById(
      "bookmarkBtn"
    );

  if (!button) return;

  const questionId =
    questions[
      currentQuestionIndex
    ].id;

  if (
    bookmarks.includes(
      questionId
    )
  ) {

    button.textContent =
      "★ Bookmarked";

    button.classList.add(
      "bookmarked"
    );

  } else {

    button.textContent =
      "☆ Bookmark";

    button.classList.remove(
      "bookmarked"
    );

  }

}

/* ==================================================
   STORAGE
================================================== */

function saveQuizData() {

  localStorage.setItem(
    "userAnswers",
    JSON.stringify(
      userAnswers
    )
  );

  localStorage.setItem(
    "bookmarks",
    JSON.stringify(
      bookmarks
    )
  );

}

function loadSavedData() {

  const savedAnswers =
    localStorage.getItem(
      "userAnswers"
    );

  const savedBookmarks =
    localStorage.getItem(
      "bookmarks"
    );

  if (savedAnswers) {

    userAnswers =
      JSON.parse(
        savedAnswers
      );

  }

  if (savedBookmarks) {

    bookmarks =
      JSON.parse(
        savedBookmarks
      );

  }

}

/* ==================================================
   RESULTS
================================================== */

function showResults() {

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  questions.forEach((question, index) => {

    const answer = userAnswers[index];

    if (answer === undefined) {
      unanswered++;
    }
    else if (answer === question.correctAnswer) {
      correct++;
    }
    else {
      wrong++;
    }
  }
  );

  const attempted = correct + wrong;

  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  document.getElementById("resultTotal").textContent = questions.length;

  document.getElementById("resultCorrect").textContent = correct;

  document.getElementById("resultWrong").textContent = wrong;

  document.getElementById("resultAccuracy").textContent = `${accuracy}%`;

  document.querySelector(".practice-layout").style.display = "none";

  document.getElementById("resultsSection").hidden = false;

  localStorage.setItem("questionsAttempted", correct + wrong);

  localStorage.setItem("correctAnswers", correct);

  localStorage.setItem("wrongAnswers", wrong);

  localStorage.setItem("accuracy", accuracy);

  localStorage.setItem("unansweredQuestions", unanswered);
}

/* ==================================================
   SUBMIT
================================================== */

function submitPractice() {

  const confirmed =
    confirm(
      quizMode === "mock"
        ? "Submit Mock Test?"
        : "Submit Practice?"
    );

  if (!confirmed) {
    return;
  }

  showResults();

}

/* ==================================================
   RESET
================================================== */

function resetQuizData() {

  localStorage.removeItem(
    "userAnswers"
  );

  localStorage.removeItem(
    "bookmarks"
  );

  location.reload();

}

/* ==================================================
   BUTTON EVENTS
================================================== */

document
  .getElementById(
    "nextBtn"
  )
  .addEventListener(
    "click",
    () => {

      if (
        currentQuestionIndex <
        questions.length - 1
      ) {

        currentQuestionIndex++;

        displayQuestion();

      } else {

        submitPractice();

      }

    }
  );

document
  .getElementById(
    "prevBtn"
  )
  .addEventListener(
    "click",
    () => {

      if (
        currentQuestionIndex > 0
      ) {

        currentQuestionIndex--;

        displayQuestion();

      }

    }
  );

document
  .getElementById(
    "bookmarkBtn"
  )
  ?.addEventListener(
    "click",
    toggleBookmark
  );

document
  .getElementById(
    "submitPracticeBtn"
  )
  .addEventListener(
    "click",
    submitPractice
  );

document
  .getElementById(
    "restartBtn"
  )
  .addEventListener(
    "click",
    resetQuizData
  );

/* ==================================================
   START APP
================================================== */

loadQuestions();