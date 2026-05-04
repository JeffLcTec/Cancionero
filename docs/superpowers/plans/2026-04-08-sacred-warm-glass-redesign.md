# Sacred Warm × Aurora Glass — Rediseño Visual

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el tema genérico de shadcn/ui con un diseño Sacred Warm × Aurora Glass: fondo crema cálido, glassmorphism en cards y header, tipografía Cormorant (headings) + Lora (body) + Inter (UI/números), acentos dorados, animaciones de hover y selección.

**Architecture:** Cambios exclusivamente en CSS variables, componentes React y HTML head. Sin cambios en lógica de negocio, hooks ni Supabase. El glassmorphism se implementa con `backdrop-filter: blur()` y utilidades CSS custom en `globals.css`. Los iconos usan Lucide React (ya instalado).

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui (Radix UI) + Lucide React + Google Fonts (Cormorant, Lora, Inter)

---

## File Map

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `index.html` | Modificar | Google Fonts: Cormorant + Lora + Inter |
| `src/styles/globals.css` | Modificar | Tokens CSS (warm palette), font vars, `.glass`, `.glass-strong`, `.glass-border`, `.font-display`, `.app-bg`, `.gold-bar` |
| `src/components/SongManager.tsx` | Modificar | Header glass + glow, stat pills, botones con Lucide, search glass, songbook panel, lista vacía |
| `src/components/SongItem.tsx` | Modificar | Card glass, barra dorada hover/selected, badge selección gradiente, acciones sin estilos inline |
| `src/components/AddSongModal.tsx` | Modificar | Dialog con fondo cálido, título Cormorant, inputs warm |
| `src/components/EditSongModal.tsx` | Modificar | Idéntico al AddSongModal — misma estructura |

---

## Task 1: Fuentes y tokens de color

**Files:**
- Modify: `index.html`
- Modify: `src/styles/globals.css`

- [ ] **Paso 1.1: Actualizar Google Fonts en index.html**

Reemplazar el bloque de Google Fonts existente (el que se agregó antes con Poppins + Righteous) con:

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

El `index.html` completo resultante debe quedar así:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Creación de Canciones</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/site.webmanifest" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Paso 1.2: Reescribir globals.css completo**

Reemplazar todo el contenido de `src/styles/globals.css` con:

```css
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --background: #fdf6e8;
  --foreground: #3b1a08;
  --card: rgba(255, 255, 255, 0.55);
  --card-foreground: #44200a;
  --popover: #fef9ee;
  --popover-foreground: #44200a;
  --primary: #92400e;
  --primary-foreground: #fef3c7;
  --secondary: #fef3c7;
  --secondary-foreground: #78350f;
  --muted: #fde68a;
  --muted-foreground: #a16207;
  --accent: #d97706;
  --accent-foreground: #fef3c7;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --border: rgba(217, 119, 6, 0.2);
  --input: transparent;
  --input-background: rgba(255, 255, 255, 0.55);
  --switch-background: #d97706;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: #d97706;
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.875rem;
  --sidebar: #fdf6e8;
  --sidebar-foreground: #44200a;
  --sidebar-primary: #92400e;
  --sidebar-primary-foreground: #fef3c7;
  --sidebar-accent: #fef3c7;
  --sidebar-accent-foreground: #78350f;
  --sidebar-border: rgba(217, 119, 6, 0.2);
  --sidebar-ring: #d97706;
}

.dark {
  --background: #1c0f04;
  --foreground: #fde68a;
  --card: rgba(60, 30, 10, 0.6);
  --card-foreground: #fde68a;
  --popover: #2a1505;
  --popover-foreground: #fde68a;
  --primary: #d97706;
  --primary-foreground: #1c0f04;
  --secondary: #3b1a08;
  --secondary-foreground: #fde68a;
  --muted: #3b1a08;
  --muted-foreground: #a16207;
  --accent: #b45309;
  --accent-foreground: #fef3c7;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: rgba(217, 119, 6, 0.25);
  --input: rgba(60, 30, 10, 0.6);
  --ring: #b45309;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  /* Font families */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Lora', Georgia, 'Times New Roman', serif;
}

/* ── Base styles ─────────────────────────────── */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Lora', Georgia, serif;
  }
}

/* ── Tipografía custom ───────────────────────── */

/* Cormorant para headings principales */
.font-display {
  font-family: 'Cormorant', Georgia, serif;
}

/* Inter para UI: números, badges, botones, labels de formulario */
.font-ui {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* ── Fondo de la app ─────────────────────────── */
.app-bg {
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(251, 191, 36, 0.15) 0%, transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 90%, rgba(217, 119, 6, 0.1) 0%, transparent 50%),
    linear-gradient(160deg, #fdf6e8 0%, #fef3c7 40%, #fdf0d8 100%);
  min-height: 100vh;
}

/* ── Glassmorphism ───────────────────────────── */
.glass {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Borde dorado para elementos glass */
.glass-border {
  border: 1px solid rgba(217, 119, 6, 0.2);
}

/* ── Barra dorada (acento izquierdo en cards) ── */
.gold-bar::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #d97706, #92400e);
  border-radius: 3px 0 0 3px;
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.gold-bar:hover::before,
.gold-bar.selected::before {
  opacity: 1;
}

/* ── Tipografía base ─────────────────────────── */
@layer base {
  :where(:not(:has([class*=" text-"]), :not(:has([class^="text-"])))) {
    h1 {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.3;
    }

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-weight-medium);
      line-height: 1.4;
    }

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-medium);
      line-height: 1.4;
    }

    h4 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
    }

    p {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.6;
    }

    label {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    }

    button {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      line-height: 1.5;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    }

    input, textarea {
      font-size: var(--text-base);
      font-weight: var(--font-weight-normal);
      line-height: 1.5;
      font-family: 'Lora', Georgia, serif;
    }
  }
}

html {
  font-size: var(--font-size);
}
```

