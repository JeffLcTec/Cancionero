import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
const PORT = process.env.PORT || 8787;

// Config Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// --- Helpers ---
const rowToSong = (r) => ({
  id: r.id,
  name: r.name,
  lyrics: r.lyrics || '',
  chords: r.chords || '',
  // estos dos ya no dependen de la DB
  isSelected: false,
  selectionOrder: null,
});

app.get('/health', (req, res) => res.json({ ok: true }));

// GET all songs
app.get('/songs', async (req, res) => {
  const { data, error } = await supabase.from('songs').select('*').order('name', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(rowToSong));
});

app.post('/songs', async (req, res) => {
  try {
    const { name, lyrics = '', chords = '' } = req.body || {};
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'name is required' });
    }

    const { data, error } = await supabase
      .from('songs')
      .insert([{ name, lyrics, chords }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }

    return res.status(201).json(data);
  } catch (e) {
    console.error('POST /songs exception:', e);
    return res.status(500).json({ error: 'insert failed' });
  }
});

// POST /songs/bulk
app.post('/songs/bulk', async (req, res) => {
  try {
    const payload = (Array.isArray(req.body) ? req.body : [])
      .filter(s => s && s.name)
      .map(s => ({ name: s.name, lyrics: s.lyrics ?? '', chords: s.chords ?? '' }));

    if (!payload.length) return res.status(400).json({ error: 'empty payload' });

    const { data, error } = await supabase
      .from('songs')
      .insert(payload)
      .select();

    if (error) {
      console.error('Supabase bulk insert error:', error);
      return res.status(500).json({
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }

    return res.status(201).json({ inserted: data.length, rows: data });
  } catch (e) {
    console.error('POST /songs/bulk exception:', e);
    return res.status(500).json({ error: 'bulk insert failed' });
  }
});

// PUT update
app.put('/songs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, lyrics, chords } = req.body || {};

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (lyrics !== undefined) fields.lyrics = lyrics;
  if (chords !== undefined) fields.chords = chords;

  if (Object.keys(fields).length === 0) return res.status(400).json({ error: 'no fields to update' });

  const { data, error } = await supabase
    .from('songs')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(rowToSong(data));
});

// DELETE one
app.delete('/songs/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('songs').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Songbook API listening on http://localhost:${PORT}`);
});
