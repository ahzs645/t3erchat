# Model Selector Popup - Complete Component Specification

Reverse-engineered from three HTML captures of the t3.chat model selector popup.

---

## 1. Source Files

| File | State | Models Shown |
|------|-------|-------------|
| `model-selector.html` (114KB) | Favorites tab active | 13 favorited models from multiple providers |
| `model-selector (1).html` (65KB) | Z.ai provider tab active | 8 GLM models, GLM 5V Turbo selected |
| `model-selector (2).html` (65KB) | Same as (1), but with Google tooltip in `delayed-open` state |

---

## 2. Component Structure (HTML Hierarchy)

```
div[data-radix-popper-content-wrapper]           -- Radix positioning wrapper
  style: position:fixed; transform:translate(...); z-index:50
  └── div[role="dialog"][data-state="open"]      -- Radix Popover content
        class: z-50 border text-popover-foreground outline-hidden
               w-[460px] max-w-screen overflow-hidden rounded-xl
               border-chat-border bg-background/69 p-0 shadow-2xl backdrop-blur-md
               data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
               data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
               data-[side=top]:slide-in-from-bottom-2
        └── div.relative.overflow-hidden.rounded-xl     -- Main container
              ├── div.absolute.inset-0.opacity-0.dark:opacity-50
              │     style="background: var(--model-selector-gradient)"
              ├── div.absolute.inset-0.bg-[url('/images/noise.png')].opacity-[0.03]
              └── div.relative                            -- Content wrapper
                    ├── [Search Bar]
                    └── [Main Flex Area: Sidebar + Model List]
```

### 2.1 Search Bar

```
div.flex.items-center.gap-2.px-4.pt-3.pb-2
  ├── div.flex.flex-1.items-center.border-b.border-chat-border/50.pb-1
  │     ├── svg.lucide.lucide-search.mr-2.5.size-4.shrink-0.text-muted-foreground/60
  │     └── input.w-full.bg-transparent.py-1.5.text-sm.text-foreground
  │           placeholder="Search models..."
  │           class: placeholder:text-muted-foreground/50 focus:outline-none
  └── button (Filter)
        class: inline-flex cursor-pointer items-center justify-center gap-2
               text-sm font-medium whitespace-nowrap transition-colors
               hover:bg-muted/40 size-9 relative shrink-0 rounded-lg
               text-muted-foreground hover:text-foreground
        └── svg.lucide.lucide-funnel.size-4
```

### 2.2 Main Flex Area

```
div.flex.h-[426px].max-h-[calc(100dvh-14rem)]
  ├── [Provider Sidebar]
  └── [Model List]
```

---

## 3. Provider Sidebar

### 3.1 Structure

```
div.relative.h-full.w-14.shrink-0
  ├── div (scrollable)
  │     class: no-scrollbar flex h-full max-h-full w-14 flex-col items-center
  │            overflow-x-hidden overflow-y-auto rounded-tr-xl
  │            border border-b-0 border-l-0 border-chat-border bg-sidebar-accent/30
  │     ├── div.grid (Favorites collapsible group)
  │     │     class: grid transition-[grid-template-rows] duration-200 ease-out grid-rows-[1fr]
  │     │     └── div.overflow-hidden.p-1
  │     │           └── div.flex.flex-col.items-center.gap-1
  │     │                 ├── button[aria-label="Favorites"] (Star icon)
  │     │                 └── div.my-1.h-px.w-[calc(100%-1.5rem)].bg-chat-border  -- Separator
  │     ├── button[aria-label="OpenAI"]
  │     ├── button[aria-label="Anthropic"]
  │     ├── button[aria-label="Google"]
  │     ├── button[aria-label="Meta"]
  │     ├── button[aria-label="DeepSeek"]
  │     ├── button[aria-label="xAI"]
  │     ├── button[aria-label="Alibaba"]     (shows Qwen icon)
  │     ├── button[aria-label="Moonshot"]
  │     ├── button[aria-label="Z.ai"]        (has sparkle badge)
  │     ├── button[aria-label="MiniMax"]
  │     └── button[aria-label="Xiaomi"]
  └── div (bottom fade gradient)
        class: pointer-events-none absolute inset-x-0 bottom-0 flex h-16
               flex-col items-center justify-end bg-gradient-to-t
               from-sidebar-accent/90 to-transparent pb-1.5
               transition-opacity duration-150 opacity-0
```

### 3.2 Provider Button Structure

