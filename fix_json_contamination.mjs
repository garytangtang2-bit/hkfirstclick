import fs from 'fs';
import path from 'path';

const DESTINATIONS_DIR = 'D:/hkfirstclick/src/data/destinations';

// CJK range: \u4e00-\u9fff (CJK Unified Ideographs)
// Also include extended CJK and other CJK blocks
function countCJK(str) {
  if (!str) return 0;
  const matches = str.match(/[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/g);
  return matches ? matches.length : 0;
}

function cjkRatio(str) {
  if (!str || str.length === 0) return 0;
  return countCJK(str) / str.length;
}

function stripCJK(str) {
  if (!str) return str;
  // Remove CJK characters
  let result = str.replace(/[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/g, '');
  // Clean up: remove double spaces, fix spacing around punctuation
  result = result.replace(/  +/g, ' ');
  result = result.replace(/ ([,.:;!?])/g, '$1');
  result = result.trim();
  return result;
}

// Get a nested field from an object using a path array
function getNestedField(obj, pathArr) {
  let current = obj;
  for (const key of pathArr) {
    if (current === null || current === undefined) return undefined;
    if (typeof key === 'number') {
      current = current[key];
    } else {
      current = current[key];
    }
  }
  return current;
}

// Set a nested field in an object using a path array
function setNestedField(obj, pathArr, value) {
  let current = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    current = current[pathArr[i]];
  }
  current[pathArr[pathArr.length - 1]] = value;
}

// Parse field path like ".translations.id.daily_itinerary[0].day_title"
// into array of keys/indices
function parsePath(pathStr) {
  // Remove leading dot
  const cleaned = pathStr.startsWith('.') ? pathStr.slice(1) : pathStr;
  const parts = [];
  const regex = /([^.[]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    if (match[1] !== undefined) {
      parts.push(match[1]);
    } else if (match[2] !== undefined) {
      parts.push(parseInt(match[2], 10));
    }
  }
  return parts;
}

// Convert a translation path to the equivalent English path
// e.g. ["translations","id","daily_itinerary",0,"day_title"]
// -> ["translations","en","daily_itinerary",0,"day_title"]
function toEnglishPath(pathArr) {
  const result = [...pathArr];
  // Replace the language code (index 1 in translations.XX...) with 'en'
  if (result[0] === 'translations' && result.length > 2) {
    result[1] = 'en';
  }
  return result;
}

// The contaminated fields list
const CONTAMINATED_FIELDS = [
  // amsterdam.json
  { file: 'amsterdam.json', lang: 'id', path: '.translations.id.daily_itinerary[0].day_title' },
  { file: 'amsterdam.json', lang: 'id', path: '.translations.id.daily_itinerary[1].day_title' },
  { file: 'amsterdam.json', lang: 'id', path: '.translations.id.daily_itinerary[2].day_title' },
  { file: 'amsterdam.json', lang: 'id', path: '.translations.id.daily_itinerary[3].day_title' },
  { file: 'amsterdam.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[1].practical_tip' },
  { file: 'amsterdam.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[1].practical_tip' },
  { file: 'amsterdam.json', lang: 'bn', path: '.translations.bn.daily_itinerary[3].activities[1].rich_description' },
  // athens.json
  { file: 'athens.json', lang: 'bn', path: '.translations.bn.hero_section.hook_intro' },
  // auckland.json
  { file: 'auckland.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].rich_description' },
  { file: 'auckland.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[1].rich_description' },
  // bali-kuta.json
  { file: 'bali-kuta.json', lang: 'hi', path: '.translations.hi.daily_itinerary[3].activities[0].practical_tip' },
  { file: 'bali-kuta.json', lang: 'ru', path: '.translations.ru.daily_itinerary[0].activities[2].rich_description' },
  // bangkok.json
  { file: 'bangkok.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[1].practical_tip' },
  { file: 'bangkok.json', lang: 'ru', path: '.translations.ru.hero_section.hook_intro' },
  // barcelona.json
  { file: 'barcelona.json', lang: 'es', path: '.translations.es.daily_itinerary[1].day_title' },
  { file: 'barcelona.json', lang: 'es', path: '.translations.es.daily_itinerary[2].day_title' },
  { file: 'barcelona.json', lang: 'es', path: '.translations.es.daily_itinerary[3].day_title' },
  { file: 'barcelona.json', lang: 'es', path: '.translations.es.daily_itinerary[4].day_title' },
  { file: 'barcelona.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].rich_description' },
  { file: 'barcelona.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'barcelona.json', lang: 'ar', path: '.translations.ar.seo_meta.description' },
  { file: 'barcelona.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[0].rich_description' },
  { file: 'barcelona.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'barcelona.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].rich_description' },
  { file: 'barcelona.json', lang: 'bn', path: '.translations.bn.daily_itinerary[1].activities[0].rich_description' },
  // berlin.json
  { file: 'berlin.json', lang: 'en', path: '.translations.en.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'fr', path: '.translations.fr.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'es', path: '.translations.es.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'id', path: '.translations.id.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'pt', path: '.translations.pt.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'ar', path: '.translations.ar.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[0].rich_description' },
  { file: 'berlin.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[1].rich_alternative' },
  { file: 'berlin.json', lang: 'ru', path: '.translations.ru.daily_itinerary[2].activities[1].rich_alternative' },
  // brussels.json
  { file: 'brussels.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[0].practical_tip' },
  // cairo.json
  { file: 'cairo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].practical_tip' },
  // chicago.json
  { file: 'chicago.json', lang: 'bn', path: '.translations.bn.hero_section.hook_intro' },
  { file: 'chicago.json', lang: 'ru', path: '.translations.ru.hero_section.hook_intro' },
  { file: 'chicago.json', lang: 'ru', path: '.translations.ru.daily_itinerary[1].activities[0].rich_description' },
  // copenhagen.json
  { file: 'copenhagen.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[0].rich_description' },
  { file: 'copenhagen.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].day_title' },
  // dubai.json
  { file: 'dubai.json', lang: 'hi', path: '.translations.hi.daily_itinerary[3].activities[0].practical_tip' },
  // edinburgh.json
  { file: 'edinburgh.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'edinburgh.json', lang: 'ru', path: '.translations.ru.daily_itinerary[1].day_title' },
  // florence.json
  { file: 'florence.json', lang: 'bn', path: '.translations.bn.hero_section.hook_intro' },
  // fukuoka.json
  { file: 'fukuoka.json', lang: 'hi', path: '.translations.hi.hero_section.hook_intro' },
  { file: 'fukuoka.json', lang: 'ru', path: '.translations.ru.daily_itinerary[0].activities[1].practical_tip' },
  { file: 'fukuoka.json', lang: 'ru', path: '.translations.ru.daily_itinerary[1].activities[0].rich_description' },
  // hakone.json
  { file: 'hakone.json', lang: 'hi', path: '.translations.hi.hero_section.hook_intro' },
  { file: 'hakone.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].rich_description' },
  { file: 'hakone.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].day_title' },
  { file: 'hakone.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[1].practical_tip' },
  { file: 'hakone.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[2].spot_name' },
  { file: 'hakone.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[2].rich_description' },
  { file: 'hakone.json', lang: 'bn', path: '.translations.bn.daily_itinerary[1].activities[1].practical_tip' },
  { file: 'hakone.json', lang: 'bn', path: '.translations.bn.daily_itinerary[1].activities[2].spot_name' },
  // hongkong.json
  { file: 'hongkong.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[1].practical_tip' },
  { file: 'hongkong.json', lang: 'pt', path: '.translations.pt.daily_itinerary[1].activities[0].rich_description' },
  { file: 'hongkong.json', lang: 'bn', path: '.translations.bn.hero_section.hook_intro' },
  { file: 'hongkong.json', lang: 'bn', path: '.translations.bn.daily_itinerary[1].activities[0].rich_description' },
  { file: 'hongkong.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[1].rich_description' },
  { file: 'hongkong.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[2].rich_description' },
  { file: 'hongkong.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[2].practical_tip' },
  // kuala-lumpur.json
  { file: 'kuala-lumpur.json', lang: 'ar', path: '.translations.ar.daily_itinerary[0].activities[2].rich_description' },
  { file: 'kuala-lumpur.json', lang: 'ar', path: '.translations.ar.daily_itinerary[1].activities[1].rich_description' },
  // kyoto.json
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].day_title' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[1].practical_tip' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].day_title' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[0].rich_description' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[2].rich_description' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[2].practical_tip' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].day_title' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[0].practical_tip' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[2].spot_name' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[2].rich_description' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[2].practical_tip' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[3].day_title' },
  { file: 'kyoto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[3].activities[2].practical_tip' },
  { file: 'kyoto.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].practical_tip' },
  { file: 'kyoto.json', lang: 'bn', path: '.translations.bn.daily_itinerary[3].activities[2].practical_tip' },
  // las-vegas.json
  { file: 'las-vegas.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[1].practical_tip' },
  { file: 'las-vegas.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[2].practical_tip' },
  // lisbon.json
  { file: 'lisbon.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].practical_tip' },
  // london.json
  { file: 'london.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[2].practical_tip' },
  { file: 'london.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[0].practical_tip' },
  { file: 'london.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].practical_tip' },
  // los-angeles.json
  { file: 'los-angeles.json', lang: 'hi', path: '.translations.hi.daily_itinerary[4].activities[2].rich_description' },
  // madrid.json
  { file: 'madrid.json', lang: 'id', path: '.translations.id.daily_itinerary[3].activities[0].rich_description' },
  { file: 'madrid.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'madrid.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[0].practical_tip' },
  { file: 'madrid.json', lang: 'ar', path: '.translations.ar.seo_meta.description' },
  { file: 'madrid.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'madrid.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[0].practical_tip' },
  { file: 'madrid.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[1].rich_description' },
  // marrakesh.json
  { file: 'marrakesh.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[0].practical_tip' },
  { file: 'marrakesh.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[0].rich_description' },
  { file: 'marrakesh.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[1].rich_description' },
  // melbourne.json
  { file: 'melbourne.json', lang: 'hi', path: '.translations.hi.daily_itinerary[3].activities[2].practical_tip' },
  { file: 'melbourne.json', lang: 'bn', path: '.translations.bn.daily_itinerary[3].activities[2].practical_tip' },
  // munich.json
  { file: 'munich.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[2].rich_description' },
  { file: 'munich.json', lang: 'hi', path: '.translations.hi.daily_itinerary[3].activities[0].practical_tip' },
  { file: 'munich.json', lang: 'bn', path: '.translations.bn.daily_itinerary[3].activities[0].practical_tip' },
  // new-york.json
  { file: 'new-york.json', lang: 'hi', path: '.translations.hi.daily_itinerary[1].activities[1].rich_description' },
  { file: 'new-york.json', lang: 'hi', path: '.translations.hi.daily_itinerary[5].activities[2].practical_tip' },
  { file: 'new-york.json', lang: 'ar', path: '.translations.ar.daily_itinerary[0].day_title' },
  { file: 'new-york.json', lang: 'ar', path: '.translations.ar.daily_itinerary[1].day_title' },
  { file: 'new-york.json', lang: 'ar', path: '.translations.ar.daily_itinerary[2].day_title' },
  { file: 'new-york.json', lang: 'ar', path: '.translations.ar.daily_itinerary[3].day_title' },
  { file: 'new-york.json', lang: 'ar', path: '.translations.ar.daily_itinerary[4].day_title' },
  { file: 'new-york.json', lang: 'ar', path: '.translations.ar.daily_itinerary[5].day_title' },
  { file: 'new-york.json', lang: 'ar', path: '.translations.ar.daily_itinerary[6].day_title' },
  // okinawa.json
  { file: 'okinawa.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[0].rich_description' },
  // osaka.json
  { file: 'osaka.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[2].spot_name' },
  { file: 'osaka.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].rich_description' },
  // paris.json
  { file: 'paris.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[2].practical_tip' },
  { file: 'paris.json', lang: 'ar', path: '.translations.ar.seo_meta.description' },
  { file: 'paris.json', lang: 'ar', path: '.translations.ar.daily_itinerary[0].day_title' },
  { file: 'paris.json', lang: 'bn', path: '.translations.bn.daily_itinerary[2].activities[2].practical_tip' },
  // rio-de-janeiro.json
  { file: 'rio-de-janeiro.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'rio-de-janeiro.json', lang: 'bn', path: '.translations.bn.hero_section.hook_intro' },
  { file: 'rio-de-janeiro.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[0].practical_tip' },
  // rome.json
  { file: 'rome.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'rome.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[0].rich_description' },
  { file: 'rome.json', lang: 'hi', path: '.translations.hi.daily_itinerary[2].activities[0].practical_tip' },
  { file: 'rome.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[0].practical_tip' },
  // sapporo.json
  { file: 'sapporo.json', lang: 'hi', path: '.translations.hi.hero_section.hook_intro' },
  { file: 'sapporo.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[2].spot_name' },
  { file: 'sapporo.json', lang: 'ar', path: '.translations.ar.daily_itinerary[2].day_title' },
  { file: 'sapporo.json', lang: 'ar', path: '.translations.ar.daily_itinerary[3].day_title' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.hero_section.hook_intro' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].day_title' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[1].spot_name' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[1].rich_description' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[1].practical_tip' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].spot_name' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].rich_description' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[1].activities[0].rich_description' },
  { file: 'sapporo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[3].activities[1].practical_tip' },
  // seattle.json
  { file: 'seattle.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].rich_description' },
  // seoul.json
  { file: 'seoul.json', lang: 'fr', path: '.translations.fr.daily_itinerary[0].activities[2].rich_description' },
  { file: 'seoul.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[2].rich_description' },
  { file: 'seoul.json', lang: 'bn', path: '.translations.bn.daily_itinerary[3].activities[2].rich_description' },
  // singapore.json
  { file: 'singapore.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[1].practical_tip' },
  { file: 'singapore.json', lang: 'ru', path: '.translations.ru.daily_itinerary[1].activities[0].rich_description' },
  { file: 'singapore.json', lang: 'ru', path: '.translations.ru.daily_itinerary[1].activities[0].practical_tip' },
  // stockholm.json
  { file: 'stockholm.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[0].rich_description' },
  { file: 'stockholm.json', lang: 'bn', path: '.translations.bn.daily_itinerary[1].activities[2].rich_description' },
  // sydney.json
  { file: 'sydney.json', lang: 'id', path: '.translations.id.daily_itinerary[1].activities[2].rich_description' },
  // taipei.json
  { file: 'taipei.json', lang: 'id', path: '.translations.id.daily_itinerary[3].activities[1].practical_tip' },
  { file: 'taipei.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].day_title' },
  { file: 'taipei.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].day_title' },
  // tokyo.json
  { file: 'tokyo.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].rich_description' },
  { file: 'tokyo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[1].spot_name' },
  { file: 'tokyo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[1].rich_description' },
  { file: 'tokyo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].spot_name' },
  { file: 'tokyo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[2].rich_description' },
  { file: 'tokyo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[4].activities[2].rich_description' },
  { file: 'tokyo.json', lang: 'bn', path: '.translations.bn.daily_itinerary[4].activities[2].practical_tip' },
  // toronto.json
  { file: 'toronto.json', lang: 'hi', path: '.translations.hi.daily_itinerary[0].activities[0].practical_tip' },
  { file: 'toronto.json', lang: 'bn', path: '.translations.bn.hero_section.hook_intro' },
  // vienna.json
  { file: 'vienna.json', lang: 'hi', path: '.translations.hi.hero_section.hook_intro' },
  { file: 'vienna.json', lang: 'ru', path: '.translations.ru.daily_itinerary[3].activities[0].rich_description' },
  // zurich.json
  { file: 'zurich.json', lang: 'bn', path: '.translations.bn.daily_itinerary[0].activities[1].rich_description' },
];

// Group contaminated fields by file
const byFile = {};
for (const item of CONTAMINATED_FIELDS) {
  if (!byFile[item.file]) byFile[item.file] = [];
  byFile[item.file].push(item);
}

let totalFixed = 0;
let totalSkipped = 0;
const errors = [];

for (const [filename, fields] of Object.entries(byFile)) {
  const filePath = path.join(DESTINATIONS_DIR, filename);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`ERROR: Could not read ${filename}: ${e.message}`);
    errors.push(`Could not read ${filename}`);
    continue;
  }

  let fileModified = false;

  for (const field of fields) {
    const pathArr = parsePath(field.path);

    // Get the current (contaminated) value
    const currentValue = getNestedField(data, pathArr);

    if (currentValue === undefined || currentValue === null) {
      console.warn(`  SKIP: ${field.file} [${field.lang}] ${field.path} - field not found`);
      totalSkipped++;
      continue;
    }

    if (typeof currentValue !== 'string') {
      console.warn(`  SKIP: ${field.file} [${field.lang}] ${field.path} - not a string`);
      totalSkipped++;
      continue;
    }

    const ratio = cjkRatio(currentValue);
    let newValue;

    if (ratio > 0.5) {
      // High contamination: replace with English version
      const enPathArr = toEnglishPath(pathArr);
      const enValue = getNestedField(data, enPathArr);

      if (enValue && typeof enValue === 'string') {
        newValue = enValue;
        console.log(`  FIX (high CJK ${(ratio*100).toFixed(0)}%, use EN): ${filename} [${field.lang}] ${field.path.split('.').slice(-1)[0]}`);
      } else {
        // Fallback: strip CJK
        newValue = stripCJK(currentValue);
        console.log(`  FIX (high CJK ${(ratio*100).toFixed(0)}%, no EN fallback, strip): ${filename} [${field.lang}] ${field.path.split('.').slice(-1)[0]}`);
      }
    } else {
      // Low contamination: strip CJK characters
      newValue = stripCJK(currentValue);
      console.log(`  FIX (low CJK ${(ratio*100).toFixed(0)}%, strip): ${filename} [${field.lang}] ${field.path.split('.').slice(-1)[0]}`);
    }

    if (newValue !== currentValue) {
      setNestedField(data, pathArr, newValue);
      fileModified = true;
      totalFixed++;
    } else {
      console.log(`  UNCHANGED: ${filename} [${field.lang}] ${field.path.split('.').slice(-1)[0]} (no change needed)`);
    }
  }

  if (fileModified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Saved: ${filename}`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Fixed: ${totalFixed} fields`);
console.log(`Skipped: ${totalSkipped} fields`);
if (errors.length > 0) {
  console.log(`Errors: ${errors.join(', ')}`);
}
