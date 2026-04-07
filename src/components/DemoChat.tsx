import React, { useState, useCallback } from "react";
import { ThinkingIcon } from "./icons/ThinkingIcon";

export function DemoChat() {
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [userCopied, setUserCopied] = useState(false);
  const [assistantCopied, setAssistantCopied] = useState(false);

  const handleCopy = useCallback((text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  }, []);

  return (
    <>
      {/* ===== User Message ===== */}
      <div className="flex justify-end break-after-avoid">
        <div className="group relative inline-block max-w-full rounded-xl border border-secondary/50 bg-secondary/50 wrap-break-word transition-colors **:[unicode-bidi:plaintext] md:max-w-[80%]">
          <div className="flex max-w-full grow flex-col overflow-hidden px-4 py-3">
            {/* Text content */}
            <div className="prose max-w-none overflow-auto prose-pink dark:prose-invert">
              <p>what is this?</p>
            </div>
            {/* File attachment pill */}
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="group/attachment-pill relative isolate flex h-12 max-w-full shrink-0 items-center gap-2 rounded-xl border border-solid border-secondary-foreground/8 bg-secondary-foreground/2 px-3.5">
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
                <span className="truncate text-sm">CatanBoxInsert.scad</span>
              </div>
            </div>
          </div>
          {/* Hover actions */}
          <div className="absolute right-0 mt-2 flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
            {/* Retry */}
            <button className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors" aria-label="Retry">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
            {/* Branch */}
            <button className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors" aria-label="Branch">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M6 21V9a9 9 0 0 0 9 9" />
              </svg>
            </button>
            {/* Edit */}
            <button className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors" aria-label="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            {/* Copy */}
            <button
              className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="Copy"
              onClick={() => handleCopy("what is this?", setUserCopied)}
            >
              <span className="relative flex items-center justify-center">
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
                  className={`transition-all duration-200 ${userCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
                  aria-hidden="true"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
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
                  className={`absolute transition-all duration-200 ${userCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Assistant Message ===== */}
      <div className="flex justify-start break-after-avoid">
        <div className="group @container relative w-full max-w-full space-y-4 wrap-break-word">
          {/* Reasoning Accordion */}
          <div data-slot="accordion" data-state={reasoningOpen ? "open" : "closed"}>
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
                  <p>
                    The user uploaded a file called <strong>CatanBoxInsert.scad</strong> and is asking what it is.
                    This is an OpenSCAD file, which is a script-based 3D CAD modeling program. Based on the
                    filename, this appears to be a design for a box insert for the board game Catan (formerly
                    "The Settlers of Catan"). Box inserts are custom organizers that fit inside board game boxes
                    to neatly store all the game components like tiles, cards, pieces, and tokens.
                  </p>
                  <p>
                    Let me analyze the code to provide a detailed explanation of what this specific
                    design creates — it likely defines compartments tailored to the various Catan game
                    pieces including resource cards, development cards, hexagonal tiles, number tokens,
                    the robber, settlements, cities, roads, and possibly the longest road/largest army cards.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Main Response */}
          <div className="prose max-w-none prose-pink dark:prose-invert [&>:nth-child(3)]:mt-0">
            <p>
              This is an <strong>OpenSCAD file</strong> that defines a <strong>custom 3D-printable box insert</strong>{" "}
              for the board game <strong>Catan</strong> (formerly &ldquo;The Settlers of Catan&rdquo;).
            </p>

            <h2>What It Does</h2>

            <p>
              The file contains parametric 3D modeling code that generates an organizer tray designed to
              fit inside the Catan game box. When rendered and 3D printed, it creates custom compartments
              for all the game&apos;s components.
            </p>

            <h2>Key Components</h2>

            <ul>
              <li>
                <strong>Resource card holders</strong> &mdash; Separated slots for each resource type (brick, lumber,
                ore, grain, wool)
              </li>
              <li>
                <strong>Tile storage</strong> &mdash; Hexagonal recesses sized for the terrain tiles
              </li>
              <li>
                <strong>Token tray</strong> &mdash; Circular wells for the number tokens
              </li>
              <li>
                <strong>Player piece compartments</strong> &mdash; Divided sections for settlements, cities, and roads
                in each player color
              </li>
              <li>
                <strong>Development card slot</strong> &mdash; A dedicated space for the development card deck
              </li>
              <li>
                <strong>Robber holder</strong> &mdash; A small recess for the robber piece
              </li>
            </ul>

            <h2>How to Use</h2>

            <p>
              Open this file in{" "}
              <code className="mx-0.5 overflow-auto rounded-md bg-secondary/50 px-[7px] py-1">OpenSCAD</code>,
              adjust any parameters (like wall thickness or tolerances), render it, then export as{" "}
              <code className="mx-0.5 overflow-auto rounded-md bg-secondary/50 px-[7px] py-1">STL</code>{" "}
              for 3D printing. The parametric design lets you customize dimensions to match your specific
              printer and game edition.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="absolute left-0 -mt-1! -ml-0.5 flex w-full flex-row justify-start gap-1 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
            {/* Copy */}
            <button
              className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="Copy"
              onClick={() =>
                handleCopy(
                  "This is an OpenSCAD file that defines a custom 3D-printable box insert for the board game Catan.",
                  setAssistantCopied,
                )
              }
            >
              <span className="relative flex items-center justify-center">
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
                  className={`transition-all duration-200 ${assistantCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
                  aria-hidden="true"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
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
                  className={`absolute transition-all duration-200 ${assistantCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            </button>
            {/* Branch */}
            <button className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors" aria-label="Branch">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M6 21V9a9 9 0 0 0 9 9" />
              </svg>
            </button>
            {/* Retry */}
            <button className="h-8 w-8 rounded-lg p-0 inline-flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors" aria-label="Retry">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
            {/* Model info */}
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <span>Kimi K2.5 (Thinking)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
