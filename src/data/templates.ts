import type { NoteTemplate } from "@/types/note";

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: "meeting",
    label: "Meeting",
    category: "Meeting",
    title: "Meeting notes",
    bodyHtml: `<p><strong>Attendees:</strong> </p>
<p><strong>Agenda:</strong></p>
<ul><li></li></ul>
<p><strong>Discussion:</strong></p>
<p><br></p>
<p><strong>Action items:</strong></p>
<ul><li></li></ul>`,
    tags: ["meeting"],
  },
  {
    id: "study",
    label: "Study",
    category: "Study",
    title: "Study session",
    bodyHtml: `<p><strong>Topic:</strong> </p>
<p><strong>Key ideas:</strong></p>
<ul><li></li></ul>
<p><strong>Questions:</strong></p>
<p><br></p>
<p><strong>Summary:</strong></p>
<p><br></p>`,
    tags: ["study"],
  },
  {
    id: "journal",
    label: "Journal",
    category: "Journal",
    title: "Journal entry",
    bodyHtml: `<p><strong>Today:</strong></p>
<p><br></p>
<p><strong>Grateful for:</strong></p>
<p><br></p>
<p><strong>Focus tomorrow:</strong></p>
<p><br></p>`,
    tags: ["journal"],
  },
];
