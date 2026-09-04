// pages/study.js - Quiz mode and Flashcard mode both live here, switched
// via a small tab toggle. Direction follows the learning direction
// (Settings page):
//   learning English    -> prompt/audio is English, answer is Vietnamese
//   learning Vietnamese -> prompt/audio is Vietnamese, answer is English

const QUIZ_OPTION_COUNT = 4;

let studyMode = 'quiz'; // 'quiz' | 'flashcard'

// Quiz state
let allStudyWords = [];
let quizQueue = [];
let currentQuizWord = null;
let quizTimeoutId = null;

// Flashcard state
let flashcardWords = [];
let flashcardIndex = 0;
let flashcardRevealed = false;

async function renderStudy(container) {
  container.innerHTML = `
    <section class="card">
      <div class="list-header">
        <h2 data-i18n="quizHeading"></h2>
        <div class="study-tabs">
          <button class="study-tab-btn" data-mode="quiz" type="button" data-i18n="studyTabQuiz"></button>
          <button class="study-tab-btn" data-mode="flashcard" type="button" data-i18n="studyTabFlashcards"></button>
        </div>
      </div>
      <div id="study-mode-content"></div>
    </section>
    <div id="cat-mascots"></div>
  `;
  applyTranslations();
  renderCatMascots(document.getElementById('cat-mascots'));

  // Warm the voice list now so the first speaker-button click isn't delayed
  // waiting on the browser's async voice loading.
  if (window.speechSynthesis) loadVoices();

  document.querySelectorAll('.study-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchStudyMode(btn.dataset.mode));
  });

  renderStudyModeContent();

  // Cancel any pending quiz timer and stop any playing audio if the user
  // leaves the page mid-quiz or mid-flashcard.
  return () => {
    if (quizTimeoutId) clearTimeout(quizTimeoutId);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };
}

function switchStudyMode(mode) {
  if (mode === studyMode) return;
  if (quizTimeoutId) { clearTimeout(quizTimeoutId); quizTimeoutId = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  studyMode = mode;
  renderStudyModeContent();
}

function renderStudyModeContent() {
  document.querySelectorAll('.study-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === studyMode);
  });

  const el = document.getElementById('study-mode-content');
  if (!el) return;

  if (studyMode === 'quiz') {
    el.innerHTML = `
      <div class="list-header">
        <button id="quiz-btn" data-i18n="quizButton"></button>
      </div>
      <div id="quiz-content"><p class="empty-message" data-i18n="quizStartPrompt"></p></div>
    `;
    applyTranslations();
    document.getElementById('quiz-btn').addEventListener('click', startQuizFlow);
  } else {
    el.innerHTML = '';
    loadFlashcards();
  }
}

function quizPromptText(word, direction) {
  return direction === 'learn_vi' ? word.vietnamese : word.english;
}

function quizAnswerText(word, direction) {
  return direction === 'learn_vi' ? word.english : word.vietnamese;
}

// --- Quiz mode ---

async function startQuizFlow() {
  const words = await getWords();
  // Multiple choice needs at least 1 correct + 1 wrong option to work.
  if (words.length < 2) {
    alert(t('quizAlertEmpty'));
    return;
  }
  allStudyWords = words;
  quizQueue = [...words].sort(() => Math.random() - 0.5);
  nextQuizQuestion();
}

// Builds a shuffled list of answer options: the correct one plus up to
// 3 wrong ones pulled from the other saved words (deduplicated).
function buildQuizOptions(word, direction) {
  const correctAnswer = quizAnswerText(word, direction);
  const correctLower = correctAnswer.trim().toLowerCase();

  const distractorPool = allStudyWords
    .filter(w => w.id !== word.id)
    .map(w => quizAnswerText(w, direction))
    .filter(text => text.trim().toLowerCase() !== correctLower);

  const uniqueDistractors = [...new Set(distractorPool)]
    .sort(() => Math.random() - 0.5)
    .slice(0, QUIZ_OPTION_COUNT - 1);

  const options = [correctAnswer, ...uniqueDistractors];
  return options.sort(() => Math.random() - 0.5);
}

function nextQuizQuestion() {
  const quizContent = document.getElementById('quiz-content');
  if (!quizContent) return; // page was navigated away from, or tab was switched

  if (quizQueue.length === 0) {
    quizContent.innerHTML = `<p>${t('quizDone')}</p>`;
    return;
  }

  currentQuizWord = quizQueue.pop();
  const direction = getLearningDirection();
  const promptText = quizPromptText(currentQuizWord, direction);
  const options = buildQuizOptions(currentQuizWord, direction);

  quizContent.innerHTML = `
    <div id="quiz-word">${escapeHtml(promptText)}</div>
    <div class="quiz-options">
      ${options.map(option => `<button class="quiz-option-btn" type="button">${escapeHtml(option)}</button>`).join('')}
    </div>
    <div id="quiz-feedback" class="quiz-feedback"></div>
  `;

  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => checkAnswer(btn));
  });
}

function checkAnswer(selectedBtn) {
  const direction = getLearningDirection();
  const correctAnswer = quizAnswerText(currentQuizWord, direction);
  const correctLower = correctAnswer.trim().toLowerCase();
  const isCorrect = selectedBtn.textContent.trim().toLowerCase() === correctLower;

  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach(btn => { btn.disabled = true; });

  const feedback = document.getElementById('quiz-feedback');

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    feedback.textContent = t('quizCorrect');
    feedback.className = 'quiz-feedback correct';
    // One of the two cats pounces and gives a kiss, then we move on.
    quizTimeoutId = playCatReaction(nextQuizQuestion);
  } else {
    selectedBtn.classList.add('wrong');
    buttons.forEach(btn => {
      if (btn.textContent.trim().toLowerCase() === correctLower) {
        btn.classList.add('correct');
      }
    });
    feedback.textContent = `${t('quizWrongPrefix')}${correctAnswer}`;
    feedback.className = 'quiz-feedback wrong';
    quizTimeoutId = setTimeout(nextQuizQuestion, 1500);
  }
}

