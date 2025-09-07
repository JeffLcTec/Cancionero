import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Edit, Plus, Trash2 } from 'lucide-react';
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
    <Card
      className="w-full cursor-pointer"
      onClick={() => setExpanded((prev) => !prev)} // expandir al click en cualquier parte
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Lado izquierdo: selección y contenido */}
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-8 h-8 flex items-center justify-center">
              {song.isSelected && song.selectionOrder ? (
                <Button
                  variant="default"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation(); // evitar expandir al click
                    onToggleSelect(song.id);
                  }}
                >
                  {song.selectionOrder}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(song.id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              <div className="text-lg font-medium">{song.name}</div>

              {/* Vista previa o expandido */}
              {!expanded ? (
                <div className="mt-1 space-y-1">
                  {song.lyrics && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {song.lyrics}
                    </p>
                  )}
                  {song.chords && (
                    <p className="text-sm text-muted-foreground font-mono">
                      Acordes: {song.chords.substring(0, 50)}
                      {song.chords.length > 50 ? '...' : ''}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  {song.lyrics && (
                    <div>
                      <p className="font-semibold text-sm" > </p>
                      <pre className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color : '#6B7280' }}>
                        {song.lyrics}
                      </pre>
                    </div>
                  )}
                  {song.chords && (
                    <div>
                      <p className="font-semibold text-sm" >Acordes:</p>
                      <p className="text-sm font-mono" style={{ color: '#6B7280' }}>{song.chords}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botones en columna (no expanden el card) */}
          <div className="flex flex-col items-center gap-2 ml-4">
            <Button
              variant="outline"
              style={{ borderColor: '#5682B1', color: '#5682B1' }}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(song);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              style={{ borderColor: 'red', color: 'red' }}
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`¿Seguro que quieres eliminar "${song.name}"?`)) {
                  onDelete(song.id);
                }
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
