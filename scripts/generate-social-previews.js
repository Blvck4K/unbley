import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing. Check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generatePreviews() {
  console.log('🚀 Starting Social Preview Generation...');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Did you run "npm run build" first?');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  // 1. Fetch Blog Posts
  console.log('📝 Fetching blog posts...');
  // Note: meta_title doesn't exist in schema, meta_description does. Fallback to title/excerpt.
  const { data: posts, error: blogError } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, cover_image_url, meta_description');

  if (blogError) {
    console.error('❌ Error fetching blog posts:', blogError);
  } else if (!posts || posts.length === 0) {
    console.warn('⚠️ No blog posts found in database.');
  } else {
    for (const post of posts) {
      const title = post.title;
      const description = post.meta_description || post.excerpt || '';
      const image = post.cover_image_url || 'https://zizzystores.com/og-default.jpg';
      const url = `https://zizzystores.com/blog/${post.slug}`;
      const folderPath = path.join(distDir, 'blog', post.slug);

      injectMeta(folderPath, template, { title, description, image, url });
    }
    console.log(`✅ Generated ${posts.length} blog previews.`);
  }

  // Brand profiles are skipped for now as the schema is unclear about the slug/username field.
  // We prioritize Fixing Blog Previews as requested.

  console.log('🎊 Social Preview Generation Complete!');
}

function injectMeta(folderPath, template, data) {
  // Ensure directory exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  let html = template;

  // Simple clean for description
  const cleanDesc = (data.description || '').replace(/<[^>]*>/g, '').substring(0, 160).trim();
  const fullTitle = `${data.title} | ZizzyStores`;

  // Inject/Replace Meta Tags using regex
  const replacements = [
    { regex: /<title>.*?<\/title>/, replacement: `<title>${fullTitle}</title>` },
    { regex: /<meta property="og:title" content=".*?"\s*\/?>/, replacement: `<meta property="og:title" content="${fullTitle}" />` },
    { regex: /<meta property="og:description" content=".*?"\s*\/?>/, replacement: `<meta property="og:description" content="${cleanDesc}" />` },
    { regex: /<meta property="og:image" content=".*?"\s*\/?>/, replacement: `<meta property="og:image" content="${data.image}" />` },
    { regex: /<meta property="og:url" content=".*?"\s*\/?>/, replacement: `<meta property="og:url" content="${data.url}" />` },
    { regex: /<meta name="description" content=".*?"\s*\/?>/, replacement: `<meta name="description" content="${cleanDesc}" />` },
    { regex: /<meta name="twitter:title" content=".*?"\s*\/?>/, replacement: `<meta name="twitter:title" content="${fullTitle}" />` },
    { regex: /<meta name="twitter:description" content=".*?"\s*\/?>/, replacement: `<meta name="twitter:description" content="${cleanDesc}" />` },
    { regex: /<meta name="twitter:image" content=".*?"\s*\/?>/, replacement: `<meta name="twitter:image" content="${data.image}" />` },
    { regex: /<meta property="og:type" content=".*?"\s*\/?>/, replacement: `<meta property="og:type" content="article" />` },
    { regex: /<meta property="fb:app_id" content=".*?"\s*\/?>/, replacement: `<meta property="fb:app_id" content="${process.env.VITE_FB_APP_ID}" />` },
    { regex: /<link rel="canonical" href=".*?"\s*\/?>/, replacement: `<link rel="canonical" href="${data.url}" />` }
  ];

  replacements.forEach(({ regex, replacement }) => {
    if (html.match(regex)) {
      html = html.replace(regex, replacement);
    } else {
      // If tag not found, inject it before </head>
      html = html.replace('</head>', `${replacement}\n</head>`);
    }
  });

  fs.writeFileSync(path.join(folderPath, 'index.html'), html);
}

generatePreviews().catch(err => {
  console.error('💥 Fatal error during preview generation:', err);
  process.exit(1);
});
