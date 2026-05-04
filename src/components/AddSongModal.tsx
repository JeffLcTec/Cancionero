import { useState } from 'react';
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
import { ExternalLink } from 'lucide-react';
import type { Song } from '../types/song';

interface AddSongModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (song: Omit<Song, 'id' | 'isSelected' | 'selectionOrder'>) => void;
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

export function AddSongModal({ open, onOpenChange, onSave }: AddSongModalProps) {
  const [name, setName]     = useState('');
  const [lyrics, setLyrics] = useState('');
  const [chords, setChords] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), lyrics: lyrics.trim(), chords: chords.trim() });
      setName(''); setLyrics(''); setChords('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setName(''); setLyrics(''); setChords('');
    onOpenChange(false);
  };

  const normalizeForUrl = (str: string) =>
    str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

  const handleSearchInLacuerda = () => {
    if (!name.trim()) return;
    if (name.includes('-')) {
      const [artistRaw, songRaw] = name.split('-').map(s => s.trim());
      if (artistRaw && songRaw) {
        window.open(`https://acordes.lacuerda.net/${normalizeForUrl(artistRaw)}/${normalizeForUrl(songRaw)}`, '_blank');
        return;
      }
    }
    window.open(`https://acordes.lacuerda.net/busca.php?lang=ES&exp=${encodeURIComponent(name.trim())}&canc=0&ord=0&ini=0`, '_blank');
  };

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
              Agregar Nueva Canción
            </DialogTitle>
            <DialogDescription style={{
              fontFamily: 'Lora, Georgia, serif', fontSize: '0.875rem',
              color: '#7A6040', marginTop: '4px',
            }}>
              Completa la información de la nueva canción
            </DialogDescription>
          </DialogHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Nombre */}
            <div>
              <label style={LABEL_STYLE}>Nombre de la Canción</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Autor - Canción  o  solo Canción"
                  style={{
                    fontFamily: 'Lora, Georgia, serif', borderRadius: '10px',
                    height: '42px', background: '#F5EDD8',
                    border: '1px solid rgba(184,146,58,0.35)', color: '#1C1008', flex: 1,
                    
                  }}
                />
                <button
                  type="button"
                  onClick={handleSearchInLacuerda}
                  disabled={!name.trim()}
                  style={{
                    fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center',
                    gap: '6px', padding: '0 12px', height: '42px', borderRadius: '10px',
                    fontSize: '12px', fontWeight: 600, color: '#6B4226',
                    background: '#F5EDD8', border: '1px solid rgba(184,146,58,0.35)',
                    cursor: 'pointer', flexShrink: 0, opacity: name.trim() ? 1 : 0.4,
                  }}
                >
                  <ExternalLink size={13} /> LaCuerda
                </button>
              </div>
            </div>

            {/* Letra */}
            <div>
              <label style={LABEL_STYLE}>Letra</label>
              <Textarea
                value={lyrics}
                onChange={e => setLyrics(e.target.value)}
                placeholder="Ingrese la letra de la canción..."
                className="sacred-textarea"
                style={{ ...TEXTAREA_BASE, height: '200px' }}
              />
            </div>

            {/* Acordes */}
            <div>
              <label style={LABEL_STYLE}>Acordes</label>
              <Textarea
                value={chords}
                onChange={e => setChords(e.target.value)}
                placeholder="Ingrese los acordes de la canción..."
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
              Guardar Canción
            </button>
          </DialogFooter>

        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
