/**
 * Fix Simplified Chinese → Traditional Chinese in food/attractions zh translations
 * Uses opencc-js for accurate conversion (STW = Simplified to Traditional Taiwan)
 */
import * as OpenCC from "opencc-js";
import fs from "fs";
import path from "path";

// STW = Simplified Chinese to Traditional Chinese (Taiwan standard)
const converter = OpenCC.Converter({ from: "cn", to: "twp" });

function convertObj(obj) {
  if (typeof obj === "string") return converter(obj);
  if (Array.isArray(obj)) return obj.map(convertObj);
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = convertObj(v);
    }
    return result;
  }
  return obj;
}

const dirs = ["src/data/food", "src/data/attractions"];
let totalFixed = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  for (const fname of files) {
    const filePath = path.join(dir, fname);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!data.translations?.zh) continue;

    const originalZh = JSON.stringify(data.translations.zh);
    data.translations.zh = convertObj(data.translations.zh);
    const newZh = JSON.stringify(data.translations.zh);

    if (originalZh !== newZh) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      totalFixed++;
      console.log(`✓ Fixed ${dir.split("/").pop()}/${fname}`);
    }
  }
}

console.log(`\nDone! Fixed ${totalFixed} files`);
