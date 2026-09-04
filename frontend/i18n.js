// i18n.js - Picks which language the UI text is shown in.
//
// The app has two kinds of "language" that are easy to mix up:
//   1. The vocabulary itself (always English <-> Vietnamese word pairs)
//   2. The UI language (buttons, labels, messages) - THIS file handles that.
//
// Rule: whichever language the user is LEARNING, the UI shows the OTHER one,
// so instructions are always in a language they already understand.
//   - direction "learn_en" (learning English)    -> UI in Vietnamese
//   - direction "learn_vi" (learning Vietnamese)  -> UI in English
//
// The direction is remembered in localStorage so it persists between visits.

const LEARNING_DIRECTION_KEY = 'esl_learning_direction';

let translations = {};
let currentLang = 'vi';

function directionToUiLang(direction) {
  return direction === 'learn_vi' ? 'en' : 'vi';
}

function getLearningDirection() {
  return localStorage.getItem(LEARNING_DIRECTION_KEY) || 'learn_en';
}

// Look up one UI string by key, e.g. t('addButton').
// Falls back to the key itself if it's missing, so a typo shows up
// as visible broken text instead of silently disappearing.
function t(key) {
  return translations[key] || key;
}

async function loadLanguage(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  translations = await res.json();
  currentLang = lang;
  document.documentElement.lang = lang;
  applyTranslations();
}

// Push the loaded strings into every element tagged for translation.
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

// Wires up the "I'm learning..." dropdown and loads the matching UI language.
// script.js calls this once on startup, then awaits it before rendering
// anything that uses t() (like the word list).
async function initI18n() {
  const direction = getLearningDirection();
  const select = document.getElementById('learning-direction');

  if (select) {
    select.value = direction;
    select.addEventListener('change', async () => {
      localStorage.setItem(LEARNING_DIRECTION_KEY, select.value);
      await loadLanguage(directionToUiLang(select.value));
      // Re-render anything with dynamic, JS-generated text (word list, quiz).
      if (typeof onLanguageChanged === 'function') onLanguageChanged();
    });
  }

  await loadLanguage(directionToUiLang(direction));
}
