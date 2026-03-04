const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const translations = {
    "en": "Free users cannot modify itineraries. Upgrade to unlock ✨",
    "zh": "免費用戶無法修改行程，請升級方案 ✨",
    "zh-HK": "免費用戶無法修改行程，請升級方案 ✨",
    "ja": "無料ユーザーは旅程を変更できません。アップグレードしてロックを解除してください ✨",
    "ko": "무료 사용자는 일정을 수정할 수 없습니다. 업그레이드하여 잠금 해제하세요 ✨",
    "es": "Los usuarios gratuitos no pueden modificar los itinerarios. Actualízate para desbloquear ✨",
    "fr": "Les utilisateurs gratuits ne peuvent pas modifier les itinéraires. Mettez à niveau pour débloquer ✨",
    "de": "Kostenlose Benutzer können Reiserouten nicht ändern. Aktualisieren, um freizuschalten ✨",
    "it": "Gli utenti gratuiti non possono modificare gli itinerari. Aggiorna per sbloccare ✨",
    "pt": "Usuários gratuitos não podem modificar itinerários. Atualize para desbloquear ✨",
    "ru": "Бесплатные пользователи не могут изменять маршруты. Обновите для разблокировки ✨",
    "ar": "لا يمكن للمستخدمين المجانيين تعديل مسارات الرحلة. قم بالترقية للوصول ✨",
    "hi": "मुफ्त उपयोगकर्ता यात्रा कार्यक्रम को संशोधित नहीं कर सकते। अनलॉक करने के लिए अपग्रेड करें ✨",
    "bn": "বিনামূল্যে ব্যবহারকারীরা ভ্রমণপথ পরিবর্তন করতে পারবেন না। আনলক করতে আপগ্রেড করুন ✨",
    "id": "Pengguna gratis tidak dapat mengubah itinerary. Tingkatkan untuk membuka fitur ✨",
};

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    const lang = path.basename(file, '.json');

    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Add ws_upgrade_hint
    data["ws_upgrade_hint"] = translations[lang] || translations["en"];

    // Ensure -5 credits for rule_1_p1_v and -1 for rule_1_p2_v
    if (lang === "en") {
        data["rule_1_p1_v"] = "-5 Points (Generated from Homepage)";
        data["rule_1_p2_v"] = "-1 Point (AI Tweak & Edit)";
    } else if (lang.startsWith("zh")) {
        data["rule_1_p1_v"] = "-5 點 (從首頁四格搜尋欄啟動)";
        data["rule_1_p2_v"] = "-1 點 (與 AI 討論修改內容)";
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", 'utf8');
});

console.log("Updated locales successfully.");
