// Paginação do PDF do currículo organizado.
// Regras: um bloco (seção) nunca é dividido entre páginas, a menos que seja
// maior que uma página inteira; se a última página ficar quase vazia, o
// layout é refeito com espaçamento mais compacto para equilibrar o documento.

/** Divide o texto em blocos (seções) separados por linhas em branco. */
export function splitResumeBlocks(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
}

/**
 * Substitui símbolos que a fonte padrão do PDF (Latin-1) não representa.
 * Acentos do português (ç, ã, é...) são preservados.
 */
export function sanitizeForPdf(text: string): string {
  return text
    .replace(/[•●▪◦‣·]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[“”„]/g, '"')
    .replace(/[‘’‚]/g, "'")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, "");
}

export interface LayoutResult {
  /** Páginas; cada página é uma lista de linhas ("" = espaço entre blocos). */
  pages: string[][];
  /** Altura de linha efetivamente usada (pode ser compactada). */
  lineHeightMm: number;
}

function layout(blocks: string[][], usableMm: number, lineHeightMm: number): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  const fits = (extraLines: number) => (current.length + extraLines) * lineHeightMm <= usableMm + 1e-6;

  const closePage = () => {
    while (current.length > 0 && current.at(-1) === "") current.pop();
    if (current.length) pages.push(current);
    current = [];
  };

  for (const block of blocks) {
    const blockFitsPage = block.length * lineHeightMm <= usableMm + 1e-6;
    const needed = block.length + (current.length ? 1 : 0);
    if (current.length && blockFitsPage && !fits(needed)) closePage();

    if (!blockFitsPage) {
      // Bloco maior que uma página: divide linha a linha (único caso permitido).
      if (current.length) current.push("");
      for (const line of block) {
        if (current.length && !fits(1)) closePage();
        current.push(line);
      }
    } else {
      if (current.length) current.push("");
      current.push(...block);
    }
  }
  closePage();
  return pages;
}

/**
 * Distribui os blocos em páginas. Se a última página ficar com menos de
 * `minLastPageFraction` da altura útil, tenta um espaçamento mais compacto
 * para evitar uma página final quase vazia.
 */
export function layoutPages(
  blocks: string[][],
  usableHeightMm: number,
  lineHeightMm: number,
  minLastPageFraction = 0.15,
): LayoutResult {
  const pages = layout(blocks, usableHeightMm, lineHeightMm);
  if (pages.length > 1) {
    const lastPage = pages.at(-1) ?? [];
    const lastContentLines = lastPage.filter((l) => l !== "").length;
    if (lastContentLines * lineHeightMm < minLastPageFraction * usableHeightMm) {
      const compactLineHeight = lineHeightMm * 0.85;
      const compact = layout(blocks, usableHeightMm, compactLineHeight);
      if (compact.length < pages.length) {
        return { pages: compact, lineHeightMm: compactLineHeight };
      }
    }
  }
  return { pages, lineHeightMm };
}