- [ ] **Paso 1.3: Verificar que el proyecto compila**

```bash
npm run build
```

Resultado esperado: `✓ built in X.XXs` sin errores TypeScript.

- [ ] **Paso 1.4: Commit**



## Task 2: SongManager — Header, stats y layout

**Files:**
- Modify: `src/components/SongManager.tsx`

- [ ] **Paso 2.1: Reemplazar el archivo completo con el nuevo diseño**

Reemplazar TODO el contenido de `src/components/SongManager.tsx` con:

```tsx
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { SongItem } from './SongItem';
import { AddSongModal } from './AddSongModal';
import { EditSongModal } from './EditSongModal';
import { generateSongbookPDF } from '../utils/pdfGenerator';
import { Plus, Download, Search, Music, BookOpen, X } from 'lucide-react';
import type { Song } from '../types/song';
import { supabase } from '../utils/supabaseClient.ts';

export function SongManager() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  // ------- Carga inicial desde Supabase -------
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) {
        setSongs(
          data.map((s) => ({
            ...s,
            isSelected: false,
            selectionOrder: undefined,
          }))
        );
      }
    })();
  }, []);

  // ------- Derivados -------
  const filteredSongs = songs
    .filter((song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

  const selectedSongs = songs.filter((s) => s.isSelected);

  // ------- Handlers -------
  const handleToggleSelect = (id: string) => {
    setSongs((prev) => {
      const next = prev.map((s) => ({ ...s }));
      const target = next.find((s) => s.id === id);
      if (!target) return prev;

      if (target.isSelected) {
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
            .map((s) => s.selectionOrder as number)
        );
        target.isSelected = true;
        target.selectionOrder = maxOrder + 1;
      }
      return next;
    });
  };

  const handleAddSong = async (
    newSong: Omit<Song, 'id' | 'isSelected' | 'selectionOrder'>
  ) => {
    const { data, error } = await supabase
      .from('songs')
      .insert([{ name: newSong.name, lyrics: newSong.lyrics, chords: newSong.chords }])
      .select()
      .single();
    if (!error && data) {
      setSongs((prev) =>
        [...prev, { ...data, isSelected: false, selectionOrder: undefined }].sort((a, b) =>
          a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        )
      );
    }
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updated: Song) => {
    const { data, error } = await supabase
      .from('songs')
      .update({ name: updated.name, lyrics: updated.lyrics, chords: updated.chords })
      .eq('id', updated.id)
      .select()
      .single();

    if (!error && data) {
      setSongs((prev) => prev.map((s) => (s.id === data.id ? { ...s, ...data } : s)));
    } else {
      setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }
    setEditingSong(null);
  };

  const handleDeleteSong = async (id: string) => {
    await supabase.from('songs').delete().eq('id', id);
    setSongs((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearSelection = () => {
    setSongs((prev) =>
      prev.map((s) => ({ ...s, isSelected: false, selectionOrder: undefined }))
    );
  };

  const handleDownloadPDF = () => {
    if (selectedSongs.length === 0) return;
    const songsInOrder = [...selectedSongs].sort(
      (a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0)
    );
    generateSongbookPDF(songsInOrder);
  };

  // ------- Render -------
  return (
    <div className="app-bg">
      {/* ── HEADER ───────────────────────────── */}
      <header className="glass-strong glass-border border-x-0 border-t-0 sticky top-0 z-10">
        {/* Glow sutil detrás del header */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 50% -20%, rgba(251,191,36,.18) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            {/* Texto */}
            <div>
              <p className="font-ui text-xs font-semibold tracking-[.14em] uppercase text-amber-600/70 mb-1">
                ✦ Ministerio de Alabanza
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-amber-950 leading-none tracking-tight">
                Cancionero
              </h1>
              <p className="font-ui text-xs text-amber-700/70 mt-1.5">
                Administra las canciones de la iglesia
              </p>
            </div>
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Logo"
              className="h-14 sm:h-16 w-auto rounded-xl flex-shrink-0 object-contain"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(146,64,14,.2))' }}
            />
          </div>

          {/* Stat pills */}
          <div className="flex gap-3 mt-4">
            <div className="glass glass-border rounded-2xl px-4 py-2.5 flex items-center gap-2.5 flex-1">
              <Music className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <div>
                <div className="font-ui text-xl font-bold text-amber-900 leading-none">
                  {songs.length}
                </div>
                <div className="font-ui text-[10px] text-amber-700/70 mt-0.5">Canciones</div>
              </div>
            </div>
            <div className="glass glass-border rounded-2xl px-4 py-2.5 flex items-center gap-2.5 flex-1">
              <BookOpen className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <div>
                <div className="font-ui text-xl font-bold text-amber-900 leading-none">
                  {selectedSongs.length}
                </div>
                <div className="font-ui text-[10px] text-amber-700/70 mt-0.5">Seleccionadas</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="font-ui flex-1 sm:flex-none sm:px-6 h-11 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-amber-50 transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #92400e, #b45309)',
              boxShadow: '0 4px 14px rgba(146,64,14,.3)',
            }}
          >
            <Plus className="h-4 w-4" />
            Agregar Canción
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={selectedSongs.length === 0}
            className="font-ui flex-1 sm:flex-none sm:px-6 h-11 rounded-2xl glass glass-border flex items-center justify-center gap-2 text-sm font-semibold text-amber-800 transition-all duration-200 hover:bg-amber-50/80 hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            <Download className="h-4 w-4" />
            Descargar PDF
            {selectedSongs.length > 0 && (
              <span className="font-ui ml-0.5 bg-amber-900/10 text-amber-900 text-xs font-bold px-1.5 py-0.5 rounded-lg">
                {selectedSongs.length}
              </span>
            )}
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600/50 pointer-events-none" />
          <Input
            placeholder="Buscar canciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-2xl glass glass-border font-serif text-amber-900 placeholder:text-amber-700/40 focus:border-amber-400 focus:ring-amber-300"
          />
        </div>

        {/* Orden del cancionero */}
        {selectedSongs.length > 0 && (
          <div className="glass glass-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold italic text-amber-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-600" />
                Orden del Cancionero
              </h3>
              <button
                onClick={handleClearSelection}
                className="font-ui flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors duration-150"
              >
                <X className="h-3 w-3" />
                Limpiar
              </button>
            </div>
            <div className="space-y-1.5">
              {[...selectedSongs]
                .sort((a, b) => (a.selectionOrder || 0) - (b.selectionOrder || 0))
                .map((song) => (
                  <div key={song.id} className="flex items-center gap-2.5">
                    <div
                      className="font-ui w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #92400e, #d97706)' }}
                    >
                      {song.selectionOrder}
                    </div>
                    <span className="font-serif text-sm text-amber-900">{song.name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Lista de canciones */}
        <div className="space-y-2.5">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-16">
              <Music className="h-12 w-12 mx-auto mb-3 text-amber-300" />
              <p className="font-serif italic text-amber-700/60 text-sm">
                {searchTerm
                  ? 'No se encontraron canciones que coincidan.'
                  : 'No hay canciones disponibles.'}
              </p>
            </div>
          ) : (
            filteredSongs.map((song) => (
              <SongItem
                key={song.id}
                song={song}
                onToggleSelect={handleToggleSelect}
                onEdit={handleEditSong}
                onDelete={handleDeleteSong}
              />
            ))
          )}
        </div>
      </main>

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
```