```
button.group.relative.flex.size-11.shrink-0.cursor-pointer.items-center
      .justify-center.rounded-xl.transition-all.ease-snappy
      .hover:duration-0.hover:bg-sidebar-accent/80
  aria-label="ProviderName"
  data-state="closed"
  ├── div (indicator bar)
  │     class: absolute top-1/2 -right-1.5 h-6 w-0.5 translate-x-[0.5px]
  │            -translate-y-1/2 rounded-l-full bg-primary transition-opacity duration-150
  │            [opacity-100 | opacity-0]  -- active vs inactive
  ├── div.relative
  │     └── svg (provider icon)
  └── [optional: sparkle badge for Z.ai]
        div.absolute.-top-1.-right-1.5.rounded-full.bg-gradient-noise-top.p-0.5
          └── svg.lucide.lucide-sparkles.size-2.text-amber-500
```

### 3.3 Provider Icon States

| State | SVG Classes |
|-------|------------|
| **Active** (regular) | `size-5 transition text-foreground opacity-100 group-hover:text-foreground group-hover:opacity-100` |
| **Inactive** (regular) | `size-5 text-muted-foreground opacity-80 transition group-hover:text-foreground group-hover:opacity-100` |
| **Active** (favorites star) | `lucide lucide-star size-5 transition-colors text-foreground group-hover:text-foreground` + `fill="currentColor" stroke-width="1"` |
| **Inactive** (favorites star) | `lucide lucide-star size-5 text-muted-foreground transition-colors group-hover:text-foreground` |

### 3.4 Providers List (in order)

| # | Provider | Icon Source | Notes |
|---|----------|-------------|-------|
| 0 | Favorites | `lucide-star` (filled when active) | In collapsible group, separated by `h-px` divider |
| 1 | OpenAI | Custom SVG, viewBox `118 120 480 480` | |
| 2 | Anthropic | Custom SVG, viewBox `0 0 46 32`, has `<title>` | |
| 3 | Google | Custom SVG (Gemini icon), viewBox `0 0 16 16`, titled "Gemini" | |
| 4 | Meta | Custom SVG, viewBox `0 0 256 171` | |
| 5 | DeepSeek | Custom SVG, viewBox `0 0 24 24` | |
| 6 | xAI | Custom SVG (Grok), viewBox `0 0 33 32` | |
| 7 | Alibaba | Custom SVG (Qwen), viewBox `0 0 24 24`, titled "Qwen" | |
| 8 | Moonshot | Custom SVG (MoonshotAI), viewBox `0 0 24 24` | |
| 9 | Z.ai | Custom SVG (triangles), viewBox `0 0 2000 1700` | Has sparkle badge + amber glow `drop-shadow-[0_0_6px_#ffae10]` |
| 10 | MiniMax | Custom SVG (hand/wave), viewBox `0 0 24 24` | |
| 11 | Xiaomi | Custom SVG, viewBox `-200.008 -199.727 512 512` | |

---

## 4. Model List Item

### 4.1 Structure

```
button[data-model-item="true"][data-state="closed"]
  class: group flex h-16 w-full cursor-pointer items-center gap-3 rounded-lg
         pt-1.5 pr-1.5 pb-2.5 pl-3 text-left transition-all ease-snappy
         hover:bg-sidebar-accent/60 hover:duration-0
         focus-visible:bg-sidebar-accent/40 focus-visible:ring-2 focus-visible:ring-primary/50
         [+ bg-sidebar-accent/80 shadow-sm if SELECTED]
  └── div.min-w-0.flex-1
        ├── div.flex.items-center.gap-1.5       -- Top row
        │     ├── [svg provider icon]           -- ONLY in Favorites tab
        │     │     class: mr-1 inline-block size-4 text-muted-foreground/80
        │     ├── p.text-md.truncate.font-semibold[.text-foreground if selected]
        │     │     "Model Name"
        │     ├── span.inline-flex.opacity-70   -- Cost indicator wrapper
        │     │     └── span[aria-label="Cost: ..."]
        │     │           └── span.font-mono.tabular-nums
        │     │                 ├── span[.text-emerald-*|.text-red-*] "$"
        │     │                 ├── span "$" or "·"
        │     │                 └── span "·" or "$"
        │     ├── [span.rounded-full "NEW"]     -- Optional NEW badge
        │     ├── span[role="button"]           -- Favorite star toggle
        │     │     aria-label="Add to favorites" | "Remove from favorites"
        │     │     └── svg.lucide.lucide-star.size-4.transition-all
        │     │           [+ fill-yellow-500 text-yellow-600 if favorited]
        │     └── div.ml-auto.flex.items-center.gap-0.5.rounded-full.bg-muted-foreground/8.p-0.75
        │           └── [Capability badge icons]
        └── div.relative                        -- Bottom row
              ├── p.mt-0.5.truncate.pr-16.pl-[0.25px].text-xs.text-muted-foreground/60[.ml-7 if favorites]
              │     "Description text..."
              └── div.absolute.top-0.right-0.flex.shrink-0.items-center.gap-1
                    └── span[aria-label="View model details"]
                          class: hidden shrink-0 cursor-pointer rounded p-1
                                 transition-colors md:block text-muted-foreground/60 hover:text-foreground
                          aria-haspopup="dialog"
                          └── svg.lucide.lucide-info.size-4
```

