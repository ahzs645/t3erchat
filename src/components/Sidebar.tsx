import { useState } from "react";
import { createPortal } from "react-dom";
import { T3Logo } from "./T3Logo";
import { CanvasIcon } from "./icons/CanvasIcon";
import { BackgroundGradient } from "./BackgroundGradient";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
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

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set(["1"]));
  const [activeId, setActiveId] = useState("1");

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
      data-collapsible={isOpen ? "" : "icon"}
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
              <a
                aria-label="Go to Canvas"
                data-state="closed"
                href="/canvas"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground size-8"
              >
                <CanvasIcon />
              </a>
            </div>

            {/* New Chat button */}
            <div className="flex flex-col gap-2 px-1">
              <a
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-reflect button-reflect rounded-lg bg-[rgb(162,59,103)] p-2 font-semibold text-primary-foreground shadow-sm hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 dark:disabled:hover:bg-primary/20 dark:disabled:active:bg-primary/20 h-9 px-4 py-2 w-full text-sm select-none active"
                href="/"
                data-status="active"
                aria-current="page"
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
            <div className="animate-fade-in">
              <div className="relative mt-2 w-full">
                {/* Pinned */}
                {pinnedThreads.length > 0 && (
                  <>
                    <div data-sidebar="group-label" className="flex h-8 shrink-0 items-center rounded-md text-xs font-medium ring-sidebar-ring outline-hidden transition-[margin,opa] duration-200 ease-snappy select-none group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 px-3.5 py-2 pt-4 text-color-heading">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin mt-px mr-1 -ml-0.5 size-3!" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                      <span>Pinned</span>
                    </div>
                    {pinnedThreads.map(t => (
                      <ThreadItem key={t.id} title={t.title} active={t.id === activeId} pinned branched={t.branched} onPin={() => togglePin(t.id)} onSelect={() => setActiveId(t.id)} />
                    ))}
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
                      <ThreadItem key={t.id} title={t.title} active={t.id === activeId} pinned={pinnedIds.has(t.id)} branched={t.branched} onPin={() => togglePin(t.id)} onSelect={() => setActiveId(t.id)} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SidebarFooter />

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
                <button className="rounded-md p-1.5 hover:bg-muted/40" tabIndex={-1} aria-label={pinned ? "Unpin Thread" : "Pin Thread"} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPin?.(); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin size-4" aria-hidden="true">
                    <path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                  </svg>
                </button>
                <button className="cursor-pointer rounded-md p-1.5 hover:bg-muted/40" tabIndex={-1} aria-label="Archive thread">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive size-4" aria-hidden="true">
                    <rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" />
                  </svg>
                </button>
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