- [ ] **Paso 2.2: Verificar build**

```bash
npm run build
```

Resultado esperado: `✓ built in X.XXs` sin errores.

- [ ] **Paso 2.3: Commit**


## Task 3: SongItem — Glass card con animaciones

**Files:**
- Modify: `src/components/SongItem.tsx`

- [ ] **Paso 3.1: Reemplazar el archivo completo**

Reemplazar TODO el contenido de `src/components/SongItem.tsx` con:

```tsx
import { useState } from 'react';
import { Edit, Plus, Trash2, ChevronDown } from 'lucide-react';
import type { Song } from '../types/song';

interface SongItemProps {
  song: Song;
  onToggleSelect: (id: string) => void;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export function SongItem({ song, onToggleSelect, onEdit, onDelete }: SongItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`gold-bar relative rounded-2xl glass glass-border overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        song.isSelected
          ? 'selected'
          : ''
      }`}
      style={{
        boxShadow: song.isSelected
          ? '0 4px 20px rgba(180,83,9,.12), inset 0 1px 0 rgba(255,255,255,.8)'
          : '0 2px 8px rgba(180,83,9,.06), inset 0 1px 0 rgba(255,255,255,.8)',
      }}
      onClick={() => setExpanded((prev) => !prev)}
    >
      {/* Fondo sutil cuando está seleccionado */}
      {song.isSelected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(254,243,199,.4)' }}
        />
      )}

      <div className="relative p-4">
        <div className="flex items-start gap-3">

          {/* Botón de selección */}
          <div className="flex-shrink-0 mt-0.5">
            {song.isSelected && song.selectionOrder ? (
              <button
                aria-label={`Quitar ${song.name} del cancionero`}
                className="font-ui w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-transform duration-150 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #92400e, #d97706)',
                  boxShadow: '0 3px 10px rgba(146,64,14,.4)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(song.id);
                }}
              >
                {song.selectionOrder}
              </button>
            ) : (
              <button
                aria-label={`Agregar ${song.name} al cancionero`}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 hover:scale-105"
                style={{ borderColor: 'rgba(180,83,9,.3)', color: '#b45309' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#d97706';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(254,243,199,.6)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(180,83,9,.3)';
                  (e.currentTarget as HTMLButtonElement).style.background = '';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(song.id);
                }}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-serif text-base font-semibold text-amber-950 leading-snug">
                {song.name}
              </p>
              <ChevronDown
                className={`h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5 transition-transform duration-200 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Vista colapsada */}
            {!expanded && (
              <div className="mt-1 space-y-0.5">
                {song.lyrics && (
                  <p className="font-serif text-sm italic text-amber-700/70 line-clamp-1 leading-relaxed">
                    {song.lyrics}
                  </p>
                )}
                {song.chords && !song.lyrics && (
                  <p className="font-ui text-xs text-amber-600/60 font-mono">
                    {song.chords.substring(0, 50)}{song.chords.length > 50 ? '…' : ''}
                  </p>
                )}
              </div>
            )}

            {/* Vista expandida */}
            {expanded && (
              <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: 'rgba(217,119,6,.15)' }}>
                {song.lyrics && (
                  <pre className="font-serif text-sm whitespace-pre-wrap leading-relaxed text-amber-900/80">
                    {song.lyrics}
                  </pre>
                )}
                {song.chords && (
                  <div>
                    <p className="font-ui text-[10px] font-semibold uppercase tracking-widest text-amber-600/70 mb-1">
                      Acordes
                    </p>
                    <p className="font-ui text-sm font-mono text-amber-800/70">{song.chords}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            <button
              aria-label={`Editar ${song.name}`}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
              style={{ color: '#92400e' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(254,243,199,.8)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '')}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(song);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </button>

            <button
              aria-label={`Eliminar ${song.name}`}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
              style={{ color: '#dc2626' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#fee2e2')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '')}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`¿Seguro que quieres eliminar "${song.name}"?`)) {
                  onDelete(song.id);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Paso 3.2: Verificar build**

```bash
npm run build
```

Resultado esperado: `✓ built in X.XXs` sin errores.

- [ ] **Paso 3.3: Commit**


## Task 4: Modales — Dialog warm + glass

**Files:**
- Modify: `src/components/AddSongModal.tsx`
- Modify: `src/components/EditSongModal.tsx`

- [ ] **Paso 4.1: Reemplazar AddSongModal.tsx completo**

Reemplazar TODO el contenido de `src/components/AddSongModal.tsx` con:

```tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ExternalLink } from 'lucide-react';
import type { Song } from '../types/song';

interface AddSongModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (song: Omit<Song, 'id' | 'isSelected' | 'selectionOrder'>) => void;
}

export function AddSongModal({ open, onOpenChange, onSave }: AddSongModalProps) {
  const [name, setName] = useState('');
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
      const [artistRaw, songRaw] = name.split('-').map((s) => s.trim());
      if (artistRaw && songRaw) {
        window.open(`https://acordes.lacuerda.net/${normalizeForUrl(artistRaw)}/${normalizeForUrl(songRaw)}`, '_blank');
        return;
      }
    }
    window.open(`https://acordes.lacuerda.net/busca.php?lang=ES&exp=${encodeURIComponent(name.trim())}&canc=0&ord=0&ini=0`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border"
        style={{
          background: 'linear-gradient(160deg, #fdf6e8 0%, #fef3c7 100%)',
          borderColor: 'rgba(217,119,6,.25)',
          boxShadow: '0 25px 60px rgba(146,64,14,.2)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold italic text-amber-950">
            Agregar Nueva Canción
          </DialogTitle>
          <DialogDescription className="font-serif italic text-amber-700/70 text-sm">
            Completa la información de la nueva canción
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="song-name" className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700/80">
              Nombre de la Canción
            </Label>
            <div className="flex gap-2">
              <Input
                id="song-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Autor - Canción  o  solo Canción"
                className="font-serif rounded-xl h-11"
                style={{ background: 'rgba(255,255,255,.7)', borderColor: 'rgba(217,119,6,.25)' }}
              />
              <button
                type="button"
                onClick={handleSearchInLacuerda}
                disabled={!name.trim()}
                className="font-ui flex items-center gap-1.5 px-3 h-11 rounded-xl text-xs font-semibold text-amber-800 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,.7)',
                  border: '1px solid rgba(217,119,6,.25)',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(254,243,199,.9)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.7)')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                LaCuerda
              </button>
            </div>
          </div>

          {/* Letra */}
          <div className="space-y-1.5">
            <Label htmlFor="song-lyrics" className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700/80">
              Letra
            </Label>
            <Textarea
              id="song-lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Ingrese la letra de la canción..."
              rows={8}
              className="font-serif rounded-xl resize-none leading-relaxed"
              style={{ background: 'rgba(255,255,255,.7)', borderColor: 'rgba(217,119,6,.25)' }}
            />
          </div>

          {/* Acordes */}
          <div className="space-y-1.5">
            <Label htmlFor="song-chords" className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700/80">
              Acordes
            </Label>
            <Textarea
              id="song-chords"
              value={chords}
              onChange={(e) => setChords(e.target.value)}
              placeholder="Ingrese los acordes de la canción..."
              rows={4}
              className="font-ui font-mono rounded-xl resize-none"
              style={{ background: 'rgba(255,255,255,.7)', borderColor: 'rgba(217,119,6,.25)' }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={handleCancel}
            className="font-ui px-5 h-10 rounded-xl text-sm font-semibold text-amber-800 transition-all duration-150"
            style={{ background: 'rgba(255,255,255,.7)', border: '1px solid rgba(217,119,6,.25)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(254,243,199,.9)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.7)')}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="font-ui px-5 h-10 rounded-xl text-sm font-semibold text-amber-50 transition-all duration-150 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #92400e, #b45309)',
              boxShadow: '0 4px 14px rgba(146,64,14,.3)',
            }}
          >
            Guardar Canción
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Paso 4.2: Reemplazar EditSongModal.tsx completo**

Reemplazar TODO el contenido de `src/components/EditSongModal.tsx` con:

```tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import type { Song } from '../types/song';

interface EditSongModalProps {
  song: Song | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (song: Song) => void;
}

export function EditSongModal({ song, open, onOpenChange, onSave }: EditSongModalProps) {
  const [name, setName] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [chords, setChords] = useState('');

  useEffect(() => {
    if (song) {
      setName(song.name);
      setLyrics(song.lyrics);
      setChords(song.chords);
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
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border"
        style={{
          background: 'linear-gradient(160deg, #fdf6e8 0%, #fef3c7 100%)',
          borderColor: 'rgba(217,119,6,.25)',
          boxShadow: '0 25px 60px rgba(146,64,14,.2)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold italic text-amber-950">
            Editar Canción
          </DialogTitle>
          <DialogDescription className="font-serif italic text-amber-700/70 text-sm">
            Modifica la letra y acordes de la canción
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-song-name" className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700/80">
              Nombre de la Canción
            </Label>
            <Input
              id="edit-song-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la canción"
              className="font-serif rounded-xl h-11"
              style={{ background: 'rgba(255,255,255,.7)', borderColor: 'rgba(217,119,6,.25)' }}
            />
          </div>

          {/* Letra */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-song-lyrics" className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700/80">
              Letra
            </Label>
            <Textarea
              id="edit-song-lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Ingrese la letra de la canción..."
              rows={8}
              className="font-serif rounded-xl resize-none leading-relaxed"
              style={{ background: 'rgba(255,255,255,.7)', borderColor: 'rgba(217,119,6,.25)' }}
            />
          </div>

          {/* Acordes */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-song-chords" className="font-ui text-xs font-semibold uppercase tracking-wider text-amber-700/80">
              Acordes
            </Label>
            <Textarea
              id="edit-song-chords"
              value={chords}
              onChange={(e) => setChords(e.target.value)}
              placeholder="Ingrese los acordes..."
              rows={4}
              className="font-ui font-mono rounded-xl resize-none"
              style={{ background: 'rgba(255,255,255,.7)', borderColor: 'rgba(217,119,6,.25)' }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={handleCancel}
            className="font-ui px-5 h-10 rounded-xl text-sm font-semibold text-amber-800 transition-all duration-150"
            style={{ background: 'rgba(255,255,255,.7)', border: '1px solid rgba(217,119,6,.25)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(254,243,199,.9)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.7)')}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="font-ui px-5 h-10 rounded-xl text-sm font-semibold text-amber-50 transition-all duration-150 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #92400e, #b45309)',
              boxShadow: '0 4px 14px rgba(146,64,14,.3)',
            }}
          >
            Guardar Cambios
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Paso 4.3: Verificar build final**

```bash
npm run build
```

Resultado esperado: `✓ built in X.XXs` sin errores.

- [ ] **Paso 4.4: Commit final**


---

## Notas

- **Sin tests unitarios:** Este es un rediseño 100% visual. La lógica de negocio (Supabase, selección, PDF) no cambia. La verificación es visual + build exitoso.
- **backdrop-filter:** Funciona en todos los browsers modernos. En Safari requiere `-webkit-backdrop-filter` (ya incluido en `.glass`).
- **font-ui / font-display / font-serif:** Son clases CSS custom definidas en `globals.css`. No son utilidades de Tailwind — se aplican directamente en className.
- **Inline styles para gradientes:** Se usan solo donde Tailwind no tiene utilidades directas para gradientes con valores exactos. Todo lo demás usa clases.
