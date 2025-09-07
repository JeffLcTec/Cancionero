// server/index.js
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { randomUUID } from 'crypto';

const PORT = process.env.PORT || 8787;
const DB_FILE = process.env.DB_FILE || './songs.db';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Abrir DB con driver sqlite3 (sin compilar nada)
const db = await open({
  filename: DB_FILE,
  driver: sqlite3.Database,
});

// Init schema
await db.exec(`
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lyrics TEXT DEFAULT '',
  chords TEXT DEFAULT '',
  isSelected INTEGER DEFAULT 0,
  selectionOrder INTEGER
);
`);

function rowToSong(r) {
  return {
    id: r.id,
    name: r.name,
    lyrics: r.lyrics || '',
    chords: r.chords || '',
    isSelected: !!r.isSelected,
    selectionOrder: r.selectionOrder ?? null,
  };
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/songs', async (req, res) => {
  const rows = await db.all(`SELECT * FROM songs ORDER BY name COLLATE NOCASE ASC`);
  res.json(rows.map(rowToSong));
});

app.post('/songs', async (req, res) => {
  const { name, lyrics = '', chords = '', isSelected = false, selectionOrder = null } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const id = randomUUID();
  await db.run(
    `INSERT INTO songs (id, name, lyrics, chords, isSelected, selectionOrder) VALUES (?, ?, ?, ?, ?, ?)`,
    id, name, lyrics, chords, isSelected ? 1 : 0, selectionOrder
  );
  const row = await db.get(`SELECT * FROM songs WHERE id = ?`, id);
  res.status(201).json(rowToSong(row));
});

app.post('/songs/bulk', async (req, res) => {
  const arr = Array.isArray(req.body) ? req.body : [];
  try {
    await db.exec('BEGIN');
    const stmt = await db.prepare(
      `INSERT INTO songs (id, name, lyrics, chords, isSelected, selectionOrder) VALUES (?, ?, ?, ?, 0, NULL)`
    );
    for (const s of arr) {
      const id = randomUUID();
      await stmt.run(id, s.name, s.lyrics || '', s.chords || '');
    }
    await stmt.finalize();
    await db.exec('COMMIT');
    res.status(201).json({ inserted: arr.length });
  } catch (e) {
    await db.exec('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'bulk insert failed' });
  }
});

app.put('/songs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, lyrics, chords, isSelected, selectionOrder } = req.body || {};

  const fields = [];
  const values = [];
  if (name !== undefined) { fields.push('name = ?'); values.push(name); }
  if (lyrics !== undefined) { fields.push('lyrics = ?'); values.push(lyrics); }
  if (chords !== undefined) { fields.push('chords = ?'); values.push(chords); }
  if (isSelected !== undefined) { fields.push('isSelected = ?'); values.push(isSelected ? 1 : 0); }
  if (selectionOrder !== undefined) { fields.push('selectionOrder = ?'); values.push(selectionOrder); }

  if (fields.length === 0) return res.status(400).json({ error: 'no fields to update' });

  values.push(id);
  const sql = `UPDATE songs SET ${fields.join(', ')} WHERE id = ?`;
  const result = await db.run(sql, ...values);
  if (result.changes === 0) return res.status(404).json({ error: 'not found' });
  const row = await db.get(`SELECT * FROM songs WHERE id = ?`, id);
  res.json(rowToSong(row));
});

app.delete('/songs/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.run(`DELETE FROM songs WHERE id = ?`, id);
  if (result.changes === 0) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Songbook API listening on http://localhost:${PORT}`);
});
