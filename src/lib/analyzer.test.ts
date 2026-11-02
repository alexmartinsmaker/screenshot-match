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

  it("ignores administrative terms and localities as keywords", () => {
    const r = analyze(
      "Professor de Biologia. Remuneração a combinar. Entrevista presencial. Jornada 40 horas semanais. Local: São Paulo.",
      "Licenciatura em Ciências Biológicas.",
    );
    for (const t of ["remuneracao", "entrevista", "jornada", "paulo", "sao", "combinar", "semanais", "presencial"]) {
      expect(r.found).not.toContain(t);
      expect(r.missing).not.toContain(t);
    }
  });

  it("recognizes explicit equivalences: Ciências Biológicas ↔ Biologia, práticas de laboratório ↔ aulas práticas", () => {
    const job = "Professor de Biologia para o Ensino Médio. Desejável experiência com aulas práticas.";
    const resume =
      "Formação: Licenciatura em Ciências Biológicas\n\nExperiência: aulas de Ciências e práticas de laboratório no Ensino Médio.";
    const r = analyze(job, resume);
    expect(r.found).toContain("biologia");
    expect(r.found).toContain("ensino medio");
    expect(r.found).toContain("aulas praticas");
    expect(r.missing).not.toContain("biologia");
    expect(r.missing).not.toContain("aulas praticas");
  });

  it("puts summary after personal data, then sections most related to the job, without inventing content", () => {
    const resume =
      "Maria Souza\nmaria@x.com\n\nCurso de informática básica\n\nResumo profissional: professora com 8 anos de experiência em Ciências.\n\nLicenciatura em Ciências Biológicas\n\nAulas de Ciências e práticas de laboratório";
    const r = analyze("Professor de Biologia com aulas práticas", resume);
    const blocks = r.organizedResume.split("\n\n");
    expect(blocks[0]).toContain("Maria Souza");
    expect(blocks[1]).toContain("Resumo profissional");
    expect(blocks[2]).toContain("Ciências Biológicas");
    expect(blocks[3]).toContain("laboratório");
    expect(blocks[4]).toContain("informática");
    // Não acrescenta o que não está no currículo.
    expect(r.organizedResume).not.toContain("Ensino Médio");
  });
});
