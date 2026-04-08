
import { supabase } from './src/lib/supabase.js';

async function checkTable() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1);

  if (error) {
    console.log("TABLE_ERROR:", error.message);
  } else {
    console.log("TABLE_EXISTS");
  }
}

checkTable();
