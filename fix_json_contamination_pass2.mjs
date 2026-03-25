import fs from 'fs';
import path from 'path';

const DESTINATIONS_DIR = 'D:/hkfirstclick/src/data/destinations';

// Extended CJK range including Korean Hangul
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
  let result = str.replace(/[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/g, '');
  result = result.replace(/  +/g, ' ');
  result = result.replace(/ ([,.:;!?])/g, '$1');
  result = result.trim();
  return result;
}

function getNestedField(obj, pathArr) {
  let current = obj;
  for (const key of pathArr) {
    if (current === null || current === undefined) return undefined;
    current = current[key];
  }
  return current;
}

function setNestedField(obj, pathArr, value) {
  let current = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    current = current[pathArr[i]];
  }
  current[pathArr[pathArr.length - 1]] = value;
}

// The Berlin rich_alternative for Kreuzberg - proper English content
// (the EN source was also contaminated with Chinese, so we provide the correct content directly)
const BERLIN_KREUZBERG_EN = "Experience Berlin's most authentic multicultural culture! This area is full of immigrant heritage and underground art style, with graffiti walls and specialty cafes everywhere — the best place to experience Berlin's 'cool' culture.";

// Scan all files for remaining CJK contamination in non-CJK languages
const NON_CJK_LANGS = ['en', 'fr', 'es', 'id', 'hi', 'pt', 'ar', 'bn', 'ru'];
const CJK_REGEX = /[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/;

function checkObject(obj, pathArr, results) {
  if (typeof obj === 'string') {
    if (CJK_REGEX.test(obj)) {
      results.push({ pathArr: [...pathArr], value: obj });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => checkObject(item, [...pathArr, i], results));
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      checkObject(obj[key], [...pathArr, key], results);
    }
  }
}

const files = fs.readdirSync(DESTINATIONS_DIR).filter(f => f.endsWith('.json'));
let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(DESTINATIONS_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.translations) continue;

  let fileModified = false;

  for (const lang of NON_CJK_LANGS) {
    if (!data.translations[lang]) continue;

    const results = [];
    checkObject(data.translations[lang], ['translations', lang], results);

    for (const r of results) {
      const ratio = cjkRatio(r.value);
      let newValue;

      if (file === 'berlin.json' && r.pathArr[r.pathArr.length - 1] === 'rich_alternative') {
        // Special case: all langs have same Chinese content, use proper English
        if (lang === 'en') {
          newValue = BERLIN_KREUZBERG_EN;
        } else {
          // For other langs, use the (now fixed) English version as fallback
          newValue = BERLIN_KREUZBERG_EN;
        }
        console.log(`  SPECIAL FIX berlin [${lang}] rich_alternative`);
      } else if (ratio > 0.5) {
        // High: try EN fallback
        const enPathArr = [...r.pathArr];
        enPathArr[1] = 'en';
        const enValue = getNestedField(data, enPathArr);
        if (enValue && typeof enValue === 'string' && !CJK_REGEX.test(enValue)) {
          newValue = enValue;
          console.log(`  FIX (high ${(ratio*100).toFixed(0)}%, use EN): ${file} [${lang}] ${r.pathArr.slice(-1)[0]}`);
        } else {
          newValue = stripCJK(r.value);
          console.log(`  FIX (high ${(ratio*100).toFixed(0)}%, strip): ${file} [${lang}] ${r.pathArr.slice(-1)[0]}`);
        }
      } else {
        // Low: strip CJK
        newValue = stripCJK(r.value);
        console.log(`  FIX (low ${(ratio*100).toFixed(0)}%, strip): ${file} [${lang}] ${r.pathArr.slice(-1)[0]}: "${r.value.substring(0,60)}"`);
      }

      if (newValue !== r.value) {
        setNestedField(data, r.pathArr, newValue);
        fileModified = true;
        totalFixed++;
      }
    }
  }

  if (fileModified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Saved: ${file}`);
  }
}

console.log(`\n=== PASS 2 SUMMARY ===`);
console.log(`Fixed: ${totalFixed} fields`);
