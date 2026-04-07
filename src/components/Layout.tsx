import React, { useState, useCallback, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { ModelSelector } from "./ModelSelector";
import { BackgroundGradient } from "./BackgroundGradient";
import { TopLeftButtons } from "./TopLeftButtons";
import { TopRightButtons } from "./TopRightButtons";
import { CanvasSidebar } from "./CanvasSidebar";
import { CanvasPage } from "./CanvasPage";
import { activeModels, type Model } from "../data/models";

export type ViewMode = "chat" | "canvas";

export function Layout() {
  const modelTriggerRef = useRef<HTMLButtonElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("chat");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedView, setDisplayedView] = useState<ViewMode>("chat");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [tempChatMode, setTempChatMode] = useState(false);

  const switchView = useCallback((newMode: ViewMode) => {
    if (newMode === viewMode) return;
    setIsTransitioning(true);
    // Start fade out
    setTimeout(() => {
      setViewMode(newMode);
      setDisplayedView(newMode);
      // Start fade in
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, 150); // fade out duration
  }, [viewMode]);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(
    () =>
      activeModels.find((m) => m.id === "claude-sonnet-4.6") || activeModels[0]
  );
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("t3-favorites");
      return stored
        ? new Set(JSON.parse(stored))
        : new Set(["claude-sonnet-4.6", "gpt-5", "gemini-2.5-flash"]);
    } catch {
      return new Set(["claude-sonnet-4.6", "gpt-5", "gemini-2.5-flash"]);
    }
  });

  const toggleFavorite = useCallback((modelId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        next.add(modelId);
      }
      localStorage.setItem("t3-favorites", JSON.stringify([...next]));
      return next;
    });
  }, []);

  return (
    <div
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
      className="group/sidebar-wrapper min-h-pwa flex w-full"
    >
      {/* Background gradient */}
      <BackgroundGradient />

      {/* Sidebar — switches between chat and canvas with transition */}
      <div className={`transition-opacity duration-150 ease-snappy ${isTransitioning ? "opacity-0" : "opacity-100"}`} style={{ display: "contents" }}>
        {displayedView === "chat" ? (
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onGoToCanvas={() => switchView("canvas")}
            activeThreadId={activeThreadId}
            onSelectThread={(id) => setActiveThreadId(id)}
            onNewChat={() => setActiveThreadId(null)}
          />
        ) : (
          <CanvasSidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onGoToChat={() => switchView("chat")}
          />
        )}
      </div>

      {/* Top-left buttons (sidebar toggle, search, new thread) */}
      <TopLeftButtons onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      {/* Main content — switches between chat and canvas with transition */}
      <div className={`flex-1 transition-[opacity,transform] duration-200 ease-snappy ${isTransitioning ? "opacity-0 scale-[0.99]" : "opacity-100 scale-100"}`} style={{ display: "contents" }}>
        {displayedView === "chat" ? (
          <MainContent
            selectedModel={selectedModel}
            onOpenModelSelector={() => setModelSelectorOpen(prev => !prev)}
            modelTriggerRef={modelTriggerRef}
            isModelSelectorOpen={modelSelectorOpen}
            sidebarOpen={sidebarOpen}
            activeThreadId={activeThreadId}
            tempChatMode={tempChatMode}
            onToggleTempChat={() => setTempChatMode(prev => !prev)}
          />
        ) : (
          <CanvasPage sidebarOpen={sidebarOpen} />
        )}
      </div>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 hidden bg-sidebar/50 pt-safe backdrop-blur-xs mobile:block"></div>

      {/* Model selector popup (chat mode only) */}
      {viewMode === "chat" && (
        <ModelSelector
          isOpen={modelSelectorOpen}
          onClose={() => setModelSelectorOpen(false)}
          selectedModel={selectedModel}
          onSelectModel={(m) => {
            setSelectedModel(m);
            setModelSelectorOpen(false);
          }}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          anchorRef={modelTriggerRef}
        />
      )}
    </div>
  );
}
