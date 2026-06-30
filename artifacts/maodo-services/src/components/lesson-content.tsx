import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useState, useCallback } from "react";
import type { Components } from "react-markdown";
import { Copy, Check, Terminal } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silent */
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all
        bg-slate-700/60 hover:bg-slate-600/80 text-slate-300 hover:text-white border border-slate-600/50"
      title="Copier le code"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-400">Copié !</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copier</span>
        </>
      )}
    </button>
  );
}

function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join("");
  if (node && typeof node === "object" && "props" in (node as object)) {
    const el = node as React.ReactElement;
    return extractTextFromNode(el.props?.children);
  }
  return "";
}

function preprocessContent(content: string): string {
  return content
    .replace(/^:::tip\s*\n?([\s\S]*?)^:::/gm, (_, body: string) =>
      body
        .split("\n")
        .map((l: string) => `> 💡 ${l}`)
        .join("\n")
    )
    .replace(/^:::warning\s*\n?([\s\S]*?)^:::/gm, (_, body: string) =>
      body
        .split("\n")
        .map((l: string) => `> ⚠️ ${l}`)
        .join("\n")
    )
    .replace(/^:::exercise\s*\n?([\s\S]*?)^:::/gm, (_, body: string) =>
      body
        .split("\n")
        .map((l: string) => `> ✏️ ${l}`)
        .join("\n")
    );
}

const markdownComponents: Components = {
  h1({ children }) {
    return (
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-8 mb-4 first:mt-0 pb-2 border-b border-border/50">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-7 mb-3 first:mt-0">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="text-lg font-semibold text-foreground mt-5 mb-2 first:mt-0">
        {children}
      </h3>
    );
  },

  p({ children }) {
    return (
      <p className="text-[0.95rem] leading-7 text-foreground/90 mb-4 last:mb-0">
        {children}
      </p>
    );
  },

  ul({ children }) {
    return (
      <ul className="my-4 ml-1 space-y-1.5 list-none">
        {children}
      </ul>
    );
  },
  ol({ children, start }) {
    return (
      <ol
        className="my-4 ml-1 space-y-1.5 list-none counter-reset-[item]"
        style={{ counterReset: `item ${(start ?? 1) - 1}` }}
      >
        {children}
      </ol>
    );
  },
  li({ children, ...props }) {
    const parentType = (props as { ordered?: boolean }).ordered;
    return (
      <li className="flex items-start gap-2.5 text-[0.95rem] leading-7 text-foreground/90">
        {parentType ? (
          <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
            {(props as { index?: number }).index !== undefined
              ? ((props as { index?: number }).index ?? 0) + 1
              : ""}
          </span>
        ) : (
          <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-primary/70 flex-none" />
        )}
        <span className="flex-1 min-w-0">{children}</span>
      </li>
    );
  },

  blockquote({ children }) {
    const text = extractTextFromNode(children);
    const isTip = text.startsWith("💡");
    const isWarning = text.startsWith("⚠️");
    const isExercise = text.startsWith("✏️");

    if (isTip) {
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 p-4">
          <span className="shrink-0 text-xl leading-none mt-0.5">💡</span>
          <div className="flex-1 min-w-0 text-[0.9rem] leading-6 text-blue-900 dark:text-blue-200 [&>p]:mb-0 [&>p]:text-blue-900 dark:[&>p]:text-blue-200">
            {stripLeadingEmoji(children, "💡")}
          </div>
        </div>
      );
    }
    if (isWarning) {
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 p-4">
          <span className="shrink-0 text-xl leading-none mt-0.5">⚠️</span>
          <div className="flex-1 min-w-0 text-[0.9rem] leading-6 text-amber-900 dark:text-amber-200 [&>p]:mb-0 [&>p]:text-amber-900 dark:[&>p]:text-amber-200">
            {stripLeadingEmoji(children, "⚠️")}
          </div>
        </div>
      );
    }
    if (isExercise) {
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40 p-4">
          <span className="shrink-0 text-xl leading-none mt-0.5">✏️</span>
          <div className="flex-1 min-w-0 text-[0.9rem] leading-6 text-violet-900 dark:text-violet-200 [&>p]:mb-0 [&>p]:text-violet-900 dark:[&>p]:text-violet-200">
            {stripLeadingEmoji(children, "✏️")}
          </div>
        </div>
      );
    }

    return (
      <blockquote className="my-4 flex gap-3 border-l-4 border-slate-300 dark:border-slate-600 pl-4 pr-2 py-1 text-[0.9rem] leading-7 text-muted-foreground italic">
        <div className="flex-1 min-w-0 [&>p]:mb-0">{children}</div>
      </blockquote>
    );
  },

  code({ className, children, ...props }) {
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded px-1.5 py-0.5 text-[0.82em] font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    const lang = (className ?? "").replace("language-", "") || "code";
    const isOutput = lang === "output" || lang === "résultat" || lang === "result";
    const codeText = extractTextFromNode(children).replace(/\n$/, "");

    if (isOutput) {
      return (
        <div className="my-4 rounded-xl overflow-hidden border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] border-b border-slate-700/60">
            <Terminal className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Résultat</span>
          </div>
          <div className="bg-[#0d1117] px-5 py-4 overflow-x-auto">
            <pre className="text-[13px] leading-6 text-green-300 font-mono whitespace-pre">
              {codeText || "\u00a0"}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="my-4 rounded-xl overflow-hidden border border-slate-700 shadow-md">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#1c2333] border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-semibold text-slate-400 ml-1">{lang}</span>
          </div>
          <CopyButton text={codeText} />
        </div>
        <div className="overflow-x-auto bg-[#282c34]">
          <code className={className} {...props} style={{ display: "block" }}>
            {children}
          </code>
        </div>
      </div>
    );
  },

  pre({ children }) {
    return <>{children}</>;
  },

  strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-foreground/80">{children}</em>;
  },

  hr() {
    return <hr className="my-6 border-border/50" />;
  },

  table({ children }) {
    return (
      <div className="my-4 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-muted/60 text-foreground font-semibold">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-border/40">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="hover:bg-muted/30 transition-colors">{children}</tr>;
  },
  th({ children }) {
    return <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">{children}</th>;
  },
  td({ children }) {
    return <td className="px-4 py-2.5 text-foreground/80">{children}</td>;
  },

  a({ children, href }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    );
  },
};

