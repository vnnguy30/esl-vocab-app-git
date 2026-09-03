// script.js - Handles all frontend logic: fetching words, adding words, quiz mode

const API_URL = 'http://localhost:3001/api';

const wordForm = document.getElementById('word-form');
const wordList = document.getElementById('word-list');
const quizBtn = document.getElementById('quiz-btn');
const quizSection = document.getElementById('quiz-section');
const quizContent = document.getElementById('quiz-content');

let allWords = [];
let quizQueue = [];
let currentQuizWord = null;

// Fetch and render all words
async function loadWords() {
  const res = await fetch(`${API_URL}/words`);
  allWords = await res.json();
  renderWords();
}

function renderWords() {
  if (allWords.length === 0) {
    wordList.innerHTML = '<p style="color:#9ca3af;">Chưa có từ nào. Hãy thêm từ đầu tiên!</p>';
    return;
  }

  wordList.innerHTML = allWords.map(word => `
    <div class="word-item">
      <div>
        <div class="word-main">${escapeHtml(word.english)} — ${escapeHtml(word.vietnamese)}</div>
        ${word.example_sentence ? `<div class="word-example">"${escapeHtml(word.example_sentence)}"</div>` : ''}
        <span class="deck-tag">${escapeHtml(word.deck)}</span>
      </div>
      <button class="delete-btn" data-id="${word.id}">Xóa</button>
    </div>
  `).join('');

  // Attach delete listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteWord(btn.dataset.id));
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Add new word
wordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const english = document.getElementById('english').value.trim();
  const vietnamese = document.getElementById('vietnamese').value.trim();
  const example_sentence = document.getElementById('example').value.trim();
  const deck = document.getElementById('deck').value.trim() || 'General';

  await fetch(`${API_URL}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ english, vietnamese, example_sentence, deck })
  });

  wordForm.reset();
  loadWords();
});

// Delete word
async function deleteWord(id) {
  await fetch(`${API_URL}/words/${id}`, { method: 'DELETE' });
  loadWords();
}

// Quiz mode
quizBtn.addEventListener('click', () => {
  if (allWords.length === 0) {
    alert('Hãy thêm ít nhất 1 từ trước khi ôn tập!');
    return;
  }
  quizSection.classList.toggle('hidden');
  if (!quizSection.classList.contains('hidden')) {
    startQuiz();
  }
});

function startQuiz() {
  quizQueue = [...allWords].sort(() => Math.random() - 0.5);
  nextQuizQuestion();
}

function nextQuizQuestion() {
  if (quizQueue.length === 0) {
    quizContent.innerHTML = '<p>🎉 Bạn đã ôn tập hết! Nhấn "Chế độ ôn tập" để bắt đầu lại.</p>';
    return;
  }

  currentQuizWord = quizQueue.pop();
  quizContent.innerHTML = `
    <div id="quiz-word">${escapeHtml(currentQuizWord.english)}</div>
    <input type="text" id="quiz-answer" placeholder="Nhập nghĩa tiếng Việt..." autocomplete="off" />
    <button id="quiz-submit">Kiểm tra</button>
    <div id="quiz-feedback" class="quiz-feedback"></div>
  `;

  document.getElementById('quiz-submit').addEventListener('click', checkAnswer);
  document.getElementById('quiz-answer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });
}

function checkAnswer() {
  const input = document.getElementById('quiz-answer').value.trim().toLowerCase();
  const correct = currentQuizWord.vietnamese.trim().toLowerCase();
  const feedback = document.getElementById('quiz-feedback');

  if (input === correct) {
    feedback.textContent = '✅ Chính xác!';
    feedback.className = 'quiz-feedback correct';
  } else {
    feedback.textContent = `❌ Sai rồi. Đáp án đúng: ${currentQuizWord.vietnamese}`;
    feedback.className = 'quiz-feedback wrong';
  }

  setTimeout(nextQuizQuestion, 1500);
}

// Initial load
loadWords();
