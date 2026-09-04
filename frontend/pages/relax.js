// pages/relax.js - Hub page: pick a cat mini-game.
// Brush and Feed are still placeholders until they're built.

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
        <div class="home-choice-btn home-choice-btn-disabled">
          <span class="home-choice-emoji">🧹</span>
          <span data-i18n="relaxBrushChoice"></span>
          <span class="home-choice-soon" data-i18n="relaxComingSoonTag"></span>
        </div>
        <div class="home-choice-btn home-choice-btn-disabled">
          <span class="home-choice-emoji">🍽️</span>
          <span data-i18n="relaxFeedChoice"></span>
          <span class="home-choice-soon" data-i18n="relaxComingSoonTag"></span>
        </div>
      </div>
    </section>
  `;
  applyTranslations();
}
