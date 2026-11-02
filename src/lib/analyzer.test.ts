import { describe, expect, it } from "vitest";
import { analyze, extractKeywords } from "./analyzer";

describe("analyzer", () => {
  it("treats 'Educação Infantil' as a single keyword, ignoring accents/case", () => {
    const k = extractKeywords("Professor de EDUCAÇÃO INFANTIL");
    expect(k).toContain("educacao infantil");
    expect(k).not.toContain("infantil");
  });

  it("score is the share of job keywords found in the resume", () => {
    const r = analyze("Pedagogia Alfabetização Música Inglês", "Formada em pedagogia, atuo com alfabetizacao.");
    expect(r.score).toBe(50);
    expect(r.missing).toEqual(["musica", "ingles"]);
  });

  it("organized resume only reorders existing text, never adds missing terms", () => {
    const resume = "Ana Souza\nana@x.com\n\nCursos: Excel\n\nExperiência: Educação Infantil por 5 anos";
    const r = analyze("Professora de Educação Infantil com Libras", resume);
    expect(r.organizedResume.split("\n\n")).toEqual([
      "Ana Souza\nana@x.com",
      "Experiência: Educação Infantil por 5 anos",
      "Cursos: Excel",
    ]);
    expect(r.organizedResume.toLowerCase()).not.toContain("libras");
  });
});
