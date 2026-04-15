import type { Note } from "@/types/note";

export const DEFAULT_EDITOR_BODY_HTML = `
<p>In an age of infinite digital noise, the act of writing becomes a sacred retrieval of self. This space is designed not just for utility, but for the quiet resonance of thought. We believe that clarity follows space, and elegance follows restraint.</p>
<p>Traditional note-taking tools treat your thoughts like data points to be managed. Here, they are artifacts to be curated. The interface recedes. The borders vanish. All that remains is the vellum of the screen and the rhythm of your keys.</p>
`;

const workspaceImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZFEJQgqngppwi_tmQHJwF9zL1S9dWTJwCdcaQA1C05gdgOVdXmWDAr8rohSlxG9oTRNBNC27FbYMFTFzmGPqUjWg02jZDLPa2UDEgMne4GMIWRvC7xb085l4or0RpcTVhQe5wouT4KqQubhtEXL4QPLI5KCfgMrS6GFs7vgLoLWQWHUpJheXbJcUFtVwfToJgd1JI4ysbFmkgl49Pju0RCHJGGFtjI0wLzhvvEkt6tDowxKqQMuPazTYC7e9vrLB8WUWpIYa6MSU";

const penImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBlKI08_qOZJoxoCXaJ8NXd1WZhyarEPsEocFIgCMEDGry82VoOEzxzYoO3kjk1rxyGtkO3nYlx8znhPZp59edRH5cNA_yeTEfd3VYw3MIKMt9KoDdXCw9eIwXqnnEJyjUfwsCYSQF2A7eIkRsztn_i73JYT4D-Qihi0_VQ6GXS65jLvUCjwW5XMXgd1HBzrBK4hReIM-qp2r73sBAcX5Q9Q2vBV54No_8uOLxgFevrC0JNdLwizgqecMelgUacImbWnLN0fzFrCgg";

export const PHILOSOPHY_BODY_HTML = `
<p class="text-xl font-body text-on-surface/80 leading-relaxed mb-8 font-light italic border-l-4 border-primary/20 pl-6">
"Simplicity is the ultimate sophistication. When the environment is silent, the mind can finally speak."
</p>
<p class="text-lg font-body text-on-surface leading-[1.8] mb-6">
The essence of a curated workspace isn't about what you add, but what you have the courage to remove. In this note, I explore how spatial minimalism directly correlates to cognitive load reduction.
</p>
<h3 class="text-2xl font-headline font-bold text-on-surface mt-10 mb-4">Core Principles</h3>
<ul class="space-y-4 mb-8">
<li class="flex items-start gap-4">
<span class="material-symbols-outlined text-primary mt-1">check_circle</span>
<span class="text-lg">Visual Silence: Reducing ocular distractions to maintain deep focus states.</span>
</li>
<li class="flex items-start gap-4">
<span class="material-symbols-outlined text-primary mt-1">check_circle</span>
<span class="text-lg">Tactile Quality: Prioritizing the feel of materials (paper, wood, metal) over sheer volume of tools.</span>
</li>
<li class="flex items-start gap-4">
<span class="material-symbols-outlined text-primary mt-1">check_circle</span>
<span class="text-lg">Intentional Lighting: Using natural gradients to signal time-blocks for work and rest.</span>
</li>
</ul>
<p class="text-lg font-body text-on-surface leading-[1.8]">
As we move further into a digital-first existence, the physical sanctuary becomes the anchor. It is the canvas upon which our most complex thoughts are painted. Without it, we are simply reacting to the noise.
</p>
`;

function isoHoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

function isoDaysAgo(d: number): string {
  return new Date(Date.now() - d * 86400 * 1000).toISOString();
}

export function createSeedNotes(): Note[] {
  return [
    {
      id: "seed-1",
      title: "Designing the Digital Vellum: A Thesis on Editorial Interfaces",
      excerpt:
        "The interface should recede as the user begins to engage. We aren't building a tool; we are crafting a space. The use of white space should be functional—creating breath and cognitive ease for high-value thought...",
      category: "Deep Work",
      pillTags: ["Philosophy", "Design"],
      tags: ["architecture", "inspiration"],
      favorite: false,
      archived: false,
      heroImageUrl: workspaceImg,
      imageUrl: null,
      checklist: null,
      statusLabels: null,
      bodyHtml: PHILOSOPHY_BODY_HTML,
      updatedAt: isoHoursAgo(2),
      createdAt: isoDaysAgo(30),
    },
    {
      id: "seed-2",
      title: "Quiet Morning Rituals",
      excerpt:
        "Coffee at 6 AM, no screens for the first 90 minutes. Reading paper books only to recalibrate focus.",
      category: "Inspiration",
      pillTags: [],
      tags: ["ritual"],
      favorite: true,
      archived: false,
      heroImageUrl: null,
      imageUrl: null,
      checklist: null,
      statusLabels: null,
      bodyHtml: DEFAULT_EDITOR_BODY_HTML.trim(),
      updatedAt: isoDaysAgo(1),
      createdAt: isoDaysAgo(14),
    },
    {
      id: "seed-3",
      title: "Client Presentation Checklist",
      excerpt: "",
      category: "Projects",
      pillTags: [],
      tags: ["work"],
      favorite: false,
      archived: false,
      heroImageUrl: null,
      imageUrl: null,
      checklist: [
        { text: "High-fidelity prototypes", done: false },
        { text: "Moodboards for lighting", done: true },
      ],
      statusLabels: null,
      bodyHtml: "<p>Run-through checklist before the client sync.</p>",
      updatedAt: isoDaysAgo(1),
      createdAt: isoDaysAgo(5),
    },
    {
      id: "seed-4",
      title: "Tactile Feedback in UI",
      excerpt: 'Study on how haptic patterns influence perceived digital "weight".',
      category: "Research",
      pillTags: [],
      tags: ["research", "ux"],
      favorite: false,
      archived: false,
      heroImageUrl: null,
      imageUrl: penImg,
      checklist: null,
      statusLabels: null,
      bodyHtml: "<p>Notes on perceived weight and rhythm in interaction design.</p>",
      updatedAt: new Date("2026-03-12T12:00:00Z").toISOString(),
      createdAt: isoDaysAgo(60),
    },
    {
      id: "seed-5",
      title: "Aura Notes V2 Roadmap",
      excerpt:
        "Quarterly objectives focusing on collaborative spaces without compromising the minimalist solitude of the editor experience.",
      category: "Strategy",
      pillTags: [],
      tags: ["roadmap"],
      favorite: false,
      archived: false,
      heroImageUrl: null,
      imageUrl: null,
      checklist: null,
      statusLabels: ["Draft", "Confidential"],
      bodyHtml: "<p>Planning themes for the next release cycle.</p>",
      updatedAt: new Date("2026-03-10T12:00:00Z").toISOString(),
      createdAt: isoDaysAgo(90),
    },
  ];
}
