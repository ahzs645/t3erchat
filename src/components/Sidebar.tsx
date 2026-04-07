import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "./dndModifiers";
import { T3Logo } from "./T3Logo";
import { CanvasIcon } from "./icons/CanvasIcon";
import { BackgroundGradient } from "./BackgroundGradient";
import { Tooltip } from "./Tooltip";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onGoToCanvas?: () => void;
  activeThreadId?: string | null;
  onSelectThread?: (id: string) => void;
  onNewChat?: () => void;
}

const SAMPLE_THREADS = [
  { id: "1", title: "Workspace Design Consultant Description", group: "pinned" },
  { id: "2", title: "Catan Box Insert Design with OpenSCAD", group: "today", branched: true },
  { id: "3", title: "Ahmad Jalil CV Data in YAML Format", group: "yesterday" },
  { id: "4", title: "Library Skills for Clinical Informatics", group: "yesterday" },
  { id: "5", title: "Library Job Point: Student Engagement", group: "yesterday" },
  { id: "6", title: "Landing Page for Cloud-Based Platform", group: "last30" },
  { id: "7", title: "Prince George Food Safety Investigation", group: "last30" },
  { id: "8", title: "Download Web App & Sourcemap for Debugging", group: "last30" },
  { id: "9", title: "Leather Brand Name Ideas", group: "last30", branched: true },
  { id: "10", title: "More Ideas Generation", group: "last30" },
  { id: "11", title: "CSS template feedback for MacOSX Aqua", group: "last30" },
  { id: "12", title: "Leather company name suggestions", group: "older" },
  { id: "13", title: "UNBC Spark Lab Innovation Hub", group: "older" },
  { id: "14", title: "Convert SVG Buttons to CSS", group: "older", branched: true },
  { id: "15", title: "Refined Data Analysis for Research Paper", group: "older" },
  { id: "16", title: "Black Carbon Meeting Notes", group: "older" },
];

