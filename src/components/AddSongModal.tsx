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
            <Label htmlFor="song-name">Nombre de la Canción</Label>
            <Input
              id="song-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre de la canción"
            />
          </div>
          
          <div>
            <Label htmlFor="song-lyrics">Letra</Label>
            <Textarea
              id="song-lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Ingrese la letra de la canción..."
              rows={8}
            />
          </div>
          
          <div>
            <Label htmlFor="song-chords">Acordes</Label>
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