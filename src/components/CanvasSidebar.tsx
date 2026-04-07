import React, { useState } from "react";
import { T3Logo } from "./T3Logo";
import { Tooltip } from "./Tooltip";

interface CanvasSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onGoToChat: () => void;
}

const IMAGE_MODELS = [
  { id: "nano-banana", name: "Nano Banana", description: "Fast, lightweight image generation" },
  { id: "nano-banana-2", name: "Nano Banana 2", description: "Improved quality & coherence" },
  { id: "nano-banana-pro", name: "Nano Banana Pro", description: "Professional-grade output" },
  { id: "seedream-v4.5", name: "Seedream v4.5", description: "Photorealistic dream engine" },
  { id: "flux-2-flex", name: "Flux 2 Flex", description: "Flexible style transfer model" },
  { id: "gpt-image-1.5", name: "GPT Image 1.5", description: "OpenAI multimodal generation" },
];

const ASPECT_RATIOS = [
  { label: "1:1", w: 1, h: 1 },
  { label: "16:9", w: 16, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "4:3", w: 4, h: 3 },
  { label: "3:4", w: 3, h: 4 },
  { label: "21:9", w: 21, h: 9 },
];

const RESOLUTIONS = [
  { id: "standard", label: "Standard", sub: "1K", disabled: false },
  { id: "high", label: "High", sub: "2K", disabled: true },
  { id: "ultra", label: "Ultra", sub: "4K", disabled: true },
];

export function CanvasSidebar({ isOpen, onToggle, onGoToChat }: CanvasSidebarProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("nano-banana");
  const [selectedAspect, setSelectedAspect] = useState("1:1");
  const [selectedResolution, setSelectedResolution] = useState("standard");

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block print:hidden"
      data-state={isOpen ? "expanded" : "collapsed"}
      data-collapsible={isOpen ? "" : "offcanvas"}
      data-variant="inset"
      data-side="left"
    >
      {/* Spacer that reserves width */}
      <div className="relative h-svh w-(--sidebar-width) bg-transparent ease-snappy group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 transition-[width]" />

      {/* Fixed sidebar panel */}
      <div className="fixed inset-y-0 hidden h-svh w-(--sidebar-width) transition ease-snappy md:flex left-0 group-data-[collapsible=offcanvas]:-translate-x-(--sidebar-width) p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)] group z-50 border-none">
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
        >
          {/* Header */}
          <div
            data-sidebar="header"
            className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0 pt-safe!"
          >
            {/* Logo row */}
            <div className="grid w-full grid-cols-[auto_1fr_auto]">
              <div className="w-8" />
              <h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
                <a
                  className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
                  href="/"
                >
                  <div className="flex h-3.5 items-center justify-center gap-1 select-none">
                    <T3Logo />
                  </div>
                </a>
              </h1>
              <Tooltip content="Go to Chat" side="right">
                <button
                  aria-label="Go to Chat"
                  onClick={onGoToChat}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground size-8"
                >
                  {/* Chat bubble icon (filled) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M3.43 2.524A41.29 41.29 0 0 1 10 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 0 1-3.55.414c-.28.02-.521.18-.643.413l-1.712 3.293a.75.75 0 0 1-1.33 0l-1.713-3.293a.783.783 0 0 0-.642-.413 41.202 41.202 0 0 1-3.55-.414C1.993 13.245 1 11.986 1 10.574V5.426c0-1.413.993-2.67 2.43-2.902Z" clipRule="evenodd" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            data-sidebar="content"
            className="flex flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden small-scrollbar scroll-shadow-mask relative min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto p-2 pb-2"
            data-shadow="bottom"
          >
            {/* Prompt Section */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {/* Wand icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wand-sparkles">
                  <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
                  <path d="m14 7 3 3" />
                  <path d="M5 6v4" /><path d="M19 14v4" />
                  <path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" />
                </svg>
                Prompt
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-chat-border bg-muted/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            {/* Models Section */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {/* Zap icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
                Models
              </label>
              <div className="flex flex-col gap-1.5">
                {IMAGE_MODELS.map((model) => {
                  const isSelected = selectedModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`group relative flex w-full items-center gap-3 rounded-lg border px-2 py-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-primary/40 bg-primary/8 hover:bg-primary/10"
                          : "border-chat-border bg-muted/20 hover:border-chat-border/80 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex flex-1 flex-col">
                        <span className="text-xs font-medium text-foreground">{model.name}</span>
                        <span className="text-[10px] text-muted-foreground">{model.description}</span>
                      </div>
                      {/* Radio circle */}
                      <div className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio Section */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {/* Ratio icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ratio">
                  <rect width="12" height="12" x="6" y="6" rx="2" />
                  <rect width="20" height="20" x="2" y="2" rx="2" />
                </svg>
                Aspect Ratio
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {ASPECT_RATIOS.map((ratio) => {
                  const isSelected = selectedAspect === ratio.label;
                  // Compute proportional rectangle: max 20px wide, scale height
                  const maxDim = 18;
                  const scale = maxDim / Math.max(ratio.w, ratio.h);
                  const rectW = Math.round(ratio.w * scale);
                  const rectH = Math.round(ratio.h * scale);
                  return (
                    <button
                      key={ratio.label}
                      onClick={() => setSelectedAspect(ratio.label)}
                      className={`flex h-[56px] flex-col items-center justify-between rounded-lg py-2 transition-all ${
                        isSelected
                          ? "bg-primary/20 ring-1 ring-primary/50"
                          : "bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <div
                        className={`rounded-[2px] border ${isSelected ? "border-primary/60" : "border-muted-foreground/30"}`}
                        style={{ width: rectW, height: rectH }}
                      />
                      <span className="text-[9px] font-medium text-muted-foreground">{ratio.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolution Section */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                </svg>
                Resolution
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {RESOLUTIONS.map((res) => {
                  const isSelected = selectedResolution === res.id;
                  return (
                    <button
                      key={res.id}
                      onClick={() => !res.disabled && setSelectedResolution(res.id)}
                      disabled={res.disabled}
                      className={`flex flex-col items-center justify-center rounded-lg py-2 transition-all ${
                        res.disabled
                          ? "cursor-not-allowed opacity-40 bg-muted/10"
                          : isSelected
                            ? "bg-primary/20 ring-1 ring-primary/50"
                            : "bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <span className="text-[10px] font-medium text-foreground">{res.label}</span>
                      <span className="text-[9px] text-muted-foreground">{res.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="m-1 mt-0 px-2 py-2">
            <button
              disabled={!prompt.trim()}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow-sm hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 dark:disabled:hover:bg-primary/20 dark:disabled:active:bg-primary/20 h-9 px-4 py-2 w-full text-sm select-none"
            >
              {/* Sparkles icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" />
              </svg>
              <span className="w-full text-center select-none">Generate</span>
            </button>
          </div>

          {/* Resize handle */}
          <div className="absolute top-0 right-0 h-full w-2 cursor-col-resize" />
        </div>
      </div>
    </div>
  );
}
