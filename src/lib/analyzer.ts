// Comparação local por palavras-chave (sem IA externa).

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Expressões relevantes tratadas como uma única palavra-chave (já normalizadas).
export const PHRASES = [
  "educacao infantil",
  "ensino fundamental",
  "ensino fundamental i",
  "ensino fundamental ii",
  "anos iniciais",
  "anos finais",
  "ensino medio",
  "ensino superior",
  "ensino tecnico",
  "educacao especial",
  "educacao inclusiva",
  "educacao de jovens e adultos",
  "educacao fisica",
  "lingua portuguesa",
  "lingua inglesa",
  "lingua estrangeira",
  "lingua brasileira de sinais",
  "ciencias da natureza",
  "ciencias humanas",
  "metodologias ativas",
  "sala de aula",
  "plano de aula",
  "planejamento pedagogico",
  "projeto pedagogico",
  "coordenacao pedagogica",
  "gestao escolar",
  "gestao de sala",
  "tecnologias educacionais",
  "ensino hibrido",
  "ensino a distancia",
  "aprendizagem baseada em projetos",
  "avaliacao formativa",
  "base nacional comum curricular",
  "trabalho em equipe",
  "pos graduacao",
  "pos-graduacao",
  "mestrado",
  "doutorado",
  "licenciatura plena",
  "atendimento educacional especializado",
  "alfabetizacao e letramento",
];

const STOPWORDS = new Set(
  `a o e de da do das dos em no na nos nas um uma uns umas para por com sem que se ao aos as os ou mais menos
  como sua seu suas seus ser ter tem sao esta este estes estas isso essa esse entre sobre ate apos pelo pela pelos pelas
  muito muita bem boa bom ja nao sim tambem cada todo toda todos todas outro outra qual quais quando onde
  voce nos eles elas ele ela eu meu minha nosso nossa vaga vagas empresa escola buscamos procuramos profissional
  requisitos requisito desejavel desejaveis obrigatorio necessario experiencia area atuacao atividades responsabilidades
  sera seja sendo forma bem ano anos mes meses dia dias horas hora local salario beneficios contratacao clt
  interessados enviar curriculo email candidato candidata candidatos the and of to in for with`
    .split(/\s+/)
    .filter(Boolean),
);

function containsTerm(normText: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(normText);
}

/** Extrai palavras-chave relevantes (expressões + palavras isoladas) de um texto. */
export function extractKeywords(text: string): string[] {
  let norm = normalize(text);
  const found: string[] = [];
  // Expressões mais longas primeiro, removendo-as para não duplicar palavras.
  for (const p of [...PHRASES].sort((a, b) => b.length - a.length)) {
    if (containsTerm(norm, p)) {
      if (!found.includes(p)) found.push(p);
      const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      norm = norm.replace(new RegExp(`(^|[^a-z0-9])${escaped}(?=[^a-z0-9]|$)`, "g"), "$1 ");
    }
  }
  for (const w of norm.split(/[^a-z0-9]+/)) {
    if (w.length < 3 || STOPWORDS.has(w) || /^\d+$/.test(w)) continue;
    if (!found.includes(w)) found.push(w);
  }
  return found;
}

export interface AnalysisResult {
  score: number;
  found: string[];
  missing: string[];
  organizedResume: string;
}

/** Divide o currículo em blocos (seções) separados por linhas em branco. */
function splitBlocks(resume: string): string[] {
  return resume
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
}

/**
 * Reorganiza o currículo apenas reordenando blocos existentes: o primeiro bloco
 * (normalmente dados pessoais) permanece no topo; os demais são ordenados pela
 * quantidade de palavras-chave da vaga. Nenhum texto é criado ou alterado.
 */
export function organizeResume(resume: string, keywords: string[]): string {
  const blocks = splitBlocks(resume);
  if (blocks.length <= 1) return blocks.join("\n\n");
  const [head, ...rest] = blocks;
  const scored = rest.map((b, i) => {
    const n = normalize(b);
    return { b, i, hits: keywords.filter((k) => containsTerm(n, k)).length };
  });
  scored.sort((x, y) => y.hits - x.hits || x.i - y.i);
  return [head, ...scored.map((s) => s.b)].join("\n\n");
}

export function analyze(job: string, resume: string): AnalysisResult {
  const keywords = extractKeywords(job);
  const normResume = normalize(resume);
  const found = keywords.filter((k) => containsTerm(normResume, k));
  const missing = keywords.filter((k) => !found.includes(k));
  const score = keywords.length ? Math.round((found.length / keywords.length) * 100) : 0;
  return { score, found, missing, organizedResume: organizeResume(resume, found) };
}
