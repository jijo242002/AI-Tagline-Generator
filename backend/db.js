const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./taglines.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS taglines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    audience TEXT,
    tone TEXT,
    tagline TEXT
  )`);
});

function storeTaglines(name, description, audience, tone, taglines) {
  const stmt = db.prepare('INSERT INTO taglines (name, description, audience, tone, tagline) VALUES (?, ?, ?, ?, ?)');
  taglines.forEach(t => {
    stmt.run(name, description, audience, tone, t);
  });
  stmt.finalize();
}

function getHistory(callback) {
  db.all('SELECT * FROM taglines ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      callback(rows);
    }
  });
}

module.exports = { storeTaglines, getHistory };
