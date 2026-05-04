import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from './ui/input';
import { SongItem } from './SongItem';
import { AddSongModal } from './AddSongModal';
import { EditSongModal } from './EditSongModal';
import { generateSongbookPDF } from '../utils/pdfGenerator';
import { Plus, Download, Search, LayoutGrid, List, Music, BookOpen, X, Check, Pencil, Trash2 } from 'lucide-react';
import type { Song } from '../types/song';
import { loadSongs, saveSongs } from '../utils/storage';
import { mockSongs } from '../data/mockSongs';


/* ── Toast de confirmación ──────────────────────────────── */
type ToastType = 'add' | 'edit' | 'delete';

const TOAST_CONFIG: Record<ToastType, { bg: string; icon: React.ReactNode; label: string }> = {
  add:    { bg: '#166534', icon: <Check    size={22} strokeWidth={2.5} />, label: 'Canción agregada'   },
  edit:   { bg: '#1C1008', icon: <Pencil   size={20} strokeWidth={2.5} />, label: 'Cambios guardados'  },
  delete: { bg: '#991B1B', icon: <Trash2   size={20} strokeWidth={2.5} />, label: 'Canción eliminada'  },
};

/* ── Diálogo de confirmación de borrado ─────────────────── */
function ConfirmDeleteDialog({
  songName,
  onConfirm,
  onCancel,
}: {
  songName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    /* Overlay */
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998,
        background: 'rgba(28,16,8,0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onCancel}
    >
      {/* Card */}
      <div
        className="toast-enter"
        style={{
          background: '#FEFCF5',
          borderRadius: '20px',
          border: '1px solid rgba(184,146,58,0.25)',
          boxShadow: '0 8px 32px rgba(28,16,8,0.22)',
          padding: '28px 28px 24px',
          maxWidth: '380px', width: '100%',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Ícono */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#FEE2E2', margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Trash2 size={24} color="#C0392B" />
        </div>

        <p style={{
          fontFamily: 'Cormorant, Georgia, serif',
          fontSize: '1.4rem', fontWeight: 700, color: '#1C1008',
          margin: '0 0 8px',
        }}>
          ¿Eliminar canción?
        </p>
        <p style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '0.9rem', color: '#7A6040',
          margin: '0 0 24px', lineHeight: 1.5,
        }}>
          Se eliminará <strong style={{ color: '#1C1008' }}>"{songName}"</strong> permanentemente.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
              padding: '0 22px', height: '40px', borderRadius: '10px', cursor: 'pointer',
              background: '#F0E4C4', border: '1px solid rgba(184,146,58,0.30)',
              color: '#6B4226', transition: 'opacity 0.15s',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
              padding: '0 22px', height: '40px', borderRadius: '10px', cursor: 'pointer',
              background: '#991B1B', border: 'none',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(153,27,27,0.35)',
              transition: 'opacity 0.15s',
            }}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionToast({ type, exiting }: { type: ToastType; exiting: boolean }) {
  const { bg, icon, label } = TOAST_CONFIG[type];
  return (
    /* Overlay centrador — sin left/top percentage, usa flex */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
    <div
      className={exiting ? 'toast-exit' : 'toast-enter'}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: bg, color: '#FEFCF5',
        borderRadius: '999px',
        padding: '10px 20px 10px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600,
        letterSpacing: '0.01em', whiteSpace: 'nowrap',
      }}
    >
      <span
        className="check-pop"
        style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        {icon}
      </span>
      {label}
    </div>
    </div>
  );
}

const GOLD     = '#B8923A';
const ESPRESSO = '#1C1008';
const CREAM    = '#FEFCF5';
const TAUPE    = '#7A6040';

