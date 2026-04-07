export interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
  hasReasoning?: boolean;
  reasoningContent?: string;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export const conversations: Conversation[] = [
  {
    id: "1",
    title: "Workspace Design Consultant Description",
    messages: [
      {
        role: "user",
        content:
          "Write a short job description for a workspace design consultant role at a mid-size architecture firm.",
      },
      {
        role: "assistant",
        content: `We're looking for a **Workspace Design Consultant** to join our studio and help clients reimagine how their teams work.

## Role Overview

You'll partner with architects, interior designers, and client stakeholders to translate business needs into spatial strategies. This is equal parts research, facilitation, and design thinking.

## Key Responsibilities

- Conduct **workplace assessments** including occupancy studies, employee surveys, and stakeholder interviews
- Develop space programming documents and adjacency diagrams
- Create **test-fit layouts** and scenario plans for hybrid, activity-based, and traditional work models
- Present design rationale to clients and guide them through change management
- Collaborate with project architects to ensure programming goals carry through to construction documents

## Qualifications

- 3-5 years of experience in workplace strategy, interior design, or facilities consulting
- Proficiency in **AutoCAD**, **Revit**, and diagramming tools (Miro, FigJam, etc.)
- Strong presentation and facilitation skills
- Understanding of current workplace trends: hybrid schedules, biophilic design, neurodiversity-inclusive spaces
- WELL AP or LEED GA certification is a plus

## What We Offer

Competitive salary, flexible hybrid schedule, professional development budget, and the chance to shape environments where people actually *want* to work.`,
        model: "Claude Sonnet 4",
      },
    ],
  },
  {
    id: "2",
    title: "Catan Box Insert Design with OpenSCAD",
    messages: [
      {
        role: "user",
        content: "what is this?",
        attachments: ["CatanBoxInsert.scad"],
      },
      {
        role: "assistant",
        content: `This is an **OpenSCAD file** that defines a **custom 3D-printable box insert** for the board game **Catan** (formerly "The Settlers of Catan").

## What It Does

The file contains parametric 3D modeling code that generates an organizer tray designed to fit inside the Catan game box. When rendered and 3D printed, it creates custom compartments for all the game's components.

## Key Components

- **Resource card holders** — Separated slots for each resource type (brick, lumber, ore, grain, wool)
- **Tile storage** — Hexagonal recesses sized for the terrain tiles
- **Token tray** — Circular wells for the number tokens
- **Player piece compartments** — Divided sections for settlements, cities, and roads in each player color
- **Development card slot** — A dedicated space for the development card deck
- **Robber holder** — A small recess for the robber piece

## How to Use

Open this file in \`OpenSCAD\`, adjust any parameters (like wall thickness or tolerances), render it, then export as \`STL\` for 3D printing. The parametric design lets you customize dimensions to match your specific printer and game edition.`,
        model: "Kimi K2.5 (Thinking)",
        hasReasoning: true,
        reasoningContent:
          'The user uploaded a file called **CatanBoxInsert.scad** and is asking what it is. This is an OpenSCAD file, which is a script-based 3D CAD modeling program. Based on the filename, this appears to be a design for a box insert for the board game Catan (formerly "The Settlers of Catan"). Box inserts are custom organizers that fit inside board game boxes to neatly store all the game components like tiles, cards, pieces, and tokens.\n\nLet me analyze the code to provide a detailed explanation of what this specific design creates — it likely defines compartments tailored to the various Catan game pieces including resource cards, development cards, hexagonal tiles, number tokens, the robber, settlements, cities, roads, and possibly the longest road/largest army cards.',
      },
    ],
  },
  {
    id: "3",
    title: "Ahmad Jalil CV Data in YAML Format",
    messages: [
      {
        role: "user",
        content:
          "I need to convert my CV into a structured YAML format that I can use as data for a personal portfolio website built with Astro. Here's the gist: Ahmad Jalil, based in Prince George BC, background in library science and clinical informatics, currently doing web dev and data work. Can you give me a starting template?",
      },
      {
        role: "assistant",
        content: `Here's a clean YAML structure you can drop into an Astro project (e.g., \`src/data/cv.yaml\`):

\`\`\`yaml
personal:
  name: Ahmad Jalil
  location: Prince George, BC, Canada
  title: Web Developer & Information Specialist
  email: ahmad@example.com
  website: https://ahmadjalil.com
  linkedin: https://linkedin.com/in/ahmadjalil
  summary: >
    Interdisciplinary professional bridging library science,
    clinical informatics, and modern web development. Passionate
    about making complex information accessible and useful.

experience:
  - role: Web Developer & Data Analyst
    org: Freelance / Contract
    period: 2023 - Present
    highlights:
      - Built data dashboards and internal tools for health organizations
      - Developed portfolio sites and landing pages using Astro, React, and Tailwind

  - role: Clinical Informatics Support
    org: Northern Health Authority
    period: 2021 - 2023
    highlights:
      - Supported EHR data quality initiatives
      - Created documentation and training materials for clinical staff

  - role: Library Technician
    org: University of Northern British Columbia
    period: 2018 - 2021
    highlights:
      - Managed digital collections and metadata standards
      - Delivered research workshops and reference services

education:
  - degree: MLIS (Library & Information Science)
    institution: University of Alberta
    year: 2020
  - degree: BSc (Health Sciences)
    institution: UNBC
    year: 2017

skills:
  technical:
    - TypeScript / JavaScript
    - React, Astro, Tailwind CSS
    - Python, SQL, YAML/JSON
    - Git, Linux, Docker
  domain:
    - Clinical informatics & EHR systems
    - Information architecture
    - Research data management
    - Digital preservation

certifications:
  - name: WELL AP
    year: 2022
  - name: Google Data Analytics Certificate
    year: 2023
\`\`\`

### How to use in Astro

Install the YAML loader if you haven't:

\`\`\`bash
npm install js-yaml @types/js-yaml
\`\`\`

Then in any \`.astro\` page:

\`\`\`astro
---
import yaml from "js-yaml";
import { readFileSync } from "fs";
const cv = yaml.load(readFileSync("src/data/cv.yaml", "utf8"));
---

<h1>{cv.personal.name}</h1>
<p>{cv.personal.summary}</p>
\`\`\`

Feel free to adjust the structure. YAML's nested format maps nicely to the component-driven layout you'd build in Astro.`,
        model: "GPT-5",
      },
      {
        role: "user",
        content:
          "This is great. Can you add a projects section with 3 sample entries?",
      },
      {
        role: "assistant",
        content: `Add this under the \`skills\` block:

\`\`\`yaml
projects:
  - name: Northern Health Data Dashboard
    url: https://github.com/ahmadjalil/nh-dashboard
    tech: [Python, Pandas, Plotly, Flask]
    description: >
      Interactive dashboard for visualizing regional health metrics.
      Used by program managers to track KPIs across Northern BC facilities.

  - name: UNBC Spark Lab Website
    url: https://sparklab.unbc.ca
    tech: [Astro, Tailwind CSS, MDX]
    description: >
      Marketing and documentation site for UNBC's innovation hub.
      Features event listings, project showcases, and a resource library.

  - name: t3.chat Rebuild
    url: https://github.com/ahmadjalil/t3-chat-rebuild
    tech: [React, TypeScript, Tailwind CSS, Vite]
    description: >
      Pixel-perfect rebuild of the t3.chat interface as a learning project.
      Implements sidebar navigation, model switching, and theme support.
\`\`\`

Each entry has enough structure that you can loop over them in an Astro component and render project cards with tech-stack badges.`,
        model: "GPT-5",
      },
    ],
  },
  {
    id: "6",
    title: "Landing Page for Cloud-Based Platform",
    messages: [
      {
        role: "user",
        content:
          "I'm building a landing page for a cloud-based project management platform called \"Nimbus\". It needs a hero section, features grid, pricing table, and a CTA. Can you outline the sections and suggest copy?",
      },
      {
        role: "assistant",
        content: `Here's a full landing page structure for **Nimbus** with section-by-section copy:

---

## Hero Section

**Headline:** Your projects, clear as the sky.

**Subheadline:** Nimbus is the project management platform that gives distributed teams a single source of truth — without the complexity.

**CTA buttons:**
- Primary: "Start free trial"
- Secondary: "See it in action" (links to demo video)

**Visual:** Abstract cloud/sky illustration with a floating dashboard mockup.

---

## Social Proof Bar

> "Nimbus replaced three tools for us. Onboarding took 20 minutes." — *Head of Ops, Meridian Labs*

Logos of 4-6 recognizable companies.

---

## Features Grid (2x3)

| Feature | Description |
|---|---|
| **Timeline View** | Drag-and-drop Gantt charts that update in real time across your team |
| **Smart Assignments** | AI suggests who should own a task based on workload and expertise |
| **Unified Inbox** | Every comment, mention, and update in one chronological feed |
| **Custom Dashboards** | Build reporting views with drag-and-drop widgets — no SQL required |
| **Integrations** | Native connections to Slack, GitHub, Figma, and 40+ more tools |
| **Audit Trail** | Full history of every change, decision, and approval for compliance |

---

## Pricing Table

| | **Starter** | **Team** | **Enterprise** |
|---|---|---|---|
| Price | Free | $12/user/mo | Custom |
| Projects | 5 | Unlimited | Unlimited |
| Storage | 1 GB | 50 GB | Unlimited |
| Integrations | 3 | All | All + custom |
| Support | Community | Priority email | Dedicated CSM |
| SSO | — | — | Yes |

---

## Final CTA Section

**Headline:** Ready to clear the fog?

**Body:** Join 2,000+ teams who shipped faster after switching to Nimbus. No credit card required.

**CTA button:** "Get started for free"

---

This structure follows a standard SaaS landing page pattern: hook them with the headline, build trust with social proof, show value through features, remove price objections, and close with urgency. Want me to write the actual HTML/Tailwind for any of these sections?`,
        model: "Claude Sonnet 4",
        hasReasoning: true,
        reasoningContent:
          "The user wants a landing page outline for a cloud-based PM tool called Nimbus. I should structure this as a practical guide with actual copywriting they can use directly, not just generic placeholder text. I'll cover the standard SaaS landing page sections: hero, social proof, features, pricing, and CTA. The copy should be concise, benefit-focused, and have the right tone — professional but not corporate.",
      },
    ],
  },
  {
    id: "11",
    title: "CSS template feedback for MacOSX Aqua",
    messages: [
      {
        role: "user",
        content:
          "I'm trying to recreate the classic Mac OS X Aqua look in CSS for a retro UI project. I've got the basic window chrome working but the buttons look flat and lifeless. How do I get that glossy gel-button effect from the early 2000s?",
      },
      {
        role: "assistant",
        content: `The Aqua gel buttons were all about **layered gradients and strategic highlights**. Here's the recipe:

\`\`\`css
.aqua-button {
  /* Base shape */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 20px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.35);
  font-family: "Lucida Grande", "Lucida Sans Unicode", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  /* The magic: layered gradients */
  background:
    /* Top highlight — the white "gel" shine */
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.75) 0%,
      rgba(255, 255, 255, 0.15) 48%,
      rgba(255, 255, 255, 0.0) 50%,
      rgba(255, 255, 255, 0.05) 100%
    ),
    /* Base color gradient */
    linear-gradient(
      180deg,
      #5ab0f5 0%,
      #2470d4 50%,
      #1a5cb8 100%
    );

  /* Depth with shadows */
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}

.aqua-button:active {
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.05) 48%,
      rgba(255, 255, 255, 0.0) 50%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    linear-gradient(
      180deg,
      #3a8cd4 0%,
      #1a5cb8 50%,
      #124a96 100%
    );
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1);
}
\`\`\`

## Key principles

1. **The highlight band** — The top gradient goes from bright white to transparent at exactly 50%. That sharp cutoff at the midpoint is what creates the "gel" illusion. It mimics light hitting a convex glass surface.

2. **The base gradient** — Goes from lighter at top to darker at bottom. The color shift should be subtle — two stops of the same hue at different lightness values.

3. **Inset shadows** — \`inset 0 1px 0 rgba(255,255,255,0.4)\` along the top edge adds the thin bright rim. The bottom inset shadow adds depth.

4. **Border** — A semi-transparent black border unifies the whole shape and separates it from any background.

5. **Active state** — Reduce the highlight opacity and darken the base gradient. Swap the outer drop-shadow for an inset shadow to make it look "pressed."

## For the striped title bar

If you want the brushed-metal or striped Aqua title bar, add a repeating gradient:

\`\`\`css
.aqua-titlebar {
  background:
    repeating-linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0px,
      rgba(255, 255, 255, 0.08) 1px,
      transparent 1px,
      transparent 2px
    ),
    linear-gradient(180deg, #d6d6d6 0%, #b0b0b0 100%);
  border-bottom: 1px solid #888;
  padding: 4px 8px;
  border-radius: 8px 8px 0 0;
}
\`\`\`

The 1px repeating stripe pattern on top of the base gradient gives that signature brushed appearance. Play with the opacity to dial in the look for your specific theme.`,
        model: "Claude Sonnet 4",
      },
      {
        role: "user",
        content:
          "That's perfect! The gel effect is spot on. What about the pulsing default button glow that Aqua had?",
      },
      {
        role: "assistant",
        content: `Classic Aqua feature. The default button would slowly pulse with a blue glow to draw attention. Here's how:

\`\`\`css
@keyframes aqua-pulse {
  0%, 100% {
    box-shadow:
      0 0 8px 2px rgba(50, 140, 255, 0.4),
      0 1px 3px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow:
      0 0 16px 6px rgba(50, 140, 255, 0.6),
      0 1px 3px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  }
}

.aqua-button--default {
  animation: aqua-pulse 2s ease-in-out infinite;
}

/* Stop pulsing on hover — Apple did this */
.aqua-button--default:hover {
  animation: none;
  box-shadow:
    0 0 12px 4px rgba(50, 140, 255, 0.5),
    0 1px 3px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}
\`\`\`

The key is the **2-second cycle** with \`ease-in-out\` timing. Apple's original was deliberately slow and smooth — it was meant to feel organic, almost like breathing. If you make it faster than ~1.5s, it feels anxious instead of inviting.

Also note: the pulse stops on hover. That's a nice touch Apple included — the button "acknowledges" your cursor by holding steady.`,
        model: "Claude Sonnet 4",
      },
    ],
  },
];

export function getConversationById(
  id: string
): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
