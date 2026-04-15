import { createClient } from '@supabase/supabase-js';
import data from '../data/bookmarks.json';
import { UUID } from 'crypto';

const supabase = createClient(
  'https://wxxkqsdkthmjltjrsgrd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4eGtxc2RrdGhtamx0anJzZ3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTk2MDQwMywiZXhwIjoyMDkxNTM2NDAzfQ.EYBttVnf_suhb78wcqEE4CSQqGuac0NwVhBm7gP9lrs',
);

// normalize tag names (important for consistency)
const normalize = (tag: string) => tag.trim().toLowerCase();

async function seed() {
  console.log('🌱 Seeding database...');

  const allTags = new Set<string>();

  // 1. collect all unique tags
  for (const bm of data.bookmarks) {
    bm.tags.forEach((t) => allTags.add(normalize(t)));
  }

  // 2. insert tags
  const tagMap = new Map<string, string>(); // name -> id

  const { data: insertedTags, error: tagError } = await supabase
    .from('tags')
    .insert(
      Array.from(allTags).map((name) => ({
        name,
      })),
    )
    .select();

  if (tagError) {
    console.error('Tag insert error:', tagError);
    return;
  }

  for (const t of insertedTags ?? []) {
    tagMap.set(t.name, t.id);
  }

  const userId: UUID = '44926537-0a87-4098-a75d-57f833e6b9c5';
  // 3. insert bookmarks
  for (const bm of data.bookmarks) {
    const { data: insertedBookmark, error: bmError } = await supabase
      .from('bookmarks')
      .insert({
        title: bm.title,
        url: bm.url,
        favicon: bm.favicon,
        description: bm.description,
        pinned: bm.pinned,
        archived: bm.isArchived,
        visit_count: bm.visitCount,
        created_at: bm.createdAt,
        last_visited: bm.lastVisited,
        user_id: userId,
      })
      .select()
      .single();

    if (bmError) {
      console.error('Bookmark insert error:', bmError);
      continue;
    }

    // 4. insert into junction table
    const relations = bm.tags.map((tag) => {
      const normalized = normalize(tag);

      return {
        bookmark_id: insertedBookmark.id,
        tag_id: tagMap.get(normalized),
      };
    });

    const { error: relError } = await supabase
      .from('bookmark_tags')
      .insert(relations);

    if (relError) {
      console.error('Relation insert error:', relError);
    }
  }

  console.log('✅ Seeding complete');
}

seed();
