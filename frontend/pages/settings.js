// pages/settings.js - Learning direction (UI language) toggle.
// Theme and account settings will be added here later.

async function renderSettings(container) {
  container.innerHTML = `
    <section class="card">
      <h2 data-i18n="settingsHeading"></h2>
      <div class="settings-row">
        <label for="learning-direction" data-i18n="learningDirectionLabel"></label>
        <select id="learning-direction">
          <option value="learn_en" data-i18n="learningEnglish"></option>
          <option value="learn_vi" data-i18n="learningVietnamese"></option>
        </select>
      </div>
    </section>
  `;
  applyTranslations();

  const select = document.getElementById('learning-direction');
  select.value = getLearningDirection();
  select.addEventListener('change', () => {
    setLearningDirection(select.value);
  });
}
