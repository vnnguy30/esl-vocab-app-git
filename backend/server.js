// server.js - Main backend server
// Provides a REST API to create, read, update, and delete vocabulary words

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all words (optionally filter by deck)
app.get('/api/words', (req, res) => {
  const { deck } = req.query;
  let words;
  if (deck) {
    words = db.prepare('SELECT * FROM words WHERE deck = ? ORDER BY created_at DESC').all(deck);
  } else {
    words = db.prepare('SELECT * FROM words ORDER BY created_at DESC').all();
  }
  res.json(words);
});

// GET a single word by id
app.get('/api/words/:id', (req, res) => {
  const word = db.prepare('SELECT * FROM words WHERE id = ?').get(req.params.id);
  if (!word) return res.status(404).json({ error: 'Word not found' });
  res.json(word);
});

// POST create a new word
app.post('/api/words', (req, res) => {
  const { english, vietnamese, example_sentence, deck } = req.body;

  if (!english || !vietnamese) {
    return res.status(400).json({ error: 'English and Vietnamese fields are required' });
  }

  const stmt = db.prepare(
    'INSERT INTO words (english, vietnamese, example_sentence, deck) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(english, vietnamese, example_sentence || '', deck || 'General');

  const newWord = db.prepare('SELECT * FROM words WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newWord);
});

// PUT update an existing word
app.put('/api/words/:id', (req, res) => {
  const { english, vietnamese, example_sentence, deck } = req.body;
  const existing = db.prepare('SELECT * FROM words WHERE id = ?').get(req.params.id);

  if (!existing) return res.status(404).json({ error: 'Word not found' });

  db.prepare(
    'UPDATE words SET english = ?, vietnamese = ?, example_sentence = ?, deck = ? WHERE id = ?'
  ).run(
    english || existing.english,
    vietnamese || existing.vietnamese,
    example_sentence ?? existing.example_sentence,
    deck || existing.deck,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM words WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE a word
app.delete('/api/words/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM words WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Word not found' });

  db.prepare('DELETE FROM words WHERE id = ?').run(req.params.id);
  res.json({ message: 'Word deleted', id: req.params.id });
});

// GET list of distinct decks
app.get('/api/decks', (req, res) => {
  const decks = db.prepare('SELECT DISTINCT deck FROM words').all().map(row => row.deck);
  res.json(decks);
});

app.listen(PORT, () => {
  console.log(`ESL Vocab backend running at http://localhost:${PORT}`);
});
