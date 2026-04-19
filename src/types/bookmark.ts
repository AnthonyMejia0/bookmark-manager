export type Bookmark = {
  id: string;
  title: string;
  url: string;
  favicon: string;
  description: string;
  pinned: boolean;
  archived: boolean;
  visit_count: number;
  created_at: string;
  last_visited: string | null;
  user_id: string;
  tags: string[];
};

export type BookmarkPost = {
  title: string;
  url: string;
  favicon: string;
  description: string;
  user_id: string;
  tags: string[];
};

export type BookmarkTag = {
  bookmark_id: string;
  tag_id: string;
};

export type BookmarkPut = {
  id: string;
  title?: string;
  url?: string;
  description?: string;
  tags?: string[];
  pin?: boolean;
  archive?: boolean;
  visit_count?: number;
};
