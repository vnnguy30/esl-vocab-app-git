// pages/study.js - Quiz mode lives here. Flashcard mode (with audio) is a
// separate feature coming later - this page just has the quiz for now.

let quizQueue = [];
let currentQuizWord = null;
let quizTimeoutId = null;

async function renderStudy(container) {
  container.innerHTML = `
    <section class="card">
      <div class="list-header">
        <h2 data-i18n="quizHeading"></h2>
        <button id="quiz-btn" data-i18n="quizButton"></button>
      </div>
      <div id="quiz-content"><p class="empty-message" data-i18n="quizStartPrompt"></p></div>
    </section>
  `;
  applyTranslations();

  document.getElementById('quiz-btn').addEventListener('click', startQuizFlow);

  // Cancel any pending "next question" timer if the user leaves mid-quiz.
  return () => {
    if (quizTimeoutId) clearTimeout(quizTimeoutId);
  };
}

async function startQuizFlow() {
  const words = await getWords();
  if (words.length === 0) {
    alert(t('quizAlertEmpty'));
    return;
  }
  quizQueue = [...words].sort(() => Math.random() - 0.5);
  nextQuizQuestion();
}

function nextQuizQuestion() {
  const quizContent = document.getElementById('quiz-content');
  if (!quizContent) return; // page was navigated away from

  if (quizQueue.length === 0) {
    quizContent.innerHTML = `<p>${t('quizDone')}</p>`;
    return;
  }

  currentQuizWord = quizQueue.pop();
  quizContent.innerHTML = `
    <div id="quiz-word">${escapeHtml(currentQuizWord.english)}</div>
    <input type="text" id="quiz-answer" placeholder="${t('quizPlaceholder')}" autocomplete="off" />
    <button id="quiz-submit">${t('quizSubmit')}</button>
    <div id="quiz-feedback" class="quiz-feedback"></div>
  `;

  document.getElementById('quiz-submit').addEventListener('click', checkAnswer);
  document.getElementById('quiz-answer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
}

function checkAnswer() {
  const input = document.getElementById('quiz-answer').value.trim().toLowerCase();
  const correct = currentQuizWord.vietnamese.trim().toLowerCase();
  const feedback = document.getElementById('quiz-feedback');

  if (input === correct) {
    feedback.textContent = t('quizCorrect');
    feedback.className = 'quiz-feedback correct';
  } else {
    feedback.textContent = `${t('quizWrongPrefix')}${currentQuizWord.vietnamese}`;
    feedback.className = 'quiz-feedback wrong';
  }

  quizTimeoutId = setTimeout(nextQuizQuestion, 1500);
}
