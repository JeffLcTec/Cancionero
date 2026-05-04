import { Music2, BookMarked } from 'lucide-react';

interface FloatingHeaderProps {
  songsCount: number;
  selectedSongsCount: number;
}

export function FloatingHeader({ songsCount, selectedSongsCount }: FloatingHeaderProps) {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl">
      <div className="glass-strong glass-border shadow-warm-lg rounded-[2rem] px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* Título */}
          <div>
            <p className="font-display text-[var(--warm-gold)] text-[9px] font-semibold tracking-[0.28em] uppercase leading-none mb-1">
              Ministerio de Alabanza
            </p>
            <h1 className="font-display text-[var(--warm-espresso)] text-2xl sm:text-[1.75rem] font-bold leading-none tracking-[-0.01em]">
              Cancionero
            </h1>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2">
            {/* Total de canciones */}
            <div
              className="flex items-center gap-2 rounded-2xl px-3.5 py-2 border"
              style={{
                background: 'rgba(184,146,58,0.10)',
                borderColor: 'rgba(184,146,58,0.20)'
              }}
            >
              <Music2 className="h-3.5 w-3.5 flex-shrink-0 text-[var(--warm-gold)]" />
              <div className="leading-none">
                <span
                  key={songsCount}
                  className="font-ui text-[var(--warm-espresso)] text-sm font-bold block animate-in zoom-in-75 duration-300"
                >
                  {songsCount}
                </span>
                <span className="font-ui text-[var(--warm-gold)] opacity-80 text-[8px] uppercase tracking-widest block mt-0.5">
                  canciones
                </span>
              </div>
            </div>

            {/* Seleccionadas */}
            {selectedSongsCount > 0 && (
              <div
                className="flex items-center gap-2 rounded-2xl px-3.5 py-2 animate-in zoom-in-75 duration-300 border"
                style={{
                  background: 'linear-gradient(135deg, rgba(28,16,8,0.06), rgba(184,146,58,0.15))',
                  borderColor: 'rgba(184,146,58,0.35)'
                }}
              >
                <BookMarked className="h-3.5 w-3.5 flex-shrink-0 text-[var(--warm-gold)]" />
                <div className="leading-none">
                  <span
                    key={selectedSongsCount}
                    className="font-ui text-[var(--warm-espresso)] text-sm font-bold block animate-in zoom-in-75 duration-300"
                  >
                    {selectedSongsCount}
                  </span>
                  <span className="font-ui text-[var(--warm-gold)] opacity-80 text-[8px] uppercase tracking-widest block mt-0.5">
                    sel.
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
