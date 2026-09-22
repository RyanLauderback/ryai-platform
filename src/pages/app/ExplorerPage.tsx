import { useQuery } from "@tanstack/react-query";
import { Bot, Calendar, FileText, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-yellow-200">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function ExplorerPage() {
  const [urlParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [source, setSource] = useState("");
  const [range, setRange] = useState("all");
  const params = useMemo(() => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (sector) search.set("sector", sector);
    if (source) search.set("source", source);
    if (range) search.set("range", range);
    return `?${search.toString()}`;
  }, [query, sector, source, range]);
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["documents", params],
    queryFn: () => api.documents(params),
  });
  const [selectedId, setSelectedId] = useState<string | null>(() => urlParams.get("document"));
  const activeId = selectedId && results.some((item) => item.id === selectedId) ? selectedId : results[0]?.id;
  const { data: selected } = useQuery({
    queryKey: ["document", activeId],
    queryFn: () => api.document(activeId!),
    enabled: Boolean(activeId),
  });

  return (
    <div data-testid="explorer-page">
      <PageHeader title="Research explorer" description="Search across filings, transcripts, expert interviews, and industry research." />
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, themes, and questions..." className="pl-9" data-testid="explorer-search" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <select aria-label="Sector" data-testid="sector-filter" value={sector} onChange={(event) => setSector(event.target.value)} className="h-9 rounded-lg border bg-white px-3 text-xs">
            <option value="">All sectors</option><option>Software</option><option>Semiconductors</option><option>Energy</option><option>Healthcare</option><option>Financials</option><option>Automotive</option>
          </select>
          <select aria-label="Source" value={source} onChange={(event) => setSource(event.target.value)} className="h-9 rounded-lg border bg-white px-3 text-xs">
            <option value="">All sources</option><option>Earnings call</option><option>SEC filing</option><option>Expert interview</option><option>Industry report</option>
          </select>
          <select aria-label="Date range" value={range} onChange={(event) => setRange(event.target.value)} className="h-9 rounded-lg border bg-white px-3 text-xs">
            <option value="all">Any date</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="180">Last 180 days</option>
          </select>
          <span className="ml-auto text-xs text-slate-500" data-testid="result-count">{isLoading ? "Searching…" : `${results.length} results`}</span>
        </div>
      </Card>
      <div className="mt-5 grid min-h-[600px] gap-5 xl:grid-cols-[minmax(340px,.9fr)_1.4fr]">
        <div className="space-y-3" data-testid="explorer-results">
          {results.map((document) => (
            <button key={document.id} onClick={() => setSelectedId(document.id)} className={cn("w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:border-brand-300", activeId === document.id && "border-brand-500 ring-2 ring-brand-50")}>
              <div className="flex items-center justify-between gap-2"><Badge>{document.source}</Badge><span className="flex items-center gap-1 text-[11px] text-slate-400"><Calendar className="h-3 w-3" />{document.date}</span></div>
              <h2 className="mt-3 text-sm font-bold"><Highlight text={document.title} query={query} /></h2>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500"><Highlight text={document.excerpt} query={query} /></p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{document.company} · {document.sector}</p>
            </button>
          ))}
          {!isLoading && !results.length && <div className="rounded-xl border border-dashed p-10 text-center text-sm text-slate-500">No sources match these filters.</div>}
        </div>
        <Card className="h-fit xl:sticky xl:top-5">
          {selected ? (
            <article className="p-6 sm:p-8" data-testid="document-viewer">
              <div className="flex flex-wrap items-center gap-2"><Badge>{selected.source}</Badge><span className="text-xs text-slate-400">{selected.date}</span></div>
              <h2 className="mt-4 text-xl font-bold">{selected.title}</h2>
              <div className="mt-4 flex flex-wrap gap-4 border-y py-3 text-xs text-slate-500"><span>Company: <b className="text-slate-700">{selected.company}</b></span><span>Sector: <b className="text-slate-700">{selected.sector}</b></span></div>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                {selected.body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {selected.tags.map((tag) => <Badge key={tag} className="bg-slate-100 text-slate-600">{tag}</Badge>)}
              </div>
              <Button className="mt-7" asChild><Link to={`/app/assistant?document=${selected.id}`}><Bot className="h-4 w-4" />Ask assistant about this</Link></Button>
            </article>
          ) : (
            <div className="grid min-h-80 place-items-center text-center text-sm text-slate-400"><div><FileText className="mx-auto mb-3 h-8 w-8" />Select a document to preview</div></div>
          )}
        </Card>
      </div>
    </div>
  );
}
