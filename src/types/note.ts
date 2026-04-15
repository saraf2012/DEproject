export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  pillTags: string[];
  tags: string[];
  favorite: boolean;
  archived: boolean;
  heroImageUrl: string | null;
  imageUrl: string | null;
  checklist: ChecklistItem[] | null;
  statusLabels: string[] | null;
  bodyHtml: string;
  editorBodyFontPx?: number;
  updatedAt: string;
  createdAt: string;
}

export interface NoteTemplate {
  id: string;
  label: string;
  category: string;
  title: string;
  bodyHtml: string;
  tags: string[];
}
