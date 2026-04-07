import React from "react";

interface GeneratedImage {
  id: string;
  model: string;
  time: string;
  cost: string;
  aspectRatio: number;
  gradient: string;
}

const SAMPLE_IMAGES: GeneratedImage[] = [
  { id: "1", model: "Nano Banana", time: "2.3s", cost: "$0.020", aspectRatio: 1, gradient: "from-violet-600 to-indigo-500" },
  { id: "2", model: "Seedream v4.5", time: "4.1s", cost: "$0.050", aspectRatio: 16 / 9, gradient: "from-rose-500 to-orange-400" },
  { id: "3", model: "Nano Banana 2", time: "2.8s", cost: "$0.030", aspectRatio: 0.5625, gradient: "from-emerald-500 to-teal-400" },
  { id: "4", model: "Flux 2 Flex", time: "5.2s", cost: "$0.070", aspectRatio: 1.33333, gradient: "from-cyan-500 to-blue-500" },
  { id: "5", model: "GPT Image 1.5", time: "6.1s", cost: "$0.100", aspectRatio: 1, gradient: "from-amber-500 to-yellow-400" },
  { id: "6", model: "Nano Banana Pro", time: "3.5s", cost: "$0.040", aspectRatio: 16 / 9, gradient: "from-pink-500 to-fuchsia-500" },
  { id: "7", model: "Nano Banana", time: "2.1s", cost: "$0.020", aspectRatio: 1, gradient: "from-sky-500 to-indigo-400" },
  { id: "8", model: "Seedream v4.5", time: "4.5s", cost: "$0.050", aspectRatio: 0.5625, gradient: "from-purple-600 to-pink-500" },
  { id: "9", model: "Flux 2 Flex", time: "5.0s", cost: "$0.070", aspectRatio: 1.33333, gradient: "from-lime-500 to-green-500" },
  { id: "10", model: "Nano Banana 2", time: "2.6s", cost: "$0.030", aspectRatio: 1, gradient: "from-red-500 to-rose-400" },
  { id: "11", model: "GPT Image 1.5", time: "6.3s", cost: "$0.100", aspectRatio: 0.5625, gradient: "from-blue-600 to-violet-500" },
  { id: "12", model: "Nano Banana Pro", time: "3.2s", cost: "$0.040", aspectRatio: 1.33333, gradient: "from-orange-500 to-red-400" },
  { id: "13", model: "Seedream v4.5", time: "4.8s", cost: "$0.050", aspectRatio: 16 / 9, gradient: "from-teal-500 to-cyan-400" },
  { id: "14", model: "Nano Banana", time: "2.4s", cost: "$0.020", aspectRatio: 1.33333, gradient: "from-fuchsia-500 to-purple-500" },
  { id: "15", model: "Flux 2 Flex", time: "5.4s", cost: "$0.070", aspectRatio: 1, gradient: "from-yellow-500 to-amber-400" },
  { id: "16", model: "Nano Banana 2", time: "2.9s", cost: "$0.030", aspectRatio: 0.5625, gradient: "from-indigo-500 to-blue-400" },
  { id: "17", model: "Seedream v4.5", time: "4.3s", cost: "$0.050", aspectRatio: 1, gradient: "from-green-500 to-emerald-400" },
  { id: "18", model: "Flux 2 Flex", time: "5.1s", cost: "$0.070", aspectRatio: 1.33333, gradient: "from-rose-400 to-pink-500" },
];

const COLUMNS = 6;

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
    colHeights[minIdx] += 1 / img.aspectRatio;
  }

  return cols;
}

export function CanvasGrid() {
  const columns = distributeToColumns(SAMPLE_IMAGES, COLUMNS);

  return (
    <div className="-ml-4 flex w-auto">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="space-y-4 pl-4" style={{ width: '16.6667%' }}>
          {col.map((img) => (
            <ImageCard key={img.id} image={img} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ImageCard({ image }: { image: GeneratedImage }) {
  return (
    <div className="canvas-preview-card relative cursor-pointer overflow-hidden rounded-xl ring-1 ring-border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Image area */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: image.aspectRatio }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${image.gradient} flex items-center justify-center`}>
          <span className="text-white/60 text-xs font-medium select-none">{image.model}</span>
        </div>

        {/* Quick actions: checkbox (top-left) */}
        <div className="canvas-preview-quick-actions absolute top-2 left-2 z-20 opacity-0 transition-opacity duration-200">
          <div className="flex items-center gap-0.5 rounded-lg bg-black/50 p-2.5 backdrop-blur-md">
            {/* Checkbox */}
            <button className="flex h-4 w-4 items-center justify-center rounded border border-white/50 text-white/70 transition-colors hover:border-white hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick actions: copy, download, delete (top-right) */}
        <div className="canvas-preview-quick-actions pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-end pr-2 opacity-0 transition-opacity duration-200">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg bg-black/50 p-1 backdrop-blur-md">
            {/* Copy */}
            <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white" title="Copy image">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
            {/* Download */}
            <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white" title="Download image">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" />
              </svg>
            </button>
            {/* Delete */}
            <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/70 transition-colors hover:bg-red-500/60 hover:text-white" title="Delete image">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 11v6" /><path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Image info below */}
      <div className="mt-2 px-0.5">
        <p className="truncate text-sm font-medium">{image.model}</p>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {/* Clock icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            {image.time}
          </span>
          <span className="flex items-center gap-1">
            {/* Dollar sign icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {image.cost}
          </span>
        </div>
      </div>
    </div>
  );
}
