// db.js - Sets up the SQLite database and creates the words table if it doesn't exist
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'vocab.db'));

// Create table for vocabulary words
db.exec(`
  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    english TEXT NOT NULL,
    vietnamese TEXT NOT NULL,
    example_sentence TEXT,
    deck TEXT DEFAULT 'General',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
