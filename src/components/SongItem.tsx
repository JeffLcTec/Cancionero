import { useState } from 'react';
import { Edit, Plus, Trash2, ChevronDown, Music2 } from 'lucide-react';
import type { Song } from '../types/song';

interface SongItemProps {
  song: Song;
  viewMode: 'list' | 'grid';
  onToggleSelect: (id: string) => void;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

const GOLD       = '#B8923A';
const ESPRESSO   = '#1C1008';
const CREAM      = '#FEFCF5';
const TAUPE      = '#7A6040';
const PARCHMENT  = '#EDE0C4';

/* ── VISTA LISTA ───────────────────────────────────────── */
function ListCard({ song, onToggleSelect, onEdit, onDelete }: Omit<SongItemProps, 'viewMode'>) {
  const [expanded, setExpanded] = useState(false);

  const cardStyle: React.CSSProperties = {
    background: CREAM,
    borderRadius: '14px',
    border: song.isSelected
      ? `1.5px solid ${GOLD}`
      : '1px solid rgba(184,146,58,0.18)',
    boxShadow: song.isSelected
      ? `0 2px 8px rgba(184,146,58,0.18), 0 8px 24px rgba(28,16,8,0.07), 0 0 0 3px rgba(184,146,58,0.08)`
      : '0 1px 3px rgba(28,16,8,0.05), 0 4px 14px rgba(28,16,8,0.05)',
    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.15s',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      className="group"
      style={cardStyle}
      onMouseEnter={e => {
        if (!song.isSelected) {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 2px 6px rgba(28,16,8,0.08), 0 10px 30px rgba(28,16,8,0.09), 0 0 0 1px rgba(184,146,58,0.28)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={e => {
        if (!song.isSelected) {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 1px 3px rgba(28,16,8,0.05), 0 4px 14px rgba(28,16,8,0.05)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }
      }}
      onClick={() => setExpanded(v => !v)}
    >
      {/* Barra lateral dorada */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
        background: `linear-gradient(to bottom, ${GOLD}, #8B6020)`,
        opacity: song.isSelected ? 1 : 0,
        transition: 'opacity 0.2s',
      }} />

      <div style={{ padding: '14px 16px 14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>

          {/* Selector */}
          <div style={{ flexShrink: 0, paddingTop: '2px' }}>
            {song.isSelected && song.selectionOrder ? (
              <button
                aria-label={`Quitar posición ${song.selectionOrder}`}
                onClick={e => { e.stopPropagation(); onToggleSelect(song.id); }}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${ESPRESSO}, ${GOLD})`,
                  color: CREAM, border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '12px',
                  boxShadow: `0 2px 8px rgba(184,146,58,0.40)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {song.selectionOrder}
              </button>
            ) : (
              <button
                aria-label={`Agregar ${song.name}`}
                onClick={e => { e.stopPropagation(); onToggleSelect(song.id); }}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'transparent',
                  border: `1.5px solid rgba(184,146,58,0.35)`,
                  color: GOLD, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,146,58,0.10)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(184,146,58,0.35)';
                }}
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          {/* Contenido */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <p className="font-display" style={{
                textTransform: 'Capitalize',
                fontSize: '1.2rem', fontWeight: 600, color: ESPRESSO,
                lineHeight: 1.3, margin: 0,
              }}>
                {song.name}
              </p>
              <ChevronDown
                size={16}
                style={{
                  color: GOLD, flexShrink: 0, marginTop: '3px',
                  transition: 'transform 0.3s',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                  opacity: 0.7,
                }}
              />
            </div>

            {!expanded && (song.lyrics || song.chords) && (
              <p className="font-serif" style={{
                fontSize: '0.82rem', color: TAUPE, fontStyle: 'italic',
                marginTop: '3px', lineHeight: 1.5,
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              }}>
                {song.lyrics
                  ? song.lyrics.split('\n')[0]
                  : song.chords?.substring(0, 60)}
              </p>
            )}

            {expanded && (
              <div style={{
                marginTop: '12px', paddingTop: '12px',
                borderTop: '1px solid rgba(184,146,58,0.15)',
              }}>
                {song.lyrics && (
                  <pre className="font-serif" style={{
                    fontSize: '0.85rem', color: ESPRESSO, opacity: 0.85,
                    whiteSpace: 'pre-wrap', lineHeight: 1.75, margin: 0,
                  }}>
                    {song.lyrics}
                  </pre>
                )}
                {song.chords && (
                  <div style={{ marginTop: song.lyrics ? '12px' : 0 }}>
                    <p className="font-ui" style={{
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.20em',
                      textTransform: 'uppercase', color: GOLD, marginBottom: '6px',
                    }}>
                      Acordes
                    </p>
                    <p className="font-ui" style={{
                      fontSize: '0.82rem', fontFamily: 'monospace', color: TAUPE, lineHeight: 1.6,
                    }}>
                      {song.chords}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Acciones — siempre visibles */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0,
          }}
            onClick={e => e.stopPropagation()}
          >
            <button
              aria-label={`Editar ${song.name}`}
              onClick={e => { e.stopPropagation(); onEdit(song); }}
              style={{
                width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                background: 'transparent', color: TAUPE, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(28,16,8,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Edit size={15} />
            </button>
            <button
              aria-label={`Eliminar ${song.name}`}
              onClick={e => {
                e.stopPropagation();
                onDelete(song.id);
              }}
              style={{
                width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                background: 'transparent', color: '#C0392B', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.6'; }}
            >
              <Trash2 size={15} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── VISTA CUADRÍCULA ──────────────────────────────────── */
function GridCard({ song, onToggleSelect, onEdit, onDelete }: Omit<SongItemProps, 'viewMode'>) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: CREAM,
        borderRadius: '18px',
        
        border: song.isSelected
          ? `1.5px solid ${GOLD}`
          : '1px solid rgba(184,146,58,0.18)',
        boxShadow: song.isSelected
          ? `0 4px 16px rgba(184,146,58,0.20), 0 0 0 3px rgba(184,146,58,0.08)`
          : hovered
            ? '0 4px 20px rgba(28,16,8,0.10), 0 0 0 1px rgba(184,146,58,0.25)'
            : '0 1px 4px rgba(28,16,8,0.06), 0 4px 12px rgba(28,16,8,0.05)',
        transition: 'box-shadow 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Zona superior: icono + selección */}
      <div style={{
        background: song.isSelected
          ? `linear-gradient(135deg, rgba(184,146,58,0.12), rgba(237,224,196,0.6))`
          : `linear-gradient(135deg, ${PARCHMENT}80, ${PARCHMENT}40)`,
        padding: '24px 16px 18px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <Music2 size={32} style={{ color: GOLD, opacity: song.isSelected ? 0.9 : 0.35 }} />

        {/* Botón selección */}
        {song.isSelected && song.selectionOrder ? (
          <button
            onClick={e => { e.stopPropagation(); onToggleSelect(song.id); }}
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${ESPRESSO}, ${GOLD})`,
              color: CREAM, border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '11px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 8px rgba(184,146,58,0.40)`,
            }}
          >
            {song.selectionOrder}
          </button>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onToggleSelect(song.id); }}
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.7)',
              border: `1.5px solid rgba(184,146,58,0.35)`,
              color: GOLD, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <Plus size={13} />
          </button>
        )}
      </div>

      {/* Zona inferior: info */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p className="font-display" style={{
          textTransform: 'Capitalize',
          fontSize: '1.05rem', fontWeight: 600, color: ESPRESSO,
          lineHeight: 1.35, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {song.name}
        </p>

        {(song.lyrics || song.chords) && (
          <p className="font-serif" style={{
            fontSize: '0.78rem', color: TAUPE, fontStyle: 'italic',
            lineHeight: 1.5, margin: 0,
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {song.lyrics
              ? song.lyrics.split('\n')[0]
              : song.chords?.substring(0, 40)}
          </p>
        )}

        {/* Acciones — siempre visibles */}
        <div style={{
          marginTop: 'auto', paddingTop: '10px',
          display: 'flex', justifyContent: 'flex-end', gap: '4px',
        }}>
          <button
            onClick={e => { e.stopPropagation(); onEdit(song); }}
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: 'none',
              background: 'rgba(28,16,8,0.06)', color: TAUPE, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Edit size={15} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              if (confirm(`¿Eliminar "${song.name}"?`)) onDelete(song.id);
            }}
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: 'none',
              background: '#FEE2E2', color: '#C0392B', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Export principal ──────────────────────────────────── */
export function SongItem({ viewMode, ...props }: SongItemProps) {
  return viewMode === 'grid'
    ? <GridCard {...props} />
    : <ListCard {...props} />;
}
