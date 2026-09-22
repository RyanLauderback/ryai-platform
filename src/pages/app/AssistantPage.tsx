import { useMutation } from "@tanstack/react-query";
import { Bot, MessageSquare, Plus, Send, User } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand } from "@/config/brand";
import { api } from "@/lib/api";
import { conversations } from "@/mocks/data";
import type { AgentResponse } from "@/types";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations?: AgentResponse["citations"];
};

export function AssistantPage() {
  const [params] = useSearchParams();
  const [input, setInput] = useState(params.get("prompt") ?? "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingText, setTypingText] = useState("");
  const responseRef = useRef<AgentResponse | null>(null);
  const mutation = useMutation({
    mutationFn: api.queryAgent,
    onSuccess: (response) => {
      responseRef.current = response;
      setTypingText("");
    },
  });

  useEffect(() => {
    if (!responseRef.current || mutation.isPending) return;
    const response = responseRef.current;
    let position = 0;
    const timer = window.setInterval(() => {
      position += 8;
      setTypingText(response.answer.slice(0, position));
      if (position >= response.answer.length) {
        window.clearInterval(timer);
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: response.answer,
            citations: response.citations,
          },
        ]);
        setTypingText("");
        responseRef.current = null;
      }
    }, 12);
    return () => window.clearInterval(timer);
  }, [mutation.data, mutation.isPending]);

  function send(event?: FormEvent) {
    event?.preventDefault();
    const value = input.trim();
    if (!value || mutation.isPending || responseRef.current) return;
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", text: value }]);
    setInput("");
    mutation.mutate(value);
  }

  function newChat() {
    setMessages([]);
    setTypingText("");
    responseRef.current = null;
    mutation.reset();
  }

  return (
    <div className="flex min-h-[calc(100vh-7rem)] overflow-hidden rounded-xl border bg-white shadow-sm" data-testid="assistant-page">
      <aside className="hidden w-64 shrink-0 border-r bg-slate-50 p-4 md:block">
        <Button className="w-full" variant="outline" onClick={newChat} data-testid="new-chat"><Plus className="h-4 w-4" />New chat</Button>
        <p className="mb-2 mt-6 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Recent</p>
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <button key={conversation.id} className="w-full rounded-lg p-2.5 text-left hover:bg-white">
              <span className="flex items-center gap-2 text-xs font-medium"><MessageSquare className="h-3.5 w-3.5" />{conversation.title}</span>
              <span className="ml-5 text-[10px] text-slate-400">{conversation.updated}</span>
            </button>
          ))}
        </div>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="border-b px-5 py-4"><h1 className="font-bold">Research assistant</h1><p className="text-xs text-slate-500">Answers grounded in your connected sources.</p></header>
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
          {!messages.length && !mutation.isPending && (
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600"><Bot /></div>
              <h2 className="mt-5 text-xl font-bold">What would you like to understand?</h2>
              <p className="mt-2 text-sm text-slate-500">Synthesize trusted sources, compare companies, or pressure-test a market thesis.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {brand.console.quickPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => setInput(prompt)} className="rounded-xl border p-4 text-left text-xs leading-5 transition hover:border-brand-400 hover:bg-brand-50">{prompt}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><Bot className="h-4 w-4" /></div>}
                <div className={message.role === "user" ? "max-w-[80%] rounded-2xl rounded-br-sm bg-ink px-4 py-3 text-sm text-white" : "max-w-2xl text-sm leading-7 text-slate-700"}>
                  <p>{message.text}</p>
                  {message.citations && (
                    <div className="mt-4 flex flex-wrap gap-2" data-testid="assistant-citations">
                      {message.citations.map((citation, index) => (
                        <Link key={citation.id} to={`/app/explorer?document=${citation.id}`} className="rounded-md border bg-slate-50 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50">[{index + 1}] {citation.title}</Link>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === "user" && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200"><User className="h-4 w-4" /></div>}
              </div>
            ))}
            {(mutation.isPending || typingText) && (
              <div className="flex gap-3" data-testid="assistant-typing">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><Bot className="h-4 w-4" /></div>
                <p className="text-sm leading-7 text-slate-700">{typingText || "Reviewing connected sources…"}</p>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={send} className="border-t bg-white p-4">
          <div className="mx-auto flex max-w-3xl gap-2">
            <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a market intelligence question..." data-testid="assistant-input" />
            <Button type="submit" size="icon" aria-label="Send message" data-testid="assistant-send" disabled={!input.trim() || mutation.isPending}><Send className="h-4 w-4" /></Button>
          </div>
        </form>
      </section>
    </div>
  );
}
