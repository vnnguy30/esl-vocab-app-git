// pages/relax.js - Cat mini-games (brush, feed, trim nails).
// Placeholder page for now - the actual mini-games are a later feature.

async function renderRelax(container) {
  container.innerHTML = `
    <section class="card">
      <h2 data-i18n="relaxHeading"></h2>
      <p data-i18n="relaxComingSoon"></p>
    </section>
  `;
  applyTranslations();
}
