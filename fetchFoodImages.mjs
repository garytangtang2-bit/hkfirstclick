/**
 * fetchFoodImages.mjs
 * Fetches Pexels images for each food & attractions item.
 * Priority: restaurant/place name first, fall back to must_try/image_keyword.
 * Saves photo_url directly into the JSON files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const PEXELS_KEY = envContent.match(/PEXELS_API_KEY=(.+)/)?.[1]?.trim();
if (!PEXELS_KEY) throw new Error('No PEXELS_API_KEY found');

const FOOD_DIR = path.join(__dirname, 'src/data/food');
const ATTR_DIR = path.join(__dirname, 'src/data/attractions');

// Force re-fetch these slugs (no photo_url yet)
const FORCE_SLUGS = process.argv[2] === '--all' ? null : [
  'rome','san-francisco','santorini','sapporo','seattle','seoul',
  'singapore','stockholm','taipei','tokyo','toronto','venice','vienna'
];

async function searchPexels(query) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
    const json = await res.json();
    return json.photos?.[0]?.src?.medium ?? null;
  } catch {
    return null;
  }
}

async function processFile(filePath, getQueries, forceAll = false) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw.startsWith('{')) return false;

  const data = JSON.parse(raw);
  const enItems = data.translations?.en?.items;
  if (!enItems?.length) return false;

  let changed = false;

  for (const item of enItems) {
    if (!forceAll && item.photo_url?.includes('pexels.com')) continue;

    const { primary, fallback } = getQueries(item);

    let url = await searchPexels(primary);
    if (!url) url = await searchPexels(fallback);

    if (url) {
      item.photo_url = url;
      changed = true;
    }

    await new Promise(r => setTimeout(r, 80));
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  }
  return false;
}

async function main() {
  const foodFiles = fs.readdirSync(FOOD_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => !FORCE_SLUGS || FORCE_SLUGS.includes(f.replace('.json','')))
    .filter(f => fs.readFileSync(path.join(FOOD_DIR, f), 'utf8').trim().startsWith('{'));

  const attrFiles = fs.readdirSync(ATTR_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => !FORCE_SLUGS || FORCE_SLUGS.includes(f.replace('.json','')))
    .filter(f => fs.readFileSync(path.join(ATTR_DIR, f), 'utf8').trim().startsWith('{'));

  console.log(`Processing food:${foodFiles.length} attr:${attrFiles.length}`);

  const allTasks = [
    ...foodFiles.map(f => ({
      filePath: path.join(FOOD_DIR, f), slug: f.replace('.json',''), type: 'food',
      getQueries: (item) => ({ primary: item.name, fallback: item.must_try + ' food' }),
    })),
    ...attrFiles.map(f => ({
      filePath: path.join(ATTR_DIR, f), slug: f.replace('.json',''), type: 'attr',
      getQueries: (item) => ({ primary: item.name, fallback: item.image_keyword }),
    })),
  ];

  const BATCH = 20;
  for (let i = 0; i < allTasks.length; i += BATCH) {
    const batch = allTasks.slice(i, i + BATCH);
    await Promise.all(batch.map(async ({ filePath, slug, type, getQueries }) => {
      process.stdout.write(`[${type}:${slug}] `);
      const saved = await processFile(filePath, getQueries, true);
      process.stdout.write(saved ? '✓\n' : 'skip\n');
    }));
  }

  console.log('\nDone!');
}

main().catch(console.error);
