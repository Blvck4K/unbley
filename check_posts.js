
import { supabase } from './src/lib/supabase.js';

async function checkPostsTable() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(1);

  if (error) {
    console.log("POSTS_TABLE_ERROR:", error.message);
  } else {
    console.log("POSTS_TABLE_EXISTS. Data:", data);
  }
}

checkPostsTable();
