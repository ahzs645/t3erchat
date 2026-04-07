import React, { useState, useRef, useCallback } from "react";
import type { Model } from "../data/models";
import { ThinkingIcon } from "./icons/ThinkingIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { Tooltip } from "./Tooltip";

interface ChatInputFormProps {
  selectedModel: Model;
  onOpenModelSelector: () => void;
  modelTriggerRef?: React.RefObject<HTMLButtonElement | null>;
  isModelSelectorOpen?: boolean;
}

export function ChatInputForm({
  selectedModel,
  onOpenModelSelector,
  modelTriggerRef,
  isModelSelectorOpen,
}: ChatInputFormProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (message.trim()) {
          console.log("Send:", message.trim(), "with model:", selectedModel.name);
          setMessage("");
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        }
      }
    },
    [message, selectedModel]
  );

  return (
    <div
      className="border-reflect pointer-events-none min-w-0 overflow-hidden rounded-t-[20px] bg-(--chat-input-background) p-2 pb-0 backdrop-blur-lg [--c:var(--chat-input-gradient)]!"
      style={{
        "--gradientBorder-gradient":
          "linear-gradient(180deg, var(--min), var(--max), var(--min)), linear-gradient(15deg, var(--min) 50%, var(--max))",
        "--start": "#000000e0",
        "--opacity": "1",
      } as React.CSSProperties}
    >
      <form
        className="pointer-events-auto relative flex w-full min-w-0 flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-(--chat-input-background) px-3 pt-3 pb-safe-offset-3 text-secondary-foreground outline-8 outline-(--chat-input-gradient)/50 outline-solid max-sm:pb-6 sm:max-w-3xl dark:border-[hsl(0,100%,83%)]/4 dark:bg-secondary/4.5 dark:outline-chat-background/40"
        style={{
          boxShadow: `0 80px 50px 0 rgba(0, 0, 0, 0.1),
          0 50px 30px 0 rgba(0, 0, 0, 0.07),
          0 30px 15px 0 rgba(0, 0, 0, 0.06),
          0 15px 8px rgba(0, 0, 0, 0.04),
          0 6px 4px rgba(0, 0, 0, 0.04),
          0 2px 2px rgba(0, 0, 0, 0.02)`,
        }}
        id="chat-input-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="hidden" />

        {/* Textarea row */}
        <div className="flex min-w-0 grow flex-row items-start">
          <textarea
            ref={textareaRef}
            name="input"
            id="chat-input"
            placeholder="Type your message here..."
            className="w-full min-w-0 resize-none bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-secondary-foreground/60 disabled:opacity-0"
            aria-label="Message input"
            aria-describedby="chat-input-description"
            autoComplete="off"
            data-draft-key="draft_message:new"
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <div id="chat-input-description" className="sr-only">
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>

        {/* Bottom bar */}
        <div className="@container mt-2 -mb-px flex w-full min-w-0 flex-row-reverse justify-between">
          {/* Right side: Send button */}
          <div
            className="-mt-0.5 -mr-0.5 flex shrink-0 items-center justify-center gap-2"
            aria-label="Message actions"
          >
            <Tooltip content="Send message" side="top">
              <button
                className="inline-flex cursor-pointer items-center justify-center gap-2 text-sm whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow-sm hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 dark:disabled:hover:bg-primary/20 dark:disabled:active:bg-primary/20 size-9 relative rounded-lg p-2 text-pink-50"
                type="submit"
                disabled={!message.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up size-5!"
                  aria-hidden="true"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </button>
            </Tooltip>
          </div>

          {/* Left side: Model selector + action buttons */}
          <div className="flex min-w-0 items-center gap-2">
            {/* Model selector trigger */}
            <div className="min-w-0 flex-1">
              <button
                ref={modelTriggerRef}
                onClick={onOpenModelSelector}
                className="cursor-pointer justify-center font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground h-8 text-xs chat-input-model-trigger relative flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground @sm:gap-2"
                type="button"
              >
                <div className="min-w-0 flex-1 text-left text-sm font-medium">
                  <div className="truncate">{selectedModel.name}</div>
                </div>
                {/* Cost indicator */}
                <span className="inline-flex items-center gap-0.5 text-right text-muted-foreground/70 text-[10px] opacity-80">
                  <span
                    aria-hidden="true"
                    className="font-mono tabular-nums"
                  >
                    <span className="text-emerald-700/85 dark:text-emerald-400/80">
                      $
                    </span>
                    <span>&middot;</span>
                    <span>&middot;</span>
                  </span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`lucide lucide-chevron-down size-4 text-muted-foreground/60 transition-transform duration-200 ${isModelSelectorOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* Action buttons row */}
            <div className="chat-input-search-desktop min-w-0 items-center gap-2">
              {/* Thinking button */}
              <div className="shrink-0">
                <Tooltip content="Thinking" side="top">
                  <button
                    className="inline-flex cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground text-xs py-1.5 h-8 gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 text-muted-foreground @sm:px-2.5"
                    type="button"
                    data-state="closed"
                  >
                    <div className="flex items-center gap-2 [&>svg]:size-4">
                      <ThinkingIcon />
                      <span className="chat-input-inline-label">Thinking</span>
                    </div>
                  </button>
                </Tooltip>
              </div>

              {/* Search button */}
              <div className="shrink-0">
                <Tooltip content="Search" side="top">
                  <button
                    className="inline-flex cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground text-xs h-8 gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 text-muted-foreground @sm:px-2.5"
                    aria-label="Web search not available on free plan"
                    type="button"
                    data-state="closed"
                  >
                    <SearchIcon />
                    <span className="chat-input-inline-label">Search</span>
                  </button>
                </Tooltip>
              </div>

              {/* Attach button */}
              <div className="shrink-0">
                <Tooltip content="Attach files" side="top">
                  <button
                    className="inline-flex cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground text-xs py-1.5 h-8 gap-2 rounded-full border border-solid border-secondary-foreground/10 px-2 text-muted-foreground @sm:px-2.5"
                    aria-label="Attaching files is a subscriber-only feature"
                    type="button"
                    data-state="closed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-paperclip size-4"
                      aria-hidden="true"
                    >
                      <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
                    </svg>
                    <span className="chat-input-inline-label @sm:ml-0.5">
                      Attach
                    </span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
