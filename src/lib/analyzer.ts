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
  "ciencias biologicas",
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
  "praticas de laboratorio",
  "aulas praticas",
];

// Expressões administrativas removidas antes da extração: não são requisitos.
const ADMIN_PHRASES = [
  "carga horaria",
  "a combinar",
  "vale transporte",
  "vale refeicao",
  "vale alimentacao",
  "plano de saude",
  "plano odontologico",
  "processo seletivo",
  "inicio imediato",
  "rio de janeiro",
  "rio grande do sul",
  "rio grande do norte",
  "mato grosso do sul",
  "mato grosso",
  "espirito santo",
  "sao paulo",
  "belo horizonte",
  "porto alegre",
  "campo grande",
  "boa vista",
  "rio branco",
];

const STOPWORDS = new Set(
  `a o e de da do das dos em no na nos nas um uma uns umas para por com sem que se ao aos as os ou mais menos
  como sua seu suas seus ser ter tem sao esta este estes estas isso essa esse entre sobre ate apos pelo pela pelos pelas
  muito muita bem boa bom ja nao sim tambem cada todo toda todos todas outro outra qual quais quando onde
  voce nos eles elas ele ela eu meu minha nosso nossa vaga vagas empresa escola buscamos procuramos profissional
  requisitos requisito desejavel desejaveis obrigatorio necessario experiencia area atuacao atividades responsabilidades
  sera seja sendo forma bem ano anos mes meses dia dias horas hora local salario beneficios contratacao clt
  interessados enviar curriculo email candidato candidata candidatos the and of to in for with
  remuneracao salarial pagamento piso entrevista entrevistas jornada horario horarios turno turnos manha tarde noite
  presencial remoto remota hibrido hibrida endereco bairro cidade estado cep inicio imediato contrato regime
  efetivo efetiva temporario temporaria prazo inscricao inscricoes inscreva candidatura candidatar envie encaminhar
  selecao seletivo seletiva processo etapa etapas documentos documentacao disponibilidade pretensao vale transporte
  alimentacao refeicao odontologico seguro auxilio combinar semanal semanais localidade regiao oferecemos oferece
  pacote adicional premio participacao resultados`
    .split(/\s+/)
    .filter(Boolean),
);

// Localidades e gentílicos comuns: não indicam requisitos nem competências.
const LOCALITIES = new Set(
  `brasil brasileiro brasileira paulista mineiro mineira carioca gaucho gaucha paranaense catarinense
  baiano baiana pernambucano pernambucana acre alagoas amapa amazonas bahia ceara goias maranhao parana
  paraiba pernambuco piaui rondonia roraima sergipe tocantins paulo janeiro horizonte curitiba florianopolis
  alegre salvador recife fortaleza manaus belem goiania brasilia cuiaba campo grande natal teresina palmas
  aracaju maceio vitoria velha santos campinas ribeirao preto uberlandia contagem juiz feira santana londrina`
    .split(/\s+/)
    .filter(Boolean),
);

// Equivalências explícitas: um termo da vaga conta como atendido quando o
// currículo traz uma redação relacionada. Isso NÃO significa que os termos
// sejam idênticos em todos os contextos — são relações pontuais e declaradas.
export const EQUIVALENCES: Record<string, string[]> = {
  biologia: ["ciencias biologicas"],
  "ciencias biologicas": ["biologia"],
  "aulas praticas": ["praticas de laboratorio", "laboratorio"],
  "praticas de laboratorio": ["aulas praticas"],
};

function containsTerm(normText: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(normText);
}

/** Verifica o termo ou uma equivalência declarada. */
function termMatches(normText: string, term: string): boolean {
  if (containsTerm(normText, term)) return true;
  return (EQUIVALENCES[term] ?? []).some((eq) => containsTerm(normText, eq));
}

function removePhrase(norm: string, phrase: string): string {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return norm.replace(new RegExp(`(^|[^a-z0-9])${escaped}(?=[^a-z0-9]|$)`, "g"), "$1 ");
}

/** Extrai palavras-chave relevantes (expressões + palavras isoladas) de um texto. */
export function extractKeywords(text: string): string[] {
  let norm = normalize(text);
  const found: string[] = [];
  // 1. Remove expressões administrativas (remuneração, benefícios, localidades...).
  for (const p of [...ADMIN_PHRASES].sort((a, b) => b.length - a.length)) {
    norm = removePhrase(norm, p);
  }
  // 2. Expressões relevantes mais longas primeiro, removendo-as para não duplicar.
  for (const p of [...PHRASES].sort((a, b) => b.length - a.length)) {
    if (containsTerm(norm, p)) {
      if (!found.includes(p)) found.push(p);
      norm = removePhrase(norm, p);
    }
  }
  // 3. Palavras isoladas: ignora comuns, administrativas, localidades e números.
  for (const w of norm.split(/[^a-z0-9]+/)) {
    if (w.length < 3 || STOPWORDS.has(w) || LOCALITIES.has(w) || /^\d+$/.test(w)) continue;
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
 * (normalmente dados pessoais) permanece no topo; o resumo/objetivo profissional,
 * se existir, vem logo em seguida; os demais blocos são ordenados pela
 * quantidade de palavras-chave da vaga (considerando as equivalências).
 * Nenhum texto é criado ou alterado.
 */
export function organizeResume(resume: string, keywords: string[]): string {
  const blocks = splitBlocks(resume);
  if (blocks.length <= 1) return blocks.join("\n\n");
  const [head, ...rest] = blocks;
  // Resumo/objetivo profissional vem logo após os dados pessoais.
  const summaryIdx = rest.findIndex((b) => /^(resumo|objetivo)\b/.test(normalize(b)));
  const summary = summaryIdx >= 0 ? rest.splice(summaryIdx, 1) : [];
  const scored = rest.map((b, i) => {
    const n = normalize(b);
    return { b, i, hits: keywords.filter((k) => termMatches(n, k)).length };
  });
  scored.sort((x, y) => y.hits - x.hits || x.i - y.i);
  return [head, ...summary, ...scored.map((s) => s.b)].join("\n\n");
}

export function analyze(job: string, resume: string): AnalysisResult {
  const keywords = extractKeywords(job);
  const normResume = normalize(resume);
  const found = keywords.filter((k) => termMatches(normResume, k));
  const missing = keywords.filter((k) => !found.includes(k));
  const score = keywords.length ? Math.round((found.length / keywords.length) * 100) : 0;
  return { score, found, missing, organizedResume: organizeResume(resume, found) };
}
