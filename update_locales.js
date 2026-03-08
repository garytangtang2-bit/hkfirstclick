const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const mapTranslations = {
    en: { map_search_placeholder: "Where would you like to find inspiration?", map_region_all: "Global", map_region_asia: "Asia", map_region_europe: "Europe", map_region_americas: "Americas", map_region_middle_east: "Middle East", map_region_oceania: "Oceania", map_region_africa: "Africa" },
    zh: { map_search_placeholder: "你想去哪裡獲取靈感？", map_region_all: "全球", map_region_asia: "亞洲", map_region_europe: "歐洲", map_region_americas: "美洲", map_region_middle_east: "中東", map_region_oceania: "大洋洲", map_region_africa: "非洲" },
    ja: { map_search_placeholder: "どこでインスピレーションを得たいですか？", map_region_all: "すべて", map_region_asia: "アジア", map_region_europe: "ヨーロッパ", map_region_americas: "アメリカ大陸", map_region_middle_east: "中東", map_region_oceania: "オセアニア", map_region_africa: "アフリカ" },
    ko: { map_search_placeholder: "어디에서 영감을 얻고 싶으신가요?", map_region_all: "전체", map_region_asia: "아시아", map_region_europe: "유럽", map_region_americas: "아메리카", map_region_middle_east: "중동", map_region_oceania: "오세아니아", map_region_africa: "아프리카" },
    fr: { map_search_placeholder: "Où aimeriez-vous trouver l'inspiration ?", map_region_all: "Global", map_region_asia: "Asie", map_region_europe: "Europe", map_region_americas: "Amériques", map_region_middle_east: "Moyen-Orient", map_region_oceania: "Océanie", map_region_africa: "Afrique" },
    es: { map_search_placeholder: "¿Dónde te gustaría encontrar inspiración?", map_region_all: "Global", map_region_asia: "Asia", map_region_europe: "Europa", map_region_americas: "Américas", map_region_middle_east: "Oriente Medio", map_region_oceania: "Oceanía", map_region_africa: "África" },
    id: { map_search_placeholder: "Di mana Anda ingin mencari inspirasi?", map_region_all: "Semua", map_region_asia: "Asia", map_region_europe: "Eropa", map_region_americas: "Amerika", map_region_middle_east: "Timur Tengah", map_region_oceania: "Oseania", map_region_africa: "Afrika" },
    hi: { map_search_placeholder: "आप प्रेरणा कहाँ प्राप्त करना चाहेंगे?", map_region_all: "ग्लोबल", map_region_asia: "एशिया", map_region_europe: "यूरोप", map_region_americas: "अमेरिका", map_region_middle_east: "मध्य पूर्व", map_region_oceania: "ओशिनिया", map_region_africa: "अफ्रीका" },
    pt: { map_search_placeholder: "Onde você gostaria de encontrar inspiração?", map_region_all: "Global", map_region_asia: "Ásia", map_region_europe: "Europa", map_region_americas: "Américas", map_region_middle_east: "Oriente Médio", map_region_oceania: "Oceania", map_region_africa: "África" },
    ar: { map_search_placeholder: "أين ترغب في العثور على الإلهام؟", map_region_all: "عالمي", map_region_asia: "آسيا", map_region_europe: "أوروبا", map_region_americas: "الأمريكتان", map_region_middle_east: "الشرق الأوسط", map_region_oceania: "أوقيانوسيا", map_region_africa: "أفريقيا" },
    ru: { map_search_placeholder: "Где бы вы хотели найти вдохновение?", map_region_all: "Глобал", map_region_asia: "Азия", map_region_europe: "Европа", map_region_americas: "Америка", map_region_middle_east: "Ближний Восток", map_region_oceania: "Океания", map_region_africa: "Африка" },
    bn: { map_search_placeholder: "আপনি কোথায় অনুপ্রেরণা খুঁজতে চান?", map_region_all: "বিশ্বব্যাপী", map_region_asia: "এশিয়া", map_region_europe: "ইউরোপ", map_region_americas: "আমেরিকা", map_region_middle_east: "মধ্যপ্রাচ্য", map_region_oceania: "ওশেনিয়া", map_region_africa: "আফ্রিকা" }
};

fs.readdirSync(localesDir).forEach(file => {
    if (file.endsWith('.json')) {
        const lang = file.split('.')[0];
        const filepath = path.join(localesDir, file);
        try {
            const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            const newTrans = mapTranslations[lang] || mapTranslations['en'];

            // Merge
            Object.assign(data, newTrans);

            fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Updated ${file}`);
        } catch (err) {
            console.error(`Error with ${file}:`, err);
        }
    }
});
