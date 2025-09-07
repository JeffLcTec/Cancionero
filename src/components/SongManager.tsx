import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SongItem } from './SongItem';
import { AddSongModal } from './AddSongModal';
import { EditSongModal } from './EditSongModal';
import { generateSongbookPDF } from '../utils/pdfGenerator';
import { Plus, Download, Search, Trash2 } from 'lucide-react';
import type { Song } from '../types/song';

const API_URL =
  (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:8787';

// ===== Semilla (por si el server no responde en local) =====
const defaultSongs: Song[] = [
  // … (tu lista grande tal cual la tienes)
];

// ===== Componente =====
export function SongManager() {
  const [songs, setSongs] = useState([] as Song[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null as Song | null);

  // ------- API helpers -------
  async function apiAddSong(payload: Pick<Song, 'name' | 'lyrics' | 'chords'>) {
    const res = await fetch(`${API_URL}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('No se pudo crear');
    return res.json() as Promise<Song>;
  }

  async function apiUpdateSong(id: string, partial: Partial<Song>) {
    // Solo mandamos campos persistidos en BD
    const body: Partial<Song> = {};
    if (partial.name !== undefined) body.name = partial.name;
    if (partial.lyrics !== undefined) body.lyrics = partial.lyrics;
    if (partial.chords !== undefined) body.chords = partial.chords;

    const res = await fetch(`${API_URL}/songs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('No se pudo actualizar');
    return res.json() as Promise<Song>;
  }

  async function apiDeleteSong(id: string) {
    const res = await fetch(`${API_URL}/songs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No se pudo eliminar');
    return res.json() as Promise<{ ok: boolean }>;
  }

  // ------- Carga inicial -------
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/songs`);
        const data: Song[] = await r.json();
        if (Array.isArray(data) && data.length) {
          setSongs(
            data
              .map((s) => ({ ...s, isSelected: false, selectionOrder: undefined }))
              .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })),
          );
        } else {
          setSongs(defaultSongs);
        }
      } catch {
        setSongs(defaultSongs);
      }
    })();
  }, []);

  // ------- Derivados / filtros -------
  const filteredSongs = songs
    .filter((song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
    );

  const selectedSongs = songs.filter((s) => s.isSelected);

  // ------- Handlers -------
  const handleToggleSelect = (id: string) => {
    setSongs((prev) => {
      const next = prev.map((s) => ({ ...s })); // copia superficial
      const target = next.find((s) => s.id === id);
      if (!target) return prev;

      if (target.isSelected) {
        // des-seleccionar y reindexar
        target.isSelected = false;
        target.selectionOrder = undefined;
        const selected = next
          .filter((s) => s.isSelected && s.selectionOrder)
          .sort((a, b) => (a.selectionOrder ?? 0) - (b.selectionOrder ?? 0));
        selected.forEach((s, i) => (s.selectionOrder = i + 1));
      } else {
        const maxOrder = Math.max(
          0,
          ...next
            .filter((s) => s.isSelected && s.selectionOrder)
            .map((s) => s.selectionOrder as number),
        );
        target.isSelected = true;
        target.selectionOrder = maxOrder + 1;
      }
      return next;
    });
  };

  const handleAddSong = (newSong: Omit<Song, 'id' | 'isSelected' | 'selectionOrder'>) => {
    (async () => {
      try {
        const created = await apiAddSong({
          name: newSong.name,
          lyrics: newSong.lyrics,
          chords: newSong.chords,
        });
        setSongs((prev) =>
          [...prev, { ...created, isSelected: false, selectionOrder: undefined }].sort((a, b) =>
            a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
          ),
        );
      } catch (e) {
        console.error(e);
        // Fallback offline
        const local: Song = {
          ...newSong,
          id: crypto.randomUUID(),
          isSelected: false,
          selectionOrder: undefined,
        } as Song;
        setSongs((prev) => [...prev, local]);
      }
    })();
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updated: Song) => {
    (async () => {
      try {
        const saved = await apiUpdateSong(String(updated.id), updated);
        setSongs((prev) => prev.map((s) => (s.id === saved.id ? { ...s, ...saved } : s)));
      } catch (e) {
        console.error(e);
        setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } finally {
        setEditingSong(null);
      }
    })();
  };

 const handleDeleteSong = (id: string) => {
  (async () => {
    try {
      await fetch(`${API_URL}/songs/${id}`, { method: "DELETE" });
      setSongs((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  })();
};


  const handleClearSelection = () => {
    setSongs((prev) => prev.map((s) => ({ ...s, isSelected: false, selectionOrder: undefined })));
  };

  const handleDownloadPDF = () => {
    if (selectedSongs.length === 0) return;
    const songsInOrder = [...selectedSongs].sort(
      (a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0),
    );
    generateSongbookPDF(songsInOrder);
  };

  // ------- Render -------
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Gestor de Canciones</h1>
        <p className="text-muted-foreground text-lg">
          Administra las canciones de la iglesia y genera cancioneros personalizados
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Canción
        </Button>

        <Button
          onClick={handleDownloadPDF}
          disabled={selectedSongs.length === 0}
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF ({selectedSongs.length})
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar canciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats (quitamos “Mostrando #”) */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl">{songs.length}</div>
            <div className="text-sm text-muted-foreground">Total de canciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">{selectedSongs.length}</div>
            <div className="text-sm text-muted-foreground">Seleccionadas</div>
          </div>
        </div>
      </div>

      {/* Orden del cancionero + limpiar */}
      {selectedSongs.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">Orden del Cancionero</h3>
            <Button variant="outline" style={{ borderColor: 'red', color: 'red' }} size="sm" onClick={handleClearSelection}>
              Limpiar lista
            </Button>
          </div>
          <div className="space-y-2">
            {[...selectedSongs]
              .sort((a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0))
              .map((song) => (
                <div key={song.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                    {song.selectionOrder}
                  </div>
                  <span className="text-base font-medium">{song.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lista de canciones (con botón Eliminar) */}
      <div className="space-y-3">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm
              ? 'No se encontraron canciones que coincidan con la búsqueda.'
              : 'No hay canciones disponibles.'}
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div key={song.id} className="flex items-start gap-2">
              <div className="flex-1">
                <SongItem
                  song={song}
                  onToggleSelect={handleToggleSelect}
                  onEdit={handleEditSong}
                  onDelete={handleDeleteSong}
                />
              </div>
              
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddSongModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleAddSong}
      />

      <EditSongModal
        song={editingSong}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
