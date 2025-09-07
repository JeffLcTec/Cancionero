import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Edit, Plus } from 'lucide-react';
import type { Song } from '../types/song';

interface SongItemProps {
  song: Song;
  onToggleSelect: (id: string) => void;
  onEdit: (song: Song) => void;
}

export function SongItem({ song, onToggleSelect, onEdit }: SongItemProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 flex items-center justify-center">
              {song.isSelected && song.selectionOrder ? (
                <Button
                  variant="default"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                  onClick={() => onToggleSelect(song.id)}
                >
                  {song.selectionOrder}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                  onClick={() => onToggleSelect(song.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <div className="cursor-pointer select-none text-lg font-medium" onClick={() => onToggleSelect(song.id)}>
                {song.name}
              </div>
              {(song.lyrics || song.chords) && (
                <div className="mt-1 space-y-1">
                  {song.lyrics && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {song.lyrics}
                    </p>
                  )}
                  {song.chords && (
                    <p className="text-sm text-muted-foreground font-mono">
                      Acordes: {song.chords.substring(0, 50)}{song.chords.length > 50 ? '...' : ''}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(song)}
            className="ml-4"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}