import { describe, expect, it } from "vitest";
import { layoutPages, sanitizeForPdf, splitResumeBlocks } from "./pdf";

describe("pdf layout", () => {
  it("keeps a block together instead of splitting it across pages", () => {
    const blocks = [
      Array(30).fill("linha do bloco 1"),
      ["Fundacao Bradesco - aulas de Ciencias e praticas de laboratorio", "segunda linha do mesmo trecho"],
      Array(5).fill("bloco 3"),
    ];
    // 100mm úteis, 6mm por linha → 16 linhas por página; bloco 1 (30) se divide.
    const { pages } = layoutPages(blocks, 100, 6);
    for (const page of pages) {
      const joined = page.join("\n");
      if (joined.includes("Fundacao Bradesco")) {
        expect(joined).toContain("segunda linha do mesmo trecho");
      }
    }
    expect(pages.length).toBeGreaterThanOrEqual(3);
  });

  it("compacts spacing to avoid an almost-empty last page", () => {
    const blocks = [Array(16).fill("a"), Array(16).fill("b"), ["c"]];
    // Sem compactação: 16+1+16 = 33 linhas → página 3 com 1 linha só.
    const { pages, lineHeightMm } = layoutPages(blocks, 100, 6);
    expect(pages.length).toBe(2);
    expect(lineHeightMm).toBeLessThan(6);
  });

  it("splits blocks on blank lines", () => {
    expect(splitResumeBlocks("A\n\nB\n\n\nC")).toEqual(["A", "B", "C"]);
  });

  it("sanitize keeps Portuguese accents and replaces unsupported symbols", () => {
    const s = sanitizeForPdf("Educação • ação — teste “aspas” 😀");
    expect(s).toContain("Educação");
    expect(s).toContain("ação");
    expect(s).not.toContain("•");
    expect(s).not.toContain("—");
    expect(s).not.toContain("😀");
  });
});
