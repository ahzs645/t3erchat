import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ThinkingIcon } from "./icons/ThinkingIcon";
import type { Conversation, Message } from "../data/conversations";

const FILE_PREVIEW_CONTENT = `wallthick = 2;
floorthick = 1;
joinerytabthick = 2;

catanhexdia = 93;
catanhexwelldepth = 50;

catanplayertokenwide = 85;
catanplayertokentall = 104;
catanplayertokendeep = 25;

catancardwide = 57;
catancardtall = 88;
catancarddeep = 35;

catandevcarddeep = 15;

catanrobberdia = 18;
catanrobberheight = 35;

catandicesize = 16;

numplayers = 4;

// Derived dimensions
hexrad = catanhexdia / 2;
hexshort = hexrad * cos(30);

// Main box dimensions
boxwide = 300;
boxtall = 295;
boxdeep = 70;

module roundedBox(size, radius) {
    hull() {
        for (x = [radius, size[0] - radius])
            for (y = [radius, size[1] - radius])
                translate([x, y, 0])
                    cylinder(r = radius, h = size[2], $fn = 32);
    }
}`;

interface DemoChatProps {
  conversation: Conversation;
}

export function DemoChat({ conversation }: DemoChatProps) {
  return (
    <>
      {conversation.messages.map((message, index) =>
        message.role === "user" ? (
          <UserMessage key={index} message={message} />
        ) : (
          <AssistantMessage key={index} message={message} />
        )
      )}
    </>
  );
}

function UserMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [fileCopied, setFileCopied] = useState(false);

  const handleCopy = useCallback(
    (text: string, setter: (v: boolean) => void) => {
      navigator.clipboard.writeText(text).catch(() => {});
      setter(true);
      setTimeout(() => setter(false), 2000);
    },
    []
  );

  useEffect(() => {
    if (!filePreviewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFilePreviewOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filePreviewOpen]);

  return (
    <>
      <div className="flex justify-end break-after-avoid">
        <div className="group relative inline-block max-w-full rounded-xl border border-secondary/50 bg-secondary/50 wrap-break-word transition-colors **:[unicode-bidi:plaintext] md:max-w-[80%]">
          <div className="flex max-w-full grow flex-col overflow-hidden px-4 py-3">
            {/* Text content */}
            <div className="prose max-w-none overflow-auto prose-pink dark:prose-invert">
              <p>{message.content}</p>
            </div>
            {/* File attachment pills */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.attachments.map((filename) => (
                  <button
                    key={filename}
                    type="button"
                    onClick={() => setFilePreviewOpen(true)}
                    className="group/attachment-pill relative isolate flex h-12 max-w-full shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-solid border-secondary-foreground/8 bg-secondary-foreground/2 px-3.5 transition-colors hover:bg-secondary-foreground/5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    </svg>
                    <span className="truncate text-sm">{filename}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Hover actions */}
          <div className="absolute right-0 mt-2 flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
            {/* Retry */}
            <button
              className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="Retry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
            {/* Branch */}
            <button
              className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="Branch"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M6 21V9a9 9 0 0 0 9 9" />
              </svg>
            </button>
            {/* Edit */}
            <button
              className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            {/* Copy */}
            <button
              className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="Copy"
              onClick={() => handleCopy(message.content, setCopied)}
            >
              <CopyIcon copied={copied} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* File Preview Dialog */}
      {filePreviewOpen &&
        message.attachments &&
        createPortal(
          <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="File preview"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setFilePreviewOpen(false)}
            />
            <div
              data-state="open"
              className="fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg flex max-h-[90vh] flex-col overflow-hidden rounded-2xl! bg-popover shadow-2xl outline-1 outline-chat-border/20 backdrop-blur-md outline-solid md:w-4xl md:max-w-[calc(100%-2rem)] lg:w-6xl xl:w-7xl dark:outline-white/5"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">
                    {message.attachments[0]}
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                      aria-label="Download"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                      aria-label="Open in new tab"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </button>
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                      aria-label="Close"
                      onClick={() => setFilePreviewOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/80">
                  23.09 KB &bull; 521 lines
                </p>
              </div>

              <div className="h-[45vh] max-h-[45vh] min-h-48 flex-1 overflow-auto rounded-md px-6 sm:h-[60vh] sm:max-h-[60vh] md:h-[70vh] md:max-h-[70vh]">
                <div className="overflow-hidden rounded-md">
                  <div className="flex items-center justify-between bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                    <span>text</span>
                    <div className="flex items-center gap-1">
                      <button
                        className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary-foreground/70 hover:text-secondary-foreground"
                        aria-label="Download"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                      <button
                        className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary-foreground/70 hover:text-secondary-foreground"
                        aria-label="Toggle word wrap"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M3 6h18" />
                          <path d="M3 12h15a3 3 0 1 1 0 6h-4" />
                          <polyline points="16 16 14 18 16 20" />
                          <path d="M3 18h7" />
                        </svg>
                      </button>
                      <button
                        className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary-foreground/70 hover:text-secondary-foreground"
                        aria-label="Copy code"
                        onClick={() =>
                          handleCopy(FILE_PREVIEW_CONTENT, setFileCopied)
                        }
                      >
                        <CopyIcon copied={fileCopied} size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="shiki not-prose relative bg-chat-accent text-sm font-[450] text-secondary-foreground">
                    <pre className="overflow-auto p-4">
                      <code>{FILE_PREVIEW_CONTENT}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (text: string, setter: (v: boolean) => void) => {
      navigator.clipboard.writeText(text).catch(() => {});
      setter(true);
      setTimeout(() => setter(false), 2000);
    },
    []
  );

  return (
    <div className="flex justify-start break-after-avoid">
      <div className="group @container relative w-full max-w-full space-y-4 wrap-break-word">
        {/* Reasoning Accordion */}
        {message.hasReasoning && message.reasoningContent && (
          <div
            data-slot="accordion"
            data-state={reasoningOpen ? "open" : "closed"}
          >
            <button
              type="button"
              onClick={() => setReasoningOpen((v) => !v)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
              aria-expanded={reasoningOpen}
            >
              <span className="flex size-5 items-center justify-center text-muted-foreground">
                <ThinkingIcon />
              </span>
              <span className="font-medium">Reasoning</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ml-auto transition-transform duration-200 ${reasoningOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {reasoningOpen && (
              <div className="overflow-hidden">
                <div className="prose prose-pink reasoning max-w-none rounded-lg bg-sidebar/40 p-3 opacity-80 dark:bg-chat-accent dark:prose-invert">
                  <MarkdownContent content={message.reasoningContent} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Response */}
        <div className="prose max-w-none prose-pink dark:prose-invert [&>:nth-child(3)]:mt-0">
          <MarkdownContent content={message.content} />
        </div>

        {/* Footer Actions */}
        <div className="absolute left-0 -mt-1! -ml-0.5 flex w-full flex-row justify-start gap-1 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          {/* Copy */}
          <button
            className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
            aria-label="Copy"
            onClick={() => handleCopy(message.content, setCopied)}
          >
            <CopyIcon copied={copied} size={16} />
          </button>
          {/* Branch */}
          <button
            className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
            aria-label="Branch"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <path d="M6 21V9a9 9 0 0 0 9 9" />
            </svg>
          </button>
          {/* Retry */}
          <button
            className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
            aria-label="Retry"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
          {/* Model info */}
          {message.model && (
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <span>{message.model}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Renders markdown-ish content as JSX. Handles headings, bold, inline code,
 *  code blocks, lists, and paragraphs. This keeps the existing prose styling. */
function MarkdownContent({ content }: { content: string }) {
  const elements: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trimStart().startsWith("```")) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={key++} className="not-prose my-4 overflow-hidden rounded-md">
          {lang && (
            <div className="flex items-center justify-between bg-secondary px-4 py-2 text-sm text-secondary-foreground">
              <span>{lang}</span>
            </div>
          )}
          <div className="shiki relative bg-chat-accent text-sm font-[450] text-secondary-foreground">
            <pre className="overflow-auto p-4">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        </div>
      );
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      if (level === 1) {
        elements.push(<h1 key={key++}><InlineMarkdown text={text} /></h1>);
      } else if (level === 2) {
        elements.push(<h2 key={key++}><InlineMarkdown text={text} /></h2>);
      } else {
        elements.push(<h3 key={key++}><InlineMarkdown text={text} /></h3>);
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={key++} />);
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[i + 1])) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<MarkdownTable key={key++} lines={tableLines} />);
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      elements.push(
        <blockquote key={key++}>
          <p>
            <InlineMarkdown text={quoteLines.join(" ")} />
          </p>
        </blockquote>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trimStart().startsWith("```") &&
      !lines[i].match(/^#{1,3}\s+/) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !lines[i].startsWith(">") &&
      !/^---+$/.test(lines[i].trim()) &&
      !(lines[i].includes("|") && i + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[i + 1] || ""))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={key++}>
          <InlineMarkdown text={paraLines.join(" ")} />
        </p>
      );
    }
  }

  return <>{elements}</>;
}

/** Handles bold, italic, inline code, and links within a line of text. */
function InlineMarkdown({ text }: { text: string }) {
  // Split on bold (**text**), inline code (`text`), italic (*text*), and links [text](url)
  const parts: React.ReactNode[] = [];
  const regex =
    /(\*\*(.+?)\*\*)|(`([^`]+)`)|(\*(.+?)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let partKey = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(
        <React.Fragment key={partKey++}>
          {text.slice(lastIndex, match.index)}
        </React.Fragment>
      );
    }

    if (match[1]) {
      // Bold
      parts.push(<strong key={partKey++}>{match[2]}</strong>);
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          key={partKey++}
          className="mx-0.5 overflow-auto rounded-md bg-secondary/50 px-[7px] py-1"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      // Italic
      parts.push(<em key={partKey++}>{match[6]}</em>);
    } else if (match[7]) {
      // Link
      parts.push(
        <a
          key={partKey++}
          href={match[9]}
          className="text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[8]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(
      <React.Fragment key={partKey++}>
        {text.slice(lastIndex)}
      </React.Fragment>
    );
  }

  return <>{parts}</>;
}

/** Renders a markdown table */
function MarkdownTable({ lines }: { lines: string[] }) {
  const parseRow = (line: string) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");

  const headers = parseRow(lines[0]);
  // Skip separator line (lines[1])
  const rows = lines.slice(2).map(parseRow);

  return (
    <div className="my-4 overflow-x-auto">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>
                <InlineMarkdown text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>
                  <InlineMarkdown text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CopyIcon({ copied, size }: { copied: boolean; size: number }) {
  return (
    <span className="relative flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-200 ${copied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        aria-hidden="true"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute transition-all duration-200 ${copied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
