// pages/dictionary.js - Full saved vocabulary list: add, view, search, delete.
// (The "add word" form lives here too, since this is where vocab is managed.)

let dictionaryWords = [];

async function renderDictionary(container) {
  container.innerHTML = `
    <section class="card">
      <h2 data-i18n="addWordHeading"></h2>
      <form id="word-form">
        <div class="form-row">
          <input type="text" id="english" data-i18n-placeholder="englishPlaceholder" required />
          <input type="text" id="vietnamese" data-i18n-placeholder="vietnamesePlaceholder" required />
        </div>
        <input type="text" id="example" data-i18n-placeholder="examplePlaceholder" />
        <input type="text" id="deck" data-i18n-placeholder="deckPlaceholder" />
        <button type="submit" data-i18n="addButton"></button>
      </form>
    </section>

    <section class="card">
      <h2 data-i18n="wordListHeading"></h2>
      <p class="subtitle" data-i18n="dictionarySubtitle"></p>
      <input type="text" id="dictionary-search" data-i18n-placeholder="dictionarySearchPlaceholder" />
      <div id="dictionary-list"></div>
    </section>
  `;
  applyTranslations();

  document.getElementById('word-form').addEventListener('submit', handleAddWord);
  document.getElementById('dictionary-search').addEventListener('input', (e) => {
    renderDictionaryList(e.target.value);
  });

  dictionaryWords = await getWords();
  renderDictionaryList('');
}

function renderDictionaryList(filterText) {
  const listEl = document.getElementById('dictionary-list');
  if (!listEl) return; // user may have already navigated to another page

  const filter = filterText.trim().toLowerCase();
  const filtered = filter
    ? dictionaryWords.filter(w =>
        w.english.toLowerCase().includes(filter) ||
        w.vietnamese.toLowerCase().includes(filter))
    : dictionaryWords;

  if (filtered.length === 0) {
    listEl.innerHTML = `<p class="empty-message">${t('emptyList')}</p>`;
    return;
  }

  listEl.innerHTML = filtered.map(word => `
    <div class="word-item">
      <div>
        <div class="word-main">${escapeHtml(word.english)} — ${escapeHtml(word.vietnamese)}</div>
        ${word.example_sentence ? `<div class="word-example">"${escapeHtml(word.example_sentence)}"</div>` : ''}
        <span class="deck-tag">${escapeHtml(word.deck)}</span>
      </div>
      <button class="delete-btn" data-id="${word.id}">${t('deleteButton')}</button>
    </div>
  `).join('');

  listEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteWord(btn.dataset.id));
  });
}

async function handleAddWord(e) {
  e.preventDefault();

  const english = document.getElementById('english').value.trim();
  const vietnamese = document.getElementById('vietnamese').value.trim();
  const example_sentence = document.getElementById('example').value.trim();
  const deck = document.getElementById('deck').value.trim() || 'General';

  await addWordApi({ english, vietnamese, example_sentence, deck });

  e.target.reset();
  dictionaryWords = await getWords();
  const searchInput = document.getElementById('dictionary-search');
  renderDictionaryList(searchInput ? searchInput.value : '');
}

async function handleDeleteWord(id) {
  await deleteWordApi(id);
  dictionaryWords = await getWords();
  const searchInput = document.getElementById('dictionary-search');
  renderDictionaryList(searchInput ? searchInput.value : '');
}
