import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
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
      onSave({
        name: name.trim(),
        lyrics: lyrics.trim(),
        chords: chords.trim(),
      });
      
      // Reset form
      setName('');
      setLyrics('');
      setChords('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setLyrics('');
    setChords('');
    onOpenChange(false);
  };

const normalizeForUrl = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/\s+/g, "_") // espacios → guiones bajos
    .replace(/[^a-z0-9_]/g, ""); // solo letras, números y _
};

const handleSearchInLacuerda = () => {
  if (!name.trim()) return;

  if (name.includes("-")) {
    // formato: "Autor - Canción"
    const [artistRaw, songRaw] = name.split("-").map((s) => s.trim());
    if (artistRaw && songRaw) {
      const artist = normalizeForUrl(artistRaw);
      const song = normalizeForUrl(songRaw);
      const url = `https://acordes.lacuerda.net/${artist}/${song}`;
      window.open(url, "_blank");
      return;
    }
  }

  // búsqueda general
  const query = encodeURIComponent(name.trim());
  const url = `https://acordes.lacuerda.net/busca.php?lang=ES&exp=${query}&canc=0&ord=0&ini=0`;
  window.open(url, "_blank");
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Canción</DialogTitle>
          <DialogDescription>
            Completa la información de la nueva canción
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="song-name" className="mb-2 block">Nombre de la Canción</Label>
            <div className="flex gap-2">
              <Input
                id="song-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Autor - Canción o solo Canción"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSearchInLacuerda}
                disabled={!name.trim()}
              >
                Buscar en LaCuerda
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="song-lyrics"className="mb-2 block">Letra</Label>
            <Textarea
              id="song-lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Ingrese la letra de la canción..."
              rows={8}
            />
          </div>
          
          <div>
            <Label htmlFor="song-chords" className="mb-2 block">Acordes</Label>
            <Textarea
              id="song-chords"
              value={chords}
              onChange={(e) => setChords(e.target.value)}
              placeholder="Ingrese los acordes de la canción..."
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Guardar Canción
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
