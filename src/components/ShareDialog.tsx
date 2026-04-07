import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  threadTitle: string;
}

export function ShareDialog({ isOpen, onClose, threadTitle }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const shareUrl = "https://t3.chat/share/78ojh3uyes";

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Reset copied state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setSettingsExpanded(false);
    }
  }, [isOpen]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        data-state="open"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        data-state="open"
        className="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg max-h-[85vh] p-0 md:max-w-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-4" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="flex flex-col space-y-1.5 p-6 pb-0">
          <h2 className="font-semibold leading-none tracking-tight text-lg">
            Share &ldquo;<span className="truncate inline-block max-w-[20ch] align-bottom">{threadTitle}</span>&rdquo;?
          </h2>
          <p className="text-sm text-muted-foreground">
            Generate a public link to share this conversation with others. Anyone with the link can view it.
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 pb-0">
          {/* Share link section */}
          <div className="space-y-3">
            {/* New Link button row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Share link</span>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw size-3.5" aria-hidden="true">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                New Link
              </button>
            </div>

            {/* Link row */}
            <div className="rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors">
              <div className="flex items-center gap-3 p-3">
                {/* Link icon */}
                <div className="flex-shrink-0 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link size-4" aria-hidden="true">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>

                {/* URL and stats */}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm underline truncate">{shareUrl}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>less than a minute ago</span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye size-3" aria-hidden="true">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      0
                    </span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-fork size-3" aria-hidden="true">
                        <circle cx="12" cy="18" r="3" />
                        <circle cx="6" cy="6" r="3" />
                        <circle cx="18" cy="6" r="3" />
                        <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                        <path d="M12 12v3" />
                      </svg>
                      0
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Copy */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden hover:bg-accent hover:text-accent-foreground size-8"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-4 text-green-500" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy size-4" aria-hidden="true">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    )}
                  </button>

                  {/* Share */}
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden hover:bg-accent hover:text-accent-foreground size-8"
                    aria-label="Share"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share size-4" aria-hidden="true">
                      <path d="M12 2v13" />
                      <path d="m16 6-4-4-4 4" />
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    </svg>
                  </button>

                  {/* Edit (pencil-off) */}
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden hover:bg-accent hover:text-accent-foreground size-8"
                    aria-label="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-off size-4" aria-hidden="true">
                      <path d="m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .833-.5L14 14" />
                      <path d="m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" />
                      <path d="m2 2 20 20" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Settings section (expandable) */}
            <div>
              <button
                type="button"
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
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
                  className={`lucide lucide-chevron-right size-4 transition-transform duration-200 ${settingsExpanded ? "rotate-90" : ""}`}
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                Settings
              </button>

              {settingsExpanded && (
                <div className="mt-2 space-y-3 pl-6">
                  {/* Auto-update toggle */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="auto-update" className="text-sm">
                      Auto-update when thread changes
                    </label>
                    <button
                      type="button"
                      role="switch"
                      id="auto-update"
                      aria-checked={autoUpdate}
                      data-state={autoUpdate ? "checked" : "unchecked"}
                      className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                      onClick={() => setAutoUpdate(!autoUpdate)}
                    >
                      <span
                        data-state={autoUpdate ? "checked" : "unchecked"}
                        className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform! data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
                      />
                    </button>
                  </div>

                  {/* Include attachments toggle */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="include-attachments" className="text-sm">
                      Include attachments
                    </label>
                    <button
                      type="button"
                      role="switch"
                      id="include-attachments"
                      aria-checked={includeAttachments}
                      data-state={includeAttachments ? "checked" : "unchecked"}
                      className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary"
                      onClick={() => setIncludeAttachments(!includeAttachments)}
                    >
                      <span
                        data-state={includeAttachments ? "checked" : "unchecked"}
                        className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform! data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
                      />
                    </button>
                  </div>

                  {/* Delete button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 h-8 px-3 text-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 size-3.5" aria-hidden="true">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                      Delete shared link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-9 px-4 py-2"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-4" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy size-4" aria-hidden="true">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
