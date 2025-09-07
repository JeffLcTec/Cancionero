// src/components/SongManager.tsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SongItem } from "./SongItem";
import { AddSongModal } from "./AddSongModal";
import { EditSongModal } from "./EditSongModal";
import { generateSongbookPDF } from "../utils/pdfGenerator";
import { Plus, Download, Search } from "lucide-react";
import type { Song } from "../types/song";

// URL del backend (Render). En Vercel definí VITE_API_URL.
// En local, usa http://localhost:8787
const API_URL =
  (import.meta as any)?.env?.VITE_API_URL || "http://localhost:8787";

/* ===================== SEMILLA INICIAL ===================== */
const defaultSongs: Song[] = [
  {
    id: "1",
    name: "Padre Nuestro — Bethel Music",
    lyrics: `INTRO //B-G#m-E//

          B                  E              F#
Padre nuestro en los cielos Santo es Tu nombre
    B                   E                 F#
Que venga Tu reino  Tu voluntad también

C o r o

      E       C#m       G#m            F#
Aqui como   en, el cielo  Que el cielo venga
    E    C#m         G#m        F#  B
Aqui  como en el cielo  Que venga aqui

 interludo: B-G#m-E-B

          B                 E              F#
Padre nuestro en los cielos Santo es Tu nombre
    B             E                 F#
Que venga Tu reino  Tu voluntad también

  E       C#m       G#m            F#
Aqui como   en, el cielo  Que el cielo venga
 E      C#m      G#m         F#     E
Aqui  como en el cielo  Que venga aqui

////E-(F#-G#m)-F#-E////

p u e n t e

        E                          F#
Tuyo es el reino,  tuyo el poder,
G#m                   D#m
Tuya es la gloria, por siempre, Amén
          E                       F#
Tuyo es el reino,  tuyo el poder,
G#m                    F#
Tuya es la gloria, por siempre, Amén`,
    chords: "Intro: B - G#m - E (var.) | Prog: E - C#m - G#m - F#",
    isSelected: false,
  },
  {
    id: "2",
    name: "Con Poder — Barak",
    lyrics: `VERSE:
    Bm
Espíritu de Dios
       G
llena todo este lugar
     D         A
Desciende una vez mas (2)

CORO:
       Bm         G
Con poder. Con poder.
               D
Desciende una vez mas
           A
y llena este lugar (2x)

PUENTE:
       Bm
Quiero ver gente danzar
       G
Quiero oír la gente hablar
         D                 A
lenguas celestiales, sobrenaturales`,
    chords: "Bm - G - D - A",
    isSelected: false,
  },
  {
    id: "3",
    name: "Espíritu Santo Ven — Barak",
    lyrics: `INTRO: Em D C B    "8 TIEMPOS CADA NOTA"

Em                           D
Estoy aquí, desesperado por ti
             C                        B
Con un corazón sediento, que espera beber
de ti

C
Cuando tu gloria desciende a un lugar
D
Toda la tierra tiene que adorar
Am7
Resucitan los muertos se sanan enfermos
    Bsus4-B
por tu poder.
C
Queremos de ti llénanos de ti
D
Espíritu santo envuélvenos en ti
Am7                     Bsus4     B
Derrama tu gloria, Esperamos por ti

CORO:
Em
Ven, ven, ven espíritu santo
D
Ven, ven, ven espíritu santo
C                            Bsus4-B
Ven, ven, ven llena este lugar

                 F#m   E   D   C#sus4   C#   F#m
sube de tono :

Version Corregida.

By: junes M.`,
    chords: "Em - D - C - B (sube a F#m - E - D - C#)",
    isSelected: false,
  },
  {
    id: "4",
    name: "Unción en el Aire — World Worship",
    lyrics: `INTRO: // Cm D# G# //

ESTRIBILLO:

      Cm
 Yo no sé que tenía Daniel
             A#
que cuando oraba leones callaba
     Fm
yo no sé que tenía Elías
           G#            G7
que profetizaba y fuego caía
     Cm
yo no sé que tenía Moisés
                 A#
que al bajar del monte él resplandecía
     Fm
yo no sé que tenía Samuel
               G#             A#
que la voz del Padre él reconocía

 PUENTE:

                   Cm
 // Pero hay una unción en el aire
 D#                  G#
y lo que me cueste quiero entregarte
            D#
hoy derramarás tú espíritu
              G7
y tus hijos profetizarán //

             Cm
 // Yo veo señales, yo veo milagros
    D#    G#
yo veo tinieblas hoy retroceder
        D#             G7
y ése mover está sobre mí //`,
    chords: "Cm - D# - G# (var. con G7, A#)",
    isSelected: false,
  },
  // ... (el resto de defaultSongs lo dejé igual que lo tenías)
];

