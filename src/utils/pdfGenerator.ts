import jsPDF from "jspdf";
import type { Song } from "../types/song";

/**
 * Cancionero bonito:
 * - Portada
 * - Cada canción empieza en página nueva
 * - Encabezado y pie de página (numeración)
 * - Títulos en negrita y más grandes
 * - Letra en monoespaciada para mejor alineación
 */
export function generateSongbookPDF(selectedSongs: Song[]) {
  const doc = new jsPDF({
    unit: "pt",      // puntos (72 pt = 1 in)
    format: "letter" // tamaño carta
  });

  // ====== CONFIGURACIÓN ======
  const PAGE_W = doc.internal.pageSize.getWidth();
  const PAGE_H = doc.internal.pageSize.getHeight();
  const MARGIN_X = 56;        // ~0.78"
  const MARGIN_TOP = 64;
  const MARGIN_BOTTOM = 64;
  const CONTENT_W = PAGE_W - MARGIN_X * 2;

  const COLOR_PRIMARY: [number, number, number] = [28, 28, 30];   // casi negro
  const COLOR_SUBTLE:  [number, number, number] = [120, 120, 120];
  const COLOR_DIVIDER: [number, number, number] = [210, 210, 210];

  // Espaciados del header
  const HEADER_Y = MARGIN_TOP;
  const HEADER_CONT_SIZE = 14;
  const DIVIDER_OFFSET = 8;          // distancia del divider bajo el título
  const CONTENT_PADDING_TOP = 18;    // padding del texto bajo el divider

  // ====== ESTADO DE PÁGINA/PAGINACIÓN ======
  let currentPage = 1;

  const drawFooter = (pageNo: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_SUBTLE);
    const text = `Página ${pageNo}`;
    const tw = doc.getTextWidth(text);
    doc.text(text, PAGE_W - MARGIN_X - tw, PAGE_H - 28);
  };

  /** Cierra la página actual (dibuja pie) y crea una nueva */
  const nextPage = () => {
    // dibuja footer en la página actual
    drawFooter(currentPage);
    // pasa a la siguiente
    doc.addPage();
    currentPage += 1;
  };

  const divider = (y: number) => {
    doc.setDrawColor(...COLOR_DIVIDER);
    doc.setLineWidth(0.8);
    doc.line(MARGIN_X, y, MARGIN_X + CONTENT_W, y);
  };

  /** Encabezado normal de canción. Retorna y de inicio de contenido. */
  const drawSongHeader = (title: string) => {
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, MARGIN_X, HEADER_Y);
    const dividerY = HEADER_Y + DIVIDER_OFFSET + 10; // 10 ~ altura de texto
    divider(dividerY);
    return dividerY + CONTENT_PADDING_TOP;
  };

  /** Encabezado para páginas de continuación. Retorna y de inicio de contenido. */
  const drawContinuationHeader = (title: string, section: string) => {
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(HEADER_CONT_SIZE);
    doc.text(`${title} (cont.) — ${section}`, MARGIN_X, HEADER_Y);
    const dividerY = HEADER_Y + DIVIDER_OFFSET + 8;
    divider(dividerY);
    return dividerY + CONTENT_PADDING_TOP;
  };

  /**
   * Escribe líneas envueltas respetando saltos.
   * Si hay nueva página, llama a onNewPage() y usa el Y que devuelva como inicio.
   */
  const writeWrapped = (
    lines: string[],
    startY: number,
    lineHeight: number,
    onNewPage?: () => number
  ) => {
    let y = startY;
    for (const line of lines) {
      if (y > PAGE_H - MARGIN_BOTTOM) {
        nextPage();
        y = onNewPage ? onNewPage() : MARGIN_TOP;
      }
      doc.text(line, MARGIN_X, y);
      y += lineHeight;
    }
    return y;
  };

  // ====== PORTADA ======
  doc.setFillColor(247, 247, 247);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFontSize(28);
  doc.text("Cancionero de la Iglesia", MARGIN_X, MARGIN_TOP + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_SUBTLE);
  const fecha = new Date().toLocaleDateString("es-ES");
  doc.text(`${selectedSongs.length} canciones seleccionadas`, MARGIN_X, MARGIN_TOP + 34);
  doc.text(`Generado el: ${fecha}`, MARGIN_X, MARGIN_TOP + 52);

  divider(MARGIN_TOP + 68);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(90, 90, 90);
  const cita =
    "“Canten al Señor un cántico nuevo; canten al Señor, habitantes de toda la tierra.” — Salmo 96:1";
  const citaLines = doc.splitTextToSize(cita, CONTENT_W);
  doc.text(citaLines, MARGIN_X, MARGIN_TOP + 96);

  // Cerrar portada y pasar a la primera página de canciones
  drawFooter(currentPage);
  doc.addPage();
  currentPage += 1;

  // ====== CANCIONES ======
  for (let i = 0; i < selectedSongs.length; i++) {
    const song = selectedSongs[i];

    // Cada canción arranca en página nueva (ya se agregó arriba).
    // Header de canción:
    let y = drawSongHeader(`${i + 1}. ${song.name}`);

    // ----- ACORDES -----
    if (song.chords?.trim()) {
      // Subtítulo
      doc.setTextColor(...COLOR_PRIMARY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Acordes", MARGIN_X, y);
      y += 14;

      // Contenido
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);

      const chordsLines = doc.splitTextToSize(song.chords, CONTENT_W);
      y = writeWrapped(chordsLines, y, 16, () => {
        // Página de continuación (Acordes)
        return drawContinuationHeader(song.name, "Acordes");
      });

      y += 8; // respiro antes de Letra
    }

    // ----- LETRA -----
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Letra", MARGIN_X, y);
    y += 14;

    // guía lateral tenue
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(1);
    doc.line(MARGIN_X - 10, y - 10, MARGIN_X - 10, PAGE_H - MARGIN_BOTTOM);

    // estilo de letra (monoespaciado)
    doc.setTextColor(40, 40, 40);
    doc.setFont("courier", "bold");
    doc.setFontSize(11);

    const lyricsLines = doc.splitTextToSize(song.lyrics || "", CONTENT_W);
    y = writeWrapped(lyricsLines, y, 16, () => {
      // Continuación de Letra: reponer header y guía
      const yStart = drawContinuationHeader(song.name, "Letra");
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(1);
      doc.line(MARGIN_X - 10, yStart - 10, MARGIN_X - 10, PAGE_H - MARGIN_BOTTOM);
      doc.setTextColor(40, 40, 40);
      doc.setFont("courier", "bold");
      doc.setFontSize(11);
      return yStart;
    });

    // Cerrar la última página utilizada por esta canción
    drawFooter(currentPage);

    // Si no es la última canción, forzamos nueva página para la siguiente
    if (i < selectedSongs.length - 1) {
      doc.addPage();
      currentPage += 1;
    }
  }

  // Guardar con fecha
  const hoy = new Date().toISOString().split("T")[0];
  doc.save(`cancionero-iglesia ${hoy}.pdf`);
}
