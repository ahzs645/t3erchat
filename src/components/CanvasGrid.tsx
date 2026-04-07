import React, { useState } from "react";

interface GeneratedImage {
  id: string;
  model: string;
  time: string;
  cost: string;
  aspectW: number;
  aspectH: number;
  gradient: string;
}

const SAMPLE_IMAGES: GeneratedImage[] = [
  { id: "1", model: "Nano Banana", time: "2.3s", cost: "$0.02", aspectW: 1, aspectH: 1, gradient: "from-violet-600 to-indigo-500" },
  { id: "2", model: "Seedream v4.5", time: "4.1s", cost: "$0.05", aspectW: 16, aspectH: 9, gradient: "from-rose-500 to-orange-400" },
  { id: "3", model: "Nano Banana 2", time: "2.8s", cost: "$0.03", aspectW: 9, aspectH: 16, gradient: "from-emerald-500 to-teal-400" },
  { id: "4", model: "Flux 2 Flex", time: "5.2s", cost: "$0.07", aspectW: 4, aspectH: 3, gradient: "from-cyan-500 to-blue-500" },
  { id: "5", model: "GPT Image 1.5", time: "6.1s", cost: "$0.10", aspectW: 3, aspectH: 4, gradient: "from-amber-500 to-yellow-400" },
  { id: "6", model: "Nano Banana Pro", time: "3.5s", cost: "$0.04", aspectW: 21, aspectH: 9, gradient: "from-pink-500 to-fuchsia-500" },
  { id: "7", model: "Nano Banana", time: "2.1s", cost: "$0.02", aspectW: 1, aspectH: 1, gradient: "from-sky-500 to-indigo-400" },
  { id: "8", model: "Seedream v4.5", time: "4.5s", cost: "$0.05", aspectW: 16, aspectH: 9, gradient: "from-purple-600 to-pink-500" },
  { id: "9", model: "Flux 2 Flex", time: "5.0s", cost: "$0.07", aspectW: 9, aspectH: 16, gradient: "from-lime-500 to-green-500" },
  { id: "10", model: "Nano Banana 2", time: "2.6s", cost: "$0.03", aspectW: 4, aspectH: 3, gradient: "from-red-500 to-rose-400" },
  { id: "11", model: "GPT Image 1.5", time: "6.3s", cost: "$0.10", aspectW: 1, aspectH: 1, gradient: "from-blue-600 to-violet-500" },
  { id: "12", model: "Nano Banana Pro", time: "3.2s", cost: "$0.04", aspectW: 3, aspectH: 4, gradient: "from-orange-500 to-red-400" },
  { id: "13", model: "Seedream v4.5", time: "4.8s", cost: "$0.05", aspectW: 16, aspectH: 9, gradient: "from-teal-500 to-cyan-400" },
  { id: "14", model: "Nano Banana", time: "2.4s", cost: "$0.02", aspectW: 4, aspectH: 3, gradient: "from-fuchsia-500 to-purple-500" },
  { id: "15", model: "Flux 2 Flex", time: "5.4s", cost: "$0.07", aspectW: 1, aspectH: 1, gradient: "from-yellow-500 to-amber-400" },
];

const COLUMNS = 5;

function distributeToColumns(images: GeneratedImage[], numCols: number): GeneratedImage[][] {
  const cols: GeneratedImage[][] = Array.from({ length: numCols }, () => []);
  const colHeights: number[] = new Array(numCols).fill(0);

  for (const img of images) {
    // Find the shortest column
    let minIdx = 0;
    for (let i = 1; i < numCols; i++) {
      if (colHeights[i] < colHeights[minIdx]) minIdx = i;
    }
    cols[minIdx].push(img);
    colHeights[minIdx] += img.aspectH / img.aspectW;
  }

  return cols;
}

export function CanvasGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const columns = distributeToColumns(SAMPLE_IMAGES, COLUMNS);

  return (
    <div className="flex w-full gap-3 p-4">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-1 flex-col gap-3" style={{ width: `${100 / COLUMNS}%` }}>
          {col.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              isHovered={hoveredId === img.id}
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ImageCard({
  image,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  image: GeneratedImage;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  // Compute aspect ratio for the card
  const paddingTop = `${(image.aspectH / image.aspectW) * 100}%`;

  return (
    <div
      className="group relative overflow-hidden rounded-xl ring-1 ring-border transition-all"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Image placeholder with gradient */}
      <div className="relative w-full" style={{ paddingTop }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${image.gradient} flex items-center justify-center`}>
          <span className="text-white/60 text-xs font-medium select-none">{image.model}</span>
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          {/* Top actions */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            {/* Checkbox */}
            <button className="flex size-6 items-center justify-center rounded-md bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
            </button>
            <div className="flex gap-1">
              {/* Copy */}
              <button className="flex size-6 items-center justify-center rounded-md bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </button>
              {/* Download */}
              <button className="flex size-6 items-center justify-center rounded-md bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" />
                </svg>
              </button>
              {/* Delete */}
              <button className="flex size-6 items-center justify-center rounded-md bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-red-600/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 11v6" /><path d="M14 11v6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image info below */}
      <div className="flex items-center justify-between bg-muted/10 px-2.5 py-1.5">
        <span className="text-[10px] font-medium text-muted-foreground">{image.model}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/60">{image.time}</span>
          <span className="text-[10px] text-muted-foreground/60">{image.cost}</span>
        </div>
      </div>
    </div>
  );
}
