import React, { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { ModelSelector } from "./ModelSelector";
import { BackgroundGradient } from "./BackgroundGradient";
import { TopLeftButtons } from "./TopLeftButtons";
import { TopRightButtons } from "./TopRightButtons";
import { activeModels, type Model } from "../data/models";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Top-left buttons (sidebar toggle, search, new thread) */}
      <TopLeftButtons onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      {/* Main content */}
      <MainContent
        selectedModel={selectedModel}
        onOpenModelSelector={() => setModelSelectorOpen(true)}
      />

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 hidden bg-sidebar/50 pt-safe backdrop-blur-xs mobile:block"></div>

      {/* Model selector popup */}
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
      />
    </div>
  );
}
