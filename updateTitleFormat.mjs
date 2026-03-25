/**
 * updateTitleFormat.mjs
 * Updates all destination seo_meta titles to include "X天Y夜" / "X Days Y Nights" format
 * to match high-volume search queries like "大阪3天2夜", "東京5天4夜自由行"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEST_DIR = path.join(__dirname, 'src/data/destinations');

// City name mapping for Traditional Chinese
const ZH_CITY_NAMES = {
  'amsterdam': '阿姆斯特丹',
  'athens': '雅典',
  'auckland': '奧克蘭',
  'bali-kuta': '峇里島',
  'bangkok': '曼谷',
  'barcelona': '巴塞隆拿',
  'berlin': '柏林',
  'brussels': '布魯塞爾',
  'buenos-aires': '布宜諾斯艾利斯',
  'cairo': '開羅',
  'cape-town': '開普敦',
  'chicago': '芝加哥',
  'copenhagen': '哥本哈根',
  'dubai': '杜拜',
  'edinburgh': '愛丁堡',
  'florence': '佛羅倫斯',
  'fukuoka': '福岡',
  'hakone': '箱根',
  'ho-chi-minh-city': '胡志明市',
  'hongkong': '香港',
  'kuala-lumpur': '吉隆坡',
  'kyoto': '京都',
  'las-vegas': '拉斯維加斯',
  'lisbon': '里斯本',
  'london': '倫敦',
  'los-angeles': '洛杉磯',
  'madrid': '馬德里',
  'marrakesh': '馬拉喀什',
  'melbourne': '墨爾本',
  'miami': '邁阿密',
  'munich': '慕尼黑',
  'new-york': '紐約',
  'nice': '尼斯',
  'okinawa': '沖繩',
  'osaka': '大阪',
  'paris': '巴黎',
  'prague': '布拉格',
  'reykjavik': '雷克雅維克',
  'rio-de-janeiro': '里約熱內盧',
  'rome': '羅馬',
  'san-francisco': '舊金山',
  'santorini': '聖托里尼',
  'sapporo': '札幌',
  'seattle': '西雅圖',
  'seoul': '首爾',
  'singapore': '新加坡',
  'stockholm': '斯德哥爾摩',
  'sydney': '雪梨',
  'taipei': '台北',
  'tokyo': '東京',
  'toronto': '多倫多',
  'venice': '威尼斯',
  'vienna': '維也納',
  'zurich': '蘇黎世',
};

// English city names for reference
const EN_CITY_NAMES = {
  'amsterdam': 'Amsterdam', 'athens': 'Athens', 'auckland': 'Auckland',
  'bali-kuta': 'Bali', 'bangkok': 'Bangkok', 'barcelona': 'Barcelona',
  'berlin': 'Berlin', 'brussels': 'Brussels', 'buenos-aires': 'Buenos Aires',
  'cairo': 'Cairo', 'cape-town': 'Cape Town', 'chicago': 'Chicago',
  'copenhagen': 'Copenhagen', 'dubai': 'Dubai', 'edinburgh': 'Edinburgh',
  'florence': 'Florence', 'fukuoka': 'Fukuoka', 'hakone': 'Hakone',
  'ho-chi-minh-city': 'Ho Chi Minh City', 'hongkong': 'Hong Kong',
  'kuala-lumpur': 'Kuala Lumpur', 'kyoto': 'Kyoto', 'las-vegas': 'Las Vegas',
  'lisbon': 'Lisbon', 'london': 'London', 'los-angeles': 'Los Angeles',
  'madrid': 'Madrid', 'marrakesh': 'Marrakesh', 'melbourne': 'Melbourne',
  'miami': 'Miami', 'munich': 'Munich', 'new-york': 'New York',
  'nice': 'Nice', 'okinawa': 'Okinawa', 'osaka': 'Osaka',
  'paris': 'Paris', 'prague': 'Prague', 'reykjavik': 'Reykjavik',
  'rio-de-janeiro': 'Rio de Janeiro', 'rome': 'Rome', 'san-francisco': 'San Francisco',
  'santorini': 'Santorini', 'sapporo': 'Sapporo', 'seattle': 'Seattle',
  'seoul': 'Seoul', 'singapore': 'Singapore', 'stockholm': 'Stockholm',
  'sydney': 'Sydney', 'taipei': 'Taipei', 'tokyo': 'Tokyo',
  'toronto': 'Toronto', 'venice': 'Venice', 'vienna': 'Vienna', 'zurich': 'Zurich',
};

// Language-specific title templates: {city} {days}天{nights}夜 format
const TITLE_TEMPLATES = {
  zh: (city, days, nights) => `${city}${days}天${nights}夜自由行2026｜行程攻略`,
  en: (city, days, nights) => `${city} ${days}-Day ${nights}-Night Itinerary 2026`,
  ja: (city, days, nights) => `${city}${days}日${nights}泊旅行2026｜完全攻略`,
  ko: (city, days, nights) => `${city} ${nights}박${days}일 여행 2026 | 완벽 가이드`,
  fr: (city, days, nights) => `${city} ${days} jours ${nights} nuits 2026 | Guide`,
  es: (city, days, nights) => `${city} ${days} días ${nights} noches 2026 | Guía`,
  id: (city, days, nights) => `${city} ${days} Hari ${nights} Malam 2026 | Panduan`,
  hi: (city, days, nights) => `${city} ${days} दिन ${nights} रात 2026 | गाइड`,
  pt: (city, days, nights) => `${city} ${days} Dias ${nights} Noites 2026 | Guia`,
  ar: (city, days, nights) => `${city} ${days} أيام ${nights} ليالٍ 2026 | دليل`,
  bn: (city, days, nights) => `${city} ${days} দিন ${nights} রাত ২০২৬ | গাইড`,
  ru: (city, days, nights) => `${city} ${days} дней ${nights} ночей 2026 | Гид`,
};

// Japanese city names (for ja template)
const JA_CITY_NAMES = {
  'amsterdam': 'アムステルダム', 'athens': 'アテネ', 'auckland': 'オークランド',
  'bali-kuta': 'バリ島', 'bangkok': 'バンコク', 'barcelona': 'バルセロナ',
  'berlin': 'ベルリン', 'brussels': 'ブリュッセル', 'buenos-aires': 'ブエノスアイレス',
  'cairo': 'カイロ', 'cape-town': 'ケープタウン', 'chicago': 'シカゴ',
  'copenhagen': 'コペンハーゲン', 'dubai': 'ドバイ', 'edinburgh': 'エディンバラ',
  'florence': 'フィレンツェ', 'fukuoka': '福岡', 'hakone': '箱根',
  'ho-chi-minh-city': 'ホーチミン', 'hongkong': '香港',
  'kuala-lumpur': 'クアラルンプール', 'kyoto': '京都', 'las-vegas': 'ラスベガス',
  'lisbon': 'リスボン', 'london': 'ロンドン', 'los-angeles': 'ロサンゼルス',
  'madrid': 'マドリード', 'marrakesh': 'マラケシュ', 'melbourne': 'メルボルン',
  'miami': 'マイアミ', 'munich': 'ミュンヘン', 'new-york': 'ニューヨーク',
  'nice': 'ニース', 'okinawa': '沖縄', 'osaka': '大阪',
  'paris': 'パリ', 'prague': 'プラハ', 'reykjavik': 'レイキャビク',
  'rio-de-janeiro': 'リオデジャネイロ', 'rome': 'ローマ', 'san-francisco': 'サンフランシスコ',
  'santorini': 'サントリーニ', 'sapporo': '札幌', 'seattle': 'シアトル',
  'seoul': 'ソウル', 'singapore': 'シンガポール', 'stockholm': 'ストックホルム',
  'sydney': 'シドニー', 'taipei': '台北', 'tokyo': '東京',
  'toronto': 'トロント', 'venice': 'ヴェネツィア', 'vienna': 'ウィーン', 'zurich': 'チューリッヒ',
};

// Korean city names
const KO_CITY_NAMES = {
  'amsterdam': '암스테르담', 'athens': '아테네', 'auckland': '오클랜드',
  'bali-kuta': '발리', 'bangkok': '방콕', 'barcelona': '바르셀로나',
  'berlin': '베를린', 'brussels': '브뤼셀', 'buenos-aires': '부에노스아이레스',
  'cairo': '카이로', 'cape-town': '케이프타운', 'chicago': '시카고',
  'copenhagen': '코펜하겐', 'dubai': '두바이', 'edinburgh': '에든버러',
  'florence': '피렌체', 'fukuoka': '후쿠오카', 'hakone': '하코네',
  'ho-chi-minh-city': '호치민', 'hongkong': '홍콩',
  'kuala-lumpur': '쿠알라룸푸르', 'kyoto': '교토', 'las-vegas': '라스베이거스',
  'lisbon': '리스본', 'london': '런던', 'los-angeles': '로스앤젤레스',
  'madrid': '마드리드', 'marrakesh': '마라케시', 'melbourne': '멜버른',
  'miami': '마이애미', 'munich': '뮌헨', 'new-york': '뉴욕',
  'nice': '니스', 'okinawa': '오키나와', 'osaka': '오사카',
  'paris': '파리', 'prague': '프라하', 'reykjavik': '레이캬비크',
  'rio-de-janeiro': '리우데자네이루', 'rome': '로마', 'san-francisco': '샌프란시스코',
  'santorini': '산토리니', 'sapporo': '삿포로', 'seattle': '시애틀',
  'seoul': '서울', 'singapore': '싱가포르', 'stockholm': '스톡홀름',
  'sydney': '시드니', 'taipei': '타이베이', 'tokyo': '도쿄',
  'toronto': '토론토', 'venice': '베네치아', 'vienna': '빈', 'zurich': '취리히',
};

function getCityName(slug, lang) {
  if (lang === 'zh') return ZH_CITY_NAMES[slug] || slug;
  if (lang === 'ja') return JA_CITY_NAMES[slug] || slug;
  if (lang === 'ko') return KO_CITY_NAMES[slug] || slug;
  return EN_CITY_NAMES[slug] || slug;
}

function files() {
  return fs.readdirSync(DEST_DIR).filter(f => f.endsWith('.json'));
}

function main() {
  const allFiles = files();
  console.log(`Updating title format for ${allFiles.length} destination files...`);

  let updated = 0;
  let tooLong = [];

  allFiles.forEach(f => {
    const slug = f.replace('.json', '');
    const filePath = path.join(DEST_DIR, f);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const days = data.daily_itinerary?.length || 3;
    const nights = days - 1;

    const langs = Object.keys(TITLE_TEMPLATES);
    let changed = false;

    langs.forEach(lang => {
      if (!data.translations?.[lang]) return;
      if (!data.translations[lang].seo_meta) data.translations[lang].seo_meta = {};

      const cityName = getCityName(slug, lang);
      const newTitle = TITLE_TEMPLATES[lang](cityName, days, nights);

      if (newTitle.length > 60) {
        tooLong.push(`${slug} [${lang}] (${newTitle.length}): ${newTitle}`);
        return;
      }

      data.translations[lang].seo_meta.title = newTitle;
      changed = true;
    });

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      updated++;
    }
  });

  console.log(`Updated ${updated} files`);

  if (tooLong.length) {
    console.log('\nTitles too long (skipped):');
    tooLong.forEach(t => console.log('  ' + t));
  }

  // Final verification
  let over60 = 0, total = 0;
  allFiles.forEach(f => {
    const data = JSON.parse(fs.readFileSync(path.join(DEST_DIR, f), 'utf8'));
    Object.values(data.translations || {}).forEach(t => {
      const title = t?.seo_meta?.title;
      if (title) { total++; if (title.length > 60) over60++; }
    });
  });
  console.log(`\nVerification: ${over60}/${total} titles over 60 chars`);

  // Show samples
  console.log('\nSamples:');
  ['osaka', 'tokyo', 'paris', 'lisbon'].forEach(slug => {
    const data = JSON.parse(fs.readFileSync(path.join(DEST_DIR, `${slug}.json`), 'utf8'));
    ['zh', 'en', 'ja', 'ko'].forEach(lang => {
      const title = data.translations?.[lang]?.seo_meta?.title;
      if (title) console.log(`  ${slug} [${lang}]: ${title}`);
    });
  });
}

main();
