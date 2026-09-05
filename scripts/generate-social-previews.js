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
const fbAppId = process.env.VITE_FB_APP_ID || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Skipping social preview generation.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generatePreviews() {
  console.log('🚀 Starting Social Preview Generation (Refined v3)...');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Did you run "npm run build" first?');
    process.exit(1);
  }

  // Read template and inject OpenGraph namespace prefix into <html>
  let template = fs.readFileSync(templatePath, 'utf8');
  if (template.includes('<html') && !template.includes('prefix=')) {
    template = template.replace('<html', '<html prefix="og: https://ogp.me/ns#"');
  }

  // 1. Fetch Blog Posts
  console.log('📝 Fetching blog posts...');
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
      const image = post.cover_image_url || 'https://unbley.com/og-default.jpg';
      const url = `https://unbley.com/blog/${post.slug}`;
      const folderPath = path.join(distDir, 'blog', post.slug);

      injectMeta(folderPath, template, { title, description, image, url });
    }
    console.log(`✅ Generated ${posts.length} blog previews.`);
  }

  console.log('🎊 Social Preview Generation Complete!');
}

function injectMeta(folderPath, template, data) {
  // Ensure directory exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  let html = template;

  // Simple clean for description and title (remove HTML and handle non-ASCII characters)
  const cleanString = (str) => (str || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u2018\u2019]/g, "'") // Smart quotes to straight quotes
    .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
    .replace(/[\u2013\u2014]/g, '-') // Em/En dashes to hyphen
    .replace(/\s+/g, ' ')
    .trim();

  const cleanDesc = cleanString(data.description).substring(0, 160);
  const cleanTitle = cleanString(data.title);
  const fullTitle = `${cleanTitle} | Unbley`;

  // Inject/Replace Meta Tags using regex
  // We use exactly 1678x937 for these specific blog images
  const replacements = [
    { regex: /<title>.*?<\/title>/, replacement: `<title>${fullTitle}</title>` },
    { regex: /<meta property="og:title" content=".*?"\s*\/?>/, replacement: `<meta property="og:title" content="${fullTitle}" />` },
    { regex: /<meta property="og:description" content=".*?"\s*\/?>/, replacement: `<meta property="og:description" content="${cleanDesc}" />` },
    { regex: /<meta property="og:image" content=".*?"\s*\/?>/, replacement: `<meta property="og:image" content="${data.image}" />` },
    { regex: /<meta property="og:image:secure_url" content=".*?"\s*\/?>/, replacement: `<meta property="og:image:secure_url" content="${data.image}" />` },
    { regex: /<meta property="og:image:type" content=".*?"\s*\/?>/, replacement: `<meta property="og:image:type" content="image/png" />` },
    { regex: /<meta property="og:image:width" content=".*?"\s*\/?>/, replacement: `<meta property="og:image:width" content="1678" />` },
    { regex: /<meta property="og:image:height" content=".*?"\s*\/?>/, replacement: `<meta property="og:image:height" content="937" />` },
    { regex: /<meta property="og:image:alt" content=".*?"\s*\/?>/, replacement: `<meta property="og:image:alt" content="${fullTitle}" />` },
    { regex: /<meta property="og:url" content=".*?"\s*\/?>/, replacement: `<meta property="og:url" content="${data.url}" />` },
    { regex: /<meta property="og:type" content=".*?"\s*\/?>/, replacement: `<meta property="og:type" content="article" />` },
    { regex: /<meta property="fb:app_id" content=".*?"\s*\/?>/, replacement: `<meta property="fb:app_id" content="${fbAppId}" />` },
    { regex: /<meta name="description" content=".*?"\s*\/?>/, replacement: `<meta name="description" content="${cleanDesc}" />` },
    { regex: /<meta name="twitter:title" content=".*?"\s*\/?>/, replacement: `<meta name="twitter:title" content="${fullTitle}" />` },
    { regex: /<meta name="twitter:description" content=".*?"\s*\/?>/, replacement: `<meta name="twitter:description" content="${cleanDesc}" />` },
    { regex: /<meta name="twitter:image" content=".*?"\s*\/?>/, replacement: `<meta name="twitter:image" content="${data.image}" />` },
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
