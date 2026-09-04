// pages/help.js - FAQ / contact info. Placeholder for now.

async function renderHelp(container) {
  container.innerHTML = `
    <section class="card">
      <h2 data-i18n="helpHeading"></h2>
      <p data-i18n="helpIntro"></p>
    </section>
  `;
  applyTranslations();
}
