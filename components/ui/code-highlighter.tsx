"use client";

import React, { useMemo } from "react";

interface CodeHighlighterProps {
  code: string;
  className?: string;
}

export function CodeHighlighter({ code, className = "" }: CodeHighlighterProps) {
  const highlighted = useMemo(() => {
    return highlightCode(code);
  }, [code]);

  return (
    <pre className={`font-mono text-[13px] leading-[1.65] overflow-x-auto ${className}`}>
      <code>{highlighted}</code>
    </pre>
  );
}

function highlightCode(code: string): React.ReactNode[] {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    return (
      <div key={lineIndex} className="flex items-start text-[13px] leading-[1.65]">
        <span className="select-none text-right text-white/20 text-[11px] font-mono w-[32px] shrink-0 pr-3 pt-[2px]">
          {lineIndex + 1}
        </span>
        <span className="whitespace-pre text-white/85 flex-1">
          {tokenizeLine(line)}
        </span>
      </div>
    );
  });
}

function tokenizeLine(line: string): React.ReactNode[] {
  if (!line) return [" "];

  // Check for line comments
  const commentIdx = line.indexOf("//");
  if (commentIdx !== -1) {
    const before = line.substring(0, commentIdx);
    const comment = line.substring(commentIdx);
    return [
      ...tokenizeCodeSegment(before),
      <span key="comment" className="text-white/35 italic">
        {comment}
      </span>,
    ];
  }

  return tokenizeCodeSegment(line);
}

function tokenizeCodeSegment(segment: string): React.ReactNode[] {
  // Regex to split by strings, keywords, tags, numbers, punctuation, identifiers
  const regex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Z][a-zA-Z0-9]*|\b(?:import|from|export|default|function|return|const|let|var|if|else|interface|type|typeof|as|true|false|null|undefined|new|async|await|use\s+client)\b|\b(?:useState|useEffect|useRef|useCallback|useMemo|gsap|timeline)\b|\b\d+(?:\.\d+)?\b|[{}()[\];,.:=<>!+*&|?/-])/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(segment)) !== null) {
    if (match.index > lastIndex) {
      parts.push(segment.substring(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      // String
      parts.push(
        <span key={key} className="text-[#86efac]">
          {token}
        </span>
      );
    } else if (
      /^(?:import|from|export|default|function|return|const|let|var|if|else|interface|type|typeof|as|true|false|null|undefined|new|async|await|use\s+client)$/.test(
        token
      )
    ) {
      // Keyword (Accent color!)
      parts.push(
        <span key={key} className="text-[var(--accent)] font-semibold">
          {token}
        </span>
      );
    } else if (/^<\/?[A-Z]/.test(token)) {
      // JSX Component Tag
      parts.push(
        <span key={key} className="text-[var(--accent)] font-medium">
          {token}
        </span>
      );
    } else if (/^(?:useState|useEffect|useRef|useCallback|useMemo|gsap|timeline)$/.test(token)) {
      // React Hooks / GSAP
      parts.push(
        <span key={key} className="text-[#c084fc]">
          {token}
        </span>
      );
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      // Number
      parts.push(
        <span key={key} className="text-[#fb923c]">
          {token}
        </span>
      );
    } else if (/^[{}()[\];,]$/.test(token)) {
      // Brackets & Punctuation
      parts.push(
        <span key={key} className="text-white/40">
          {token}
        </span>
      );
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < segment.length) {
    parts.push(segment.substring(lastIndex));
  }

  return parts;
}
