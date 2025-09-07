export interface Song {
  id: string;
  name: string;
  lyrics: string;
  chords: string;
  isSelected: boolean;
  selectionOrder?: number;
}