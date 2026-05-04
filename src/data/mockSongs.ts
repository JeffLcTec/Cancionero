import type { Song } from '../types/song';

export const mockSongs: Song[] = [
  {
    id: 'mock-1',
    name: 'Cuán Grande es Él',
    lyrics: `Señor mi Dios, al contemplar los cielos,
El firmamento y las estrellas mil.
Al oír tu voz en los potentes truenos
Y ver brillar al sol en su cenit.

Mi corazón entona la canción.
¡Cuán grande es Él! ¡Cuán grande es Él!
Mi corazón entona la canción.
¡Cuán grande es Él! ¡Cuán grande es Él!`,
    chords: 'G D C G\nG D C G\nC G D G\nC G D G',
    isSelected: false
  },
  {
    id: 'mock-2',
    name: 'Cuerdas de Amor',
    lyrics: `Aunque pase por el valle de la sombra de muerte,
Yo no temeré, porque tú estás conmigo.
Tus cuerdas de amor cayeron sobre mí,
Y mi heredad es hermosa.`,
    chords: 'Am F C G\nAm F C G\nF C G\nF C G',
    isSelected: false
  },
  {
    id: 'mock-3',
    name: 'Tu Fidelidad',
    lyrics: `Tu fidelidad es grande,
Tu fidelidad incomparable es.
Nadie como tú, bendito Dios,
Grande es tu fidelidad.`,
    chords: 'D Bm Em A\nD Bm Em A\nD D7 G Gm\nD A D',
    isSelected: false
  }
];
