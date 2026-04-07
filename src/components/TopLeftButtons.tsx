import { Tooltip } from "./Tooltip";

interface TopLeftButtonsProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function TopLeftButtons({ onToggleSidebar, sidebarOpen }: TopLeftButtonsProps) {
  // When sidebar is collapsed, show search + new thread buttons with blurred background
  const collapsed = !sidebarOpen;

  return (
    <div className="pointer-events-auto fixed top-safe-offset-2 left-2 z-50 flex flex-row gap-0.5 p-1">
      {/* Background blur pill — wider when collapsed to contain all 3 buttons */}
      <div
        className={`pointer-events-none absolute inset-0 right-auto -z-10 rounded-md backdrop-blur-xs transition-[background-color,width] ${
          collapsed
            ? "w-27 bg-sidebar/50 delay-125 duration-125 blur-fallback:bg-sidebar"
            : "w-10 bg-transparent delay-0 duration-250"
        } max-sm:w-27 max-sm:bg-sidebar/50 max-sm:delay-125 max-sm:duration-125`}
      />

      {/* Sidebar toggle */}
      <Tooltip content="Toggle Sidebar" side="bottom">
        <button
          onClick={onToggleSidebar}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground size-9 z-10 h-8 w-8 text-muted-foreground"
          data-sidebar="trigger"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" />
        </svg>
        <span className="sr-only">Toggle Sidebar</span>
        </button>
      </Tooltip>

      {/* Search button — visible when collapsed or on mobile */}
      <Tooltip content="Search" side="bottom">
        <button
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground size-8 text-muted-foreground transition-[transform,opacity] ${
            collapsed
              ? "translate-x-0 opacity-100 delay-150 duration-250"
              : "sm:pointer-events-none sm:-translate-x-8.5 sm:opacity-0 sm:delay-0 sm:duration-150 translate-x-0 opacity-100"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search" aria-hidden="true">
            <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </Tooltip>

      {/* New Thread button — visible when collapsed or on mobile */}
      <Tooltip content="New Thread" side="bottom">
        <a
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground size-8 text-muted-foreground transition-[transform,opacity] ${
            collapsed
              ? "translate-x-0 opacity-100 delay-150 duration-150"
              : "sm:pointer-events-none sm:-translate-x-8.5 sm:opacity-0 sm:delay-0 sm:duration-150 translate-x-0 opacity-100 pointer-events-none opacity-25"
          }`}
          href="/"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus" aria-hidden="true">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          <span className="sr-only">New Thread</span>
        </a>
      </Tooltip>
    </div>
  );
}
