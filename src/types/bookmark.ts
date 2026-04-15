export type Bookmark = {
  id: string;
  title: string;
  url: string;
  favicon: string;
  description: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  visit_count: number;
  created_at: string;
  last_visited: string | null;
};