/* ===================== COMPONENTE ===================== */
export function SongManager() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  /* ----------- API helpers centralizados ----------- */

  async function apiGetSongs(): Promise<Song[]> {
    const res = await fetch(`${API_URL}/songs`);
    if (!res.ok) throw new Error("No se pudo obtener canciones");
    return res.json();
  }

  async function apiBulkSeed(payload: Array<Pick<Song, "name" | "lyrics" | "chords">>) {
    const res = await fetch(`${API_URL}/songs/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo sembrar canciones");
    return res.json();
  }

  async function apiAddSong(
    payload: Omit<Song, "id" | "isSelected" | "selectionOrder">
  ): Promise<Song> {
    const res = await fetch(`${API_URL}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo crear canción");
    return res.json();
  }

  // ✅ Corrección: recibe `partial` y usa API_URL
  async function apiUpdateSong(id: string, partial: Partial<Song>): Promise<Song> {
    const res = await fetch(`${API_URL}/songs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    if (!res.ok) throw new Error("Error al actualizar canción");
    return res.json();
  }

  /* ----------- Persistencia de cambios de selección ----------- */
  async function persistDiff(prev: Song[], next: Song[]) {
    const byIdPrev = new Map(prev.map((s) => [s.id, s]));
    const updates: Promise<any>[] = [];

    for (const s of next) {
      const p = byIdPrev.get(s.id);
      if (!p) continue;

      const changed =
        p.name !== s.name ||
        p.lyrics !== s.lyrics ||
        p.chords !== s.chords ||
        p.isSelected !== s.isSelected ||
        (p.selectionOrder ?? null) !== (s.selectionOrder ?? null);

      if (changed) {
        updates.push(
          apiUpdateSong(s.id, {
            name: s.name,
            lyrics: s.lyrics,
            chords: s.chords,
            isSelected: s.isSelected,
            selectionOrder: s.selectionOrder ?? undefined,
          })
        );
      }
    }

    if (updates.length) await Promise.allSettled(updates);
  }

  /* ----------- Carga inicial desde API (sin localStorage) ----------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetSongs();
        if (Array.isArray(data) && data.length > 0) {
          setSongs(data);
        } else {
          // Seed automático al backend
          await apiBulkSeed(
            defaultSongs.map((s) => ({
              name: s.name,
              lyrics: s.lyrics,
              chords: s.chords,
            }))
          );
          const seeded = await apiGetSongs();
          setSongs(seeded);
        }
      } catch (err) {
        console.error(err);
        // Fallback solo visual si el server no está accesible
        setSongs(defaultSongs);
      }
    })();
  }, []);

  /* ----------- Handlers ----------- */
  const filteredSongs = songs
    .filter((song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" })
    );

  const selectedSongs = songs.filter((song) => song.isSelected);

  const handleToggleSelect = (id: string) => {
    setSongs((prev) => {
      const targetSong = prev.find((song) => song.id === id);
      if (!targetSong) return prev;

      let updatedSongs: Song[];

      if (targetSong.isSelected) {
        // Deseleccionar y reordenar
        updatedSongs = prev.map((song) =>
          song.id === id
            ? { ...song, isSelected: false, selectionOrder: undefined }
            : song
        );

        const selected = updatedSongs
          .filter((song) => song.isSelected && song.selectionOrder)
          .sort((a, b) => (a.selectionOrder ?? 0) - (b.selectionOrder ?? 0));

        updatedSongs = updatedSongs.map((song) => {
          if (song.isSelected && song.selectionOrder) {
            const newOrder = selected.findIndex((s) => s.id === song.id) + 1;
            return { ...song, selectionOrder: newOrder };
          }
          return song;
        });
      } else {
        // Seleccionar y asignar siguiente número
        const maxOrder = Math.max(
          0,
          ...prev
            .filter((song) => song.isSelected && song.selectionOrder)
            .map((song) => song.selectionOrder as number)
        );

        updatedSongs = prev.map((song) =>
          song.id === id
            ? { ...song, isSelected: true, selectionOrder: maxOrder + 1 }
            : song
        );
      }

      // Persistir cambios al backend (en background)
      persistDiff(prev, updatedSongs).catch(console.error);
      return updatedSongs;
    });
  };

  const handleAddSong = (
    newSong: Omit<Song, "id" | "isSelected" | "selectionOrder">
  ) => {
    (async () => {
      try {
        const created = await apiAddSong({
          name: newSong.name,
          lyrics: newSong.lyrics,
          chords: newSong.chords,
        });
        setSongs((prev) =>
          [...prev, created].sort((a, b) =>
            a.name.localeCompare(b.name, "es", { sensitivity: "base" })
          )
        );
      } catch (e) {
        console.error(e);
        // Fallback local si la API falla
        const song: Song = {
          ...newSong,
          id: crypto.randomUUID(),
          isSelected: false,
          selectionOrder: undefined,
        };
        setSongs((prev) => [...prev, song]);
      }
    })();
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedSong: Song) => {
    (async () => {
      try {
        const saved = await apiUpdateSong(updatedSong.id, updatedSong);
        setSongs((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
      } catch (e) {
        console.error(e);
        // Optimistic UI fallback
        setSongs((prev) =>
          prev.map((s) => (s.id === updatedSong.id ? updatedSong : s))
        );
      } finally {
        setEditingSong(null);
      }
    })();
  };

  const handleDownloadPDF = () => {
    if (selectedSongs.length > 0) {
      const songsInOrder = [...selectedSongs].sort(
        (a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0)
      );
      generateSongbookPDF(songsInOrder);
    }
  };

  /* ------------------- Render ------------------- */
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Gestor de Canciones</h1>
        <p className="text-muted-foreground text-lg">
          Administra las canciones de la iglesia y genera cancioneros
          personalizados
        </p>
      </div>

      {/* Botones */}
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar canciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl">{songs.length}</div>
            <div className="text-sm text-muted-foreground">
              Total de canciones
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl">{selectedSongs.length}</div>
            <div className="text-sm text-muted-foreground">Seleccionadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">{filteredSongs.length}</div>
            <div className="text-sm text-muted-foreground">Mostrando</div>
          </div>
        </div>
      </div>

      {/* Orden del cancionero */}
      {selectedSongs.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <h3 className="mb-3 text-xl font-semibold">Orden del Cancionero</h3>
          <div className="space-y-2">
            {[...selectedSongs]
              .sort(
                (a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0)
              )
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

      {/* Lista de canciones */}
      <div className="space-y-3">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm
              ? "No se encontraron canciones que coincidan con la búsqueda."
              : "No hay canciones disponibles."}
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div key={song.id}>
              <SongItem
                song={song}
                onToggleSelect={handleToggleSelect}
                onEdit={handleEditSong}
              />
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
