import React, { useState } from "react";
import { ChatInputForm } from "./ChatInputForm";
import { TopRightButtons } from "./TopRightButtons";
import { CornerDecoration } from "./CornerDecoration";
import { DemoChat } from "./DemoChat";
import type { Model } from "../data/models";

interface MainContentProps {
  selectedModel: Model;
  onOpenModelSelector: () => void;
  modelTriggerRef?: React.RefObject<HTMLButtonElement | null>;
  isModelSelectorOpen?: boolean;
  sidebarOpen?: boolean;
}

export function MainContent({
  selectedModel,
  onOpenModelSelector,
  modelTriggerRef,
  isModelSelectorOpen,
  sidebarOpen = true,
}: MainContentProps) {
  const [showDemoChat, setShowDemoChat] = useState(true);

  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-y-clip transition-[width,height] print:absolute print:top-0 print:left-0 print:h-auto print:min-h-auto print:overflow-visible">
      {/* Background panel with noise — slides up when sidebar closed */}
      <div className={`absolute top-0 bottom-0 w-full overflow-hidden border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy select-none max-sm:border-none print:hidden ${sidebarOpen ? "border-t border-l sm:translate-y-3.5 sm:rounded-tl-xl" : "sm:translate-y-0"}`}>
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed bg-bottom-right transition-transform ease-snappy" />
      </div>

      {/* Top gradient noise bar — hidden when sidebar closed */}
      <div className={`absolute inset-x-3 top-0 z-10 box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border,opacity,height] ease-snappy max-sm:hidden print:hidden blur-fallback:bg-gradient-noise-top ${sidebarOpen ? "sm:h-3.5 opacity-100" : "sm:h-0 opacity-0 border-b-0"}`}>
        <div className="absolute top-0 left-0 h-full w-8 bg-linear-to-r from-gradient-noise-top to-transparent blur-fallback:hidden" />
        <div className="absolute top-0 right-24 h-full w-8 bg-linear-to-l from-gradient-noise-top to-transparent blur-fallback:hidden" />
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden" />
      </div>

      {/* Main scrollable area */}
      <div className="absolute top-0 bottom-0 w-full print:static print:h-auto print:overflow-visible">
        {/* Top-right corner decoration — hidden when sidebar closed */}
        <div className={`fixed top-0 right-0 max-sm:hidden print:hidden transition-opacity ease-snappy ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <CornerDecoration sidebarOpen={sidebarOpen} />
        </div>

        {/* Chat input (bottom floating) */}
        <div className="pointer-events-none absolute bottom-0 z-10 w-full overflow-x-visible px-2">
          <div className="relative mx-auto flex w-full max-w-3xl flex-col overflow-x-visible text-center">
            <div className="pointer-events-auto">
              <ChatInputForm
                selectedModel={selectedModel}
                onOpenModelSelector={onOpenModelSelector}
                modelTriggerRef={modelTriggerRef}
                isModelSelectorOpen={isModelSelectorOpen}
              />
            </div>
          </div>
        </div>

        {/* Scroll container with welcome content */}
        <div
          id="chat-scroll-container"
          className={`absolute inset-0 overflow-y-scroll print:visible print:static print:inset-auto print:block print:h-auto print:scroll-pb-0! print:overflow-visible print:pt-2 print:pb-0! transition-[padding] ease-snappy ${sidebarOpen ? "pt-8 sm:pt-3.5" : "pt-2 sm:pt-0"}`}
          style={{
            paddingBottom: "144px",
            scrollbarGutter: "stable both-edges",
            scrollPaddingBottom: "112px",
          }}
        >
          {/* Top-right corner (for scroll container) — hidden when sidebar closed */}
          <div
            className={`pointer-events-none fixed top-0 right-0 z-20 h-20 w-40 print:invisible max-sm:hidden print:hidden transition-opacity ease-snappy ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
            style={{ clipPath: "inset(0px 12px 0px 0px)" }}
          >
            <CornerDecoration sidebarOpen={sidebarOpen} />
          </div>

          {/* Top-right buttons */}
          <TopRightButtons />

          {/* Content: Demo Chat or Welcome */}
          {showDemoChat ? (
            <div className="animate-fade-in">
              <div
                role="log"
                aria-label="Chat messages"
                aria-live="polite"
                className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pt-safe-offset-10 pb-10"
              >
                <DemoChat />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div
                role="log"
                aria-label="Chat messages"
                aria-live="polite"
                className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pt-safe-offset-10 pb-10 print:space-y-0 print:pt-0"
              >
                <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
                  <div
                    className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] sm:px-8"
                    style={{ opacity: 1, transform: "none" }}
                  >
                    <h2 className="text-3xl font-semibold">
                      <span className="grid">
                        <span
                          className="invisible col-start-1 row-start-1"
                          aria-hidden="true"
                        >
                          <span className="inline-flex items-baseline gap-2">
                            <span className="inline-flex size-7 shrink-0 items-center justify-center self-baseline">
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
                                className="lucide lucide-clock-check relative top-1 size-7 text-foreground"
                                aria-hidden="true"
                              >
                                <path d="M12 6v6l4 2" />
                                <path d="M22 12a10 10 0 1 0-11 9.95" />
                                <path d="m22 16-5.5 5.5L14 19" />
                              </svg>
                            </span>
                            <span>Temporary chat</span>
                          </span>
                        </span>
                        <span
                          className="col-start-1 row-start-1"
                          aria-hidden="false"
                        >
                          How can I help you today?
                        </span>
                      </span>
                    </h2>

                    {/* Category buttons */}
                    <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
                      {[
                        { icon: "sparkles", label: "Create" },
                        { icon: "newspaper", label: "Explore" },
                        { icon: "code", label: "Code" },
                        { icon: "graduation-cap", label: "Learn" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className="cursor-pointer justify-center text-sm whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:hover:bg-primary h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl data-[selected=false]:bg-secondary/30 data-[selected=false]:text-secondary-foreground/90 data-[selected=false]:outline-solid data-[selected=false]:hover:bg-secondary max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full"
                          data-selected="false"
                        >
                          <CategoryIcon name={item.icon} />
                          <div>{item.label}</div>
                        </button>
                      ))}
                    </div>

                    {/* Sample questions */}
                    <div className="flex flex-col text-foreground">
                      {[
                        "How does AI work?",
                        "Are black holes real?",
                        'How many Rs are in the word "strawberry"?',
                        "What is the meaning of life?",
                      ].map((q) => (
                        <div
                          key={q}
                          className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none"
                        >
                          <button className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3">
                            <span>{q}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function CategoryIcon({ name }: { name: string }) {
  switch (name) {
    case "sparkles":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles max-sm:block" aria-hidden="true">
          <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
          <path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" />
        </svg>
      );
    case "newspaper":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper max-sm:block" aria-hidden="true">
          <path d="M15 18h-5" /><path d="M18 14h-8" /><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
          <rect width="8" height="4" x="10" y="6" rx="1" />
        </svg>
      );
    case "code":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code max-sm:block" aria-hidden="true">
          <path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" />
        </svg>
      );
    case "graduation-cap":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap max-sm:block" aria-hidden="true">
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      );
    default:
      return null;
  }
}