### 4.2 Capability Badge Structure

Each badge inside the container:

```
span.inline-flex[data-state="closed"]          -- Tooltip wrapper
  └── div.relative.flex.size-5.items-center.justify-center.overflow-hidden
        class: text-(--color) dark:text-(--color-dark)
        style="--color-dark: hsl(...); --color: hsl(...);"
        └── svg.size-3.5 (the icon)
```

### 4.3 Capability Types

| Capability | Icon | Color (light) | Color (dark) |
|------------|------|---------------|--------------|
| **Vision** | `lucide-eye` | `hsl(168 54% 52%)` (teal) | `hsl(168 54% 74%)` |
| **Reasoning** | `lucide-brain` | `hsl(263 58% 53%)` (purple) | `hsl(263 58% 75%)` |
| **Coding** | Custom brain-tree SVG | `hsl(263 58% 53%)` (purple) | `hsl(263 58% 75%)` |
| **Image Generation** | `lucide-image-plus` | `hsl(12 60% 45%)` (orange) | `hsl(12 60% 60%)` |
| **Tool Use** | Custom file-star SVG | `hsl(237 55% 57%)` (blue) | `hsl(237 75% 77%)` |

---

## 5. Cost Indicator System

| Level | Display | aria-label | $ Color |
|-------|---------|------------|---------|
| Very Low | `···` | "Cost: Very low" | (none - all dots) |
| Low | `$··` | "Cost: Low" | `text-emerald-700/85` / `dark:text-emerald-400/80` |
| Medium | `$$·` | "Cost: Medium" | `text-emerald-700/85` / `dark:text-emerald-400/80` |
| High | `$$$` | "Cost: High" | `text-emerald-700/85` / `dark:text-emerald-400/80` |
| Very High | `$$$+` | "Cost: Very high" | `text-red-600/85` / `dark:text-red-400` |

Non-highlighted `·` and `+` characters have no special color classes (inherit muted foreground).

---

## 6. NEW Badge

```html
<span class="rounded-full bg-linear-to-r from-amber-500/20 to-orange-500/20
             px-1.5 py-0.5 text-[10px] font-semibold
             text-amber-600 dark:text-amber-400">
  NEW
</span>
```

---

## 7. Favorite Star States

**Favorited (filled):**
```
span[aria-label="Remove from favorites"]
  class: group/star shrink-0 cursor-pointer rounded p-1
         text-muted-foreground/80 transition-colors hover:text-yellow-600
  └── svg.lucide.lucide-star.size-4.transition-all
        .fill-yellow-500.text-yellow-600.dark:fill-yellow-400.dark:text-yellow-400
```

**Unfavorited (outline only):**
```
span[aria-label="Add to favorites"]
  class: group/star shrink-0 cursor-pointer rounded p-1
         text-muted-foreground/80 transition-colors hover:text-foreground
  └── svg.lucide.lucide-star.size-4.transition-all
        (no fill classes - uses default stroke)
```

---

## 8. All Models Extracted

### 8.1 From Favorites Tab (13 models)

| Model | Provider | Cost | Capabilities | Description |
|-------|----------|------|-------------|-------------|
| Kimi K2.5 | MoonshotAI | $·· (Low) | Vision, Coding | Native multimodal with visual coding |
| Kimi K2 (0905) | MoonshotAI | $$· (Medium) | Coding | Enhanced version with longer context |
| Nano Banana | Gemini | $$· (Medium) | Vision, Image Gen | Fast Image Generation, f.k.a. Gemini 2.5 Flash Image |
| Gemini 3 Pro | Gemini | $$$ (High) | Vision, Reasoning, Tool Use | Google's previous flagship with advanced reasoning |
| Claude Sonnet 4.5 | Anthropic | $$$ (High) | Vision, Reasoning, Tool Use | Anthropic's most advanced Sonnet yet |
| GPT-5 | OpenAI | $$· (Medium) | Vision, Reasoning, Tool Use | Next-generation intelligence for professional work |
| Gemini Imagen 4 | Gemini | $$· (Medium) | Image Gen | Google's advanced image generation model powered by Imagen 4 |
| Gemini Imagen 4 Ultra | Gemini | $$· (Medium) | Image Gen | Google's advanced image generation model powered by Imagen 4 Ultra |
| Gemini 2.5 Flash Lite | Gemini | ··· (Very Low) | Vision, Reasoning, Tool Use | Google's most cost-efficient Flash model |
| Claude 4 Sonnet | Anthropic | $$$ (High) | Vision, Reasoning, Tool Use | The sweet spot of capability and efficiency |
| GPT ImageGen | OpenAI | $$$+ (Very High) | Vision, Image Gen, Tool Use | OpenAI's previous image generation model |
| Gemini 2.5 Flash | Gemini | $·· (Low) | Vision, Reasoning, Tool Use | Upgraded speed with enhanced capabilities |
| Gemini 2.5 Pro | Gemini | $$$ (High) | Vision, Reasoning, Tool Use | Google's flagship for complex reasoning |

