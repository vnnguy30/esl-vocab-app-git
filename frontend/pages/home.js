// pages/home.js - Welcome screen: Add New Word / Relax choice, plus the
// cat mascots. "Add New Word" goes to the Dictionary page (where the add
// form and saved word list live) - Quiz/Flashcard study is still reachable
// any time via the "Study" nav bar link.

async function renderHome(container) {
  container.innerHTML = `
    <section class="card home-card">
      <h2 data-i18n="homeHeading"></h2>
      <p data-i18n="homeSubtitle"></p>
      <div class="home-choices">
        <div class="home-choice-wrap">
          <a href="#/dictionary" class="home-choice-btn">
            <span class="home-choice-emoji">📖</span>
            <span data-i18n="homeStudyChoice"></span>
          </a>
          <p class="home-choice-prompt" data-i18n="homeAddWordPrompt"></p>
        </div>
        <a href="#/relax" class="home-choice-btn">
          <span class="home-choice-emoji">🐾</span>
          <span data-i18n="homeRelaxChoice"></span>
        </a>
      </div>
    </section>
    <div id="cat-mascots"></div>
  `;
  applyTranslations();
  renderCatMascots(document.getElementById('cat-mascots'));
}