export function Sidebar({ isOpen, onToggle, onGoToCanvas, activeThreadId, onSelectThread, onNewChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set(["1"]));
  const [pinnedCollapsed, setPinnedCollapsed] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState("test");
  const activeId = activeThreadId ?? "";

  const togglePin = (id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredThreads = SAMPLE_THREADS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedThreads = filteredThreads.filter(t => pinnedIds.has(t.id));
  const unpinnedThreads = filteredThreads.filter(t => !pinnedIds.has(t.id));

  const groups = {
    today: unpinnedThreads.filter(t => t.group === "today"),
    yesterday: unpinnedThreads.filter(t => t.group === "yesterday"),
    last30: unpinnedThreads.filter(t => t.group === "last30"),
    older: unpinnedThreads.filter(t => t.group === "older"),
  };

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
          {/* Mobile-only background gradient inside sidebar */}
          <div
            className="inset-0 -z-50 dark:bg-sidebar [:where(.theme-boring_*)]:hidden static hidden mobile:block"
            style={{ "--x": 120, "--y": 36 } as React.CSSProperties}
          >
            <div
              className="absolute inset-0 opacity-0 dark:opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(closest-corner at calc(var(--x)*1px) calc(var(--y)*1px), rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))",
              }}
            />
            <div
              className="absolute inset-0 opacity-40 dark:opacity-0"
              style={{
                backgroundImage:
                  "radial-gradient(closest-corner at calc(var(--x)*1px) calc(var(--y)*1px), rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0)), linear-gradient(rgb(254, 247, 255) 15%, rgb(244, 214, 250))",
              }}
            />
            <div className="absolute inset-0 bg-noise" />
            <div className="absolute inset-0 bg-black/40 light:opacity-0" />
          </div>

          {/* Header */}
          <div
            data-sidebar="header"
            className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0 pt-safe!"
          >
            {/* Theme toggle (mobile only) */}
            <div className="absolute left-1 text-muted-foreground sm:hidden">
              <button
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground group size-8"
                tabIndex={-1}
                data-state="closed"
                style={{ WebkitTouchCallout: "none" }}
              >
                <div className="relative size-4">
                  {/* Monitor icon (auto mode) */}
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
                    className="lucide lucide-monitor absolute inset-0 transition-all duration-200 ease-snappy scale-100 opacity-100"
                    aria-hidden="true"
                  >
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                </div>
                <span className="sr-only">Toggle theme</span>
              </button>
            </div>

            {/* Logo row */}
            <div className="grid w-full grid-cols-[auto_1fr_auto]">
              <div className="w-8" />
              <h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
                <a
                  className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground active"
                  href="/"
                  data-status="active"
                  aria-current="page"
                >
                  <div className="flex h-3.5 items-center justify-center gap-1 select-none">
                    <T3Logo />
                  </div>
                </a>
              </h1>
              <Tooltip content="Canvas" side="bottom">
                <button
                  aria-label="Go to Canvas"
                  data-state="closed"
                  onClick={(e) => { e.preventDefault(); onGoToCanvas?.(); }}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground size-8"
                >
                  <CanvasIcon />
                </button>
              </Tooltip>
            </div>

            {/* New Chat button */}
            <div className="flex flex-col gap-2 px-1">
              <a
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow-sm hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 dark:disabled:hover:bg-primary/20 dark:disabled:active:bg-primary/20 h-9 px-4 py-2 w-full text-sm select-none active"
                href="/"
                data-status="active"
                aria-current="page"
                onClick={(e) => { e.preventDefault(); onNewChat?.(); }}
              >
                <span
                  className="w-full text-center select-none"
                  data-state="closed"
                >
                  New Chat
                </span>
              </a>
            </div>

            {/* Search bar */}
            <div className="border-b border-chat-border px-3">
              <div className="flex items-center">
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
                  className="lucide lucide-search mr-3 -ml-[3px] size-4! min-w-4 text-muted-foreground"
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                <input
                  role="searchbox"
                  aria-label="Search threads"
                  placeholder="Search your threads..."
                  className="w-full bg-transparent py-2 text-sm text-foreground placeholder-muted-foreground/50 placeholder:select-none focus:outline-hidden"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Thread list with sample threads */}
          <div
            data-sidebar="content"
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden small-scrollbar scroll-shadow-mask relative overflow-x-hidden pb-2"
            data-shadow="bottom"
          >
            {activeProfileId !== "test" ? (
              /* Empty state for non-test profiles */
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-8 text-muted-foreground/30">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-sm text-muted-foreground/60">No conversations yet.</p>
                <p className="text-xs text-muted-foreground/40">Start a new chat to begin.</p>
              </div>
            ) : (
            <div className="animate-fade-in">
              <div className="relative mt-2 w-full">
                {/* Pinned — collapsible */}
                {pinnedThreads.length > 0 && (
                  <>
                    <div data-sidebar="group-label" className="relative flex h-8 shrink-0 items-center rounded-md text-xs font-medium ring-sidebar-ring outline-hidden transition-[margin,opa] duration-200 ease-snappy select-none group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 px-3.5 py-2 pt-4 text-color-heading">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin mt-px mr-1 -ml-0.5 size-3!" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                      <span>Pinned</span>
                      <button
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground h-9 absolute! top-1/2 right-0 size-7! -translate-y-1/2 p-0"
                        onClick={() => setPinnedCollapsed(!pinnedCollapsed)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down size-3! transition-transform duration-200 ${pinnedCollapsed ? "" : "rotate-180"}`} aria-hidden="true">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: pinnedCollapsed ? "0fr" : "1fr" }}>
                      <div className="overflow-hidden">
                        {pinnedThreads.map(t => (
                          <ThreadItem key={t.id} title={t.title} active={t.id === activeId} pinned branched={t.branched} onPin={() => togglePin(t.id)} onSelect={() => onSelectThread?.(t.id)} />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Dynamic groups */}
                {([
                  ["Today", groups.today],
                  ["Yesterday", groups.yesterday],
                  ["Last 30 Days", groups.last30],
                  ["Older", groups.older],
                ] as [string, typeof unpinnedThreads][]).map(([label, threads]) => threads.length > 0 && (
                  <div key={label}>
                    <div data-sidebar="group-label" className="flex h-8 shrink-0 items-center rounded-md text-xs font-medium ring-sidebar-ring outline-hidden transition-[margin,opa] duration-200 ease-snappy select-none group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 px-3.5 py-2 pt-4 text-color-heading">
                      <span>{label}</span>
                    </div>
                    {threads.map(t => (
                      <ThreadItem key={t.id} title={t.title} active={t.id === activeId} pinned={pinnedIds.has(t.id)} branched={t.branched} onPin={() => togglePin(t.id)} onSelect={() => onSelectThread?.(t.id)} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>

          <SidebarFooter activeProfileId={activeProfileId} onChangeProfile={(id) => { setActiveProfileId(id); onNewChat?.(); }} />

          {/* Resize handle */}
          <div className="absolute top-0 right-0 h-full w-2 cursor-col-resize" />
        </div>
      </div>
    </div>
  );
}

function ThreadItem({ title, active, pinned, branched, onPin, onSelect }: { title: string; active?: boolean; pinned?: boolean; branched?: boolean; onPin?: () => void; onSelect?: () => void }) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  return (
    <>
      <span data-state="closed" style={{ userSelect: "none" }}>
        <div data-sidebar="menu-item" className="group/menu-item relative px-2">
          <a
            href="#"
            className={`group/link relative flex h-9 w-full items-center overflow-hidden rounded-lg px-2 py-1 text-sm outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring hover:focus-visible:bg-sidebar-accent ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
            onClick={(e) => { e.preventDefault(); onSelect?.(); }}
            onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); }}
          >
            <div className="relative flex w-full items-center">
              {branched && (
                <div className="inline-flex" data-state="closed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide mr-1 h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground">
                    <path d="M6.02,5.78m0,15.31V4.55m0,0v-1.91m0,3.14v-1.23m0,1.23c0,1.61,1.21,3.11,3.2,3.94l4.58,1.92c1.98,.83,3.2,2.32,3.2,3.94v3.84" />
                    <path d="M20.53,17.59l-3.41,3.66-3.66-3.41" />
                  </svg>
                  <span className="sr-only">Go to parent thread</span>
                </div>
              )}
              <button data-state="closed" className="w-full" tabIndex={-1}>
                <div className="relative overflow-visible w-full">
                  <div className="relative w-full cursor-pointer transition-[filter] [transition-duration:500ms] ease-snappy">
                    <input aria-label="Thread title" aria-readonly="true" readOnly tabIndex={-1} className="h-full w-full rounded bg-transparent px-1 py-1 text-left text-sm text-muted-foreground outline-hidden [unicode-bidi:plaintext] pointer-events-none cursor-pointer truncate overflow-hidden" dir="auto" title={title} type="text" value={title} />
                  </div>
                </div>
              </button>
              <div className="mobile:hidden pointer-events-auto absolute top-0 -right-1 bottom-0 z-50 flex translate-x-full items-center justify-end text-muted-foreground transition-transform group-hover/link:translate-x-0 group-hover/link:bg-sidebar-accent">
                <div className="pointer-events-none absolute top-0 right-full bottom-0 h-12 w-8 bg-linear-to-l from-sidebar-accent to-transparent opacity-0 group-hover/link:opacity-100" />
                <Tooltip content={pinned ? "Unpin" : "Pin"} side="bottom">
                  <button className="rounded-md p-1.5 hover:bg-muted/40" tabIndex={-1} aria-label={pinned ? "Unpin Thread" : "Pin Thread"} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPin?.(); }}>
                    {pinned ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin-off size-4" aria-hidden="true">
                        <path d="M12 17v5" /><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" /><path d="m2 2 20 20" /><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin size-4" aria-hidden="true">
                        <path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                      </svg>
                    )}
                  </button>
                </Tooltip>
                <Tooltip content="Archive" side="bottom">
                  <button className="cursor-pointer rounded-md p-1.5 hover:bg-muted/40" tabIndex={-1} aria-label="Archive thread">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive size-4" aria-hidden="true">
                      <rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
          </a>
        </div>
      </span>

      {/* Right-click context menu */}
      {contextMenu && createPortal(
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setContextMenu(null)} />
          <div
            role="menu"
            data-state="open"
            className="fixed z-50 min-w-32 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
            style={{ top: contextMenu.y, left: contextMenu.x, outline: "none", pointerEvents: "auto" }}
            tabIndex={-1}
          >
            {[
              { icon: "pin", label: pinned ? "Unpin" : "Pin", action: () => onPin?.() },
              { icon: "share", label: "Share" },
              { icon: "folder-input", label: "Move to", hasSubmenu: true },
              { icon: "external-link", label: "Open in New Tab" },
              { icon: "text-cursor", label: "Rename" },
              { icon: "sparkles", label: "Regenerate Title" },
              { icon: "download", label: "Export", hasSubmenu: true },
              { icon: "archive", label: "Archive" },
            ].map(item => (
              <div key={item.label} role="menuitem" className="relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground" tabIndex={-1} onClick={() => { item.action?.(); setContextMenu(null); }}>
                <ContextMenuIcon name={item.icon} />
                {item.label}
                {item.hasSubmenu && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right ml-auto h-4 w-4" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                )}
              </div>
            ))}
            <div role="separator" className="-mx-1 my-1 h-px bg-muted" />
            <div role="menuitem" className="relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent/30 text-red-600 transition-colors hover:text-red-500 focus:text-red-500" tabIndex={-1} onClick={() => setContextMenu(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 mr-2 size-4" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Permanently Delete
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function SortableProfileIcon({ profile, isActive, onClick }: { profile: Profile; isActive: boolean; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: profile.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} data-profile-id={profile.id} {...attributes} {...listeners}>
      <Tooltip content={profile.name} side="top">
        <button
          className={`flex shrink-0 cursor-grab items-center justify-center rounded-lg text-sm transition-all active:cursor-grabbing hover:text-muted-foreground ${
            isActive ? "text-foreground" : "text-muted-foreground/80"
          }`}
          type="button"
          aria-label={profile.name}
          aria-roledescription="sortable"
          onClick={onClick}
          data-state="closed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d={profile.icon} />
          </svg>
        </button>
      </Tooltip>
    </div>
  );
}

function ContextMenuIcon({ name }: { name: string }) {
  const cls = "mr-2 size-4";
  const props = { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: `lucide lucide-${name} ${cls}`, "aria-hidden": true as const };
  switch (name) {
    case "pin": return <svg {...props}><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>;
    case "share": return <svg {...props}><path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>;
    case "folder-input": return <svg {...props}><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><path d="M2 13h10"/><path d="m9 16 3-3-3-3"/></svg>;
    case "external-link": return <svg {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>;
    case "text-cursor": return <svg {...props}><path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"/><path d="M7 22h1a4 4 0 0 0 4-4v-1"/><path d="M7 2h1a4 4 0 0 1 4 4v1"/></svg>;
    case "sparkles": return <svg {...props}><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>;
    case "download": return <svg {...props}><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>;
    case "archive": return <svg {...props}><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
    default: return null;
  }
}

// ── Sidebar Footer with Profile Creation + Switcher ──

interface Profile {
  id: string;
  name: string;
  icon: string; // SVG path data for the profile icon
}

const ICON_OPTIONS: { name: string; path: string }[] = [
  { name: "Chat bubble", path: "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" },
  { name: "Star", path: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" },
  { name: "Bookmark", path: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" },
  { name: "Heart", path: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" },
  { name: "Flag", path: "M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" },
  { name: "Lightning bolt", path: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" },
  { name: "Play", path: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" },
  { name: "Sparkles", path: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" },
  { name: "Bell", path: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" },
  { name: "Light bulb", path: "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" },
  { name: "Building", path: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
  { name: "Grid squares", path: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" },
  { name: "Grid small", path: "M3.75 6A2.25 2.25 0 0 1 6 3.75h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 7.5 9.75H6A2.25 2.25 0 0 1 3.75 7.5V6Zm0 9.75A2.25 2.25 0 0 1 6 13.5h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-1.5Zm10.5-9.75a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v1.5A2.25 2.25 0 0 1 18 9.75h-1.5a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 18 19.5h-1.5a2.25 2.25 0 0 1-2.25-2.25v-1.5Z" },
  { name: "Table", path: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12h-7.5m8.625 0h7.5m-8.625 0c.621 0 1.125.504 1.125 1.125m-1.125 0c-.621 0-1.125.504-1.125 1.125m1.125-1.125v1.5c0 .621-.504 1.125-1.125 1.125m0-3.75v1.5c0 .621.504 1.125 1.125 1.125" },
  { name: "Briefcase", path: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" },
  { name: "Database", path: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" },
  { name: "Cube", path: "m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" },
  { name: "Folder", path: "M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" },
  { name: "Calendar", path: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" },
  { name: "Envelope", path: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" },
  { name: "Document check", path: "M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm0 0A9 9 0 0 1 19.5 11.25M10.125 2.25H5.625m4.5 0v4.5c0 .621.504 1.125 1.125 1.125h4.5m-4.5 6 2.25 2.25 4.5-4.5" },
  { name: "Document text", path: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" },
  { name: "Book open", path: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" },
  { name: "Bookmark square", path: "M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" },
  { name: "Chat bubble dots", path: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" },
  { name: "Users", path: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" },
  { name: "Paper airplane", path: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" },
  { name: "Wrench", path: "M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" },
  { name: "Square", path: "M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" },
  { name: "Fire", path: "M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" },
  { name: "Moon", path: "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" },
  { name: "Sun", path: "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" },
  { name: "Globe", path: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" },
  { name: "Beaker", path: "M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
  { name: "Cloud", path: "M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" },
  { name: "Shopping cart", path: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" },
  { name: "Gift", path: "M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" },
  { name: "Home", path: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
  { name: "Cake", path: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m18-2.25a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3" },
  { name: "Settings gear", path: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" },
  { name: "Map", path: "M9 6.75l-5.25 3v11.25L9 17.25l6 3.75 5.25-3V6.75L15 3.75 9 6.75Zm0 0v10.5m6-6.75v10.5" },
  { name: "Music note", path: "m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V4.103A49.635 49.635 0 0 1 12 5.25c-2.676 0-5.216.584-7.499 1.632Z" },
  { name: "Paint brush", path: "M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" },
  { name: "Video camera", path: "m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" },
  { name: "Pencil", path: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" },
  { name: "Clipboard", path: "M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.334a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" },
  { name: "Bar chart", path: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" },
  { name: "Globe pointer", path: "M20.893 13.393l-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738.145l-.957.718a2.1 2.1 0 0 1-2.4.042l-.43-.306a2.345 2.345 0 0 1-1.005-1.573 3.098 3.098 0 0 0-1.22-2.093L8.172 5.88a.857.857 0 0 1-.163-1.234l.113-.146a.857.857 0 0 1 1.233-.163l.757.568a1.5 1.5 0 0 0 1.438.209l.247-.089a1.5 1.5 0 0 0 .695-2.294L12 2.25A9.75 9.75 0 0 0 2.25 12c0 5.385 4.365 9.75 9.75 9.75 5.385 0 9.75-4.365 9.75-9.75 0-.661-.066-1.307-.192-1.932l-.857.286Z" },
  { name: "Newspaper", path: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z" },
  { name: "Thumbs up", path: "M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" },
  { name: "Camera", path: "M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316ZM16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" },
  { name: "Ticket", path: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" },
  { name: "Bug", path: "M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" },
  { name: "Trophy", path: "M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .982-3.172M5.25 4.236c-.996.178-1.768-.767-1.605-1.76.024-.148.056-.293.096-.436.217-.778.97-1.29 1.771-1.29h13.476c.8 0 1.554.512 1.771 1.29.04.143.072.288.096.436.163.993-.609 1.938-1.605 1.76M5.25 4.236V4.5c0 2.178.94 4.137 2.434 5.497a7.5 7.5 0 0 0 2.313 1.675M5.25 4.236V2.721M18.75 4.236V4.5c0 2.178-.94 4.137-2.434 5.497a7.5 7.5 0 0 1-2.313 1.675" },
  { name: "Rocket", path: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" },
];

function IconPicker({
  selectedIcon,
  onSelect,
  buttonRef,
}: {
  selectedIcon: string;
  onSelect: (path: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left,
      });
    }
  }, [buttonRef]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  // Adjust position after render so the popover appears above the button
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const popoverRect = popoverRef.current.getBoundingClientRect();
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top - popoverRect.height - 8,
          left: rect.left,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        className="inline-flex cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-xs hover:bg-input/60 disabled:hover:bg-background text-lg size-9 shrink-0 rounded-lg"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d={selectedIcon} />
        </svg>
      </button>
      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setIsOpen(false)} />
          <div
            ref={popoverRef}
            className="z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden w-auto p-2 fixed"
            style={{ top: position.top, left: position.left, zIndex: 100 }}
          >
            <div className="grid grid-cols-7 gap-1">
              {ICON_OPTIONS.map((icon) => (
                <Tooltip key={icon.name} content={icon.name} side="top">
                  <button
                    type="button"
                    className={`flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                      selectedIcon === icon.path ? "bg-accent text-accent-foreground" : ""
                    }`}
                    onClick={() => {
                      onSelect(icon.path);
                      setIsOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
                    </svg>
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function CopySettingsDropdown({ profiles }: { profiles: Profile[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  const selectedProfile = profiles.find(p => p.id === selected);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="flex h-9 cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs ring-offset-background focus:ring-1 focus:ring-ring focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground [&>span]:line-clamp-1 w-full"
        data-placeholder={selected ? undefined : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ pointerEvents: "none" }}>
          {selectedProfile ? selectedProfile.name : "Copy settings from..."}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[99]" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 min-w-32 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            style={{ top: position.top, left: position.left, width: position.width, zIndex: 100 }}
          >
            {profiles.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No profiles yet</div>
            ) : (
              profiles.map(profile => (
                <div
                  key={profile.id}
                  role="option"
                  aria-selected={selected === profile.id}
                  className="relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground"
                  onClick={() => {
                    setSelected(profile.id);
                    setIsOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="mr-2 size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d={profile.icon} />
                  </svg>
                  {profile.name}
                  {selected === profile.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check ml-auto h-4 w-4" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </div>
              ))
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function SidebarFooter({ activeProfileId, onChangeProfile }: { activeProfileId: string; onChangeProfile: (id: string) => void }) {
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: "test", name: "test", icon: ICON_OPTIONS[1].path },
    { id: "default", name: "Default", icon: ICON_OPTIONS[0].path },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[2].path); // Bookmark default
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ bottom: number; left: number } | null>(null);

  // Position the user menu above the avatar button
  useEffect(() => {
    if (userMenuOpen && avatarBtnRef.current) {
      const rect = avatarBtnRef.current.getBoundingClientRect();
      setMenuPos({ bottom: window.innerHeight - rect.top + 4, left: rect.left });
    }
  }, [userMenuOpen]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target as Node) &&
        avatarBtnRef.current && !avatarBtnRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [userMenuOpen]);
  const createProfile = () => {
    if (!newName.trim()) return;
    const id = newName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setProfiles(prev => [...prev, { id, name: newName.trim(), icon: selectedIcon }]);
    onChangeProfile(id);
    setNewName("");
    setSelectedIcon(ICON_OPTIONS[2].path);
    setShowCreate(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProfiles(prev => {
        const oldIndex = prev.findIndex(p => p.id === active.id);
        const newIndex = prev.findIndex(p => p.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div data-sidebar="footer" className="flex flex-col gap-2 m-0 p-0">
      <div className="overflow-visible border-sidebar-border">
        {/* Create Profile form */}
        {showCreate && (
          <div className="overflow-hidden" style={{ height: "auto", opacity: 1 }}>
            <div className="flex flex-col gap-3 rounded-t-xl bg-muted/30 p-3">
              <div className="flex flex-col gap-0.5">
                <div className="text-sm font-medium">Create a Profile</div>
                <div className="text-xs text-muted-foreground">Profiles have separate threads and settings</div>
              </div>
              <div className="flex gap-2">
                <IconPicker
                  selectedIcon={selectedIcon}
                  onSelect={setSelectedIcon}
                  buttonRef={iconButtonRef}
                />
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Profile name"
                  maxLength={50}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createProfile()}
                />
              </div>
              <CopySettingsDropdown profiles={profiles} />
              <button
                className="inline-flex cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:hover:bg-primary h-8 rounded-md px-3 text-xs w-full"
                disabled={!newName.trim()}
                onClick={createProfile}
              >
                Create Profile
              </button>
            </div>
          </div>
        )}

        {/* User bar with avatar + profile icons */}
        <div className={`flex items-center px-2 py-1.5 transition-colors duration-200 ease-out ${showCreate ? "rounded-b-xl bg-muted/30" : ""}`}>
          {/* Avatar */}
          <Tooltip content="User menu" side="right">
            <button
              ref={avatarBtnRef}
              aria-label="User menu"
              className="mr-2 shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              type="button"
              data-state={userMenuOpen ? "open" : "closed"}
              onClick={() => setUserMenuOpen(v => !v)}
            >
              <span data-slot="avatar" className="relative flex shrink-0 overflow-hidden rounded-full size-8 ring-2 ring-primary">
                <div className="aspect-square size-full flex items-center justify-center bg-primary/30 text-xs font-bold text-primary-foreground">AJ</div>
              </span>
            </button>
          </Tooltip>

          {/* User profile dropdown menu (portal) */}
          {userMenuOpen && menuPos && createPortal(
            <div
              ref={userMenuRef}
              role="menu"
              className="z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md outline-1! outline-chat-border/20! outline-solid! dark:outline-white/5! data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=top]:slide-in-from-bottom-2 transform-origin w-48"
              data-state="open"
              data-side="top"
              style={{ position: "fixed", bottom: menuPos.bottom, left: menuPos.left }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className="text-sm font-medium">Ahmad Jalil</span>
                <span className="rounded-full bg-pink-500/20 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-pink-400">Pro</span>
              </div>
              <div className="-mx-1 my-1 h-px bg-border" role="separator" />
              {/* Settings */}
              <a
                role="menuitem"
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
                onClick={() => setUserMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings" aria-hidden="true">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Settings
              </a>
              {/* Feedback */}
              <a
                role="menuitem"
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
                onClick={() => setUserMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Feedback
              </a>
              <div className="-mx-1 my-1 h-px bg-border" role="separator" />
              {/* Sign out */}
              <a
                role="menuitem"
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400 [&>svg]:size-4 [&>svg]:shrink-0"
                onClick={() => setUserMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Sign out
              </a>
            </div>,
            document.body
          )}

          {/* Sortable profile icons with dnd-kit */}
          <div className="relative flex flex-1 items-center justify-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis]}>
              <SortableContext items={profiles.map(p => p.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex min-w-max items-center gap-2 px-1">
                  {profiles.map(profile => (
                    <SortableProfileIcon
                      key={profile.id}
                      profile={profile}
                      isActive={profile.id === activeProfileId}
                      onClick={() => onChangeProfile(profile.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Toggle create / close button */}
          <Tooltip content={showCreate ? "Cancel" : "Add profile"} side="right">
            <button
              className="ml-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground"
              type="button"
              onClick={() => setShowCreate(!showCreate)}
              data-state="closed"
            >
              {showCreate ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-plus size-5" aria-hidden="true">
                  <path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="M19 16v6" /><path d="M22 19h-6" />
                </svg>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
