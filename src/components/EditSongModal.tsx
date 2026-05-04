import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogPortal,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ChevronDown } from 'lucide-react';
import type { Song } from '../types/song';

interface EditSongModalProps {
  song: Song | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (song: Song) => void;
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  color: '#B8923A', display: 'block', marginBottom: '6px',
};

const TEXTAREA_BASE: React.CSSProperties = {
  fontFamily: 'Lora, Georgia, serif', borderRadius: '10px',
  background: '#F5EDD8', border: '1px solid rgba(184,146,58,0.35)',
  color: '#1C1008', resize: 'none', lineHeight: 1.7,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(184,146,58,0.38) transparent',
  width: '100%', boxSizing: 'border-box',
};

export function EditSongModal({ song, open, onOpenChange, onSave }: EditSongModalProps) {
  const [name, setName]               = useState('');
  const [lyrics, setLyrics]           = useState('');
  const [chords, setChords]           = useState('');
  const [lyricsOpen, setLyricsOpen]   = useState(false);

  useEffect(() => {
    if (song) {
      setName(song.name);
      setLyrics(song.lyrics);
      setChords(song.chords);
      setLyricsOpen(false); // siempre empieza colapsado
    }
  }, [song]);

  const handleSave = () => {
    if (song && name.trim()) {
      onSave({ ...song, name: name.trim(), lyrics: lyrics.trim(), chords: chords.trim() });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (song) { setName(song.name); setLyrics(song.lyrics); setChords(song.chords); }
    onOpenChange(false);
  };

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>

        {/* Overlay borroso */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(28,16,8,0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }} onClick={() => onOpenChange(false)} />

        {/* Modal */}
        <DialogPrimitive.Content style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
          width: '92%', maxWidth: '600px',
          outline: 'none', overflow: 'hidden',
          borderRadius: '20px',
          border: '1px solid rgba(184,146,58,0.25)',
          boxShadow: '0 8px 32px rgba(28,16,8,0.22), 0 2px 8px rgba(28,16,8,0.10)',
          background: '#FEFCF5',
          padding: '28px',
        }}>

          <DialogHeader style={{ marginBottom: '20px' }}>
            <DialogTitle style={{
              fontFamily: 'Cormorant, Georgia, serif', fontSize: '1.7rem',
              fontWeight: 700, fontStyle: 'italic', color: '#1C1008', margin: 0,
            }}>
              Editar Canción
            </DialogTitle>
            <DialogDescription style={{
              fontFamily: 'Lora, Georgia, serif', fontSize: '0.875rem',
              color: '#7A6040', marginTop: '4px',
            }}>
              Modifica la letra y acordes de la canción
            </DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Nombre */}
            <div>
              <label style={LABEL_STYLE}>Nombre de la Canción</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre de la canción"
                style={{
                  fontFamily: 'Lora, Georgia, serif', borderRadius: '10px',
                  height: '42px', background: '#F5EDD8',
                  border: '1px solid rgba(184,146,58,0.35)', color: '#1C1008',
                  width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Letra — desplegable */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Letra</label>
                <button
                  type="button"
                  onClick={() => setLyricsOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                    color: '#B8923A', background: 'transparent', border: 'none',
                    cursor: 'pointer', padding: '2px 0',
                  }}
                >
                  {lyricsOpen ? 'Contraer' : 'Editar'}
                  <ChevronDown
                    size={13}
                    style={{
                      transition: 'transform 0.22s',
                      transform: lyricsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
              </div>

              {/* Vista previa colapsada */}
              {!lyricsOpen && (
                <div
                  onClick={() => setLyricsOpen(true)}
                  style={{
                    position: 'relative', borderRadius: '10px', overflow: 'hidden',
                    background: '#F5EDD8', border: '1px solid rgba(184,146,58,0.35)',
                    cursor: 'pointer', minHeight: '62px',
                  }}
                >
                  <pre style={{
                    fontFamily: 'Lora, Georgia, serif', fontSize: '0.83rem',
                    color: lyrics ? '#1C1008' : '#7A6040',
                    fontStyle: lyrics ? 'normal' : 'italic',
                    lineHeight: 1.7, padding: '10px 12px', margin: 0,
                    whiteSpace: 'pre-wrap', maxHeight: '66px', overflow: 'hidden',
                  }}>
                    {lyrics || 'Haz clic para escribir la letra…'}
                  </pre>
                  {/* Degradado fade al fondo */}
                  {lyrics && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '32px',
                      background: 'linear-gradient(to bottom, transparent, #F5EDD8)',
                      pointerEvents: 'none',
                    }} />
                  )}
                </div>
              )}

              {/* Textarea expandido */}
              {lyricsOpen && (
                <Textarea
                  value={lyrics}
                  onChange={e => setLyrics(e.target.value)}
                  placeholder="Ingrese la letra de la canción..."
                  className="sacred-textarea"
                  style={{ ...TEXTAREA_BASE, height: '200px' }}
                />
              )}
            </div>

            {/* Acordes */}
            <div>
              <label style={LABEL_STYLE}>Acordes</label>
              <Textarea
                value={chords}
                onChange={e => setChords(e.target.value)}
                placeholder="Ingrese los acordes..."
                className="sacred-textarea"
                style={{
                  ...TEXTAREA_BASE,
                  fontFamily: 'monospace',
                  height: '88px',
                }}
              />
            </div>
          </div>

          <DialogFooter style={{ marginTop: '24px', gap: '8px' }}>
            <button
              onClick={handleCancel}
              style={{
                fontFamily: 'Inter, sans-serif', padding: '0 20px', height: '40px',
                borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                color: '#6B4226', background: '#F0E4C4',
                border: '1px solid rgba(184,146,58,0.30)', cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              style={{
                fontFamily: 'Inter, sans-serif', padding: '0 20px', height: '40px',
                borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#FEFCF5',
                background: 'linear-gradient(135deg, #1C1008, #4A2C10 55%, #B8923A)',
                border: 'none',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                opacity: name.trim() ? 1 : 0.45,
                boxShadow: '0 2px 8px rgba(28,16,8,0.20)',
              }}
            >
              Guardar Cambios
            </button>
          </DialogFooter>

        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
