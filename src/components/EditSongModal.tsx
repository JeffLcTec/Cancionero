import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
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
      onSave({
        ...song,
        name: name.trim(),
        lyrics: lyrics.trim(),
        chords: chords.trim(),
      });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (song) {
      setName(song.name);
      setLyrics(song.lyrics);
      setChords(song.chords);
    }
    onOpenChange(false);
  };

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Canción</DialogTitle>
          <DialogDescription>
            Modifica la letra y acordes de la canción
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="edit-song-name">Nombre de la Canción</Label>
            <Input
              id="edit-song-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre de la canción"
            />
          </div>
          
          <div>
            <Label htmlFor="edit-song-lyrics">Letra</Label>
            <Textarea
              id="edit-song-lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Ingrese la letra de la canción..."
              rows={8}
            />
          </div>
          
          <div>
            <Label htmlFor="edit-song-chords">Acordes</Label>
            <Textarea
              id="edit-song-chords"
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
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}