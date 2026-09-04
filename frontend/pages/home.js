// pages/home.js - Welcome screen: Study / Relax choice.
// Cat mascots will be added here once the cat mascot system is built.

async function renderHome(container) {
  container.innerHTML = `
    <section class="card home-card">
      <h2 data-i18n="homeHeading"></h2>
      <p data-i18n="homeSubtitle"></p>
      <div class="home-choices">
        <a href="#/study" class="home-choice-btn">
          <span class="home-choice-emoji">📖</span>
          <span data-i18n="homeStudyChoice"></span>
        </a>
        <a href="#/relax" class="home-choice-btn">
          <span class="home-choice-emoji">🐾</span>
          <span data-i18n="homeRelaxChoice"></span>
        </a>
      </div>
    </section>
  `;
  applyTranslations();
}