All 13 models are favorited (filled star).

### 8.2 From Z.ai Provider Tab (8 models)

| Model | Cost | Capabilities | NEW? | Selected? | Description |
|-------|------|-------------|------|-----------|-------------|
| **GLM 5V Turbo** | $$· (Medium) | Vision, Coding | YES | YES | Fast multimodal model for visual understanding and tool-assisted workflows |
| GLM 5 | $$· (Medium) | Coding | No | No | Flagship model with enhanced programming and stable multi-step execution |
| GLM 4.6V | $·· (Low) | Vision, Tool Use | No | No | Multimodal model for visual understanding, documents, and UI reconstruction |
| GLM 4.7 | $·· (Low) | Coding | No | No | Flagship model with enhanced programming and stable multi-step execution |
| GLM 4.6 | $·· (Low) | Coding | No | No | MoE model with superior coding capabilities |
| GLM 4.5V | $·· (Low) | Vision, Coding | No | No | Multimodal MoE model for visual understanding and coding tasks |
| GLM 4.5 Air | $·· (Low) | Coding | No | No | Lightweight variant optimized for coding |
| GLM 4.5 | $·· (Low) | Coding | No | No | Open-weight MoE model excelling at coding |

None of these models are favorited.

---

## 9. Interaction States Summary

| Element | Trigger | Classes Applied |
|---------|---------|----------------|
| Model item hover | Mouse over | `hover:bg-sidebar-accent/60 hover:duration-0` |
| Model item focus | Keyboard focus | `focus-visible:bg-sidebar-accent/40 focus-visible:ring-2 focus-visible:ring-primary/50` |
| Model item selected | Currently active model | `bg-sidebar-accent/80 shadow-sm` |
| Selected model name | Currently active model | Additional `text-foreground` on `<p>` |
| Provider button hover | Mouse over | `hover:bg-sidebar-accent/80` |
| Provider active | Selected tab | `opacity-100` on indicator bar, icon: `text-foreground opacity-100` |
| Provider inactive | Not selected tab | `opacity-0` on indicator bar, icon: `text-muted-foreground opacity-80` |
| Star hover (favorited) | Mouse over | `hover:text-yellow-600` |
| Star hover (unfavorited) | Mouse over | `hover:text-foreground` |
| Info button | Desktop only | `hidden md:block`, `hover:text-foreground` |
| Filter button | Mouse over | `hover:bg-muted/40`, `hover:text-foreground` |
| Transition base | All model items | `transition-all ease-snappy` |

---

## 10. Key Design Tokens / CSS Variables

- `--model-selector-gradient` - Background gradient for the dialog
- `--color` / `--color-dark` - CSS custom properties on capability badge containers for light/dark mode colors
- `bg-background/69` - Semi-transparent background with backdrop blur
- `bg-sidebar-accent/30` - Provider sidebar background
- `bg-sidebar-accent/80` - Selected model item background
- `border-chat-border` - Border color
- `ease-snappy` - Custom easing function for transitions
- `bg-gradient-noise-top` - Gradient used for the Z.ai sparkle badge background

---

## 11. Differences Between Favorites Tab and Provider Tab

| Aspect | Favorites Tab | Provider Tab |
|--------|--------------|--------------|
| Provider icon in model item | Yes (svg with `<title>`, `mr-1 inline-block size-4 text-muted-foreground/80`) | No |
| Description left padding | `ml-7` (accounts for icon width) | No `ml-7` |
| Active sidebar indicator | Star button `opacity-100` | Provider button `opacity-100` |
| Star icon fill (sidebar) | `fill="currentColor" stroke-width="1"` | Default unfilled |

---

## 12. Filter Menu

None of the three captured HTML files show the filter popover in an open state. The funnel icon button (`lucide-funnel`) is visible but no filter dropdown content was captured.

---

## 13. Radix Component Usage

- **Radix Popover**: The entire popup is a Radix Popover (`data-radix-popper-content-wrapper`)
- **Dialog role**: Content has `role="dialog"`
- **Tooltip wrappers**: Various elements use `data-state="closed"` / `data-state="delayed-open"` for Radix Tooltip integration
- **aria-controls**: Info buttons reference Radix dialog IDs (`aria-controls="radix-..."`)
- **aria-haspopup="dialog"**: Info button opens a dialog (model details)
