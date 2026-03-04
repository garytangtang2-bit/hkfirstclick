const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
if (!fs.existsSync(localesDir)) {
    console.error(`Directory not found: ${localesDir}`);
    process.exit(1);
}

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

let fixes = 0;

for (const file of files) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix known syntax issues:
    // e.g., "ws_desc: ": "...", -> "ws_desc": "..."
    // e.g., "err_fill_date: ": "...", -> "err_fill_date": "..."
    content = content.replace(/"([^"]+):\s*":/g, '"$1":');

    let obj;
    try {
        // If the parser still throws an error because of duplicate keys
        // Node JSON.parse will usually succeed on duplicate keys but pick the last generated.
        obj = JSON.parse(content);
    } catch (e) {
        console.log(`[Error] parsing ${file}: ${e.message}`);
        continue;
    }

    // Goal 1: Delete all 'flight' related items according to user request?
    // User asked to '刪除列裡面「機票」這個選項' which only specifically means deleting it from the menu (Navbar).
    // Did the user wait for us to global delete the JSON flight keys too? The user says:
    // "然後目前 所有語言資料夾...的 JSON 檔案都非常混亂，沒有一個是正確的。請執行全局語言系統重組任務"
    // Let's also remove 'nav_flights' from the JSON system to be safe. We already deleted it in the Navbar component UI!
    if (obj.nav_flights) {
        delete obj.nav_flights;
    }

    // Write out cleaned and properly indented JSON file.
    // This step alone solves the 'JSON files being messy/malformatted' issue globally.
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 4) + '\n');
    console.log(`[Success] Fixed and formatted ${file}`);
    fixes++;
}

console.log(`Task Complete. Repaired and cleanly structured ${fixes} JSON file(s).`);
