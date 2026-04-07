import React from "react";
import { CanvasGrid } from "./CanvasGrid";
import { CornerDecoration } from "./CornerDecoration";
import { Tooltip } from "./Tooltip";

interface CanvasPageProps {
  sidebarOpen: boolean;
}

export function CanvasPage({ sidebarOpen }: CanvasPageProps) {
  return (
    <main className="firefox-scrollbar-margin-fix min-h-pwa relative flex w-full flex-1 flex-col overflow-y-clip transition-[width,height] print:absolute print:top-0 print:left-0 print:h-auto print:min-h-auto print:overflow-visible">
      {/* Background panel with noise */}
      <div className={`absolute top-0 bottom-0 w-full overflow-hidden border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy select-none max-sm:border-none print:hidden ${sidebarOpen ? "border-t border-l sm:translate-y-3.5 sm:rounded-tl-xl" : "sm:translate-y-0"}`}>
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed bg-bottom-right transition-transform ease-snappy" />
      </div>

      {/* Top gradient noise bar */}
      <div className={`absolute inset-x-3 top-0 z-10 box-content overflow-hidden border-b border-chat-border bg-gradient-noise-top/80 backdrop-blur-md transition-[transform,border,opacity,height] ease-snappy max-sm:hidden print:hidden blur-fallback:bg-gradient-noise-top ${sidebarOpen ? "sm:h-3.5 opacity-100" : "sm:h-0 opacity-0 border-b-0"}`}>
        <div className="absolute top-0 left-0 h-full w-8 bg-linear-to-r from-gradient-noise-top to-transparent blur-fallback:hidden" />
        <div className="absolute top-0 right-24 h-full w-8 bg-linear-to-l from-gradient-noise-top to-transparent blur-fallback:hidden" />
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-noise-top blur-fallback:hidden" />
      </div>

      {/* Main scrollable area */}
      <div className="absolute top-0 bottom-0 w-full print:static print:h-auto print:overflow-visible">
        {/* Top-right corner decoration */}
        <div className={`fixed top-0 right-0 max-sm:hidden print:hidden transition-opacity ease-snappy ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <CornerDecoration sidebarOpen={sidebarOpen} />
        </div>

        {/* Scroll container */}
        <div
          id="canvas-scroll-container"
          className={`absolute inset-0 overflow-y-scroll transition-[padding] ease-snappy ${sidebarOpen ? "pt-8 sm:pt-3.5" : "pt-2 sm:pt-0"}`}
          style={{ scrollbarGutter: "stable both-edges" }}
        >
          {/* Top-right corner (for scroll container) */}
          <div
            className={`pointer-events-none fixed top-0 right-0 z-20 h-20 w-40 max-sm:hidden transition-opacity ease-snappy ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
            style={{ clipPath: "inset(0px 12px 0px 0px)" }}
          >
            <CornerDecoration sidebarOpen={sidebarOpen} />
          </div>

          {/* Top-right buttons: Timeline view + Settings */}
          <CanvasTopRightButtons />

          {/* Canvas grid */}
          <div className="animate-fade-in px-2 pt-2">
            <CanvasGrid />
          </div>
        </div>
      </div>
    </main>
  );
}

function CanvasTopRightButtons() {
  return (
    <div
      className="fixed top-safe-offset-2 z-20"
      style={{ right: "var(--firefox-scrollbar, 0.4rem)" }}
    >
      <div className="flex flex-row items-center text-muted-foreground gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
        {/* Timeline view toggle */}
        <Tooltip content="Timeline view" side="bottom">
          <button
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground z-0 size-8 transform-gpu transition-all duration-300 sm:ml-2 sm:rounded-bl-xl sm:bg-gradient-noise-top translate-x-0 opacity-100"
            aria-label="Toggle timeline view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock size-4" aria-hidden="true">
              <path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />
            </svg>
          </button>
        </Tooltip>

        {/* Settings */}
        <Tooltip content="Settings" side="bottom">
          <button
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground sm:bg-gradient-noise-top relative z-10 size-8"
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings2 lucide-settings-2 size-4" aria-hidden="true">
              <path d="M14 17H5" /><path d="M19 7h-9" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
