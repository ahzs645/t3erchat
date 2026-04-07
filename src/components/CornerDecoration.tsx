import React from "react";

export function CornerDecoration() {
  return (
    <div
      className="group pointer-events-none absolute top-3.5 z-10 -mb-8 h-32 w-full origin-top transition-all ease-snappy"
      style={{
        boxShadow: "10px -10px 8px 2px var(--gradient-noise-top)",
      }}
    >
      <svg
        className="absolute h-9 origin-top-left skew-x-30 overflow-visible -right-16 transform-gpu transition-transform duration-300 ease-snappy -translate-x-8"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 128 32"
        xmlSpace="preserve"
      >
        <line
          stroke="var(--gradient-noise-top)"
          strokeWidth="2px"
          shapeRendering="optimizeQuality"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeMiterlimit="10"
          x1="1"
          y1="0"
          x2="128"
          y2="0"
        />
        <path
          stroke="var(--chat-border)"
          className="translate-y-[0.5px]"
          fill="var(--gradient-noise-top)"
          shapeRendering="optimizeQuality"
          strokeWidth="1px"
          strokeLinecap="round"
          strokeMiterlimit="10"
          vectorEffect="non-scaling-stroke"
          d="M0,0c5.9,0,10.7,4.8,10.7,10.7v10.7c0,5.9,4.8,10.7,10.7,10.7H128V0"
        />
      </svg>
    </div>
  );
}
