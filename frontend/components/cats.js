// components/cats.js - The two cat mascots: gray tabby (white mitten paws)
// and orange-and-white. Both are plain inline SVG - no image files needed,
// so colors/shapes are easy to tweak right here.
//
// Public functions used by other pages:
//   renderCatMascots(container) - mounts both cats + their click menus
//   playCatReaction(onComplete) - correct-answer "pounce and kiss" animation

// How long the pounce+kiss reaction plays, in milliseconds.
// Must match the `cat-pounce` / `cat-kiss-pop` animation-duration in style.css.
const CAT_REACTION_MS = 1600;

const TABBY_CAT_SVG = `
<svg class="cat-illustration" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse cx="20" cy="78" rx="9" ry="7" fill="#ffffff"/>
  <ellipse cx="80" cy="78" rx="9" ry="7" fill="#ffffff"/>
  <g class="cat-tail">
    <path d="M78,60 Q98,55 92,30" stroke="#8b8a86" stroke-width="9" fill="none" stroke-linecap="round"/>
  </g>
  <ellipse cx="50" cy="62" rx="34" ry="26" fill="#a8a6a1"/>
  <ellipse cx="50" cy="70" rx="18" ry="14" fill="#f6f2ea"/>
  <ellipse cx="36" cy="84" rx="9" ry="7" fill="#ffffff"/>
  <ellipse cx="64" cy="84" rx="9" ry="7" fill="#ffffff"/>
  <circle cx="50" cy="34" r="24" fill="#a8a6a1"/>
  <polygon points="28,22 34,2 42,20" fill="#a8a6a1"/>
  <polygon points="31,17 34,7 38,16" fill="#e8b4b8"/>
  <polygon points="72,22 66,2 58,20" fill="#a8a6a1"/>
  <polygon points="69,17 66,7 62,16" fill="#e8b4b8"/>
  <path d="M38,14 Q40,10 44,12" stroke="#847f78" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M62,14 Q60,10 56,12" stroke="#847f78" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M30,48 Q40,44 48,48" stroke="#847f78" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse class="cat-eye" cx="41" cy="34" rx="3.2" ry="4.2" fill="#2f2a25"/>
  <ellipse class="cat-eye" cx="59" cy="34" rx="3.2" ry="4.2" fill="#2f2a25"/>
  <polygon points="50,41 47,45 53,45" fill="#e8909a"/>
  <path d="M50,45 Q46,50 41,47 M50,45 Q54,50 59,47" stroke="#5b544c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M20,36 L34,34 M20,42 L34,40" stroke="#c9c6c0" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M80,36 L66,34 M80,42 L66,40" stroke="#c9c6c0" stroke-width="1.4" stroke-linecap="round"/>
</svg>
`;

const ORANGE_CAT_SVG = `
<svg class="cat-illustration" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse cx="20" cy="78" rx="9" ry="7" fill="#fffaf0"/>
  <ellipse cx="80" cy="78" rx="9" ry="7" fill="#fffaf0"/>
  <g class="cat-tail">
    <path d="M22,60 Q2,55 8,30" stroke="#d97a3d" stroke-width="9" fill="none" stroke-linecap="round"/>
  </g>
  <ellipse cx="50" cy="62" rx="34" ry="26" fill="#e0873c"/>
  <ellipse cx="50" cy="70" rx="18" ry="14" fill="#fffaf0"/>
  <ellipse cx="36" cy="84" rx="9" ry="7" fill="#fffaf0"/>
  <ellipse cx="64" cy="84" rx="9" ry="7" fill="#fffaf0"/>
  <circle cx="50" cy="34" r="24" fill="#e0873c"/>
  <polygon points="28,22 34,2 42,20" fill="#e0873c"/>
  <polygon points="31,17 34,7 38,16" fill="#fbd7c4"/>
  <polygon points="72,22 66,2 58,20" fill="#e0873c"/>
  <polygon points="69,17 66,7 62,16" fill="#fbd7c4"/>
  <ellipse class="cat-eye" cx="41" cy="34" rx="3.2" ry="4.2" fill="#2f2a25"/>
  <ellipse class="cat-eye" cx="59" cy="34" rx="3.2" ry="4.2" fill="#2f2a25"/>
  <polygon points="50,41 47,45 53,45" fill="#8a4a2a"/>
  <path d="M50,45 Q46,50 41,47 M50,45 Q54,50 59,47" stroke="#8a4a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M20,36 L34,34 M20,42 L34,40" stroke="#f3c9a8" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M80,36 L66,34 M80,42 L66,40" stroke="#f3c9a8" stroke-width="1.4" stroke-linecap="round"/>
</svg>
`;

// Tracks the "click outside to close" listener so it can be removed again -
// there's only ever one cat menu open at a time.
let closeMenuHandler = null;

function catMenuHtml() {
  return `
    <div class="cat-menu" hidden>
      <a href="#/settings">⚙️ ${t('navSettings')}</a>
      <a href="#/help">❓ ${t('navHelp')}</a>
    </div>
  `;
}

function renderCatMascots(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="cat-mascot cat-left" data-cat="tabby">
      <button class="cat-button" type="button" aria-label="Open cat menu">
        ${TABBY_CAT_SVG}
        <span class="cat-kiss">💕</span>
      </button>
      ${catMenuHtml()}
    </div>
    <div class="cat-mascot cat-right" data-cat="orange">
      <button class="cat-button" type="button" aria-label="Open cat menu">
        ${ORANGE_CAT_SVG}
        <span class="cat-kiss">💕</span>
      </button>
      ${catMenuHtml()}
    </div>
  `;

  container.querySelectorAll('.cat-mascot').forEach(mascotEl => {
    mascotEl.querySelector('.cat-button').addEventListener('click', () => toggleCatMenu(mascotEl));
  });
}

function toggleCatMenu(mascotEl) {
  const menu = mascotEl.querySelector('.cat-menu');
  const wasOpen = !menu.hidden;
  closeAllCatMenus();
  if (wasOpen) return;

  menu.hidden = false;
  closeMenuHandler = (e) => {
    if (!mascotEl.contains(e.target)) closeAllCatMenus();
  };
  document.addEventListener('click', closeMenuHandler);
}

function closeAllCatMenus() {
  document.querySelectorAll('.cat-menu').forEach(menu => { menu.hidden = true; });
  if (closeMenuHandler) {
    document.removeEventListener('click', closeMenuHandler);
    closeMenuHandler = null;
  }
}

// Called from study.js when the user answers correctly. Picks a random
// mounted cat, plays its pounce+kiss animation, then calls onComplete.
// Returns the timeout id so the caller can clearTimeout() it if the user
// navigates away mid-animation.
function playCatReaction(onComplete) {
  const cats = document.querySelectorAll('.cat-mascot');
  if (cats.length > 0) {
    const chosen = cats[Math.floor(Math.random() * cats.length)];
    chosen.classList.add('pounce');
    setTimeout(() => chosen.classList.remove('pounce'), CAT_REACTION_MS);
  }
  return setTimeout(onComplete, CAT_REACTION_MS);
}
