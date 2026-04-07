import React from "react";

export function BackgroundGradient() {
  return (
    <div
      className="inset-0 fixed dark:bg-sidebar [:where(.theme-boring_*)]:hidden z-0"
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
  );
}
