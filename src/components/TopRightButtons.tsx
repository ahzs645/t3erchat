import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "./Tooltip";

interface TopRightButtonsProps {
  tempChatMode?: boolean;
  onToggleTempChat?: () => void;
}

export function TopRightButtons({ tempChatMode = false, onToggleTempChat }: TopRightButtonsProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "auto" | "dark">("dark");
  const [boringMode, setBoringMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  // Close on Escape
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [settingsOpen]);

  const handleTheme = (t: "light" | "auto" | "dark") => {
    setTheme(t);
    const html = document.documentElement;
    html.classList.remove("light", "dark", "auto");
    if (t === "auto") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      html.classList.add(sys, "auto");
      html.style.colorScheme = sys;
    } else {
      html.classList.add(t);
      html.style.colorScheme = t;
    }
    localStorage.setItem("theme-mode", t);
  };

  return (
    <div
      className="fixed top-safe-offset-2 z-20 print:invisible"
      style={{ right: "var(--firefox-scrollbar, 0.4rem)" }}
      ref={menuRef}
    >
      <div className="pointer-events-none absolute inset-0 left-auto -z-10 w-0 rounded-md bg-transparent backdrop-blur-xs transition-[background-color,width] delay-0 duration-250 max-sm:bg-sidebar/50 max-sm:delay-125 max-sm:duration-125 max-sm:w-19" />
      <div className="flex flex-row items-center text-muted-foreground gap-0.5 rounded-md p-1 transition-all rounded-bl-xl">
        {/* Temporary chat button */}
        <Tooltip content={tempChatMode ? "Disable temporary chat" : "Temporary chat"} side="bottom">
          <button
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground z-0 size-8 transform-gpu transition-all duration-300 sm:ml-2 sm:rounded-bl-xl sm:bg-gradient-noise-top translate-x-0 opacity-100"
            aria-label={tempChatMode ? "Disable temporary chat mode" : "Enable temporary chat mode"}
            onClick={onToggleTempChat}
          >
            {tempChatMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-check size-4 text-primary" aria-hidden="true">
                <path d="M12 6v6l4 2" /><path d="M22 12a10 10 0 1 0-11 9.95" /><path d="m22 16-5.5 5.5L14 19" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock size-4" aria-hidden="true">
                <path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </button>
        </Tooltip>

        {/* Settings button */}
        <Tooltip content="Settings" side="bottom">
          <button
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground sm:bg-gradient-noise-top relative z-10 size-8"
            ref={settingsBtnRef}
            aria-label="Settings"
            type="button"
            aria-haspopup="menu"
            aria-expanded={settingsOpen}
            data-state={settingsOpen ? "open" : "closed"}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings2 lucide-settings-2 size-4" aria-hidden="true">
              <path d="M14 17H5" /><path d="M19 7h-9" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Settings dropdown menu — rendered via portal to avoid shifting buttons */}
      {settingsOpen && createPortal(
        <div ref={menuRef}>
          {/* Invisible backdrop for click-outside */}
          <div className="fixed inset-0 z-[49]" onClick={() => setSettingsOpen(false)} />
          <div
            data-side="bottom"
            data-align="center"
            role="menu"
            aria-orientation="vertical"
            data-state="open"
            className="fixed z-50 min-w-32 overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md outline-1! outline-chat-border/20! outline-solid! dark:outline-white/5! data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 transform-origin p-1"
            tabIndex={-1}
            style={{
              outline: "none",
              pointerEvents: "auto",
              top: settingsBtnRef.current ? settingsBtnRef.current.getBoundingClientRect().bottom + 8 : 40,
              right: 8,
            }}
          >
          {/* Theme selector */}
          <div className="flex flex-row items-center gap-2 px-2 py-1.5 text-sm">
            Theme
            <div className="relative flex flex-row items-center gap-0.5 rounded-full border border-border bg-background/80 backdrop-blur-sm">
              <button
                type="button"
                aria-label="Switch to light theme"
                className="cursor-pointer rounded-full px-2.5 py-1 transition hover:bg-muted/40"
                onClick={() => handleTheme("light")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun size-4">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Use system theme"
                className="cursor-pointer rounded-full px-2.5 py-1 hover:bg-muted/40"
                onClick={() => handleTheme("auto")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor size-4">
                  <rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Switch to dark theme"
                className="cursor-pointer rounded-full px-2.5 py-1 hover:bg-muted/40"
                onClick={() => handleTheme("dark")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon size-4">
                  <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
                </svg>
              </button>
              {/* Active indicator pill */}
              <div
                className="absolute inset-y-0 -z-10 w-9 transform-gpu rounded-full border border-primary-foreground/20 bg-primary/40 backdrop-blur-md transition-transform! duration-200"
                style={{
                  transform: theme === "light" ? "translateX(0)" : theme === "auto" ? "translateX(38px)" : "translateX(76px)",
                }}
              />
            </div>
          </div>

          {/* Boring mode toggle */}
          <div className="flex items-center space-x-2 px-2 py-1.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain size-4">
              <circle fill="currentColor" cx="13.5" cy="6.5" r=".5" /><circle fill="currentColor" cx="17.5" cy="10.5" r=".5" /><circle fill="currentColor" cx="6.5" cy="12.5" r=".5" />
              <path d="M20.63,14.48c.85-.98,1.37-2.25,1.37-3.64-.03-4.83-4.53-8.84-9.99-8.84-1.36,0-2.66,.27-3.84,.77" />
              <path d="M4.86,5.02c-1.77,1.81-2.86,4.27-2.86,6.98,0,5.5,4.5,10,10,10,.93,0,1.65-.75,1.65-1.69,0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.12-.02-.91,.71-1.65,1.61-1.67,.02,0,.04,0,.06,0h1.95" />
              <path d="M2,2L22,22" />
            </svg>
            <label htmlFor="boring-mode">Boring Mode</label>
            <button
              type="button"
              role="switch"
              aria-checked={boringMode}
              data-state={boringMode ? "checked" : "unchecked"}
              className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary ml-auto"
              id="boring-mode"
              onClick={() => {
                setBoringMode(!boringMode);
                document.body.classList.toggle("theme-boring", !boringMode);
                document.body.classList.toggle("theme-default", boringMode);
              }}
            >
              <span
                data-state={boringMode ? "checked" : "unchecked"}
                className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform! data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
              />
            </button>
          </div>

          {/* Separator */}
          <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted" />

          {/* Settings link */}
          <a
            aria-label="Go to settings"
            role="button"
            tabIndex={-1}
            className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0"
            href="#"
            onClick={(e) => { e.preventDefault(); setSettingsOpen(false); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings size-4" aria-hidden="true">
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Settings
          </a>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
