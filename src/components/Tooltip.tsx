import { useState, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  sideOffset?: number;
}

export function Tooltip({ children, content, side = "bottom", delayMs = 300, sideOffset = 8 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return;
      // Measure the first child element if possible, otherwise the span
      const el = triggerRef.current.firstElementChild as HTMLElement || triggerRef.current;
      const rect = el.getBoundingClientRect();
      let x: number, y: number;
      switch (side) {
        case "top":
          x = rect.left + rect.width / 2;
          y = rect.top - sideOffset;
          break;
        case "bottom":
          x = rect.left + rect.width / 2;
          y = rect.bottom + sideOffset;
          break;
        case "left":
          x = rect.left - sideOffset;
          y = rect.top + rect.height / 2;
          break;
        case "right":
          x = rect.right + sideOffset;
          y = rect.top + rect.height / 2;
          break;
      }
      setPos({ x, y });
      setVisible(true);
    }, delayMs);
  }, [side, delayMs, sideOffset]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const slideClass = {
    top: "data-[side=top]:slide-in-from-bottom-1",
    bottom: "data-[side=bottom]:slide-in-from-top-1",
    left: "data-[side=left]:slide-in-from-right-1",
    right: "data-[side=right]:slide-in-from-left-1",
  }[side];

  const transform = {
    top: "translate(-50%, -100%)",
    bottom: "translate(-50%, 0)",
    left: "translate(-100%, -50%)",
    right: "translate(0, -50%)",
  }[side];

  return (
    <span
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      data-state={visible ? "delayed-open" : "closed"}
      className="inline-flex"
    >
      {children}
      {visible && createPortal(
        <div
          role="tooltip"
          data-state="delayed-open"
          data-side={side}
          className={`z-[9999] overflow-hidden rounded-md bg-primary px-2 py-1 text-[11px] leading-none font-medium text-primary-foreground animate-in fade-in-0 zoom-in-95 pointer-events-none whitespace-nowrap ${slideClass}`}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            transform,
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </span>
  );
}
