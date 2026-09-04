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

// Loads the UI language that matches the saved learning direction.
// script.js calls this once on startup, before the router renders any page.
// The "I'm learning..." dropdown itself lives on the Settings page
// (pages/settings.js), which calls setLearningDirection() when it changes.
async function initI18n() {
  const direction = getLearningDirection();
  await loadLanguage(directionToUiLang(direction));
}

// Called by pages/settings.js when the user changes learning direction.
async function setLearningDirection(direction) {
  localStorage.setItem(LEARNING_DIRECTION_KEY, direction);
  await loadLanguage(directionToUiLang(direction));
  // Re-render the navbar and whichever page is currently showing, so
  // already-rendered dynamic text (word list, quiz, nav labels) updates too.
  if (typeof renderRoute === 'function') renderRoute();
}
