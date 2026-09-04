// pages/relax.js - Hub page: pick a cat mini-game.

// A simple hairbrush icon - a rectangle handle plus a row of short bristle
// lines. Drawn as SVG instead of an emoji (like 🪮) since brush emoji
// support/rendering is inconsistent across browsers and operating systems.
function brushIconSvg() {
  return `
    <svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="24" width="8" height="20" rx="4" fill="#8a5a35"/>
      <rect x="10" y="8" width="28" height="14" rx="7" fill="#d97a3d"/>
      <line x1="14" y1="8" x2="14" y2="2" stroke="#5b544c" stroke-width="2" stroke-linecap="round"/>
      <line x1="20" y1="8" x2="20" y2="1" stroke="#5b544c" stroke-width="2" stroke-linecap="round"/>
      <line x1="26" y1="8" x2="26" y2="1" stroke="#5b544c" stroke-width="2" stroke-linecap="round"/>
      <line x1="32" y1="8" x2="32" y2="2" stroke="#5b544c" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

async function renderRelax(container) {
  container.innerHTML = `
    <section class="card home-card">
      <h2 data-i18n="relaxHeading"></h2>
      <p data-i18n="relaxSubtitle"></p>
      <div class="home-choices">
        <a href="#/relax/trim-nails" class="home-choice-btn">
          <span class="home-choice-emoji">💅</span>
          <span data-i18n="relaxTrimNailsChoice"></span>
        </a>
        <a href="#/relax/brush" class="home-choice-btn">
          <span class="home-choice-icon">${brushIconSvg()}</span>
          <span data-i18n="relaxBrushChoice"></span>
        </a>
        <a href="#/relax/feed" class="home-choice-btn">
          <span class="home-choice-emoji">🍽️</span>
          <span data-i18n="relaxFeedChoice"></span>
        </a>
      </div>
    </section>
  `;
  applyTranslations();
}