function stripLeadingEmoji(children: React.ReactNode, emoji: string): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      i === 0 ? stripLeadingEmoji(child, emoji) : child
    );
  }
  if (typeof children === "string") {
    return children.startsWith(emoji) ? children.slice(emoji.length).trimStart() : children;
  }
  if (children && typeof children === "object" && "props" in (children as object)) {
    const el = children as React.ReactElement;
    return {
      ...el,
      props: { ...el.props, children: stripLeadingEmoji(el.props?.children, emoji) },
    };
  }
  return children;
}

export function LessonContent({ content }: { content: string }) {
  const processed = preprocessContent(content);

  return (
    <div className="lesson-content w-full overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}

export function SyntaxGuide() {
  return (
    <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 space-y-1 border border-border/50">
      <p className="font-semibold text-foreground mb-1.5">Syntaxe Markdown supportée :</p>
      <p><code className="bg-background px-1 rounded"># Titre</code> → Titre H1</p>
      <p><code className="bg-background px-1 rounded">## Sous-titre</code> → Titre H2</p>
      <p><code className="bg-background px-1 rounded">**texte**</code> → <strong>Gras</strong></p>
      <p><code className="bg-background px-1 rounded">*texte*</code> → <em>Italique</em></p>
      <p><code className="bg-background px-1 rounded">`code`</code> → <span className="bg-rose-100 text-rose-700 rounded px-0.5">code inline</span></p>
      <p><code className="bg-background px-1 rounded">- item</code> → Liste à puces</p>
      <p><code className="bg-background px-1 rounded">1. item</code> → Liste numérotée</p>
      <p><code className="bg-background px-1 rounded">{"```python"}</code> ... <code className="bg-background px-1 rounded">{"```"}</code> → Bloc de code Python</p>
      <p><code className="bg-background px-1 rounded">{"```output"}</code> ... <code className="bg-background px-1 rounded">{"```"}</code> → Bloc de résultat</p>
      <p><code className="bg-background px-1 rounded">{"> texte"}</code> → Citation</p>
      <p><code className="bg-background px-1 rounded">{"> 💡 texte"}</code> → Astuce (bleu)</p>
      <p><code className="bg-background px-1 rounded">{"> ⚠️ texte"}</code> → Avertissement</p>
      <p><code className="bg-background px-1 rounded">{"> ✏️ texte"}</code> → Exercice</p>
    </div>
  );
}