// --- Flashcard mode ---

async function loadFlashcards() {
  // Fetch words and make sure the voice list is loaded together, so
  // renderFlashcard() can immediately tell whether audio will work.
  const [words] = await Promise.all([
    getWords(),
    window.speechSynthesis && !cachedVoices ? loadVoices() : Promise.resolve(),
  ]);
  const el = document.getElementById('study-mode-content');
  if (!el || studyMode !== 'flashcard') return; // navigated/switched away while fetching

  if (words.length === 0) {
    el.innerHTML = `<p class="empty-message">${t('flashcardAlertEmpty')}</p>`;
    return;
  }

  flashcardWords = [...words].sort(() => Math.random() - 0.5);
  flashcardIndex = 0;
  flashcardRevealed = false;
  renderFlashcard();
}

function renderFlashcard() {
  const el = document.getElementById('study-mode-content');
  if (!el) return;

  const word = flashcardWords[flashcardIndex];
  const direction = getLearningDirection();
  const front = quizPromptText(word, direction);
  const back = quizAnswerText(word, direction);
  const langCode = direction === 'learn_vi' ? 'vi-VN' : 'en-US';
  const voiceAvailable = !!findVoiceForLang(langCode, cachedVoices || []);

  el.innerHTML = `
    <div class="flashcard-progress">${flashcardIndex + 1} / ${flashcardWords.length}</div>
    <div class="flashcard">
      <div class="flashcard-front">
        <span class="flashcard-word">${escapeHtml(front)}</span>
        <button class="flashcard-speak-btn" type="button" aria-label="Play pronunciation">🔊</button>
      </div>
      ${!voiceAvailable ? `<div class="flashcard-voice-note">${t('flashcardVoiceUnavailable')}</div>` : ''}
      ${flashcardRevealed ? `
        <div class="flashcard-back">
          <div class="flashcard-answer">${escapeHtml(back)}</div>
          ${word.example_sentence ? `<div class="flashcard-example">"${escapeHtml(word.example_sentence)}"</div>` : ''}
        </div>
      ` : ''}
    </div>
    <button class="flashcard-reveal-btn" type="button">${flashcardRevealed ? t('flashcardHideAnswer') : t('flashcardShowAnswer')}</button>
    <div class="flashcard-nav">
      <button class="flashcard-prev-btn" type="button" ${flashcardIndex === 0 ? 'disabled' : ''}>⬅ ${t('flashcardPrev')}</button>
      <button class="flashcard-next-btn" type="button" ${flashcardIndex === flashcardWords.length - 1 ? 'disabled' : ''}>${t('flashcardNext')} ➡</button>
    </div>
  `;

  document.querySelector('.flashcard-speak-btn').addEventListener('click', () => speakFlashcardWord(word, direction));
  document.querySelector('.flashcard-reveal-btn').addEventListener('click', toggleFlashcardReveal);
  document.querySelector('.flashcard-prev-btn').addEventListener('click', () => goToFlashcard(flashcardIndex - 1));
  document.querySelector('.flashcard-next-btn').addEventListener('click', () => goToFlashcard(flashcardIndex + 1));
}

function toggleFlashcardReveal() {
  flashcardRevealed = !flashcardRevealed;
  renderFlashcard();
}

function goToFlashcard(index) {
  if (index < 0 || index >= flashcardWords.length) return;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  flashcardIndex = index;
  flashcardRevealed = false;
  renderFlashcard();
}

// Setting utterance.lang alone isn't enough in every browser - if no voice
// installed actually matches that language, some browsers silently fall
// back to a default (usually English) voice instead of erroring, which is
// what makes Vietnamese come out sounding wrong even with lang set right.
// So we also look up and set an explicit matching voice when one exists.
let cachedVoices = null;

function loadVoices() {
  return new Promise(resolve => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    // Chrome loads voices asynchronously - they're not ready on the very
    // first call, so wait for the browser to tell us they're in.
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    };
    // Fallback in case onvoiceschanged never fires (some browsers don't).
    setTimeout(() => {
      if (!cachedVoices) {
        cachedVoices = window.speechSynthesis.getVoices();
        resolve(cachedVoices);
      }
    }, 1000);
  });
}

// Finds an installed voice matching a language code (e.g. "vi-VN"),
// preferring an exact match and falling back to any voice for that
// language's prefix (e.g. any "vi-*"). Returns null if the browser has
// no voice for that language at all.
function findVoiceForLang(langCode, voices) {
  const exact = voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase());
  if (exact) return exact;
  const prefix = langCode.split('-')[0].toLowerCase();
  return voices.find(v => v.lang.toLowerCase().startsWith(prefix)) || null;
}

async function speakFlashcardWord(word, direction) {
  if (!window.speechSynthesis) return; // Web Speech API not supported here
  window.speechSynthesis.cancel();

  const text = quizPromptText(word, direction);
  const langCode = direction === 'learn_vi' ? 'vi-VN' : 'en-US';
  const voices = cachedVoices || await loadVoices();
  const voice = findVoiceForLang(langCode, voices);

  if (!voice) {
    // No installed voice for this language - the browser would otherwise
    // silently substitute a wrong-sounding one. Logged for now; see the
    // conversation for the UX decision on how to surface this to users.
    console.warn(`No ${langCode} voice installed - speech will be skipped.`);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