export function SongManager() {
  const [songs, setSongs]               = useState<Song[]>([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSong, setEditingSong]   = useState<Song | null>(null);
  const [viewMode, setViewMode]         = useState<'list' | 'grid'>('list');
  const [toast, setToast]               = useState<{ type: ToastType; exiting: boolean } | null>(null);
  const [deletePending, setDeletePending] = useState<{ id: string; name: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((type: ToastType) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, exiting: false });
    // Empieza el exit a los 750ms, desaparece a los 1000ms
    toastTimer.current = setTimeout(() => {
      setToast(t => t ? { ...t, exiting: true } : null);
      setTimeout(() => setToast(null), 280);
    }, 750);
  }, []);

  useEffect(() => {
    (async () => {
      const data = await loadSongs();
      if (data && data.length > 0) {
        setSongs(data.map(s => ({ ...s, isSelected: false, selectionOrder: undefined })));
      } else {
        setSongs(mockSongs);
        saveSongs(mockSongs);
      }
    })();
  }, []);

  const filteredSongs = songs
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  const selectedSongs = songs.filter(s => s.isSelected);

  const handleToggleSelect = (id: string) => {
    setSongs(prev => {
      const next = prev.map(s => ({ ...s }));
      const target = next.find(s => s.id === id);
      if (!target) return prev;
      if (target.isSelected) {
        target.isSelected = false;
        target.selectionOrder = undefined;
        next.filter(s => s.isSelected && s.selectionOrder)
          .sort((a, b) => (a.selectionOrder ?? 0) - (b.selectionOrder ?? 0))
          .forEach((s, i) => (s.selectionOrder = i + 1));
      } else {
        const max = Math.max(0, ...next.filter(s => s.isSelected && s.selectionOrder).map(s => s.selectionOrder as number));
        target.isSelected = true;
        target.selectionOrder = max + 1;
      }
      return next;
    });
  };

  const handleAddSong = async (newSong: Omit<Song, 'id' | 'isSelected' | 'selectionOrder'>) => {
    const newId = crypto.randomUUID();
    const newsong : Song = { ...newSong,
      id: newId,
      isSelected: false,
      selectionOrder: undefined,
    };
     setSongs(prev => {
    const updatedSongs = [...prev, newsong].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    saveSongs(updatedSongs); // Guardamos en IndexedDB/LocalStorage
    return updatedSongs;
  });
    showToast('add');
  };

  const handleEditSong   = (song: Song) => { setEditingSong(song); setShowEditModal(true); };

  const handleSaveEdit = async (updated: Song) => {
   setSongs (prev => {
     const updatedSongs = prev.map(s => s.id === updated.id ? updated : s);
     saveSongs(updatedSongs);
     return updatedSongs;
   })
   setEditingSong(null);
   showToast('edit');
  };

  // Primer click: guarda el id pendiente y abre el diálogo custom
  const handleDeleteRequest = (id: string) => {
    const song = songs.find(s => s.id === id);
    if (song) setDeletePending({ id, name: song.name });
  };

  // Confirmado: borra de verdad
  const handleDeleteConfirm = async () => {
    if (!deletePending) return;
    setSongs(prev => {
      const updatedSongs = prev.filter(s => s.id !== deletePending.id);
      saveSongs(updatedSongs);
      return updatedSongs;
    })
    setDeletePending(null);
    showToast('delete');
  };

  const handleClearSelection = () =>
    setSongs(prev => prev.map(s => ({ ...s, isSelected: false, selectionOrder: undefined })));

  const handleDownloadPDF = () => {
    if (!selectedSongs.length) return;
    generateSongbookPDF([...selectedSongs].sort((a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0)));
  };

  /* ── Estilos del botón primario ─────────── */
  const btnPrimary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '0 18px', height: '38px', borderRadius: '10px', border: 'none',
    background: `linear-gradient(135deg, ${ESPRESSO} 0%, #4A2C10 55%, ${GOLD} 100%)`,
    color: CREAM, fontFamily: 'Inter, sans-serif', fontSize: '13px',
    fontWeight: 600, letterSpacing: '0.02em', cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(28,16,8,0.20), 0 6px 18px rgba(184,146,58,0.18)',
    transition: 'opacity 0.15s, transform 0.15s',
  };

  const btnSecondary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '0 18px', height: '38px', borderRadius: '10px',
    background: CREAM,
    border: `1px solid rgba(184,146,58,0.30)`,
    color: ESPRESSO, fontFamily: 'Inter, sans-serif', fontSize: '13px',
    fontWeight: 600, letterSpacing: '0.02em', cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(28,16,8,0.06)',
    transition: 'opacity 0.15s, transform 0.15s',
  };

  const btnIcon: React.CSSProperties = {
    width: '38px', height: '38px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: `1px solid rgba(184,146,58,0.25)`,
    cursor: 'pointer', transition: 'all 0.15s',
  };

  return (
    /* ── FONDO PARCHMENT ─────────────────────────── */
    <div style={{ minHeight: '100vh', background: '#EDE0C4' }}>

      {/* ── HEADER FLOTANTE ──────────────────────── */}
      <header style={{
        position: 'fixed', top: '16px', left: 0, right: 0,
        margin: '0 auto',
        zIndex: 50, width: '92%', maxWidth: '900px',
      }}>
        <div style={{
          background: 'rgba(254,252,245,0.88)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: `1px solid rgba(184,146,58,0.28)`,
          boxShadow: '0 4px 10px rgba(28,16,8,0.08), 0 16px 40px rgba(28,16,8,0.10)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              style={{ 
                position: 'absolute', 
                left: '-8px', // Ajuste a la izquierda
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '80px', 
                objectFit: 'contain', 
                borderRadius: '40%',
              }} 
              alt="Logo" 
            />
            <div style={{ marginLeft: '80px' }}>
              <h1 className="font-display" style={{
                fontSize: '1.7rem', fontWeight: 700, color: ESPRESSO,
                lineHeight: 1, letterSpacing: '-0.01em', margin: 0,
              }}>
                Centro Cristiano Monte Moriah
              </h1>
            </div>
          </div> 

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(184,146,58,0.08)',
              borderRadius: '12px', padding: '6px 12px',
              border: '1px solid rgba(184,146,58,0.18)',
            }}>
              <Music size={14} style={{ color: GOLD }} />
              <div>
                <p className="font-ui" style={{ fontSize: '14px', fontWeight: 700, color: ESPRESSO, lineHeight: 1 }}>
                  {songs.length}
                </p>
                <p className="font-ui" style={{ fontSize: '8px', color: TAUPE, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  canciones
                </p>
              </div>
            </div>

            {selectedSongs.length > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(184,146,58,0.14)',
                borderRadius: '12px', padding: '6px 12px',
                border: `1px solid rgba(184,146,58,0.35)`,
              }}>
                <BookOpen size={14} style={{ color: GOLD }} />
                <div>
                  <p className="font-ui" style={{ fontSize: '14px', fontWeight: 700, color: ESPRESSO, lineHeight: 1 }}>
                    {selectedSongs.length}
                  </p>
                  <p className="font-ui" style={{ fontSize: '8px', color: TAUPE, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    sel.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ──────────────────── */}
      <main style={{ maxWidth: '100%', margin: '0 auto', padding: '100px 16px 40px' }}>
      <div className="song-layout">


   

      {/* ── COLUMNA DERECHA: orden del cancionero ── */}
        <div className="song-sidebar">
          <div style={{
            background: 'rgba(254,252,245,0.90)',
            borderRadius: '16px',
            border: `1px solid rgba(184,146,58,0.28)`,
            padding: '16px',
            boxShadow: '0 2px 14px rgba(184,146,58,0.10)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={14} style={{ color: GOLD }} />
                <h3 className="font-display" style={{
                  fontSize: '1.1rem', fontWeight: 700, fontStyle: 'italic',
                  color: ESPRESSO, margin: 0,
                }}>
                  Cancionero
                </h3>
              </div>
              <button
                disabled={selectedSongs.length === 0}
                onClick={handleClearSelection}
                className="font-ui"
                style={{
                  opacity: selectedSongs.length === 0 ? 0.45 : 1 ,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '12px', fontWeight: 600, color: '#C0392B',
                  background: 'transparent', border: '1px solid rgba(192,57,43,0.22)',
                  cursor: 'pointer', padding: '4px 10px', borderRadius: '7px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <X size={11} /> Limpiar
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
              {[...selectedSongs]
                .sort((a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0))
                .map(song => (
                  <div key={song.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${ESPRESSO}, ${GOLD})`,
                      color: CREAM, fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {song.selectionOrder}
                    </div>
                    <span className="font-serif" style={{
                      fontSize: '0.83rem', color: ESPRESSO, lineHeight: 1.3,
                    }}>
                      {song.name}
                    </span>
                  </div>
                ))}
            </div>

            <button     
              disabled={selectedSongs.length === 0}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={handleDownloadPDF}
              style={{
                ...btnSecondary,
                opacity: selectedSongs.length === 0 ? 0.45 : 1 ,
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', height: '36px', borderRadius: '9px', border: 'none',
                background: `linear-gradient(135deg, ${ESPRESSO} 0%, #4A2C10 55%, ${GOLD} 100%)`,
                color: CREAM, fontFamily: 'Inter, sans-serif', fontSize: '12px',
                fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(28,16,8,0.18)',
              }}
            >
              <Download size={13} /> Descargar PDF
            </button>
          </div>
        </div>



           {/* ── COLUMNA CENTRAL (antes izquierda) ── */}
      <div className="song-main">

        {/* Barra de herramientas */}
        <div  style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <button
          
            style={btnPrimary}
            onClick={() => setShowAddModal(true)}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88', e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1', e.currentTarget.style.transform = 'scale(1)')}
          >
            <Plus  size={14} /> Agregar Canción
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Toggle vista */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              aria-label="Vista lista"
              style={{
                ...btnIcon,
                background: viewMode === 'list' ? ESPRESSO : CREAM,
                color: viewMode === 'list' ? CREAM : TAUPE,
              }}
              onClick={() => setViewMode('list')}
            >
              <List size={15} />
            </button>
            <button
              aria-label="Vista cuadrícula"
              style={{
                ...btnIcon,
                background: viewMode === 'grid' ? ESPRESSO : CREAM,
                color: viewMode === 'grid' ? CREAM : TAUPE,
              }}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={15} style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: GOLD, opacity: 0.6,
            pointerEvents: 'none',
          }} />
          <Input
            placeholder="Buscar canciones..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="font-serif"
            style={{
              paddingLeft: '38px', height: '42px', borderRadius: '12px',
              background: 'rgba(254,252,245,0.80)',
              border: `1px solid rgba(184,146,58,0.25)`,
              color: ESPRESSO, fontSize: '0.9rem',
              boxShadow: '0 1px 3px rgba(28,16,8,0.05)',
            }}
          />
        </div>

        {/* Lista / Grid de canciones */}
        {filteredSongs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Music size={40} style={{ color: GOLD, opacity: 0.3, margin: '0 auto 16px' }} />
            <p className="font-display" style={{ fontSize: '1.2rem', fontStyle: 'italic', color: TAUPE }}>
              {searchTerm ? 'No hay resultados.' : 'No hay canciones aún.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '14px',
          }}>
            {filteredSongs.map(song => (
              <SongItem
                key={song.id} song={song} viewMode="grid"
                onToggleSelect={handleToggleSelect}
                onEdit={handleEditSong}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredSongs.map(song => (
              <SongItem
                key={song.id} song={song} viewMode="list"
                onToggleSelect={handleToggleSelect}
                onEdit={handleEditSong}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}

      </div>{/* fin .song-main */}
      
   {/* ── COLUMNA FANTASMA PARA CENTRAR ── */}
      <div className="song-spacer" ></div>

      </div>{/* fin layout */}

      
   

      </main>

      <AddSongModal open={showAddModal} onOpenChange={setShowAddModal} onSave={handleAddSong} />
      <EditSongModal song={editingSong} open={showEditModal} onOpenChange={setShowEditModal} onSave={handleSaveEdit} />

      {deletePending && (
        <ConfirmDeleteDialog
          songName={deletePending.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletePending(null)}
        />
      )}
      {toast && <ActionToast type={toast.type} exiting={toast.exiting} />}
    </div>
  );
}
