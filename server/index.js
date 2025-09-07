import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { randomUUID } from 'crypto';

const PORT = process.env.PORT || 8787;
const DB_FILE = process.env.DB_FILE || './songs.db';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// --- SQLite3 (callback) → helpers Promise ---
const db = new sqlite3.Database(DB_FILE);
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // this.lastID, this.changes
    });
  });
const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

// Init schema
await run(`
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lyrics TEXT DEFAULT '',
  chords TEXT DEFAULT '',
  isSelected INTEGER DEFAULT 0,
  selectionOrder INTEGER
);
`);

const rowToSong = (r) => ({
  id: r.id,
  name: r.name,
  lyrics: r.lyrics || '',
  chords: r.chords || '',
  isSelected: !!r.isSelected,
  selectionOrder: r.selectionOrder ?? null,
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/songs', async (req, res) => {
  try {
    const rows = await all(
      `SELECT * FROM songs ORDER BY name COLLATE NOCASE ASC`
    );
    res.json(rows.map(rowToSong));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/songs', async (req, res) => {
  try {
    const { name, lyrics = '', chords = '', isSelected = false, selectionOrder = null } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });

    const id = randomUUID();
    await run(
      `INSERT INTO songs (id, name, lyrics, chords, isSelected, selectionOrder)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, lyrics, chords, isSelected ? 1 : 0, selectionOrder]
    );
    const row = await get(`SELECT * FROM songs WHERE id = ?`, [id]);
    res.status(201).json(rowToSong(row));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'insert failed' });
  }
});

app.post('/songs/bulk', async (req, res) => {
  const arr = Array.isArray(req.body) ? req.body : [];
  try {
    await run('BEGIN');
    const stmt = db.prepare(
      `INSERT INTO songs (id, name, lyrics, chords, isSelected, selectionOrder)
       VALUES (?, ?, ?, ?, 0, NULL)`
    );
    await new Promise((resolve, reject) => {
      stmt.serialize = true;
      (async () => {
        try {
          for (const s of arr) {
            const id = randomUUID();
            await new Promise((res, rej) =>
              stmt.run([id, s.name, s.lyrics || '', s.chords || ''], (err) =>
                err ? rej(err) : res()
              )
            );
          }
          stmt.finalize((err) => (err ? reject(err) : resolve()));
        } catch (e) {
          reject(e);
        }
      })();
    });
    await run('COMMIT');
    res.status(201).json({ inserted: arr.length });
  } catch (e) {
    console.error(e);
    await run('ROLLBACK').catch(() => {});
    res.status(500).json({ error: 'bulk insert failed' });
  }
});

app.put('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lyrics, chords, isSelected, selectionOrder } = req.body || {};

    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (lyrics !== undefined) { fields.push('lyrics = ?'); values.push(lyrics); }
    if (chords !== undefined) { fields.push('chords = ?'); values.push(chords); }
    if (isSelected !== undefined) { fields.push('isSelected = ?'); values.push(isSelected ? 1 : 0); }
    if (selectionOrder !== undefined) { fields.push('selectionOrder = ?'); values.push(selectionOrder); }

    if (!fields.length) return res.status(400).json({ error: 'no fields to update' });

    values.push(id);
    const sql = `UPDATE songs SET ${fields.join(', ')} WHERE id = ?`;
    const result = await run(sql, values);
    if (result.changes === 0) return res.status(404).json({ error: 'not found' });

    const row = await get(`SELECT * FROM songs WHERE id = ?`, [id]);
    res.json(rowToSong(row));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'update failed' });
  }
});

app.delete('/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await run(`DELETE FROM songs WHERE id = ?`, [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'delete failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Songbook API listening on port ${PORT}`);
});
