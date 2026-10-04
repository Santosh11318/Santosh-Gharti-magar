import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const routes = [
  'free-tools',
  'free-tools/seo-score-checker',
  'free-tools/website-cost-calculator',
  'free-tools/meta-tag-generator',
  'free-tools/blog-title-generator',
  'free-tools/social-bio-generator',
  'free-tools/hashtag-generator',
  'free-tools/qr-code-generator',
  'free-tools/profit-margin-calculator',
  'free-tools/gst-calculator',
  'free-tools/image-compressor'
];

const indexHtml = fs.readFileSync(indexPath, 'utf-8');

// 1. Create 404.html in dist for fallback
fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);
console.log('Created dist/404.html');

// 2. Create static directories and index.html for each tool route
for (const route of routes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml);
  console.log(`Created ${route}/index.html`);
}

console.log('Successfully pre-generated all static routes for GitHub Pages deployment!');
