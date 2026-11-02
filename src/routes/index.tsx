import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { analyze, type AnalysisResult } from "@/lib/analyzer";

const TITLE = "BoraDarAula — Ajuste seu currículo para a vaga docente";
const DESC =
  "Compare seu currículo de professor com uma vaga docente e organize-o para destacar o que mais importa, sem inventar informações.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

async function downloadPdf(text: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageH = doc.internal.pageSize.getHeight();
  let y = margin;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  for (const para of text.split("\n")) {
    const lines: string[] = para.trim() ? doc.splitTextToSize(para, width) : [""];
    for (const line of lines) {
      if (y > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    }
  }
  doc.save("curriculo-organizado.pdf");
}

function Index() {
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  function handleAnalyze() {
    const jobEmpty = !job.trim();
    const resumeEmpty = !resume.trim();
    if (jobEmpty && resumeEmpty) return setError("Preencha os campos “Descrição da vaga” e “Currículo”.");
    if (jobEmpty) return setError("Preencha o campo “Descrição da vaga”.");
    if (resumeEmpty) return setError("Preencha o campo “Currículo”.");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setResult(analyze(job, resume));
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 300);
  }

  function handleReset() {
    setJob("");
    setResume("");
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const field =
    "w-full min-h-56 rounded-xl border-2 border-input bg-card p-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 resize-y";
  const btn =
    "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-base font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:opacity-60";

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-4">
          <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">B</span>
          <span className="font-display text-xl font-bold">
            Bora<span className="text-primary">Dar</span><span className="text-secondary">Aula</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-5xl">
          Ajuste seu currículo para a vaga que você <span className="text-primary">sonha</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Cole a descrição da vaga e seu currículo. A comparação acontece no seu navegador — nada é enviado para a internet.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="job" className="mb-2 block text-lg font-bold">Descrição da vaga</label>
            <textarea id="job" className={field} value={job} onChange={(e) => setJob(e.target.value)} placeholder="Cole aqui o texto da vaga docente…" />
          </div>
          <div>
            <label htmlFor="resume" className="mb-2 block text-lg font-bold">Currículo</label>
            <textarea id="resume" className={field} value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Cole aqui o texto do seu currículo. Separe as seções com uma linha em branco." />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl border-2 border-destructive/40 bg-destructive/10 px-4 py-3 font-semibold text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleAnalyze} disabled={loading} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
            {loading ? "Analisando…" : "Analisar compatibilidade"}
          </button>
          <button type="button" onClick={handleReset} className={`${btn} border-2 border-foreground bg-card text-foreground hover:bg-muted`}>
            Enviar novo currículo
          </button>
        </div>

        {result && (
          <section ref={resultsRef} aria-live="polite" className="mt-12 scroll-mt-6 space-y-6">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Resultado da análise</h2>

            <div className="rounded-2xl bg-primary-soft p-6">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">Compatibilidade estimada</p>
              <p className="mt-1 font-display text-6xl font-bold text-primary">{result.score}%</p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-card">
                <div className="h-full rounded-full bg-primary" style={{ width: `${result.score}%` }} />
              </div>
              <p className="mt-4 text-sm text-foreground/80">
                Esta é apenas uma estimativa baseada na proporção de palavras-chave da vaga que aparecem no currículo. Não é uma avaliação profissional nem garantia de aprovação. A comparação por palavras-chave pode não reconhecer sinônimos nem compreender o contexto.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <KeywordList title="Encontradas no currículo" items={result.found} tone="found" empty="Nenhuma palavra-chave da vaga foi encontrada." />
              <KeywordList title="Não encontradas no currículo" items={result.missing} tone="missing" empty="Todas as palavras-chave foram encontradas." />
            </div>
            {result.missing.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Os itens não encontrados não são adicionados ao currículo. Inclua-os somente se fizerem parte da sua experiência real.
              </p>
            )}

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-xl font-bold">Currículo organizado para a vaga</h3>
                <button
                  type="button"
                  disabled={pdfLoading}
                  onClick={async () => {
                    setPdfLoading(true);
                    try { await downloadPdf(result.organizedResume); } finally { setPdfLoading(false); }
                  }}
                  className={`${btn} bg-secondary text-secondary-foreground hover:bg-secondary/90`}
                >
                  {pdfLoading ? "Gerando PDF…" : "Baixar em PDF"}
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Usamos apenas o texto que você colou: o primeiro bloco fica no topo e as demais seções são reordenadas para destacar as mais relevantes para a vaga.
              </p>
              <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-muted p-4 font-sans text-base leading-relaxed">{result.organizedResume}</pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function KeywordList({ title, items, tone, empty }: { title: string; items: string[]; tone: "found" | "missing"; empty: string }) {
  const chip = tone === "found" ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-xl font-bold">{title} <span className="text-muted-foreground">({items.length})</span></h3>
      {items.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((k) => (
            <li key={k} className={`rounded-full px-3 py-1 text-sm font-semibold ${chip}`}>{k}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}
